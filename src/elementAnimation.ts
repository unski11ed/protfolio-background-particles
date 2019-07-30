import { IElement, ElementModifier } from "./element";
import * as eases from "eases";

export type AnimationParams = {
  [key: string]: number[];
};

export type AnimationOptions = {
  duration: number;
  functionName: string;
};

type AnimationState = {
  startTime: number;
  params: AnimationParams;
  options: AnimationOptions;
  finishedPromiseResolver: (element: IElement) => void;
};

const DefaultAnimationOptions: AnimationOptions = {
  duration: 200,
  functionName: "InBack"
};

export class ElementAnimation {
  private animationStates = new WeakMap<IElement, AnimationState>();

  public animateElement(
    element: IElement,
    animatedParams: AnimationParams,
    animationOptions: AnimationOptions
  ): Promise<IElement> {
    return new Promise<IElement>((finishedPromiseResolver) => {
      this.animationStates.set(element, {
        startTime: Date.now(),
        params: animatedParams,
        options: {
          ...DefaultAnimationOptions,
          ...animationOptions
        },
        finishedPromiseResolver,
      });
    });
  }

  public isAnimated(element: IElement) {
    return this.animationStates.has(element);
  }

  public createModifier(): ElementModifier {
    return (element: IElement, time: number) => {
      const state = this.animationStates.get(element);

      if (state) {
        if (time >= state.startTime + state.options.duration) {
          state.finishedPromiseResolver(element);

          this.animationStates.delete(element);

          return;
        }

        for (const targetKey of Object.keys(state.params)) {
          const [initialValue, endValue] = state.params[targetKey];

          const t = (time - state.startTime) / state.options.duration;
          const v = eases[state.options.functionName](t);
          const value = initialValue + v * (endValue - initialValue);

          element[targetKey] = value;
        }
      }
    };
  }
}
