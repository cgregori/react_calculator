import { ACTIONS } from "./App";

// We pass in dispatch function so we can call it from this component.
export default function OperationButton({ dispatch, operation}) {
    return (
        <button
            onClick={() => dispatch({
                type: ACTIONS.CHOOSE_OPERATION,
                payload: { operation }}
        )}>
            {operation}
        </button>
    );
}