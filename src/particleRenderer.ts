import { RendererBase } from "./renderer";
import { Particle } from "./particle";

export class ParticleRenderer extends RendererBase<Particle> {
  public render(items: Particle[]) {
    for (const particle of items) {
      const prevCtxAlpha = this.canvasContext.globalAlpha;

      this.canvasContext.globalAlpha = particle.opacity;
      this.canvasContext.drawImage(
        particle.texture,
        particle.x,
        particle.y,
        particle.size * particle.maxSize,
        particle.size * particle.maxSize
      );

      this.canvasContext.globalAlpha = prevCtxAlpha;
    }
  }
}
