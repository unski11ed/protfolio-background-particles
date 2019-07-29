export class ScreenSize {
  public get width(): number {
    return this.canvasElement.width;
  }
  public get height(): number {
    return this.canvasElement.height;
  }

  constructor(private canvasElement: HTMLCanvasElement) {}
}
