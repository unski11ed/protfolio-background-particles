import { random } from "lodash";
import { ElementAnimation } from "./elementAnimation";
import { ParticleBuilder } from "./particles";
import { Particle } from "./particle";

export const createFadeInParticleBuilder = (params: {
  elementAnimation: ElementAnimation;
}): ParticleBuilder => (particle: Particle) => {
  const { elementAnimation } = params;
  const targetOpacity = random(0.1, particle.maxOpacity);
  const targetSize = random(0.1, particle.maxSize);

  elementAnimation.animateElement(
    particle,
    {
      opacity: [0, targetOpacity],
      size: [0, targetSize]
    },
    {
      functionName: "OutCubic",
      duration: 200
    }
  );
};
