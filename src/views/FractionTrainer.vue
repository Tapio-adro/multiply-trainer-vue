<template>
  <div class="main">
		<div class="wrapper">
			<Inputs 
				:inputs-options="getInputsOptions()"
				:pass-inputs="passInputs"
				@passInputsData="getInputsData"
				v-model:equationsAmount="inputsEquationsAmount"
			/>
			<div id="equations_amount">{{ equationsAmount }}</div>
			<EquationArea
				ref="equationArea"
				v-model:answer="answer"
				v-model:equationText="equationText"
				:trainingInProgress="trainingInProgress"
				v-model:signLook="signLook"
				:displayRawHTML="true"
				@signClicked="processEnterInput"
			/>
			<MistakesFT
				ref="mistakes"
				:mistakes="mistakes"
			/>		
			<ToTopButton
				ref="toTopButton"
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
import EquationArea from '../components/EquationArea.vue'
import MistakesFT from '../components/MistakesFT.vue'
import ToTopButton from '../components/ToTopButton.vue'
import Results from '../components/Results.vue'

export default {
  name: "FractionTrainer",
	components: {
		Inputs,
		EquationArea,
		MistakesFT,
		ToTopButton,
		Results
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
		window.onscroll = function() {checkScrolling()};
		function checkScrolling() {
			if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
				that.$refs.toTopButton.$el.classList.remove('hiden');
			} else {
				that.$refs.toTopButton.$el.classList.add('hiden');
			}
		}
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
				this.equations = createFractionsList(...this.inputValues);
				this.equations.forEach(eq => {
					console.log(eq.answer);
				});

				this.equationsAmount = this.equations.length;
		
				this.maxPoints = this.equations.length;
	
				this.showNextEquation(true);
			}, 0)
		},
		processEnterInput() {
			if (!this.canRecieveEnterInput || this.$refs.toTopButton.$refs.button == document.activeElement) return;

			let sign = this.$refs.equationArea.$refs.sign;
			if (sign.classList.contains('start')){
				this.trainingInProgress = true;
				this.start();
			} else if (sign.classList.contains('submit')) {
				this.checkAnswer();
			} else if (sign.classList.contains('accept')) {
				if (document.documentElement.scrollTop > 20) {
					this.$refs.toTopButton.scrollToTop();
				} else {
					this.hideElementsAndShowResults();
				}
			} else if (this.$refs.results.$refs.resultsElem.classList.contains("full")) {
				this.hideResults();
			} else if (sign.classList.contains('reload')) {
				this.resetData();		
			} 
		},
		showNextEquation(hasMistaken) {
			this.answer = null;
			this.curEquation = this.equations.pop();
			let equationString = this.curEquation.partial;
			this.$refs.equationArea.changeEquationText(equationString, !hasMistaken);
		},
		checkAnswer() {
			let equationArea = this.$refs.equationArea.$refs.area;

			let mistake = false;
			let answer = this.answer;
			let equation = this.curEquation;

			if (!answer) {
				this.$refs.equationArea.$refs.answerInput.focus();
				return;
			} else {
				if (answer == equation.answer) {
					this.curPoints++;
					this.$refs.mistakes.deactivateMistakesHeader();
					this.$refs.equationArea.$refs.answerInput.focus();
					// showCheckmark();
				} else {
					mistake = true;
					this.showExplanations();

					equationArea.classList.toggle('mistake');
					setTimeout(function() {
						equationArea.classList.toggle('mistake');
					}, 250)
				}
				this.equationsAmount--;
			}

			if (this.equations.length > 0) {
				this.showNextEquation(mistake);
			} else {
				if (!mistake) {
					this.hideElementsAndShowResults();
				} else {
					this.signLook = 'accept';					
					this.equationText = '';
					this.trainingInProgress = false;
				}
			}

		},
		showExplanations () {
			let explanationsWrapper = document.createElement('div');
			let fullEquationContainer = document.createElement('div');
			let explanationsContainer = document.createElement('div');
			explanationsWrapper.className = 'explanation_wrapper';
			fullEquationContainer.className = 'equation_wrapper';
			explanationsContainer.className = 'explanation_container';
			explanationsWrapper.appendChild(fullEquationContainer);
			explanationsWrapper.appendChild(explanationsContainer);

			let equationDiv = document.createElement('div');
			equationDiv.className = 'equation_with_answer';
			equationDiv.innerHTML = this.curEquation.full;

			fullEquationContainer.appendChild(equationDiv);

			explanationsContainer.innerHTML = this.curEquation.explanations;
			
			this.$refs.mistakes.$refs.explanations_container.prepend(explanationsWrapper);

			// if (equations.length == 0) {
			// 	toTopButton.innerHTML = '✓';
			// }
			this.$refs.mistakes.mistakeAdded();
			let that = this;
			setTimeout(() => {
				explanationsWrapper.scrollIntoView({behavior: "smooth"});
				setTimeout(() => {
					that.$refs.toTopButton.focus();
				}, 500)
			}, 500)
		},
		checkNoMistakes() {
			if (this.curPoints == this.maxPoints) {
				this.$refs.mistakes.$refs.mistakesHeader.classList.toggle('no_mistakes');
			}
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
			this.$refs.mistakes.$refs.explanations_container.innerHTML = '';
			this.maxPoints = 0;
			this.curPoints = 0;
			this.passInputs = false;
			this.$refs.results.$refs.progressLine.style.width = '0%';
			this.mistakes = [];
			this.$refs.mistakes.mistakes = 0;
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
				rangeValues: {min: 3, max: 12, step: 3, value: 3}
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
