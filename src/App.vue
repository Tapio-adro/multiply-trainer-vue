<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view /> -->
  <div class="main">
		<div class="wrapper">
			<div class="header">
				<span 
					id="multiplication" 
					class="actionSign"
					:class="{active: operationsData.multiplication}"
					@click="toggleOperation('multiplication')"
				>×</span> 
				& 
				<span 
					id="division" 
					class="actionSign"
					:class="{active: operationsData.division}"
					@click="toggleOperation('division')"
				>÷</span>
			</div>
			<div class="nums_holder">
				<div 
					v-for="(numberItem, index) in numbersData" :key="index"
					class="numbers"
					@click="toggleNumber(index)"
					:class="{active: numberItem.isEnabled}"
				>
					{{ numberItem.num }}
				</div>
				<div 
					class="select_all_button"
					@click="toggleAllNumbers()"
					ref="toggleNumbersButton"
				>
					<div class="squares"></div>
					<div class="squares"></div>
					<div class="squares"></div>
					<div class="squares"></div>
				</div>
			</div>
			<input type="range" class="range" min="0" max="4" step="1" value="2"
				ref="range"
				@input="updateEquationsAmount()"
			>
			<div class="range_value">{{ equationsAmount }}</div>
			<div class="equation_area">
				<div class="equation_text"></div>
				<input type="number" class="answer_text hiden">
				<div class="sign start">
					<div id="sign_start"></div>
				</div>
			</div>
			<div class="mistakes_header">
				<div class="mistake_cross"></div>
			</div>
			<div class="mistakes_area"></div>
		</div>
	</div>
	<div class="results">
		<div class="results_inner">
			<div class="results_content">

			</div>
		</div>
	</div>
	<div class="darkBg"></div>

	<div id="buttons_holder">
		<div id="ref_button" class="top_button">?</div>
		<div id="colors_container" class="top_button">
			<div class="color_container" style="background-color: #66ff66"></div>
			<div class="color_container" style="background-color: #ff6666"></div>
			<div class="color_container" style="background-color: #66ffff"></div>
			<div class="color_container" style="background-color: #ffff66"></div>
		</div>
		<div id="link_holder">
			<div class="top_button" id="linkToFraction">
				<div class="fract">
					<div class="numer">1</div>
					<div class="denom" style="border-top: 2px solid rgb(0, 0, 0)">2</div>
				</div>
			</div>
			<div id="shrink_link_wrapper" class="hiden">
				<div id="shrink_link_container"></div>
			</div>
		</div>
	</div>
	<div class="ref_wrapper hiden">
		<div class="ref_content">
			<section>
				<h2>Призначення</h2>
				<p>Програма використовується для покращення та закріплення знання таблички множення і ділення.</p>
			</section>
			<section>
				<h2>Налаштування</h2>
			</section>
		</div>
	</div>
</template>

<script>

export default {
  name: "App",
	data() {
		return {
			numbersData: [],
			operationsData: {},
			time: {
				timeStart: null,
				trainingDuration: 0
			},
			equationsAmount: 0
		}
	},
	methods: {
		start() {
			checkActiveActions();
			checkActiveNumbers();

			updateRangeValue();

			// toggleButtons();
			// toggleEquationArea();
			// toggleAnswerTextVisibility();

			// changeSignTo('submit');

			// timeStart = new Date();

			// equations = createEquationsList();
			// maxPoints = equations.length;
			// eqAmount = equations.length;

			// answerText.focus();

			// window.scrollTo({
			// 		results: 80,
			// 		behavior: "smooth"
			// });
		},
		toggleOperation(op) {
			this.operationsData[op] = !this.operationsData[op];
			if (!Object.values(this.operationsData).some(value => value)) {
				if (op == 'multiplication') {
					this.operationsData['division'] = true;
				} else {
					this.operationsData['multiplication'] = true;
				}
			}
			this.updateEquationsAmount();
		},
		toggleNumber(index) {
			this.numbersData[index].isEnabled = !this.numbersData[index].isEnabled;
			this.updateEquationsAmount();
		},
		toggleAllNumbers() {
			let button = this.$refs.toggleNumbersButton;
			console.log(button);
			let that = this;

			button.classList.toggle('active');
			
			let nums = [2, 3, 4, 5, 6, 7, 8, 9];
			let curInterval = setInterval(function() {
				let num = nums.shift();
				let numItem = that.numbersData[num - 2];
				if (button.classList.contains('active')) {
					numItem.isEnabled = true;
				} else {
					numItem.isEnabled = false;
				}
				that.updateEquationsAmount();
				if (nums.length == 0) {
					clearInterval(curInterval);
				}
			}, 50);
		},
		updateEquationsAmount() {
			let rangeValues = [0.25, 0.5, 1, 2, 4];

			let enabledNumbersAmount = this.numbersData.filter(num => num.isEnabled).length;

			let enabledOperationsAmount = 0;
			enabledOperationsAmount += this.operationsData.division ? 1 : 0;
			enabledOperationsAmount += this.operationsData.multiplication ? 1 : 0;

			let defaultAmount = enabledNumbersAmount * enabledOperationsAmount * 8;
			this.equationsAmount = rangeValues[this.$refs.range.value] * defaultAmount;
		}
	},
	mounted() {
		// set nums data
		let defaultNums = [2, 3, 4, 5, 6, 7, 8, 9];
		for (let key in defaultNums) {
			let num = defaultNums[key];
			this.numbersData[key] = {num, isEnabled: false}
			if (num == 2) {
				this.numbersData[key].isEnabled = true;
			}
		}
		// set operations data
		this.operationsData = {
			multiplication: true,
			division: false
		}
	},
};

let indexes = [];

let actions = [];

let defaultNums = [2, 3, 4, 5, 6, 7, 8, 9];
// defaultNums = [2];

let equations = [];

let maxPoints = 0;
let eqAmount = 0;
let curPoints = 0;

let timeAfterFinish = 3000;

let equation;

let multAction;
let divisAction;
let lastActiveAction;

let main;
let numHolders;
let actionHolders;
let equationText;
let answerText;
let equationArea;
let mistakesArea;
let mistakesHeader;
let sign;
let selectAllButton;
let range;
let rangeValue;
let resultsElem;
let resultsContent
let darkBg;



let results_p1, results_p2, results_holder, results_eqAmount;
let rangeLine, acceptButton;

let trainingInProgress = false;


let firstEquation = true;


setTimeout(() => {
	
indexes = [];

actions = [];

defaultNums = [2, 3, 4, 5, 6, 7, 8, 9];

equations = [];

maxPoints = 0;
eqAmount = 0;
curPoints = 0;

timeAfterFinish = 3000;

equation;

multAction = document.querySelector('#multiplication');
divisAction = document.querySelector('#division');
lastActiveAction;

main = document.querySelector('.main');
numHolders = document.querySelectorAll('.numbers');
actionHolders = document.querySelectorAll('.actionSign');
equationText = document.querySelector('.equation_text');
answerText = document.querySelector('.answer_text');
equationArea = document.querySelector('.equation_area');
mistakesArea = document.querySelector('.mistakes_area');
mistakesHeader = document.querySelector('.mistakes_header');
sign = document.querySelector('.sign');
selectAllButton = document.querySelector('.select_all_button');
range = document.querySelector('.range');
rangeValue = document.querySelector('.range_value');
resultsElem = document.querySelector('.results');
resultsContent = document.querySelector('.results_content')
darkBg = document.querySelector('.darkBg')

results_p1, results_p2, results_holder, results_eqAmount;
rangeLine, acceptButton;

trainingInProgress = false;

firstEquation = true;

sign.addEventListener('click', function(e) {
	checkInputs();
});

document.addEventListener('keydown', function(e) {
	if (e.key == 'Enter') {
		checkInputs();
	}
});

answerText.addEventListener('keyup', function(e) {
	if (answerText.value.length > 2) {
		answerText.value = answerText.value.substr(0, 2);
	}
});
}, 1000)




function checkInputs() {
	if (!trainingInProgress){
		trainingInProgress = true;
		start();
		doEquation();
	} else if (sign.classList.contains('submit')) {
		checkAnswer();
	} else if (resultsElem.classList.contains("full")) {
		closeResults();
	} else if (sign.classList.contains('reload')) {
		resetData();	
	}
}

function resetData() {
	changeSignTo('start');
	equationText.innerHTML = '';
	firstEquation = true;
	mistakesHeader.innerHTML = '<div class="mistake_cross"></div>';	
	mistakesArea.innerHTML = '';
	curPoints = 0;
	indexes = [];
	actions = [];
	toggleButtons();
	trainingInProgress = false;
	mistakesHeader.classList.remove('no_mistakes');
}

function doEquation() {
	answerText.value = '';
	equation = equations.pop();
	let equationString = getEquationString(equation);
	if (firstEquation) {
		firstEquation = false;
		showFirstEquation(equationString)
		return;
	}
	changeEquationText(equationString);
} 

function checkAnswer() {
	let answerString = answerText.value;
	if (!answerString) {
		return;
	} else if (answerString == equation.answer) {
		if (equation.type == 'normal') {
			eqAmount--;
			curPoints++;
			deactivateMistakesHeader();
		} else {
			makeMistakeDiv('solved');
		}
	} else {
		equationArea.classList.toggle('equation_area-mistake');
		setTimeout(function() {
			equationArea.classList.toggle('equation_area-mistake');
		}, 250);
		if (equation.type == 'normal') {
			eqAmount--;
			addMistakeDiv();
			addAdditionalEquationToList();
			equationArea.scrollIntoView({behavior: 'smooth'});
		} else {
			makeMistakeDiv('failed');
		}
	}

	rangeValue.innerHTML = eqAmount;

	answerText.focus();

	if (equations.length > 0) {
		doEquation();
	} else {
		hideElementsAndShowResult();
	}
	
}

function hideElementsAndShowResult() {
	toggleEquationArea();

	openResults();

	trainingDuration = Math.round(
		(new Date().getTime() - timeStart.getTime()) / 1000);

	equationText.innerHTML = '';

	deactivateMistakesHeader();

	let main = document.querySelector('.main');

	equationText.innerHTML = curPoints + ' / ' + maxPoints;

	checkNoMistakes();

	window.scrollTo({
	    results: 0,
	    behavior: "smooth"
	});

	changeSignTo('hiden');
	toggleAnswerTextVisibility('none');
	setTimeout(function() {
		changeSignTo('reload');
	}, timeAfterFinish);
}

// functions



function openResults () {

	resultsContent.classList.add("hiden");
	setTimeout(() => {
		resultsElem.classList.add("full");
		darkBg.classList.add('active');

		setTimeout(() => {
			resultsContent.classList.remove("hiden");
			let result = createResult();
			result.forEach(elem => resultsContent.appendChild(elem));
			activateAcceptButton();
			setTimeout(() => {
				rangeLine.style.width = (curPoints / maxPoints * 100) + '%';
			}, 500)
		}, 500)
	}, 500)

	function createResult () {
		let elemArr = [];
		elemArr.push(createSection1());
		elemArr.push(createSection2());
		elemArr.push(createAcceptSign());
		return elemArr;
	}

	function createSection1 () {
		let sect = document.createElement('section');

		let header = document.createElement('h2');
		header.innerHTML = 'Результат';

		let mark = document.createElement('h3');
		mark.innerHTML = 'Оцінка: ' + Math.round(curPoints / maxPoints * 12);

		let rangeResult = document.createElement('div');
		rangeResult.classList.add('range_result');

		let range_line = document.createElement('div');
		range_line.classList.add('range_line');
		rangeLine = range_line;
		rangeResult.appendChild(range_line);

		let percent = document.createElement('h3');
		percent.classList.add('percent');
		percent.innerHTML = Math.round(curPoints / maxPoints * 10000) / 100  + '%';

		sect.appendChild(header);
		sect.appendChild(mark);
		sect.appendChild(rangeResult);
		sect.appendChild(percent);

		return sect;
	}

	function createSection2 () {
		let sect = document.createElement('section');

		let header = document.createElement('h2');
		header.innerHTML = 'Статистика';

		let table = createTable();

		sect.appendChild(header);
		sect.appendChild(table);

		return sect;
	}

	function createTable () {
		let table = document.createElement('table');
		table.classList.add('stats');

		let tableData = [
			[
				'Всього прикладів:',
				maxPoints
			],
			[
				'Правильних відповідей:',
				curPoints
			],
			[
				'Час виконання:',
				getDuration()
			],
			[
				'Середній час виконання одного виразу:',
				getDuration('average'),
				lastTd = true
			]
		];

		for (let data of tableData) {
			table.appendChild(createTableRow(...data));
		}

		return table;
	}

	function createTableRow (td1, td2, lastTd = false) {
		let row = document.createElement('tr')
		
		let td1Elem = document.createElement('td');
		td1Elem.innerHTML = td1;

		let td2Elem = document.createElement('td');
		td2Elem.innerHTML = td2;

		if(lastTd) {
			td1Elem.classList.add('lastTd');
			td2Elem.classList.add('lastTd');
		}

		row.appendChild(td1Elem);
		row.appendChild(td2Elem);

		return row;
	}

	function createAcceptSign () {
		let button = document.createElement('div');
		button.innerHTML = '✓';
		button.classList.add('acceptButton');
		acceptButton = button;

		let buttonHolder = document.createElement('div');
		buttonHolder.classList.add('buttonHolder');

		buttonHolder.appendChild(button);

		return buttonHolder;
	}

	function activateAcceptButton () {
		acceptButton.addEventListener('click', function () {
			closeResults();
		});
	}
}

function closeResults () {
	darkBg.classList.toggle('active');
	resultsElem.classList.add('hiden');
	setTimeout(() => {
		resultsContent.innerHTML = '';
		resultsElem.classList.remove('hiden');
		resultsElem.classList.remove('full');
	}, 1000)
}

function getDuration (option) {
	let sec = trainingDuration;

	sec = option == 'average' ? 
		Math.round((sec / maxPoints) * 100) / 100 : sec;

	let mins = Math.floor(sec / 60);
	let secs = sec - mins * 60;

	mins = mins ? mins + 'хв ' : '';
	secs = secs != 0 ? secs + 'с' : '';

	return mins + secs;
}


function deactivateMistakesHeader() {
	let mistakeDivs = document.querySelectorAll('.mistakes_area div:not(.failed, .solved)');
	if (mistakeDivs.length == 0) {
		mistakesHeader.classList.remove('active');
	}
}

function addMistakeDiv() {
	let mistakeDiv = document.createElement('div');
	mistakeDiv.innerHTML = getEquationString(equation, 'full');
	mistakesArea.appendChild(mistakeDiv);
	let mistakeDivs = document.querySelectorAll('.mistakes_area div');
	if (mistakeDivs.length == 1) {
		mistakesHeader.classList.add('active');
	} else {
		mistakesHeader.classList.add('active');
		mistakesHeader.innerHTML += '<div class="mistake_cross"></div>';
	}
	if (mistakeDivs.length > 6) {
		mistakesArea.removeChild(mistakeDivs[0]);
	}
}

function addAdditionalEquationToList() {
	let newEquation = equation;
	newEquation.type = 'additional';
	equations.splice(equations.length - 1, 0, newEquation);
}

function makeMistakeDiv(type) {
	let mistakeDivs = document.querySelectorAll('.mistakes_area div');
	for (let elem of mistakeDivs) {
		if (elem.innerHTML == getEquationString(equation, 'full') 
			&& !elem.classList.contains('failed')
			&& !elem.classList.contains('solved')) {
			elem.classList.add(type);
			return;
		}
	}
}

function checkNoMistakes() {
	if (curPoints == maxPoints) {
		mistakesHeader.classList.toggle('no_mistakes');
	}
}

function toggleAnswerTextVisibility(mode) {
	answerText.classList.toggle('hiden');
	if (mode == 'none') {
		setTimeout(() => {
			answerText.classList.toggle('none');
			setTimeout(() => {
				answerText.classList.toggle('none');
			}, 500)
		}, 500)
	}
}

function getEquationString(equation, mode='default') {
	modes = {
		default: function(equation) {
			return equation.num1 + ' ' + equation.sign + ' ' + equation.num2 + ' = ';
		},
		full: function(equation) {
			return equation.num1 + ' ' + equation.sign + ' ' + equation.num2 + ' = ' + equation.answer;
		}
	}
	return modes[mode](equation);
}

function changeEquationText(str) {
	equationText.classList.add('hiden');
	setTimeout(function() {
		equationText.innerHTML = str;
		equationText.classList.remove('hiden');
	}, 250);
}

function toggleButtons() {
	numHolders.forEach(function(elem) {
		elem.classList.toggle('unactive');
	});

	actionHolders.forEach(function(elem) {
		elem.classList.toggle('unactive');
	});

	selectAllButton.classList.toggle('unactive');

	range.classList.toggle('unactive');
}

function changeSignTo(type) {
	switch (type) {
		case 'start':
			sign.setAttribute('class', 'sign');
			sign.classList.add(type);
			sign.innerHTML = '<div id="sign_start"></div>';
			break;
		case 'submit':
			sign.setAttribute('class', 'sign');
			sign.classList.add(type);
			sign.innerHTML = '⇨';
			break;
		case 'hiden':
			sign.setAttribute('class', 'sign');
			sign.classList.add(type);
			sign.innerHTML = '';
			break;
		case 'reload':
			sign.setAttribute('class', 'sign');
			sign.classList.add('reload');
			sign.innerHTML = '↻';
			break;
	}
}

function toggleEquationArea() {
	equationArea.classList.toggle('equation_area-active');
}

function checkActiveActions() {
	actions = [];
	let activeActions = document.querySelectorAll('.actionSign.active');
	for (let elem of activeActions) {
		actions.push(elem.innerHTML);
	}
}

function createEquationsList() {

	let result = generateBaseArray();

	let coefficient = rangeValues[range.value];

	checkBiggerCoefficient();

	result = shuffle(result);

	checkSmallerCoefficient();

	return result;



	function generateBaseArray() {
		let result = [];
		for (let index of indexes) {
			for (let num of defaultNums) {
				if (actions.indexOf('×') != -1) {
					result.push({
						num1: num, 
						num2: index, 
						answer: num * index, 
						type: 'normal',
						sign: '×'});
				}
				if (actions.indexOf('÷') != -1) {
					result.push({
						num1: num * index, 
						num2: index, 
						answer: num, 
						type: 'normal',
						sign: '÷'});
				}	
			}
		}
		return result;
	}

	function checkBiggerCoefficient() {
		if (coefficient > 1) {
			for (let i = coefficient; i > 1; i /= 2) {
				let newArr = [];
				for (let i = 0; i < result.length; i++) {
					newArr.push(Object.assign({}, result[i]));
				}
				result.push(...newArr);
			}
		}
	}

	function checkSmallerCoefficient() {
		if (coefficient < 1) {
			result = result.slice(0, result.length * coefficient)
		}
	}

	function shuffle(arr) {
		let result = [];
		while (arr.length != 0) {
			result.push(...arr.splice(random(arr), 1));
		}
		return result;
	}

	function random(arr) {
		return Math.floor(Math.random() * arr.length);
	}
}

function showFirstEquation(equationString) {
	let chars = equationString.split('');
	let funcInterval = setInterval(function() {
		equationText.innerHTML += chars.shift();
		if (chars.length == 0) {
			clearInterval(funcInterval);
		}
	}, 10);
}

let colorButton;
let colorsHolder;
let colorButtons;
let shrinkLink;
let linkToFractionButton;
let linkToMainButton;
let refButton;
let refWrapper;

let canChangeColor = false;

setTimeout(() => {
	colorButton = document.querySelector('#color_button');
	colorsHolder = document.querySelector('#colors_container');
	colorButtons = document.querySelectorAll('.color_container');
	shrinkLink = document.querySelector('#shrink_link_wrapper');
	linkToFractionButton = document.querySelector('#linkToFraction');
	linkToMainButton = document.querySelector('#linkToMain');
	refButton = document.querySelector('#ref_button');
	refWrapper = document.querySelector('.ref_wrapper');
	activateColorButtons();
	if (linkToFractionButton) {
		linkToFractionButton.addEventListener('click', ev => {
			if (linkToFractionButton.classList.contains('active')) {
				window.location.href = "./fraction/index.html";
			} else {
				linkToFractionButton.classList.add('active');
				linkToFractionButton.innerHTML = 'Тренажер дробів';
				shrinkLink.classList.remove('hiden');
			}
		})
		shrinkLink.addEventListener('click', ev => {
			if (!shrinkLink.classList.contains('hiden')) {
				shrinkLink.classList.add('hiden');
				linkToFractionButton.innerHTML = '<div class="fract"> <div class="numer">1</div> <div class="denom" style="border-top: 2px solid rgb(0, 0, 0)">2</div> </div>';
				linkToFractionButton.classList.remove('active');
			}
		})
	} else {
		linkToMainButton.addEventListener('click', ev => {
			if (linkToMainButton.classList.contains('active')) {
				window.location.href = "../index.html";
			} else {
				linkToMainButton.classList.add('active');
				linkToMainButton.innerHTML = 'Тренажер множення';
				shrinkLink.classList.remove('hiden');
			}
		})
		shrinkLink.addEventListener('click', ev => {
			if (!shrinkLink.classList.contains('hiden')) {
				shrinkLink.classList.add('hiden');
				linkToMainButton.innerHTML = '2 × 2';
				linkToMainButton.classList.remove('active');
			}
		})
	}
	refButton.addEventListener('click', ev => {
		refButton.classList.toggle('active');
		refWrapper.classList.toggle('hiden');
	})
	
	
	
	document.addEventListener('keydown', function(e) {
	if (refButton.classList.contains('active') && e.key == 'Escape') {
		refButton.classList.toggle('active');
		refWrapper.classList.toggle('hiden');	
		}
	});
	
	colorsHolder.addEventListener('click', ev => {
		if (!canChangeColor) {
			console.log('2');
			colorsHolder.classList.toggle('active');
			setTimeout(() => {
				canChangeColor = true;
			}, 500)
		}
	})
}, 1000)






function activateColorButtons () {
	for (let button of colorButtons) {
		button.addEventListener('click', ev => {
			console.log('1');
			if (canChangeColor) {
				let color = button.style.backgroundColor;
				document.documentElement.style.setProperty('--green', color);
				colorsHolder.classList.toggle('active');
				setTimeout(() => {
					canChangeColor = false;
				}, 0)
			}
		})
	}
}
</script>
