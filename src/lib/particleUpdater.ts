import { Particle } from "./particle";
import { Particles } from "./particles";
import { IUpdatable } from './interfaces/updatable';

export type ParticleModifier = (particle: Particle, time: number) => void;

export class ParticleUpdater implements IUpdatable {
    constructor(
        private modifiers: ParticleModifier[],
        private particles: Particles
    ) { }

    public update(time: number) {
        for (const particle of this.particles.particles) {
            for (const modifier of this.modifiers) {
                modifier(particle, time);
            }
        }
    }
}
