import { Particle } from "./particle";
import { GravitySource } from "./gravitySource";
import { IBuilder } from "./interfaces/builder";

export class GravityRectParticleBuilder implements IBuilder<Particle> {
    constructor(
        private gravitySource: GravitySource,
    ) { }

    public build(particle) {
        const particleGravityTarget = this.gravitySource.generatePointWithinRegion();

        const vLength = Math.sqrt(
        Math.pow(particleGravityTarget.x - particle.x, 2) +
            Math.pow(particleGravityTarget.y - particle.y, 2)
        );
        particle.vX = (particle.x - particleGravityTarget.x) / vLength;
        particle.vY = (particle.y - particleGravityTarget.y) / vLength;
    }
}
