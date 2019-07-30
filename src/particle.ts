import { ElementType } from "./elementTypes";
import { IElement } from "./element";

export class Particle implements IElement {
  public type = ElementType.Particle;
  public size = 1;
  public opacity = 0.5;

  public vX = 0;
  public vY = 0;

  public gravityCenterLength = 0;

  constructor(
    public x: number,
    public y: number,
    public texture: CanvasImageSource,
    public maxSize = 4,
    public maxOpacity = 1,
    public speed = 0.1
  ) {}
}
