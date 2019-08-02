import eases from 'eases';

import { IUpdatable } from "./interfaces/updatable";
import { IElement } from "./interfaces/element";
import { ElementType } from "./interfaces/elementTypes";
import { ScreenSize } from "./screenSize";
import { GravitySource } from "./gravitySource";
import { Point } from './interfaces/point';
import { rippleLength, drawCircle } from './utilities';

export type RippleTextureParams = {
    duration: number;
    easingFunc: string;
    waveLength: number;
    initialColor: string;
};

export class RippleTexture implements IUpdatable, IElement {
    public type = ElementType.Ripple;
    public x = 0;
    public y = 0;
    public get texture(): CanvasImageSource {
        return this.canvasElement;
    }

    private canvasElement: HTMLCanvasElement | null = null;
    private canvasContext: CanvasRenderingContext2D | null = null;
    private startTime = 0;
    private originPoint: Point = { x: 0, y: 0 };
    private currentColor: string;
    private nextColor: string = '#fff';
    private animationInProgress = false;

    constructor(
        private params: RippleTextureParams,
        private screenSize: ScreenSize,
        private gravitySource: GravitySource,
    ) {
        if (typeof document !== 'undefined') {
            this.canvasElement = document.createElement('canvas');
            this.updateSize();
            this.canvasContext = this.canvasElement.getContext('2d');

            this.currentColor = params.initialColor;

            this.fillTexture({ color: this.currentColor });
        }
    }

    public updateSize() {
        this.canvasElement.width = this.screenSize.width;
        this.canvasElement.height = this.screenSize.height;
    }

    public trigger(nextColor: string, originPoint: Point) {
        this.startTime = Date.now();
        this.animationInProgress = true;

        this.currentColor = this.nextColor;
        this.nextColor = nextColor;
        this.originPoint = originPoint;
    }

    public update(time: number) {
        const { duration, easingFunc } = this.params;

        if (this.animationInProgress) {
            if (this.startTime + duration > time) {
                const t = (time - this.startTime) / duration;
                const v = eases[easingFunc](t);
                const rippleRadius = v * rippleLength(
                    this.screenSize,
                    this.originPoint
                );
    
                this.generateTexture(rippleRadius);
            } else {
                // Finish
                this.fillTexture({ color: this.nextColor });

                this.animationInProgress = false;
            }
        }
    }

    private fillTexture(params: { color: string }) {
        this.canvasContext.fillStyle = params.color;
        this.canvasContext.fillRect(0, 0, this.screenSize.width, this.screenSize.height);
    }

    private generateTexture(rippleRadius: number) {
        const { waveLength } = this.params;

        this.fillTexture({ color: this.currentColor });
        
        const offset = waveLength / 2;
        // Setup Radial Gradient
        const waveGradient = this.canvasContext.createRadialGradient(
            // Inner Circle (x, y, r)
            this.originPoint.x,
            this.originPoint.y,
            rippleRadius - offset < 0 ? 0 : rippleRadius - offset,

            // Outer Cricle (x, y, r)
            this.originPoint.x,
            this.originPoint.y,
            rippleRadius + waveLength,
        );
        waveGradient.addColorStop(0.0, this.nextColor);
        waveGradient.addColorStop(0.2, '#fff');
        waveGradient.addColorStop(0.8, '#fff');
        waveGradient.addColorStop(1.0, this.currentColor);

        // Draw Wave
        drawCircle(this.canvasContext, {
            ...this.originPoint,
            radius: rippleRadius + offset,
            color: waveGradient,
        });
    }
}