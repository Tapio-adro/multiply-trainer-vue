let types = ['linear', 'incomplete quadratic','quadratic']

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
    type: 'simple',
    answer: x,
    string: coefficient + '(x - ' + bracketsPart + ') = ' + leftNum,
    parts: [
      [coefficient + '(x - ' + bracketsPart + ') = ' + leftNum, ''],
      [coefficient + '•x - ' + coefficient + '•' + bracketsPart + ' = ' + leftNum, 'Розкриваємо дужки'],
      [coefficient + 'x - ' + bracketsNum + ' = ' + leftNum, 'Виконаємо дії'],
      [coefficient + 'x = ' + leftNum + ' + ' + bracketsNum, 'Переносимо відомі вправо'],
      [coefficient + 'x = ' + num + ' | ÷' + coefficient, 'Ділимо обидві частини на ' + coefficient],
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
    type: 'complex',
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
      [['x = 0', 'x - ' + x + ' = 0'], ''],
      [['x = 0', 'x = ' + x], ''],
      ['В.: x = 0 і x = ' + x, ''],
    ]
  }
}
let result = getIncompleteQuadraticEquation();
document.open();
for (let elem of result.parts) {
  document.writeln(elem[0] + '  ' + elem[1] + '<br>')
  console.log();
}
document.close();