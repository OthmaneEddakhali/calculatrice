const display = document.getElementById("display");
let expression = "0";

function formatResult(value) {
    if (!Number.isFinite(value)) {
        return "Error";
    }

    if (Number.isInteger(value)) {
        return String(value);
    }

    return String(parseFloat(value.toFixed(10)));
}

function updateDisplay(value) {
    expression = value;
    display.value = expression;
}

function appendNumber(value) {
    if (display.value === "Error") {
        updateDisplay("");
    }

    if (display.value === "0") {
        updateDisplay(value);
        return;
    }

    updateDisplay(expression + value);
}

function appendDecimal() {
    if (display.value === "Error") {
        updateDisplay("0.");
        return;
    }

    const lastTerm = expression.split(/[+\-*/%^]/).pop();
    if (!lastTerm.includes(".")) {
        updateDisplay(expression + ".");
    }
}

function appendOperator(operator) {
    if (display.value === "Error") {
        updateDisplay("0");
    }

    if (expression === "") {
        updateDisplay("0" + operator);
        return;
    }

    if (/[+\-*/%^]$/.test(expression)) {
        updateDisplay(expression.slice(0, -1) + operator);
        return;
    }

    updateDisplay(expression + operator);
}

function clearDisplay() {
    updateDisplay("0");
}

function deleteLast() {
    if (display.value === "Error") {
        clearDisplay();
        return;
    }

    if (expression.length <= 1) {
        clearDisplay();
        return;
    }

    updateDisplay(expression.slice(0, -1));
}

function toggleSign() {
    if (display.value === "Error") {
        updateDisplay("0");
        return;
    }

    const current = Number(expression);
    if (!Number.isFinite(current)) {
        updateDisplay("Error");
        return;
    }

    updateDisplay(formatResult(-current));
}

function applyUnaryFunction(name) {
    const currentValue = Number(expression);

    if (!Number.isFinite(currentValue)) {
        updateDisplay("Error");
        return;
    }

    let result;

    switch (name) {
        case "sqrt":
            result = Math.sqrt(currentValue);
            break;
        case "square":
            result = currentValue * currentValue;
            break;
        case "cube":
            result = currentValue * currentValue * currentValue;
            break;
        case "sin":
            result = Math.sin((currentValue * Math.PI) / 180);
            break;
        case "cos":
            result = Math.cos((currentValue * Math.PI) / 180);
            break;
        case "tan":
            result = Math.tan((currentValue * Math.PI) / 180);
            break;
        case "log":
            result = Math.log10(currentValue);
            break;
        case "ln":
            result = Math.log(currentValue);
            break;
        case "abs":
            result = Math.abs(currentValue);
            break;
        case "exp":
            result = Math.exp(currentValue);
            break;
        case "pi":
            result = Math.PI;
            break;
        case "e":
            result = Math.E;
            break;
        default:
            result = currentValue;
    }

    updateDisplay(formatResult(result));
}

function evaluateExpression() {
    if (display.value === "Error") {
        return;
    }

    const sanitizedExpression = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\^/g, "**");

    try {
        const result = Function('"use strict"; return (' + sanitizedExpression + ');')();
        updateDisplay(formatResult(Number(result)));
    } catch (error) {
        updateDisplay("Error");
    }
}

function handleParenthesis(value) {
    if (display.value === "Error") {
        updateDisplay(value);
        return;
    }

    updateDisplay(expression + value);
}

document.querySelectorAll(".number").forEach((button) => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.value);
    });
});

document.querySelectorAll(".operator").forEach((button) => {
    button.addEventListener("click", () => {
        appendOperator(button.dataset.value);
    });
});

document.querySelectorAll(".function").forEach((button) => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        if (action === "clear") {
            clearDisplay();
        } else if (action === "delete") {
            deleteLast();
        } else if (action === "decimal") {
            appendDecimal();
        } else if (action === "toggle-sign") {
            toggleSign();
        } else if (action === "unary") {
            applyUnaryFunction(button.dataset.value);
        } else if (action === "constant") {
            applyUnaryFunction(button.dataset.value);
        } else if (action === "parenthesis") {
            handleParenthesis(button.dataset.value);
        }
    });
});

document.querySelector("[data-action='equals']").addEventListener("click", evaluateExpression);

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        appendNumber(key);
    } else if (key === ".") {
        appendDecimal();
    } else if (["+", "-", "*", "/", "%", "^"].includes(key)) {
        appendOperator(key);
    } else if (key === "Enter") {
        evaluateExpression();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearDisplay();
    }
});