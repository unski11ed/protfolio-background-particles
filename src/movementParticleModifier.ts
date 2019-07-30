import { Particle } from "./particle";
import { ElementModifier } from "./element";
import { GravitySource } from './gravitySource';

export const createMovementParticleModifier = (params: {
  gravitySource: GravitySource,
}): ElementModifier => (
  particle: Particle,
  time: number
) => {
  const { gravitySource } = params;

  particle.x -= particle.vX * particle.speed;
  particle.y -= particle.vY * particle.speed;

  particle.gravityCenterLength = Math.sqrt(
    Math.pow(particle.x - gravitySource.center.x, 2) +
    Math.pow(particle.y - gravitySource.center.y, 2)
  );
};
