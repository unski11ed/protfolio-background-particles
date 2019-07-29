import { random } from "lodash";

import { Particle } from "./particle";
import { GravitySource } from "./gravitySource";

export function createGravityRectParticleBuilder(config: {
  gravitySource: GravitySource;
}) {
  const { gravitySource } = config;

  return (particle: Particle) => {
    const particleGravityTarget = gravitySource.generatePointWithinRegion();

    const vLength = Math.sqrt(
      Math.pow(particleGravityTarget.x - particle.x, 2) +
        Math.pow(particleGravityTarget.y - particle.y, 2)
    );
    particle.vX = (particle.x - particleGravityTarget.x) / vLength;
    particle.vY = (particle.y - particleGravityTarget.y) / vLength;
  };
}
