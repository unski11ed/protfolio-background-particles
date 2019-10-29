import _ from "lodash";
import { Particle } from "./particle";
import { IBuilder } from "./interfaces/builder";
import { PropertyAnimation } from "./propertyAnimation";

export type FadeInParticleBuilderOptions = {
    spawnAnimationEasing?: string;
    spawnAnimationDuration?: number;

    minSize?: number;
    maxSize?: number;
    minOpacity?: number;
    maxOpacity?: number;
    minSpeed?: number;
    maxSpeed?: number;
};

export class FadeInParticleBuilder implements IBuilder<Particle> {
    // Default Options
    private options: FadeInParticleBuilderOptions = {
        spawnAnimationEasing: 'cubicOut',
        spawnAnimationDuration: 300,

        minSize: 1,
        maxSize: 4,
        minOpacity: 0.01,
        maxOpacity: 0.7,
        minSpeed: 0.001,
        maxSpeed: 0.1,
    };

    constructor(
        private propertyAnimation: PropertyAnimation,
        builderOptions: FadeInParticleBuilderOptions = { },
    ) {
        // Fill the options from the provided config if there are any
        Object.assign(this.options, builderOptions);
    }

    public build(particle: Particle) {
        // Randomize the Particle options
        const targetOpacity = _.random(
            this.options.minOpacity,
            this.options.maxOpacity,
            true
        );
        const targetSize = _.random(
            this.options.minSize,
            this.options.maxSize
        );
        particle.speed = _.random(
            this.options.minSpeed,
            this.options.maxSpeed,
            true
        );
        particle.opacity = 0;

        // Animate them if nescessary
        this.propertyAnimation.animate(
            particle,
            {
                maxOpacity: [0, targetOpacity],
                size: [0, targetSize]
            },
            {
                functionName: this.options.spawnAnimationEasing,
                duration: this.options.spawnAnimationDuration
            }
        );
    }
}
