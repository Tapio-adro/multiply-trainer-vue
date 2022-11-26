<template>
  <div class="main">
		<div class="wrapper">
			<Inputs 
				:inputs-options="getInputsOptions()"
				:pass-inputs="passInputs"
				@passInputsData="getInputsData"
				v-model:equationsAmount="inputsEquationsAmount"
			/>
			<div class="equations_amount">{{ equationsAmount }}</div>
			<EquationArea
				ref="equationArea"
				v-model:answer="answer"
				v-model:equationText="equationText"
				:trainingInProgress="trainingInProgress"
				:signLook="signLook"
				@signClicked="processEnterInput"
			/>
			<div v-auto-animate id="mistakes">
				<div class="mistakes_header" ref="mistakesHeader">
					<div class="mistake_cross"></div>
				</div>
				<div v-auto-animate class="mistakes_area">
					<div 
						v-for="(mistake, index) in mistakes" :key="index"
						:class="{solved: mistake.state == 'solved', failed: mistake.state == 'failed'}"
					>
						{{ mistake.text }}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="results" ref="resultsElem">
		<div id="results_inner">
			<div id="results_content" ref="resultsContent">
				<section>
					<h2>Результат</h2>
					<h3>Оцінка: {{ results.mark }}</h3>
					<div class="progress_bar">
						<div class="progress_line" ref="progressLine"></div>
					</div>
					<h3 class="progress_percent">{{ results.percent }}</h3>
				</section>
				<section>
					<h2>Статистика</h2>
					<table>
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
							<td>{{ results.duration }}</td>
						</tr>
						<tr>
							<td class="lastTd">Середній час виконання одного виразу:</td>
							<td class="lastTd">{{ results.durationAverage }}</td>
						</tr>
					</table>
				</section>
				<div class="buttonHolder">
					<div class="acceptButton" @click="processEnterInput">✓</div>
				</div>
			</div>
		</div>
	</div>
	<div id="darkBg" ref="darkBg"></div>

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
</template>

<script>
import Inputs from '../components/Inputs.vue'
import EquationArea from '../components/EquationArea.vue'

export default {
  name: "App",
	components: {
		Inputs,
		EquationArea
	},
	data() {
		return {
			inputValues: [],
			time: {
				timeStart: null,
				trainingDuration: 0
			},
			inputsEquationsAmount: 0,
			equationsAmount: 0,
			trainingInProgress: false,
			equations: [],
			curEquation: {},
			equationText: '',
			answer: 0,
			maxPoints: 0,
			curPoints: 0,
			mistakes: [],
			results: {},
			canRecieveEnterInput: true,
			passInputs: false,
			signLook: ''
		}
	},
	watch: {
		inputsEquationsAmount() {
			this.equationsAmount = this.inputsEquationsAmount;
		}
	},
	mounted() {
		let that = this;
		document.addEventListener('keydown', function(e) {
			if (e.key == 'Enter') {
				that.processEnterInput();
			}
		});
	},
	methods: {
		start() {
			// form array of input value to be deconstructed for creating array of equations 
			this.passInputs = true;
			// change green sign with white triangle to smaller with
			// white arrow, which allows to check answer for equation
			this.signLook = 'submit';
			// save time, when training started
			this.time.timeStart = new Date();
			setTimeout(() => {
				this.equations = createEquationsList(...this.inputValues);
				this.equationsAmount = this.equations.length;
		
				this.maxPoints = this.equations.length;
	
				this.showNextEquation();
			}, 0)
		},
		processEnterInput() {
			if (!this.canRecieveEnterInput) return;

			let sign = this.$refs.equationArea.$refs.sign;
			if (sign.classList.contains('start')){
				this.trainingInProgress = true;
				this.start();
			} else if (sign.classList.contains('submit')) {
				this.checkAnswer();
			} else if (this.$refs.resultsElem.classList.contains("full")) {
				this.hideResults();
			} else if (sign.classList.contains('reload')) {
				this.resetData();	
			}
		},
		showNextEquation() {
			this.answer = null;
			this.curEquation = this.equations.pop();
			let equationString = getEquationString(this.curEquation);
			if (this.curEquation.isFirst) {
				this.showFirstEquation(equationString)
				return;
			}
			this.$refs.equationArea.changeEquationText(equationString);
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
				equationArea.classList.toggle('mistake');
				setTimeout(function() {
					equationArea.classList.toggle('mistake');
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
			
			this.$refs.equationArea.$refs.answerInput.focus();

			if (this.equations.length > 0) {
				this.showNextEquation();
			} else {
				this.hideElementsAndShowResults();
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
		hideElementsAndShowResults() {
			this.equationText = this.curPoints + ' / ' + this.maxPoints;
			this.trainingInProgress = false;

			this.time.trainingDuration = Math.round((new Date().getTime() - this.time.timeStart.getTime()) / 1000);
			this.deactivateMistakesHeader();
			this.checkNoMistakes();

			this.showResults();

			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});

			this.signLook = 'hiden';
			this.signLook = 'reload';
		},
		showResults() {
			this.results = {
				mark: Math.round(this.curPoints / this.maxPoints * 12),
				percent: Math.round(this.curPoints / this.maxPoints * 10000) / 100  + '%',
				duration: getDuration(this.time.trainingDuration),
				durationAverage: getDuration(this.time.trainingDuration, 'average', this.maxPoints)
			}

			let resultsContent = this.$refs.resultsContent;
			let resultsElem = this.$refs.resultsElem;
			resultsContent.classList.add("hiden");
			this.canRecieveEnterInput = false;
			setTimeout(() => {
				resultsElem.classList.add("full");
				this.$refs.darkBg.classList.add('active');

				setTimeout(() => {
					resultsContent.classList.remove("hiden");
					this.canRecieveEnterInput = true;
					setTimeout(() => {
						this.$refs.progressLine.style.width = (this.curPoints / this.maxPoints * 100) + '%';
					}, 500)
				}, 500)
			}, 500)
		},
		hideResults() {
			let resultsElem = this.$refs.resultsElem;
			this.$refs.darkBg.classList.toggle('active');
			resultsElem.classList.add('hiden');
			this.canRecieveEnterInput = false;
			setTimeout(() => {
				resultsElem.classList.remove('hiden');
				resultsElem.classList.remove('full');
				this.canRecieveEnterInput = true;
			}, 1000)
		},
		resetData() {
			this.equationsAmount = this.inputsEquationsAmount;
			this.signLook = 'start';
			this.equationText = '';
			this.$refs.mistakesHeader.innerHTML = '<div class="mistake_cross"></div>';	
			this.$refs.mistakesHeader.classList.remove('no_mistakes');
			this.maxPoints = 0;
			this.curPoints = 0;
			this.passInputs = false;
			this.$refs.progressLine.style.width = '0%';
			this.mistakes = [];
		},
		getInputsOptions () {
			return {
				buttonsSections: [
					{
						type: 'multiplication_header',
						name: 'operations', 
						values: ['×', '÷'], 
						toggleAllButton: false
					},
					{
						type: 'default',
						name: 'numbers', 
						values: [2, 3, 4, 5, 6, 7, 8, 9], 
						toggleAllButton: true
					}
				],
				isCoefficientBased: true,
				rangeValues: [0.25, 0.5, 1, 2, 4],
				// rangeValues: {min: 3, max: 15, step: 3}
				coefficientValue: 8
			}
		},
		getInputsData(inputsData) {
			this.inputValues = inputsData;
		}
	},
};

// let colorButton;
// let colorsHolder;
// let colorButtons;

// let canChangeColor = false;

// setTimeout(() => {
// 	colorButton = document.querySelector('#color_button');
// 	colorsHolder = document.querySelector('#colors_container');
// 	colorButtons = document.querySelectorAll('.color_container');
// 	shrinkLink = document.querySelector('#shrink_link_wrapper');
// 	linkToFractionButton = document.querySelector('#linkToFraction');
// 	linkToMainButton = document.querySelector('#linkToMain');
// 	refButton = document.querySelector('#ref_button');
// 	refWrapper = document.querySelector('.ref_wrapper');
// 	activateColorButtons();
// 	// if (linkToFractionButton) {
// 	// 	linkToFractionButton.addEventListener('click', ev => {
// 	// 		if (linkToFractionButton.classList.contains('active')) {
// 	// 			window.location.href = "./fraction/index.html";
// 	// 		} else {
// 	// 			linkToFractionButton.classList.add('active');
// 	// 			linkToFractionButton.innerHTML = 'Тренажер дробів';
// 	// 			shrinkLink.classList.remove('hiden');
// 	// 		}
// 	// 	})
// 	// 	shrinkLink.addEventListener('click', ev => {
// 	// 		if (!shrinkLink.classList.contains('hiden')) {
// 	// 			shrinkLink.classList.add('hiden');
// 	// 			linkToFractionButton.innerHTML = '<div class="fract"> <div class="numer">1</div> <div class="denom" style="border-top: 2px solid rgb(0, 0, 0)">2</div> </div>';
// 	// 			linkToFractionButton.classList.remove('active');
// 	// 		}
// 	// 	})
// 	// } else {
// 	// 	linkToMainButton.addEventListener('click', ev => {
// 	// 		if (linkToMainButton.classList.contains('active')) {
// 	// 			window.location.href = "../index.html";
// 	// 		} else {
// 	// 			linkToMainButton.classList.add('active');
// 	// 			linkToMainButton.innerHTML = 'Тренажер множення';
// 	// 			shrinkLink.classList.remove('hiden');
// 	// 		}
// 	// 	})
// 	// 	shrinkLink.addEventListener('click', ev => {
// 	// 		if (!shrinkLink.classList.contains('hiden')) {
// 	// 			shrinkLink.classList.add('hiden');
// 	// 			linkToMainButton.innerHTML = '2 × 2';
// 	// 			linkToMainButton.classList.remove('active');
// 	// 		}
// 	// 	})
// 	// }
// 	// refButton.addEventListener('click', ev => {
// 	// 	refButton.classList.toggle('active');
// 	// 	refWrapper.classList.toggle('hiden');
// 	// })
	
	
	
// 	// document.addEventListener('keydown', function(e) {
// 	// if (refButton.classList.contains('active') && e.key == 'Escape') {
// 	// 	refButton.classList.toggle('active');
// 	// 	refWrapper.classList.toggle('hiden');	
// 	// 	}
// 	// });
	
// 	// colorsHolder.addEventListener('click', ev => {
// 	// 	if (!canChangeColor) {
// 	// 		colorsHolder.classList.toggle('active');
// 	// 		setTimeout(() => {
// 	// 			canChangeColor = true;
// 	// 		}, 500)
// 	// 	}
// 	// })
// }, 1000)

// function activateColorButtons () {
// 	for (let button of colorButtons) {
// 		button.addEventListener('click', ev => {
// 			if (canChangeColor) {
// 				let color = button.style.backgroundColor;
// 				document.documentElement.style.setProperty('--green', color);
// 				colorsHolder.classList.toggle('active');
// 				setTimeout(() => {
// 					canChangeColor = false;
// 				}, 0)
// 			}
// 		})
// 	}
// }


// external functions

function createEquationsList(actions, indexes, coefficient) {
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
