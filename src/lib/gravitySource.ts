import { Rect } from "./interfaces/rect";
import { Point } from "./interfaces/point";

export class GravitySource {
    public get region(): Rect {
        return this.gravityRegion;
    }

    public get center(): Point {
        return {
            x: this.region.x + this.region.width / 2,
            y: this.region.y + this.region.height / 2,
        };
    }

    constructor(private gravityRegion: Rect) { }

    public setRegion(newRegion: Rect) {
        this.gravityRegion = newRegion;
    }

    public generatePointWithinRegion(): Point {
        return {
            x: this.gravityRegion.x + Math.random() * this.gravityRegion.width,
            y: this.gravityRegion.y + Math.random() * this.gravityRegion.height
        };
    }
}
