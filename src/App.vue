<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view /> -->
  <div class="main">
		<div class="wrapper">
			<div id="input_elems" ref="inputElems">
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
				<input type="range" class="range" min="0" max="4" step="1" value="0"
					ref="range"
					@input="refreshEquationsAmount()"
				>
				<div class="range_value">{{ equationsAmount }}</div>
			</div>
			<div class="equation_area" ref="equationArea">
				<div class="equation_text" ref="equationText">{{ equationText }}</div>
				<input type="number" class="answer_text hiden" ref="answerInput" v-model="answer">
				<div class="sign start" @click="processEnterInput" ref="sign">
					<div id="sign_start"></div>
				</div>
			</div>
			<div class="mistakes_header" ref="mistakesHeader">
				<div class="mistake_cross"></div>
			</div>
			<div class="mistakes_area">
				<div 
					v-for="(mistake, index) in mistakes" :key="index"
					:class="{solved: mistake.state == 'solved', failed: mistake.state == 'failed'}"
				>
				  {{ mistake.text }}
				</div>
			</div>
		</div>
	</div>
	<div class="results" ref="resultsElem">
		<div class="results_inner">
			<div class="results_content" ref="resultsContent">
				<section>
					<h2>Результат</h2>
					<h3>Оцінка: {{ result.mark }}</h3>
					<div class="range_result">
						<div class="range_line" ref="markPercentLine"></div>
					</div>
					<h3 class="percent">{{ result.percent }}</h3>
				</section>
				<section>
					<h2>Статистика</h2>
					<table class="stats">
						<tr>
							<td>Всього прикладів:</td>
							<td>{{ maxPoints }}</td>
						</tr>
						<tr>
							<td>Правильних відповідей:</td>
							<td>{{ curPoints }}</td>
						</tr>
						<tr>
							<td>Час виконання:</td>
							<td>{{ result.duration }}</td>
						</tr>
						<tr>
							<td class="lastTd">Середній час виконання одного виразу:</td>
							<td class="lastTd">{{ result.durationAverage }}</td>
						</tr>
					</table>
				</section>
				<div class="buttonHolder">
					<div class="acceptButton" @click="processEnterInput">✓</div>
				</div>
			</div>
		</div>
	</div>
	<div class="darkBg" ref="darkBg"></div>

	<!-- <div id="buttons_holder">
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
	</div> -->
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
			rangeData: {},
			inputValues: [],
			time: {
				timeStart: null,
				trainingDuration: 0
			},
			equationsAmount: 0,
			trainingInProgress: false,
			equations: [],
			curEquation: {},
			equationText: '',
			answer: '',
			maxPoints: 0,
			curPoints: 0,
			mistakes: [],
			result: {}
		}
	},
	methods: {
		start() {
			// make all input buttons uninteractable
			this.$refs.inputElems.classList.add('inactive');
			// make equation area border green 
			this.$refs.equationArea.classList.toggle('equation_area-active');
			// show input to write there answer
			this.toggleAnswerInput();
			// change green sign with white triangle to smaller with
			// white arrow, which allows to check answer for equation
			this.changeSignTo('submit');
			// save time, when training started
			this.time.timeStart = new Date();
			// form array of input value to be deconstructed for creating array of equations 
			this.prepareInputValues();
			this.equations = createEquationsList(...this.inputValues);

			this.maxPoints = this.equations.length;

			this.$refs.answerInput.focus();
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
			this.refreshEquationsAmount();
			isTSThisType
		},
		toggleNumber(index) {
			this.numbersData[index].isEnabled = !this.numbersData[index].isEnabled;
			this.refreshEquationsAmount();
		},
		toggleAllNumbers() {
			let button = this.$refs.toggleNumbersButton;
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
				that.refreshEquationsAmount();
				if (nums.length == 0) {
					clearInterval(curInterval);
				}
			}, 50);
		},
		refreshEquationsAmount() {
			let rangeValues = [0.25, 0.5, 1, 2, 4];
			this.rangeData.coefficient = rangeValues[this.$refs.range.value];

			let enabledNumbersAmount = this.numbersData.filter(num => num.isEnabled).length;

			let enabledOperationsAmount = 0;
			enabledOperationsAmount += this.operationsData.division ? 1 : 0;
			enabledOperationsAmount += this.operationsData.multiplication ? 1 : 0;

			let defaultAmount = enabledNumbersAmount * enabledOperationsAmount * 8;
			this.equationsAmount = rangeValues[this.$refs.range.value] * defaultAmount;
		},
		processEnterInput() {
			let sign = this.$refs.sign;
			if (!this.trainingInProgress){
				this.trainingInProgress = true;
				this.start();
				this.showNextEquation();
			} else if (sign.classList.contains('submit')) {
				this.checkAnswer();
			} else if (this.$refs.resultsElem.classList.contains("full")) {
				this.hideResults();
			} else if (sign.classList.contains('reload')) {
				this.resetData();	
			}
		},
		toggleAnswerInput(mode) {
			let answerInput = this.$refs.answerInput;
			answerInput.classList.toggle('hiden');
			if (mode == 'none') {
				setTimeout(() => {
					answerInput.classList.toggle('none');
					setTimeout(() => {
						answerInput.classList.toggle('none');
					}, 500)
				}, 500)
			}
		},
		changeSignTo(type) {
			let sign = this.$refs.sign;
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
		},
		prepareInputValues() {
			let numbers = [];
			for (let numItem of this.numbersData) {
				if (numItem.isEnabled) {
					numbers.push(numItem.num);
				}
			}
			if (numbers.length == 0) {
				numbers = [2];
				this.numbersData[0].isEnabled = true;
				this.refreshEquationsAmount();
			}
			let operations = [];
			if (this.operationsData.multiplication) {
				operations.push('×');
			}
			if (this.operationsData.division) {
				operations.push('÷');
			}
			let coefficient = this.rangeData.coefficient;
			this.inputValues = [numbers, operations, coefficient];
		},
		showNextEquation() {
			this.answer = '';
			this.curEquation = this.equations.pop();
			let equationString = getEquationString(this.curEquation);
			if (this.curEquation.isFirst) {
				this.showFirstEquation(equationString)
				return;
			}
			this.changeEquationText(equationString);
		},
		showFirstEquation(equationString) {
			let chars = equationString.split('');
			let that = this;
			let interval = setInterval(function() {
				that.equationText += chars.shift();
				if (chars.length == 0) {
					clearInterval(interval);
				}
			}, 10);
		},
		changeEquationText(str) {
			this.$refs.equationText.classList.add('hiden');
			let that = this;
			setTimeout(function() {
				that.equationText = str;
				that.$refs.equationText.classList.remove('hiden');
			}, 250);
		},
		checkAnswer() {
			let answer = this.answer;
			let equation = this.curEquation;
			let equationArea = this.$refs.equationArea;

			if (!answer) {
				return;
			} else if (answer == equation.answer) {
				if (equation.type == 'normal') {
					this.equationsAmount--;
					this.curPoints++;
					this.deactivateMistakesHeader();
				} else {
					this.changeMistakeStateTo('solved');
				}
			} else {
				equationArea.classList.toggle('equation_area-mistake');
				setTimeout(function() {
					equationArea.classList.toggle('equation_area-mistake');
				}, 250);
				if (equation.type == 'normal') {
					this.equationsAmount--;
					this.addMistakeContainer();
					this.addAdditionalEquationToList();
					equationArea.scrollIntoView({behavior: 'smooth'});
				} else {
					this.changeMistakeStateTo('failed');
				}
			}
			
			this.$refs.answerInput.focus();

			if (this.equations.length > 0) {
				this.showNextEquation();
			} else {
				this.hideElementsAndShowResult();
			}
			
		},
		addMistakeContainer() {
			let mistake = {
				text: getEquationString(this.curEquation, 'full'),
				state: 'neutral'
			}
			this.mistakes.push(mistake);
			let mistakesAmount = this.mistakes.length;
			if (mistakesAmount == 1) {
				this.$refs.mistakesHeader.classList.add('active');
			} else {
				this.$refs.mistakesHeader.classList.add('active');
				this.$refs.mistakesHeader.innerHTML += '<div class="mistake_cross"></div>';
			}
			if (mistakesAmount > 6) {
				this.mistakes.shift();
			}
		},
		changeMistakeStateTo(type) {
			for (let mistake of this.mistakes) {
				if (mistake.text == getEquationString(this.curEquation, 'full') 
					&& mistake.state == 'neutral') {
					mistake.state = type;
					return;
				}
			}
		},
		deactivateMistakesHeader() {
			let uncorrectedMistakes = this.mistakes.filter((mistake) => {
				return mistake.state == 'neutral';
			});
			if (uncorrectedMistakes.length == 0) {
				this.$refs.mistakesHeader.classList.remove('active');
			}
		},
		checkNoMistakes() {
			if (this.curPoints == this.maxPoints) {
				this.$refs.mistakesHeader.classList.toggle('no_mistakes');
			}
		},
		addAdditionalEquationToList() {
			let newEquation = this.curEquation;
			newEquation.type = 'additional';
			newEquation.isFirst = false;
			this.equations.splice(this.equations.length - 1, 0, newEquation);
		},
		hideElementsAndShowResult() {
			this.$refs.equationArea.classList.toggle('equation_area-active');
			equationText.innerHTML = this.curPoints + ' / ' + this.maxPoints;

			this.time.trainingDuration = Math.round((new Date().getTime() - this.time.timeStart.getTime()) / 1000);
			this.deactivateMistakesHeader();
			this.checkNoMistakes();

			this.showResults();

			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});

			this.changeSignTo('hiden');
			this.toggleAnswerInput('none');
			let that = this;
			setTimeout(function() {
				that.changeSignTo('reload');
			}, 3000);
		},
		showResults() {
			this.result = {
				mark: Math.round(this.curPoints / this.maxPoints * 12),
				percent: Math.round(this.curPoints / this.maxPoints * 10000) / 100  + '%',
				duration: getDuration(this.time.trainingDuration),
				durationAverage: getDuration(this.time.trainingDuration, 'average', this.maxPoints)
			}

			let resultsContent = this.$refs.resultsContent;
			let resultsElem = this.$refs.resultsElem;
			resultsContent.classList.add("hiden");
			setTimeout(() => {
				resultsElem.classList.add("full");
				this.$refs.darkBg.classList.add('active');

				setTimeout(() => {
					resultsContent.classList.remove("hiden");
					setTimeout(() => {
						this.$refs.markPercentLine.style.width = (this.curPoints / this.maxPoints * 100) + '%';
					}, 500)
				}, 500)
			}, 500)
		},
		hideResults() {
			let resultsElem = this.$refs.resultsElem;
			this.$refs.darkBg.classList.toggle('active');
			resultsElem.classList.add('hiden');
			setTimeout(() => {
				resultsElem.classList.remove('hiden');
				resultsElem.classList.remove('full');
			}, 1000)
		},
		resetData() {
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
		},
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
		let that = this;
		document.addEventListener('keydown', function(e) {
			if (e.key == 'Enter') {
				that.processEnterInput();
			}
		});
		this.refreshEquationsAmount();
	},
};

let main;
let numHolders;
let actionHolders;
let equationText;
let answerInput;
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
	

main = document.querySelector('.main');
numHolders = document.querySelectorAll('.numbers');
actionHolders = document.querySelectorAll('.actionSign');
equationText = document.querySelector('.equation_text');
answerInput = document.querySelector('.answer_text');
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

answerInput.addEventListener('keyup', function(e) {
	if (answerInput.value.length > 2) {
		answerInput.value = answerInput.value.substr(0, 2);
	}
});
}, 1000)







// functions













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
	// if (linkToFractionButton) {
	// 	linkToFractionButton.addEventListener('click', ev => {
	// 		if (linkToFractionButton.classList.contains('active')) {
	// 			window.location.href = "./fraction/index.html";
	// 		} else {
	// 			linkToFractionButton.classList.add('active');
	// 			linkToFractionButton.innerHTML = 'Тренажер дробів';
	// 			shrinkLink.classList.remove('hiden');
	// 		}
	// 	})
	// 	shrinkLink.addEventListener('click', ev => {
	// 		if (!shrinkLink.classList.contains('hiden')) {
	// 			shrinkLink.classList.add('hiden');
	// 			linkToFractionButton.innerHTML = '<div class="fract"> <div class="numer">1</div> <div class="denom" style="border-top: 2px solid rgb(0, 0, 0)">2</div> </div>';
	// 			linkToFractionButton.classList.remove('active');
	// 		}
	// 	})
	// } else {
	// 	linkToMainButton.addEventListener('click', ev => {
	// 		if (linkToMainButton.classList.contains('active')) {
	// 			window.location.href = "../index.html";
	// 		} else {
	// 			linkToMainButton.classList.add('active');
	// 			linkToMainButton.innerHTML = 'Тренажер множення';
	// 			shrinkLink.classList.remove('hiden');
	// 		}
	// 	})
	// 	shrinkLink.addEventListener('click', ev => {
	// 		if (!shrinkLink.classList.contains('hiden')) {
	// 			shrinkLink.classList.add('hiden');
	// 			linkToMainButton.innerHTML = '2 × 2';
	// 			linkToMainButton.classList.remove('active');
	// 		}
	// 	})
	// }
	// refButton.addEventListener('click', ev => {
	// 	refButton.classList.toggle('active');
	// 	refWrapper.classList.toggle('hiden');
	// })
	
	
	
	// document.addEventListener('keydown', function(e) {
	// if (refButton.classList.contains('active') && e.key == 'Escape') {
	// 	refButton.classList.toggle('active');
	// 	refWrapper.classList.toggle('hiden');	
	// 	}
	// });
	
	// colorsHolder.addEventListener('click', ev => {
	// 	if (!canChangeColor) {
	// 		colorsHolder.classList.toggle('active');
	// 		setTimeout(() => {
	// 			canChangeColor = true;
	// 		}, 500)
	// 	}
	// })
}, 1000)

function activateColorButtons () {
	for (let button of colorButtons) {
		button.addEventListener('click', ev => {
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

// external functions

function createEquationsList(indexes, actions, coefficient) {
	let defaultNums = [2, 3, 4, 5, 6, 7, 8, 9];

	let result = generateBaseArray();

	checkBiggerCoefficient();

	result = shuffle(result);

	checkSmallerCoefficient();

	result[result.length - 1].isFirst = true;

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
						sign: '×',
						isFirst: false});
				}
				if (actions.indexOf('÷') != -1) {
					result.push({
						num1: num * index, 
						num2: index, 
						answer: num, 
						type: 'normal',
						sign: '÷',
						isFirst: false});
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
function getEquationString(equation, mode='default') {
	let modes = {
		default: function(equation) {
			return equation.num1 + ' ' + equation.sign + ' ' + equation.num2 + ' = ';
		},
		full: function(equation) {
			return equation.num1 + ' ' + equation.sign + ' ' + equation.num2 + ' = ' + equation.answer;
		}
	}
	return modes[mode](equation);
}
function getDuration (duration, mode = 'default', maxPoints = 0) {
	let sec = duration;

	sec = mode == 'average' ? 
		Math.round((sec / maxPoints) * 100) / 100 : sec;

	let mins = Math.floor(sec / 60);
	let secs = sec - mins * 60;

	mins = mins ? mins + 'хв ' : '';
	secs = secs != 0 ? secs + 'с' : '';

	return mins + secs;
}

</script>

