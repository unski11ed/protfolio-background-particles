import { ElementType } from "./interfaces/elementTypes";
import { IElement } from "./interfaces/element";

export class Particle implements IElement {
    public type = ElementType.Particle;
    public size = 1;
    public opacity = 0.5;
    public maxOpacity = 1;

    public vX = 0;
    public vY = 0;

    constructor(
        public x: number,
        public y: number,
        public speed = 0.1
    ) { }
}
