import { IElement, ElementModifier } from "./element";
import { OutCubic } from "@rbxts/easing-functions";

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
  ) {
    this.animationStates.set(element, {
      startTime: Date.now(),
      params: animatedParams,
      options: {
        ...DefaultAnimationOptions,
        ...animationOptions
      }
    });
  }

  createModifier(): ElementModifier {
    return (element: IElement, time: number) => {
      const state = this.animationStates.get(element);

      if (state) {
        if (time >= state.startTime + state.options.duration) {
          this.animationStates.delete(element);

          return;
        }

        for (const targetKey of Object.keys(state.params)) {
          const [initialValue, endValue] = state.params[targetKey];

          OutCubic(
            time - state.startTime,
            initialValue,
            endValue - initialValue,
            state.options.duration
          );
        }
      }
    };
  }
}
