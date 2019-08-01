import { EventEmitter } from "eventemitter3";

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

export type RippledParticlesConfig = {
    gravitySourceRect?: Rect;
    particleConfig?: FadeInParticleBuilderOptions;
    rippleConfig?: RippleGeneratorParams & {
        waveLength?: number;
    };
    initialColor?: string;
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
    },
    rippleConfig: {
        rippleAnimationDuration: 1000,
        rippleAnimationEasing: 'cubicOut',
        waveLength: 300,
    },
    initialColor: 'hotpink'
}

class RippledParticlesEvents extends EventTarget {
    triggerReset() {
        this.dispatchEvent(new Event('reset'));
    }
}

export default class {
    private screen: Screen;
    private screenSize: ScreenSize;
    
    private propertyAnimation: PropertyAnimation;

    private particles: Particles;
    private particleUpdater: ParticleUpdater;
    private particleRenderer: ParticleRenderer;
    
    private rippleGenerator: RippleGenerator;
    private rippleTexture: RippleTexture;
    private rippleRenderer: RippleRenderer;

    private isLoopActive: boolean = true;

    public events = new EventEmitter();

    constructor(
        canvasElement: HTMLCanvasElement,
        config: RippledParticlesConfig
    ) {
        const options = { ...defaultConfig, ...config };

        // Screen ===================================
        const screenSize = this.screenSize = new ScreenSize(canvasElement);
        const screen = this.screen = new Screen(canvasElement, screenSize);

        // Renderers ================================
        this.particleRenderer = new ParticleRenderer(canvasElement);
        this.rippleRenderer = new RippleRenderer(canvasElement);

        // Animation ================================
        const propertyAnimation = this.propertyAnimation = new PropertyAnimation();

        // Particles ================================
        const gravitySource = new GravitySource({
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
            particleConfig: config.particleConfig
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
        this.loop();

        screen.events.on('screenResized', () => {
            this.reset();
        });
    }

    public createParticles(count: number) {
        this.particles.create(count);
    }

    public trigger(origin: Point, color: string) {
        this.rippleGenerator.trigger(origin);
        this.rippleTexture.trigger(color, origin);
    }

    public destroy() {
        this.isLoopActive = false;

        this.screen.destroy();
    }

    public reset() {
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

        // Continue Loop...
        if (this.isLoopActive) {
            requestAnimationFrame(this.loop.bind(this));
        }
    }
}
