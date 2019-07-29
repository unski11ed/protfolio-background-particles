import { IDestroyable } from "./destroyable";
import { EventEmitter } from "events";
import { ScreenSize } from "./screenSize";

const BLANK_COLOR = "rgb(0, 0, 0)";

export class Screen implements IDestroyable {
  public onScreenResized: EventEmitter = new EventEmitter();

  private canvasContext: CanvasRenderingContext2D;
  private handleCanvasResize = () => {
    const canvasElementRect = this.canvasElement.getBoundingClientRect();

    this.canvasElement.width = canvasElementRect.width;
    this.canvasElement.height = canvasElementRect.height;

    this.onScreenResized.emit("screenResized");
  };

  constructor(
    private canvasElement: HTMLCanvasElement,
    private screenSize: ScreenSize
  ) {
    this.canvasContext = canvasElement.getContext("2d");

    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.handleCanvasResize);
    }

    this.handleCanvasResize();
  }

  public prepareScene() {
    this.canvasContext.fillStyle = BLANK_COLOR;
    this.canvasContext.fillRect(
      0,
      0,
      this.screenSize.width,
      this.screenSize.height
    );
  }

  public destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.handleCanvasResize);
    }
  }
}
