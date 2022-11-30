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
			<MistakesMT
				ref="mistakes"
				:mistakes="mistakes"
			/>		
			<Results
				ref="results"
				:results="results"
				@accept="processEnterInput"
			/>	
		</div>
	</div>
	<div id="darkBg" ref="darkBg"></div>
</template>

<script>
import Inputs from '../components/Inputs.vue'
import Results from '../components/Results.vue'
import EquationArea from '../components/EquationArea.vue'
import MistakesMT from '../components/MistakesMT.vue'

export default {
  name: "FractionTrainer",
	components: {
		Results,
		Inputs,
		MistakesMT,
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
		// processEnterInput();
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
			} else if (this.$refs.results.$refs.resultsElem.classList.contains("full")) {
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
			let equationArea = this.$refs.equationArea.$refs.area;

			if (!answer) {
				return;
			} else if (answer == equation.answer) {
				if (equation.type == 'normal') {
					this.equationsAmount--;
					this.curPoints++;
					this.$refs.mistakes.deactivateMistakesHeader();
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
					this.addMistake();
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
		addMistake() {
			let mistake = {
				text: getEquationString(this.curEquation, 'full'),
				state: 'neutral'
			}
			this.mistakes.push(mistake);
			this.$refs.mistakes.mistakeAdded();
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
		checkNoMistakes() {
			if (this.curPoints == this.maxPoints) {
				this.$refs.mistakes.$refs.mistakesHeader.classList.toggle('no_mistakes');
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
			this.$refs.mistakes.deactivateMistakesHeader();
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
				durationAverage: getDuration(this.time.trainingDuration, 'average', this.maxPoints),
				maxPoints: this.maxPoints,
				curPoints: this.curPoints
			}

			let resultsContent = this.$refs.results.$refs.resultsContent;
			let resultsElem = this.$refs.results.$refs.resultsElem;
			resultsContent.classList.add("hiden");
			this.canRecieveEnterInput = false;
			setTimeout(() => {
				resultsElem.classList.add("full");
				this.$refs.darkBg.classList.add('active');

				setTimeout(() => {
					resultsContent.classList.remove("hiden");
					this.canRecieveEnterInput = true;
					setTimeout(() => {
						this.$refs.results.$refs.progressLine.style.width = (this.curPoints / this.maxPoints * 100) + '%';
					}, 500)
				}, 500)
			}, 500)
		},
		hideResults() {
			let resultsElem = this.$refs.results.$refs.resultsElem;
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
			this.$refs.mistakes.$refs.mistakesHeader.innerHTML = '<div class="mistake_cross"></div>';	
			this.$refs.mistakes.$refs.mistakesHeader.classList.remove('no_mistakes');
			this.maxPoints = 0;
			this.curPoints = 0;
			this.passInputs = false;
			this.$refs.results.$refs.progressLine.style.width = '0%';
			this.mistakes = [];
		},
		getInputsOptions () {
			return {
				buttonsSections: [
					{
						type: 'header',
						name: 'operations', 
						values: ['+', '−', '×', '÷'], 
						toggleAllButton: false,
						areAllEnabled: true
					}
				],
				isCoefficientBased: false,
				rangeValues: {min: 3, max: 15, step: 3, value: 6}
			}
		},
		getInputsData(inputsData) {
			this.inputValues = inputsData;
		}
	},
};

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
