import { IDestroyable } from "./interfaces/destroyable";
import { EventEmitter } from "eventemitter3";
import { ScreenSize } from "./screenSize";

export class Screen implements IDestroyable {
    public events = new EventEmitter();

    private canvasContext: CanvasRenderingContext2D;
    private handleCanvasResize = () => {
        const canvasElementRect = this.canvasElement.getBoundingClientRect();

        this.canvasElement.width = canvasElementRect.width;
        this.canvasElement.height = canvasElementRect.height;

        this.events.emit("screenResized");
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
        this.canvasContext.fillStyle ='#000';
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
