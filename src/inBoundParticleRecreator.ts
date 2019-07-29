import { Particle } from "./particle";
import { ParticleModifier, Particles } from "./particles";
import { ScreenSize } from "./screenSize";

export const createInBoundParticleRecreator = (params: {
  screenSize: ScreenSize;
  particles: Particles;
}): ParticleModifier => (particle: Particle, time: number) => {
  const { screenSize, particles } = params;

  if (
    particle.x > screenSize.width ||
    particle.x < 0 ||
    particle.y > screenSize.height ||
    particle.y < 0
  ) {
    particles.destroy(particle);

    particles.create(1);
  }
};
