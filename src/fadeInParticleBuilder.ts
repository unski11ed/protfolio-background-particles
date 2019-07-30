import { random } from "lodash";
import { ElementAnimation } from "./elementAnimation";
import { ParticleBuilder } from "./particles";
import { Particle } from "./particle";

export const createFadeInParticleBuilder = (params: {
  elementAnimation: ElementAnimation;
}): ParticleBuilder => (particle: Particle) => {
  const { elementAnimation } = params;
  const targetOpacity = random(0.1, particle.maxOpacity);
  const targetSize = random(2, particle.maxSize);
  
  particle.speed = random(0.001, 0.1, true);

  elementAnimation.animateElement(
    particle,
    {
      opacity: [0, targetOpacity],
      size: [0, targetSize]
    },
    {
      functionName: "cubicOut",
      duration: 3000
    }
  );
};
