import { RendererBase } from "./renderer";
import { Particle } from "./particle";
import { drawCircle } from './utilities';

const PARTICLE_COLOR = '#fff';

export class ParticleRenderer extends RendererBase<Particle[]> {
    public render(particles: Particle[]) {
        for (const particle of particles) {
            // Store the current GlobalAlpha
            const prevCtxAlpha = this.canvasContext.globalAlpha;

            // Set the target particle opacity as GlobalAlpha
            this.canvasContext.globalAlpha = particle.opacity;

            // Draw the particle
            drawCircle(this.canvasContext, {
                color: PARTICLE_COLOR,
                x: particle.x,
                y: particle.y,
                radius: particle.size / 2,
            });
            
            // Restore the previous Global Alpha
            this.canvasContext.globalAlpha = prevCtxAlpha;
        }
    }
}
