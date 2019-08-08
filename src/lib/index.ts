import EventEmitter from "eventemitter3";
import FpsThrottler from 'fps-throttler';
import _ from 'lodash';

import { Screen } from './screen';
import { ScreenSize } from './screenSize';
import { Particles } from './particles';
import { ParticleRenderer } from './particleRenderer';
import { GravityRectParticleBuilder } from './gravityRectParticleBuilder';
import { FadeInParticleBuilder, FadeInParticleBuilderOptions } from './fadeInParticleBuilder';
import { GravitySource } from './gravitySource';
import { createMovementParticleModifier } from './movementParticleModifier';
import { createInBoundParticleRecreator } from './inBoundParticleRecreator';
import { createParticleToGravityModifier } from './particleToGravityOpacityModifier';
import { ParticleUpdater } from './particleUpdater';
import { PropertyAnimation } from './propertyAnimation';
import { RippleGenerator, RippleGeneratorParams } from './rippleGenerator';
import { RippleTexture } from './rippleTexture';
import { RippleRenderer } from './rippleRenderer';
import { Point } from './interfaces/point';
import { Rect } from './interfaces/rect';
import { createDebouncer } from "./utilities";

export type RippledParticlesConfig = {
    gravitySourceRect?: Rect;
    particleConfig?: FadeInParticleBuilderOptions & {
        gravityOpacityFunc?: string;
    };
    rippleConfig?: RippleGeneratorParams & {
        waveLength?: number;
    };
    initialColor?: string;
    fpsLimit?: number;
}

const defaultConfig: RippledParticlesConfig = {
    gravitySourceRect: {
        x: 0.75,
        y: 0.75,
        width: 100,
        height: 100,
    },
    particleConfig: {
        minSize: 1,
        maxSize: 4,
        minOpacity: 0.1,
        maxOpacity: 0.9,
        minSpeed: 0.001,
        maxSpeed: 0.1,
        gravityOpacityFunc: 'cubicOut'
    },
    rippleConfig: {
        rippleAnimationDuration: 1000,
        rippleAnimationEasing: 'cubicOut',
        waveLength: 300,
    },
    initialColor: 'hotpink',
    fpsLimit: 30,
}

export default class {
    private options: RippledParticlesConfig;

    private screen: Screen;
    private screenSize: ScreenSize;
    
    private propertyAnimation: PropertyAnimation;

    private gravitySource: GravitySource;

    private particles: Particles;
    private particleUpdater: ParticleUpdater;
    private particleRenderer: ParticleRenderer;
    
    private rippleGenerator: RippleGenerator;
    private rippleTexture: RippleTexture;
    private rippleRenderer: RippleRenderer;

    private fpsThrottler: FpsThrottler;

    public events = new EventEmitter();

    constructor(
        canvasElement: HTMLCanvasElement,
        config: RippledParticlesConfig
    ) {
        const options: RippledParticlesConfig = this.options = _.merge({}, defaultConfig, config);

        // Screen ===================================
        const screenSize = this.screenSize = new ScreenSize(canvasElement);
        const screen = this.screen = new Screen(canvasElement, screenSize);

        // Renderers ================================
        this.particleRenderer = new ParticleRenderer(canvasElement);
        this.rippleRenderer = new RippleRenderer(canvasElement);

        // Animation ================================
        const propertyAnimation = this.propertyAnimation = new PropertyAnimation();

        // Particles ================================
        const gravitySource = this.gravitySource =  new GravitySource({
            ...options.gravitySourceRect,
            x: options.gravitySourceRect.x * screenSize.width,
            y: options.gravitySourceRect.x * screenSize.height,
        });
        const gravityRectParticleBuilder = new GravityRectParticleBuilder(gravitySource);
        const fadeInParticleBuilder = new FadeInParticleBuilder(propertyAnimation, options.particleConfig);
        const particles = this.particles = new Particles(
            screenSize,
            [
                gravityRectParticleBuilder,
                fadeInParticleBuilder,
            ]
        );

        const movementParticleModifier = createMovementParticleModifier({
            gravitySource
        });
        const inBoundParticleRecreator = createInBoundParticleRecreator({
            bounds: screenSize,
            particles,
        });
        const particleToGravityOpacityModifier = createParticleToGravityModifier({
            screenSize,
            gravitySource,
            particleConfig: config.particleConfig,
        });
        this.particleUpdater = new ParticleUpdater([
            movementParticleModifier,
            inBoundParticleRecreator,
            particleToGravityOpacityModifier
        ], particles);

        // Ripple ===================================
        this.rippleGenerator = new RippleGenerator(
            options.rippleConfig,
            particles,
            screenSize,
            propertyAnimation,
        );
        this.rippleTexture = new RippleTexture(
            {
                duration: options.rippleConfig.rippleAnimationDuration,
                easingFunc: options.rippleConfig.rippleAnimationEasing,
                waveLength: options.rippleConfig.waveLength,
                initialColor: options.initialColor,
            },
            screenSize,
            gravitySource,
        );

        // Bootstrap ============================
        this.fpsThrottler = new FpsThrottler(this.loop.bind(this), config.fpsLimit);
        const resizeDebouncer = createDebouncer(300);

        screen.events.on('screenResized', () => {
            resizeDebouncer(this.reset.bind(this));
        });

        this.fpsThrottler.start();
    }

    public createParticles(count: number) {
        this.particles.create(count);
    }

    public trigger(origin: Point, color: string) {
        this.rippleGenerator.trigger(origin);
        this.rippleTexture.trigger(color, origin);
    }

    public destroy() {
        this.fpsThrottler.stop();

        this.screen.destroy();
    }

    public reset() {
        this.rippleTexture.updateSize();
        
        this.gravitySource.setRegion({
            ...this.options.gravitySourceRect,
            x: this.options.gravitySourceRect.x * this.screenSize.width,
            y: this.options.gravitySourceRect.y * this.screenSize.height,
        });

        for (const particle of this.particles.particles) {
            this.particles.destroy(particle);
        }

        this.events.emit('reset');
    }

    private loop() {
        const time = Date.now();

        // Setup Scene
        this.screen.prepareScene();

        // Update entities
        this.particleUpdater.update(time);
        this.rippleTexture.update(time);
        this.rippleGenerator.update(time);

        // Update animations
        this.propertyAnimation.update(time);

        // Render
        this.particleRenderer.render(this.particles.particles);
        this.rippleRenderer.render(this.rippleTexture);
    }
}
