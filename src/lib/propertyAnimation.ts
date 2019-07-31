import * as eases from 'eases';
import { IUpdatable } from "./interfaces/updatable";

export type AnimationParams = {
    [key: string]: number[];
};

export type AnimationOptions = {
    duration?: number;
    functionName?: string;
};

type AnimationState = {
    element: object;
    startTime: number;
    params: AnimationParams;
    options: AnimationOptions;
    finishResolver: (element: object) => void;
};

const DefaultAnimationOptions: AnimationOptions = {
    duration: 200,
    functionName: 'linear'
};

export class PropertyAnimation implements IUpdatable {
    private animationStates: AnimationState[] = [];

    public animate(
        element: object,
        animatedParams: AnimationParams,
        animationOptions: AnimationOptions = { }
    ) {
        // Fill in the missing option properties
        const options = { ...DefaultAnimationOptions, ...animationOptions };

        if (typeof eases[options.functionName] !== 'function') {
            throw Error(`Provided easing function name ${ options.functionName } is not recognized.`)
        }

        // Create an animation finish promise
        const animationFinishPromise = new Promise<object>((finishResolver) => {
            // Store the initial animation state with the Promise Resolver
            const newAnimationState = {
                element,
                startTime: Date.now(),
                params: animatedParams,
                options,
                finishResolver,
            }
            this.animationStates.push(newAnimationState);
        });

        return animationFinishPromise;
    }

    public finishAnimation(element: object) {
        const state = this.animationStates.find(s => s.element === element);

        if (state) {
            // Ensure all of the target properties are at their taraget end state
            for (const targetKey of Object.keys(state.params)) {
                element[targetKey] = state.params[targetKey][1];
            }

            // Remove the state from tracking
            const stateIndex = this.animationStates.indexOf(state);
            this.animationStates.splice(stateIndex, 1);

            // Call the finish promise resolver
            state.finishResolver(state.element);
        }
    }

    public update(time: number) {
        for (const animationState of this.animationStates) {
            const {
                element,
                startTime,
                params,
                options,
                finishResolver,
            } = animationState;

            if (time >= startTime + options.duration) {
                // When time is up - finish the animation...
                this.finishAnimation(element);
            } else {
                // ... continue animating othwerwise
                for (const targetKey of Object.keys(params)) {
                    const [initialValue, endValue] = params[targetKey];
            
                    const t = (time - startTime) / options.duration;
                    const v = eases[options.functionName](t);
                    const value = initialValue + v * (endValue - initialValue);
            
                    element[targetKey] = value;
                }
            }
        }
    }
}
