let equationTypes = {'linear': getLinearEquation, 'incomplete quadratic': getIncompleteQuadraticEquation,'quadratic': getQuadraticEquation};

function createEquationsList (equationsTypes, amount) {
  amount *= 4;
  let equations = [];
  for (let type of equationsTypes) {
    for (let j = 1; j <= amount; j++) {
      let equation = equationTypes[type]()
      equations.push(equation);
    }
  }
  console.log(equations);
  return shuffle(equations);
}
// linear
function getLinearEquation () {
  let x = getRandom(2, 9);
  let coefficient = getRandom(2, 9);
  let num = x * coefficient;
  let bracketsPart = getRandom(1, x - 1)
  let bracketsNum = bracketsPart * coefficient
  let leftNum = num - bracketsNum;
  // return [coefficient + '(x - ' + bracketsPart + ') - ' + leftNum + ' = 0', coefficient + 'x - ' + num + ' = 0']
  return {
    type: 'linear',
    answer: x,
    string: coefficient + '(x - ' + bracketsPart + ') = ' + leftNum,
    parts: [
      [coefficient + '(x - ' + bracketsPart + ') = ' + leftNum, ''],
      [coefficient + '•x - ' + coefficient + '•' + bracketsPart + ' = ' + leftNum, 'Розкриваємо дужки'],
      [coefficient + 'x - ' + bracketsNum + ' = ' + leftNum, 'Виконаємо дії'],
      [coefficient + 'x = ' + leftNum + ' + ' + bracketsNum, 'Переносимо відомі вправо'],
      [coefficient + 'x = ' + num + ' | ÷' + coefficient, 'Виконаємо дії і ділимо обидві частини на ' + coefficient],
      ['x = ' + x, '']
    ]
  }
}
// incomplete quadratic
function getIncompleteQuadraticEquation () {
  let x = getRandom(2, 9);
  let coefficient = getRandom(2, 9);
  let num = x * coefficient;
  let bracketsPart = getRandom(1, x - 1)
  let bracketsNum = bracketsPart * coefficient
  let leftNum = num - bracketsNum;

  let sq = '<sup>2</sup>'
  return {
    type: 'inquad',
    answer: [0, x],
    string: coefficient + 'x(x - ' + bracketsPart + ') = ' + leftNum + 'x',
    parts: [
      [coefficient + 'x(x - ' + bracketsPart + ') = ' + leftNum + 'x', ''],
      [coefficient + 'x•x - ' + coefficient + 'x•' + bracketsPart + ' = ' + leftNum + 'x', 'Розкриваємо дужки'],
      [coefficient + 'x' + sq + ' - ' + bracketsNum + 'x = ' + leftNum + 'x', 'Виконуємо дії'],
      [coefficient + 'x' + sq + ' - ' + bracketsNum + 'x - ' + leftNum + 'x = 0', 'Переносимо невідомі вліво'],
      [coefficient + 'x' + sq + ' - ' + num + 'x = 0', 'Виконуємо дії'],
      ['x' + sq + ' - ' + x + 'x = 0', 'Ділимо обидві частини на ' + coefficient],
      ['<u>x</u>•x - <u>x</u>•' + x + ' = 0', 'Виділяємо спільні множники'],
      ['x(x - ' + x + ') = 0', 'Вносимо в дужки'],
      [['x = 0', 'x - ' + x + ' = 0'], ['x = 0', 'x = ' + x], 'Знаходимо корені'],
      ['x = 0, x = ' + x, 'Записуємо відповіді']
    ]
  }
}
function getQuadraticEquation () {
  let x1Abs = getRandom(2, 9);
  let x2Abs = getRandom(2, 9);
  x2Abs = x1Abs == x2Abs ? x2Abs - 1 : x2Abs;
  let [op1, op2] = getOperations(x1Abs, x2Abs);
  let [x1, x2] = getConvertedRoots(x1Abs, x2Abs, op1, op2)
  
  let bx = -(x1 + x2);
  let c = x1 * x2
  let cAbs = Math.abs(c);

  let cLeft = getRandom(1, cAbs - 1);
  let cRight = cAbs - cLeft;
  cLeft = c > 0 ? cLeft : -cLeft;
  cRight = c < 0 ? cRight : -cRight;
  let sqrtD = Math.sqrt(bx * bx + c * -4);
  
  let sqx = 'x<sup>2</sup>&nbsp;'
  let sq = '<sup>2</sup>'
  let sub = n => '<sub>' + n + '</sub>'
  return {
    type: 'quad',
    answer: [x1, x2],
    string: sqx + showX(bx) + ' ' + showNum(cLeft) + ' = ' + showNum(cRight, true),
    parts: [
      // ['x1 = ' + x1 + ' x2 = ' + x2, ''],
      // ['(x ' + op1 + ' ' + x1Abs + ')(x ' + op2 + ' ' + x2Abs + ') = 0', ''],
      [sqx + showX(bx) + ' ' + showNum(cLeft) + ' = ' + showNum(cRight, true), ''],
      [sqx + showX(bx) + ' ' + showNum(cLeft) + ' ' + showNum(-cRight) + ' = 0', 'Перенесемо відоме вліво'],
      [sqx + showX(bx) + ' ' + showNum(c) + ' = 0' , 'Виконаємо дію'],
      ['a = 1, b = ' + showNum(bx, true) + ', c = ' + showNum(c, true), 'Позначимо числа'],
      ['D = ' + 'b' + sq + '&nbsp;- 4ac', 'Згадаємо формулу дискримінанта'],
      ['D = ' + showNum(bx, true, true) + sq + '&nbsp;- 4•1•' + showNum(c, true, true), 'Підставимо числа'],
      ['D = ' + bx * bx + ' ' + showNum(c * -4) + ' = ' + (bx * bx + c * -4), 'Розв\'яжемо'],
      [sqrtOut('D') + '&nbsp;= ' + sqrtOut(bx * bx + c * -4) + ' = ' + sqrtD, 'Знайдемо корінь з дискримінанта'],
      [
        ['x' + sub(1) + '&nbsp;=&nbsp;' + fract('-b + ' + sqrtOut('D'), '2a'), 
          'x' + sub(2) + '&nbsp;=&nbsp;' + fract('-b - ' + sqrtOut('D'), '2a')
        ], ['x' + sub(1) + '&nbsp;=&nbsp;' + fract(showNum(-bx, true) + ' + ' + sqrtD, '2•1'), 
          'x' + sub(2) + '&nbsp;=&nbsp;' + fract(showNum(-bx, true) + ' - ' + sqrtD, '2•1')
        ], 'Згадаємо формулу знаходження коренів і підставимо числа'
      ],
      [
        ['x' + sub(1) + '&nbsp;=&nbsp;' + fract(-bx + sqrtD, '2'), 
          'x' + sub(2) + '&nbsp;=&nbsp;' + fract(-bx - sqrtD, '2')
        ], ['x' + sub(1) + '&nbsp;=&nbsp;' + showNum((-bx + sqrtD) / 2, true), 
          'x' + sub(2) + '&nbsp;=&nbsp;' + showNum((-bx - sqrtD) / 2, true)
        ], 'Виконаємо дії'
      ],
      [
        'x' + sub(1) + '&nbsp;=&nbsp;' + showNum((-bx + sqrtD) / 2, true) + ' ' +
        'x' + sub(2) + '&nbsp;=&nbsp;' + showNum((-bx - sqrtD) / 2, true),
        ''
      ]
    ]
  }

  function fract (str1, str2) {
    let fract = document.createElement("span");
    fract.className = "fract";
    fract.style.display = 'inline-flex';

    let numer = document.createElement("div");
    numer.className = "numer";
    numer.innerHTML = str1;

    let denom = document.createElement("div");
    denom.className = "denom";
    denom.innerHTML = str2;
    
    fract.appendChild(numer);
    fract.appendChild(denom);

    if (isNumerLonger()) {
      numer.style.borderBottom = "2px solid #000";
    } else {
      denom.style.borderTop = "2px solid #000";
    }
    return fract.outerHTML;

    function isNumerLonger() {
      let len1 = numer.innerText.length,
        len2 = denom.innerText.length;
      return len1 > len2;
    }
  }
  function sqrtOut (string) {
    return '√<span class="sqrt">' + string + '</span>';
  }
  function showNum (n, firstInRow = false, negativeBrackets = false) {
    let op = n > 0 ? '+ ' : '- ';
    op = firstInRow ? (op == '+ ' ? '' : '-') : op;
    let string = op + Math.abs(n);;
    let result = negativeBrackets && op == '-' ? '(' + string + ')' : string;
    return result;
  }
  function showX (x) {
    let op = x > 0 ? '+' : '-';
    let num = Math.abs(x) == 1 ? '' : Math.abs(x);
    return op + ' ' + num + 'x';
  }

  function getConvertedRoots (x1, x2, op1, op2) {
    let newX1 = op1 == '+' ? -x1 : x1;
    let newX2 = op2 == '+' ? -x2 : x2;
    return [newX1, newX2];
  }

  function getOperations (x1, x2) {
    return [getOp(), getOp()];

    function getOp () {
      return randomFromArray(['+', '-'])
    }
  }
}
let result = getQuadraticEquation();
// document.open();
// for (let elem of result.parts) {
//   document.writeln(elem[0] + '  ' + elem[1] + '<br>')
//   console.log();
// }
// document.close();

function shuffle(arr) {
  let result = [];
  while (arr.length != 0) {
    result.push(...arr.splice(random(arr), 1));
  }
  return result;
  function random(arr) {
    return Math.floor(Math.random() * arr.length);
  }
}