// A simple, safe expression evaluator using Shunting-yard algorithm.
// Does not use eval().

const precedence: { [key: string]: number } = {
  '+': 1, '−': 1, '×': 2, '÷': 2, '^': 3,
};

const functions = ['sin', 'cos', 'tan', 'log', 'ln', '√'];

function tokenize(expression: string): (string | number)[] {
    const cleaned = expression
      .replace(/π/g, String(Math.PI))
      .replace(/×/g, '*')
      .replace(/−/g, '-')
      .replace(/÷/g, '/')
      .replace(/√/g, 'sqrt');

    const regex = /(\d+\.?\d*|[a-z]+|\S)/gi;
    return cleaned.match(regex) || [];
}

function toRPN(tokens: (string | number)[]): (string | number)[] {
  const outputQueue: (string | number)[] = [];
  const operatorStack: string[] = [];

  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      outputQueue.push(Number(token));
    } else if (functions.includes(String(token))) {
        operatorStack.push(String(token));
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack[operatorStack.length - 1] === '(') {
          operatorStack.pop();
      }
      if (functions.includes(operatorStack[operatorStack.length - 1])) {
          outputQueue.push(operatorStack.pop()!);
      }
    } else { // Operator
      const op = String(token);
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1] !== '(' &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[op]
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(op);
    }
  }

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop()!);
  }

  return outputQueue;
}

function evaluateRPN(rpn: (string | number)[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (typeof token === 'number') {
      stack.push(token);
    } else {
        // It's an operator or function
      if (functions.includes(String(token))) {
        if (stack.length < 1) throw new Error("Invalid expression");
        const operand = stack.pop()!;
        switch (token) {
            case 'sin': stack.push(Math.sin(operand * Math.PI / 180)); break; // Assuming Deg
            case 'cos': stack.push(Math.cos(operand * Math.PI / 180)); break; // Assuming Deg
            case 'tan': stack.push(Math.tan(operand * Math.PI / 180)); break; // Assuming Deg
            case 'log': stack.push(Math.log10(operand)); break;
            case 'ln': stack.push(Math.log(operand)); break;
            case 'sqrt': stack.push(Math.sqrt(operand)); break;
        }
      } else {
          if (stack.length < 2) throw new Error("Invalid expression");
          const b = stack.pop()!;
          const a = stack.pop()!;
          switch (token) {
            case '+': stack.push(a + b); break;
            case '-': stack.push(a - b); break;
            case '*': stack.push(a * b); break;
            case '/': stack.push(a / b); break;
            case '^': stack.push(Math.pow(a, b)); break;
          }
      }
    }
  }

  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}


export function evaluate(expression: string): number {
    if (!expression) return 0;
    try {
        const tokens = tokenize(expression);
        const rpn = toRPN(tokens);
        const result = evaluateRPN(rpn);
        return result;
    } catch(e) {
        console.error("Evaluation error:", e);
        throw new Error("Invalid Expression");
    }
}
