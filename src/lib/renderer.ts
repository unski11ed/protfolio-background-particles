import { IElement } from "./interfaces/element";

// Base class for Element Renderers
export abstract class RendererBase<TElement extends IElement | IElement[]> {
    protected canvasContext: CanvasRenderingContext2D;

    constructor(protected canvasElement: HTMLCanvasElement) {
        this.canvasContext = canvasElement.getContext("2d");
    }

    public abstract render(item: TElement);
}
