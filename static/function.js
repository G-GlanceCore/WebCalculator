// DOM elements
const exprInput = document.getElementById("expression");
const answerOutput = document.getElementById("answer");

// Valid operators 
// We define what counts as an operator. % is special, so we track it separately.
const allOperators = ["+", "-", "*", "/", "%"];
const mathOperators = ["+", "-", "*", "/"];

// Listen to typing input
exprInput.addEventListener("input", updateLiveAnswer);
document.addEventListener("keydown", handleKeyboardInput);

// Recalculates on each input
function updateLiveAnswer() {
    try {
    const transformed = transformPercent(exprInput.value);
    if (transformed && !endsWithMathOperator(exprInput.value)) {
        const result = eval(transformed);
        answerOutput.textContent = "= " + result;
    } else {
        answerOutput.textContent = "";
    }
    } catch {
    answerOutput.textContent = "";
    }
}

// Evaluate expression on =
function calculate() {
    try {
    const result = eval(transformPercent(exprInput.value));
    exprInput.value = result;
    answerOutput.textContent = "";
    } catch {
    exprInput.value = "Error";
    answerOutput.textContent = "";
    }
}

// Replace numbers with their percentage equivalent
// This turns any number%intonumber * 0.01 so we can calculate it.
function transformPercent(expr) {
    return expr.replace(/(\d+(\.\d+)?)%/g, (_, num) => `(${num}*0.01)`);
}

// Handles input, cursor control and validation
function inputSymbol(symbol) {
    const cursorPos = exprInput.selectionStart;
    const value     = exprInput.value;
    const before    = value.slice(0, cursorPos);
    const after     = value.slice(cursorPos);
    const lastChar  = before.slice(-1);
    const nextChar  = after[0] || "";

    const isMathOperator = c => mathOperators.includes(c);
    const isAnyOperator = c => allOperators.includes(c);

    // Special percent rules
    if (symbol === "%") {
    const isPrevPercent = lastChar === "%";
    const isNextPercent = nextChar === "%";
    const isPrevOperator = isMathOperator(lastChar) || lastChar === "";
    const isNextDigit = /\d/.test(nextChar);
    const isStartInvalid = cursorPos === 0 && !isMathOperator(nextChar);

        if (
            isPrevPercent   ||  // ❌ prevent after %
            isNextPercent   ||  // ❌ prevent before %
            isPrevOperator  ||  // ❌ no +%
            isStartInvalid      // ❌ cannot start with % unless before operator
        ) 
        return;
    }

    // Allow only one % per number, not after operator, not before number at start
    if (cursorPos === 0 && allOperators.includes(symbol) && symbol !== "%") return;

    // Replace or insert operator
    if (isMathOperator(symbol)) {
        if (isMathOperator(lastChar)) {
            exprInput.value = before.slice(0, -1) + symbol + after;
            setCursor(cursorPos);
        } else if (isMathOperator(nextChar)) {
            exprInput.value = before + symbol + after.slice(1);
            setCursor(cursorPos + 1);
        } else {
            exprInput.value = before + symbol + after;
            setCursor(cursorPos + 1);
        }
    } else {
    exprInput.value = before + symbol + after;
    setCursor(cursorPos + 1);
    }

    updateLiveAnswer();
}

// Deletes the character before cursor
function backspace() {
    const cursorPos = exprInput.selectionStart;
    if (cursorPos === 0) return;
    const before = exprInput.value.slice(0, cursorPos - 1);
    const after = exprInput.value.slice(cursorPos);
    exprInput.value = before + after;
    setCursor(cursorPos - 1);
    updateLiveAnswer();
}

// Set cursor position
function setCursor(pos) {
    exprInput.setSelectionRange(pos, pos);
    exprInput.focus();
}

// Clears input and preview
function clearDisplay() {
    exprInput.value = "";
    answerOutput.textContent = "";
}

// Negates the result
function toggleSign() {
    try {
    const result = eval(transformPercent(exprInput.value));
    exprInput.value = String(-result);
    updateLiveAnswer();
    } catch {}
}

// Allows keyboard typing
function handleKeyboardInput(e) {
    const key = e.key;
    if (/\d/.test(key) || key === "." || allOperators.includes(key)) {
    e.preventDefault();
    inputSymbol(key);
    } else if (key === "Enter") {
    e.preventDefault();
    calculate();
    } else if (key === "Backspace") {
    e.preventDefault();
    backspace();
    } else if (key === "Escape") {
    e.preventDefault();
    clearDisplay();
    }
}

// Check if last character is operator
function endsWithMathOperator(expr) {
    return mathOperators.includes(expr.trim().slice(-1));
}