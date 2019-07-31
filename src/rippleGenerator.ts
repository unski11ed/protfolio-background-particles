import eases from 'eases';

import { Particles } from './particles';
import { GravitySource } from './gravitySource';
import { ScreenSize } from './screenSize';
import { ElementAnimation } from './elementAnimation';
import { Particle } from './particle';

type RippleGeneratorParams = {
    duration: number,
    easingFunc: string,
    waveLength: number,
}

export class RippleGenerator {
    private startTime: number = 0;
    private animatedParticles: Particle[] = []

    constructor(
        private params: RippleGeneratorParams,
        private particles: Particles,
        private gravitySource : GravitySource,
        private screenSize: ScreenSize,
        private elementAnimation: ElementAnimation,
    ) { }

    public trigger() {
        this.startTime = Date.now();

        this.animatedParticles.length = 0;
    }

    // TODO: Connect with elementAnimation
    public update() {
        const { duration, easingFunc, waveLength } = this.params;
        const time = Date.now();
        const particleAnimationOptions = {
            duration: 50,
            functionName: 'quadInOut'
        };

        if (this.startTime + duration > time) {
            const t = (time - this.startTime) / duration;
            const v = eases[easingFunc](t);
            const rippleRadius = v * this.getTargetRadius();

            // TODO: Animate particles
            for (const particle of this.particles.particles) {
                if (
                    this.animatedParticles.indexOf(particle) < 0 &&
                    particle.gravityCenterLength <= rippleRadius
                ) {
                    const initialOpacity = particle.opacity;
                    const initialSize = particle.size;
                    
                    // Save the particle
                    this.animatedParticles.push(particle);

                    // Intro Animation
                    const introFinished = this.elementAnimation.animateElement(particle, {
                        opacity: [particle.opacity, particle.maxOpacity],
                        size: [particle.size, particle.maxSize]
                    }, particleAnimationOptions);
                    // Outro Animation
                    introFinished.then(() => {
                        this.elementAnimation.animateElement(particle, {
                            opacity: [particle.opacity, initialOpacity],
                            size: [particle.size, initialSize]
                        }, particleAnimationOptions);
                    })
                }
            }
        }
    }

    private getTargetRadius() {
        const { center } = this.gravitySource;

        return Math.sqrt(
            Math.pow(center.x > this.screenSize.width / 2 ? center.x : this.screenSize.width - center.x, 2) +
            Math.pow(center.y > this.screenSize.height / 2 ? center.y : this.screenSize.height - center.y, 2)
        );
    }
}