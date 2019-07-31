import { Particle } from "./particle";
import { ScreenSize } from "./screenSize";
import { IBuilder } from "./interfaces/builder";

export class Particles {
    public readonly particles: Particle[] = [];

    constructor(
        private screenSize: ScreenSize,
        private particleBuilders: IBuilder<Particle>[],
    ) { }

    public create(count: number = 1) {
        for (let i = 0; i < count; i++) {
            const newParticle = new Particle(
                Math.random() * this.screenSize.width,
                Math.random() * this.screenSize.height,
            );

            for (const particleBuilder of this.particleBuilders) {
                particleBuilder.build(newParticle);
            }

            this.particles.push(newParticle);
        }
    }

    public destroy(particle: Particle) {
        const indexToRemove = this.particles.indexOf(particle);

        this.particles.splice(indexToRemove, 1);
    }
}
