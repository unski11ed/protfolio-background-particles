import { Particle } from "./particle";
import { ScreenSize } from "./screenSize";

export type ParticleBuilder = (particle: Particle) => void;

export class Particles {
  public readonly particles: Particle[] = [];

  constructor(
    private screenSize: ScreenSize,
    private particleTexture: CanvasImageSource,
    private particleBuilders: ParticleBuilder[]
  ) {}

  public create(count: number = 1) {
    for (let i = 0; i < count; i++) {
      const newParticle = new Particle(
        Math.random() * this.screenSize.width,
        Math.random() * this.screenSize.height,
        this.particleTexture
      );

      for (const particleBuilder of this.particleBuilders) {
        particleBuilder(newParticle);
      }

      this.particles.push(newParticle);
    }
  }

  public destroy(particle: Particle) {
    const indexToRemove = this.particles.indexOf(particle);

    this.particles.splice(indexToRemove, 1);
  }
}
