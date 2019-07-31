import eases from 'eases';

import { IUpdatable } from "./updatable";
import { ScreenSize } from "./screenSize";
import { IElement } from "./element";
import { ElementType } from "./elementTypes";
import { GravitySource } from "./gravitySource";

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
            this.canvasElement.width = screenSize.width;
            this.canvasElement.height = screenSize.height;
            this.canvasContext = this.canvasElement.getContext('2d');

            this.currentColor = params.initialColor;

            this.fillTexture({ color: this.currentColor });
        }
    }

    public trigger(nextColor: string) {
        this.startTime = Date.now();
        this.animationInProgress = true;

        this.currentColor = this.nextColor;
        this.nextColor = nextColor;
    }

    public update(time: number) {
        const { duration, easingFunc } = this.params;

        if (this.animationInProgress) {
            if (this.startTime + duration > time) {
                const t = (time - this.startTime) / duration;
                const v = eases[easingFunc](t);
                const rippleRadius = v * this.getTargetRadius();
    
                this.generateTexture(rippleRadius);
            } else {
                // Finish
                this.fillTexture({ color: this.nextColor });

                this.animationInProgress = false;
            }
        }
    }

    private getTargetRadius() {
        const { center } = this.gravitySource;

        return Math.sqrt(
            Math.pow(center.x > this.screenSize.width / 2 ? center.x : this.screenSize.width - center.x, 2) +
            Math.pow(center.y > this.screenSize.height / 2 ? center.y : this.screenSize.height - center.y, 2)
        );
    }

    private fillTexture(params: { color: string }) {
        this.canvasContext.fillStyle = params.color;
        this.canvasContext.fillRect(0, 0, this.screenSize.width, this.screenSize.height);
    }

    private drawCircle(params: {
        x: number;
        y: number;
        radius: number;
        color: string | CanvasGradient;
    }) {
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = params.color;
        this.canvasContext.arc(
            params.x,
            params.y,
            params.radius,
            0,
            2 * Math.PI
        );
        this.canvasContext.fill();
    }

    private generateTexture(rippleRadius: number) {
        const { waveLength } = this.params;

        this.fillTexture({ color: this.currentColor });
        
        const offset = waveLength / 2;
        // Setup Radial Gradient
        const waveGradient = this.canvasContext.createRadialGradient(
            // Inner Circle (x, y, r)
            this.gravitySource.center.x,
            this.gravitySource.center.y,
            rippleRadius - offset < 0 ? 0 : rippleRadius - offset,

            // Outer Cricle (x, y, r)
            this.gravitySource.center.x,
            this.gravitySource.center.y,
            rippleRadius + offset,
        );
        waveGradient.addColorStop(0.0, this.nextColor);
        waveGradient.addColorStop(0.2, '#fff');
        waveGradient.addColorStop(0.8, '#fff');
        waveGradient.addColorStop(1.0, this.currentColor);

        // Draw Wave
        this.drawCircle({
            ...this.gravitySource.center,
            radius: rippleRadius + offset,
            color: waveGradient,
        });
    }
}