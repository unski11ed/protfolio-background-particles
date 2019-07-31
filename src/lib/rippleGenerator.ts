import eases from 'eases';

import { Particles } from './particles';
import { ScreenSize } from './screenSize';
import { PropertyAnimation } from './propertyAnimation';
import { Particle } from './particle';
import { Point } from './interfaces/point';
import { IUpdatable } from './interfaces/updatable';
import { distance, rippleLength } from './utilities';

export type RippleGeneratorParams = {
    rippleAnimationDuration?: number,
    rippleAnimationEasing?: string,

    particleAnimationDuration?: number,
    particleAnimationEasing?: string,

    targetParticleOpacity?: number;
    targetParticleSize?: number;
}

// Animates all of the Particles in a Ripple fashion
// from the center provided by the trigger
export class RippleGenerator implements IUpdatable {
    private startTime: number = 0;
    private rippleOrigin: Point = { x: 0, y: 0 };
    private animatedParticles: Particle[] = []
    private params: RippleGeneratorParams = {
        rippleAnimationDuration: 1000,
        rippleAnimationEasing: 'cubicOut',
    
        particleAnimationDuration: 75,
        particleAnimationEasing: 'cubicOut',
    
        targetParticleOpacity: 0.8,
        targetParticleSize: 4,
    };

    constructor(
        params: RippleGeneratorParams,
        private particles: Particles,
        private screenSize: ScreenSize,
        private propertyAnimation: PropertyAnimation,
    ) {
        // Extend the default params by the provided ones
        Object.assign(this.params, params);
    }

    public trigger(rippleOrigin: Point) {
        this.startTime = Date.now();
        this.rippleOrigin = rippleOrigin;

        this.animatedParticles.length = 0;

        // Finish animation of all of the particles in case
        // some of the particles have some other animations going on
        for (const particle of this.particles.particles) {
            this.propertyAnimation.finishAnimation(particle);
        }
    }

    public update(time: number) {
        const { 
            rippleAnimationDuration,
            rippleAnimationEasing,

            particleAnimationDuration,
            particleAnimationEasing,

            targetParticleOpacity,
            targetParticleSize
        } = this.params;

        if (this.startTime + rippleAnimationDuration > time) {
            const t = (time - this.startTime) / rippleAnimationDuration;
            const v = eases[rippleAnimationEasing](t);
            const rippleRadius = v * rippleLength(this.screenSize, this.rippleOrigin);

            this.particles.particles.forEach(async particle => {
                if (this.animatedParticles.indexOf(particle) < 0) {
                    const particleToOriginDistance = distance(particle, this.rippleOrigin);

                    if (particleToOriginDistance <= rippleRadius) {
                        const initialOpacity = particle.opacity;
                        const initialSize = particle.size;
                        const particleAnimationOptions = {
                            duration: particleAnimationDuration,
                            easing: particleAnimationEasing,
                        };

                        // Save the particle
                        this.animatedParticles.push(particle);

                        // Intro Animation
                        await this.propertyAnimation.animate(particle, {
                            opacity: [particle.opacity, targetParticleOpacity],
                            size: [particle.size, targetParticleSize]
                        }, particleAnimationOptions);

                        // Recovery animation
                        this.propertyAnimation.animate(particle, {
                            opacity: [particle.opacity, initialOpacity],
                            size: [particle.size, initialSize]
                        }, particleAnimationOptions);
                    }
                }
            });
        }
    }
}
