import { Particle } from "./particle";
import { ElementModifier } from "./interfaces/element";
import { GravitySource } from './gravitySource';

// Creates a ElementModifier function which moves the
// Particles in the direction of the GravitySource's center
// applying the defined Velocity
export const createMovementParticleModifier = (params: {
    gravitySource: GravitySource,
}): ElementModifier => (
    particle: Particle,
    time: number
) => {
        particle.x -= particle.vX * particle.speed;
        particle.y -= particle.vY * particle.speed;
    };
