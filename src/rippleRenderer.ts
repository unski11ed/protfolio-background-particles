import { RendererBase } from "./renderer";
import { Particle } from "./particle";
import { RippleTexture } from "./rippleTexture";

export class RippleRenderer extends RendererBase<RippleTexture> {
  public render(rippleTextures: RippleTexture[]) {
    const rippleTexture = rippleTextures[0];
    const lastBlend = this.canvasContext.globalCompositeOperation;

    this.canvasContext.globalCompositeOperation = 'multiply';
    this.canvasContext.drawImage(
      rippleTexture.texture,
      rippleTexture.x,
      rippleTexture.y,
    );
    this.canvasContext.globalCompositeOperation = lastBlend;
  }
}
