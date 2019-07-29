import { Rect } from "./rect";
import { Point } from "./point";

export class GravitySource {
  public get region(): Rect {
    return this.gravityRegion;
  }

  constructor(private gravityRegion: Rect) {}

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
