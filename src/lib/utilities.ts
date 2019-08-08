import { Point } from "./interfaces/point";
import { Size } from './interfaces/size';

export function drawCircle(
    ctx: CanvasRenderingContext2D,
    params: {
        x: number;
        y: number;
        radius: number;
        color: string | CanvasGradient;
    }
) {
    ctx.beginPath();
    ctx.fillStyle = params.color;
    ctx.arc(
        params.x,
        params.y,
        params.radius < 0 ? 0 : params.radius,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

export function distance(a: Point, b: Point): number {
    return Math.sqrt(
        Math.pow(b.x - a.x, 2) +
        Math.pow(b.y - a.y, 2)
    );
}

/**
 * Calculates how long the ripple should be to cover the whole screen
 * 
 * @param screenSize size of the screen the ripple should cover
 * @param center origin point of the ripple
 */
export function rippleLength(screenSize: Size, center: Point) {
    // Assuming screen starts at 0,0
    const greaterHorizontalDistance = center.x > screenSize.width / 2 ?
        center.x : screenSize.width - center.x;
    const greaterVerticalDistance = center.y > screenSize.height / 2 ?
        center.y : screenSize.height - center.y;

    return Math.sqrt(
        Math.pow(greaterHorizontalDistance, 2) +
        Math.pow(greaterVerticalDistance, 2)
    );
}

export function createDebouncer(debounceDelay = 100) {
    const timeout = 0;

    return (callback: Function) => {
        clearTimeout(timeout);
        
        setTimeout(callback, debounceDelay);
    }
}
