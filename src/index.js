function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
  //init operator precedence
  const OP = {
    '+': 1,
    '-': 1,
    '/': 2,
    '*': 2,
  };

  const brError = "ExpressionError: Brackets must be paired";
  const typeError = "TypeError: Division by zero.";

  const isNum = (str) => Number.isInteger(parseInt(str))

  const operation = (b, a, operator) => {
    if (operator === '+') return parseFloat(a) + parseFloat(b);
    if (operator === '-') return parseFloat(a) - parseFloat(b);
    if (operator === '*') return parseFloat(a) * parseFloat(b);
    if (operator === '/') return parseFloat(a) / parseFloat(b);
  }
  //convert input expression to compatible array
  let inputArray = expr.split('').filter(i => i !== ' ')
  for (i = 0; i < inputArray.length; i++)
    if (isNum(inputArray[i]) && isNum(inputArray[i + 1])) {
      inputArray[i] += inputArray[i + 1];
      inputArray.splice(i + 1, 1)
      i--;
    }

  let nStack = [];
  let oStack = [];

  const pushOperation = () => {
    temp = operation(nStack.pop(), nStack.pop(), oStack.pop());
    nStack.push(temp)
  };

  for (i = 0; i < inputArray.length; i++) {
    let cur = inputArray[i];
    if (isNum(cur)) {
      if (OP[oStack[oStack.length - 1]] <= OP[oStack[oStack.length - 2]] && oStack.length) {
        temp = operation(nStack[nStack.length - 1], nStack[nStack.length - 2], oStack[oStack.length - 2])
        nStack.splice(nStack.length - 2, 2);
        oStack.splice(oStack.length - 2, 1);
        nStack.splice(nStack.length, 0, temp);
      }
      nStack.push(cur)
    } else if (cur === ")" && !oStack.includes('(')) return brError;
    else if (!oStack.length) oStack.push(cur);
    else if (cur === '(') {
      if (OP[oStack[oStack.length - 1]] <= OP[oStack[oStack.length - 2]] && oStack.length) {
        temp = operation(nStack[nStack.length - 1], nStack[nStack.length - 2], oStack[oStack.length - 2])
        nStack.splice(nStack.length - 2, 2);
        oStack.splice(oStack.length - 2, 1);
        nStack.splice(nStack.length, 0, temp);
      }
      oStack.push(cur);
    } else if (oStack[oStack.length - 1] === '(' || OP[cur] > OP[oStack[oStack.length - 1]]) oStack.push(cur);
    else if (OP[cur] < OP[oStack[oStack.length - 1]]) {
      while (OP[oStack[oStack.length - 1]] > OP[oStack[oStack.length - 2]] && oStack[oStack.length - 2] !== '(') {
        pushOperation()
      }
      while (oStack.length && oStack[oStack.length - 2] !== '(') {
        pushOperation()
      }
      oStack.push(cur)
    } else if (OP[cur] === OP[oStack[oStack.length - 1]]) {
      while (OP[oStack[oStack.length - 1]] === OP[oStack[oStack.length - 2]] /* && oStack[oStack.length - 1] !== '(' */ ) {
        temp = operation(nStack[nStack.length - 2], nStack[nStack.length - 3], oStack[oStack.length - 2])
        nStack.splice(nStack.length - 3, 2);
        oStack.splice(oStack.length - 2, 1);
        nStack.splice(nStack.length - 2, 0, temp);
      }
      pushOperation()
      oStack.push(cur)
    } else if (cur === ')') {
      while (oStack[oStack.length - 1] !== '(') {
        pushOperation()
      }
      oStack.pop()
    }
    if (i === (inputArray.length - 1) && oStack.includes('(')) return brError;
    if (nStack.includes(Infinity)) return typeError;

    console.log(i, inputArray[i]);
    console.log(nStack);
    console.log(oStack);
  }

  for (i = 0; oStack.length; i++) {
    if (OP[oStack[i]] === OP[oStack[i + 1]]) {
      temp = operation(nStack[i + 1], nStack[i], oStack[i])
      nStack.splice(i, 2);
      oStack.splice(i, 1);
      nStack.splice(i, 0, temp);
    }
    if (OP[oStack[i]] > OP[oStack[i + 1]] || oStack.length - 1 === i) {
      temp = operation(nStack[i + 1], nStack[i], oStack[i])
      nStack.splice(i, 2);
      oStack.splice(i, 1);
      nStack.splice(i, 0, temp);
      i -= 2
    }
  }
  if (nStack.includes(Infinity)) return typeError;
  return nStack[0]
}

module.exports = {
    expressionCalculator
}
