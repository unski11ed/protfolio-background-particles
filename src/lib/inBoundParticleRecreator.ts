import { Particle } from "./particle";
import { Particles } from "./particles";
import { ElementModifier } from "./interfaces/element";
import { Size } from './interfaces/size';

// Creates a ElementModifier function which keeps track
// if all of the particles are in bound. If not it destroys
// them and creates a new one.
export const createInBoundParticleRecreator = (params: {
    bounds: Size;
    particles: Particles;
}): ElementModifier => (particle: Particle, time: number) => {
    const { bounds, particles } = params;

    if (
        particle.x > bounds.width ||
        particle.x < 0 ||
        particle.y > bounds.height ||
        particle.y < 0
    ) {
        particles.destroy(particle);

        particles.create(1);
    }
};
