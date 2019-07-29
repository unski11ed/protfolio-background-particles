import { Particle } from "./particle";
import { Particles } from "./particles";

export type ParticleModifier = (particle: Particle, time: number) => void;

export class ParticleUpdater {
  constructor(
    private modifiers: ParticleModifier[],
    private particles: Particles
  ) {}

  public update() {
    for (const particle of this.particles.particles) {
      const time = Date.now();

      for (const modifier of this.modifiers) {
        modifier(particle, time);
      }
    }
  }
}
