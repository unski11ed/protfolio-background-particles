import { RendererBase } from "./renderer";
import { RippleTexture } from "./rippleTexture";

export class RippleRenderer extends RendererBase<RippleTexture> {
    public render(rippleTexture) {
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
