import { ElementType } from "./elementTypes";

export interface IElement {
    type: ElementType;
    x: number;
    y: number;
}

export type ElementModifier = (element: IElement, time: number) => void;
