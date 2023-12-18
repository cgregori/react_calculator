import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload } /*action*/) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite === true) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
          // Preserve in case of accidental input.
          previousOperand: state.previousOperand + state.currentOperand
        }
      }
      return {
        ...state,
        currentOperand: addDigit(state.currentOperand, payload.digit),
      };
    case ACTIONS.CHOOSE_OPERATION:
      // No action.
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      // Move current state up to previous.
      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null
        };
      }
      // Overwrite previous operation (Accidental input).
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      // Keep the user's flow, as if they were looking at their paper.
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      // No action.
      if (state.currentOperand == null) {
        return {...state}
      }
      // An All Clear "Lite"
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      };
    case ACTIONS.EVALUATE:
      // No operations have been performed yet.
      if (
        state.previousOperand == null ||
        state.operation == null ||
        state.currentOperand == null
      ) {
        return { ...state };
      }
      // We're safe to go ahead.
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null
      };
    default:
      return {...state};
  }
}

function addDigit(currentOperand, digit) {
  // We need to check for a null state (i.e. first calculator input).
  if (currentOperand == null) {
    return digit;
  }
  // No multiple leading 0s.
  if (digit === "0" && currentOperand === "0") {
    return currentOperand;
  }
  // Only one decimal allowed.
  if (digit === "." && currentOperand.includes(".")) {
    return currentOperand;
  }
  return `${currentOperand || ""}${digit}`;
}

function evaluate({previousOperand, currentOperand, operation}) {
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(previous) || isNaN(current)) {
    return ""
  }

  switch (operation) {
    case "+":
      return previous + current;
    case "-":
      return previous - current;
    case "*":
      return previous * current;
    case "÷":
      return previous / current;
    default:
      return currentOperand;
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  console.log("operand: ", operand);
  if (operand == null) {
    return;
  }

  const [integer, decimal] = operand.toString().split(".");
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }
  // With decimal.
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation } /*state*/, dispatch] =
    useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;