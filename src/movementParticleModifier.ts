import { Particle } from "./particle";
import { ParticleModifier } from "./particles";

export const createMovementParticleModifier = (): ParticleModifier => (
  particle: Particle,
  time: number
) => {
  particle.x -= particle.vX * particle.speed;
  particle.y -= particle.vY * particle.speed;
};
