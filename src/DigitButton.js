import { ACTIONS } from "./App";

// We pass in dispatch function so we can call it from this component.
export default function DigitButton({ dispatch, digit}) {
    return (
        <button
            onClick={() => dispatch({
                type: ACTIONS.ADD_DIGIT,
                payload: { digit }}
        )}>
            {digit}
        </button>
    );
}