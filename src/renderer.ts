import { IElement } from "./element";

export abstract class RendererBase<TElement extends IElement> {
  protected canvasContext: CanvasRenderingContext2D;

  constructor(protected canvasElement: HTMLCanvasElement) {
    this.canvasContext = canvasElement.getContext("2d");
  }

  public abstract render(items: TElement[]);
}
