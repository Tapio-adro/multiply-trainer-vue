<template>
  <div class="main">
		<div class="wrapper">
			<div class="box"></div>
			<Inputs 
				:inputs-options="getInputsOptions()"
				:pass-inputs="passInputs"
				@passInputsData="getInputsData"
				v-model:equationsAmount="inputsEquationsAmount"
        class="autoButtonsWidth"
			/>
			<div id="equations_amount">{{ equationsAmount }}</div>
			<EquationArea
				ref="equationArea"
				v-model:answer="answer"
				v-model:answer2="answer2"
				v-model:equationText="equationText"
				:trainingInProgress="trainingInProgress"
				v-model:signLook="signLook"
				:displayRawHTML="true"
				:equationTrainer="true"
				:twoAnswers="twoAnswers"
				@signClicked="processEnterInput"
			/>
			<MistakesET
				ref="mistakes"
				:mistakesData="mistakesData"
				@focus-to-top-button="$refs.toTopButton.focus();"
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
import MistakesET from '../components/MistakesET.vue'
import ToTopButton from '../components/ToTopButton.vue'
import Results from '../components/Results.vue'

export default {
  name: "FractionTrainer",
	components: {
		Inputs,
		EquationArea,
		MistakesET,
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
			answer: null,
			answer2: null,
			maxPoints: 0,
			curPoints: 0,
			results: {},
			canRecieveEnterInput: true,
			passInputs: false,
			signLook: '',
			twoAnswers: false,
			mistakesData: []
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
		this.processEnterInput();
		setTimeout(() => {
			this.answer = 2;
			this.answer2 = 2;
			setTimeout(() => {
				this.processEnterInput();
			}, 10)
		}, 10)
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
			this.answer2 = null;
			this.curEquation = this.equations.pop();
			let timeoutTime = hasMistaken ? 0 : 500;
			setTimeout(() => {
				this.twoAnswers = typeof this.curEquation.answer == 'object'
			}, timeoutTime)
			let equationString = this.curEquation.string;
			this.$refs.equationArea.changeEquationText(equationString, !hasMistaken);
		},
		checkAnswer() {
			let equationArea = this.$refs.equationArea.$refs.area;

			let mistake = false;
			let answer = this.answer;
			let answer2 = this.answer2;
			let equation = this.curEquation;
			let that = this;

			if (checkNoAnswers()) {
				if (answer === null) {
					this.$refs.equationArea.$refs.answerInput.focus();
				} else {
					this.$refs.equationArea.$refs.answerInput2.focus();
				}
				return;
			} else {
				if (compareAnswers()) {
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

			function checkNoAnswers () {
				return that.twoAnswers ? answer === null || answer2 === null : answer === null;
			}
			function compareAnswers() {
				let answer = that.curEquation.answer
				if (typeof answer == 'number') {
					return answer == that.answer;
				} else {
					return (answer[0] == that.answer && answer[1] == that.answer2)
							|| (answer[0] == that.answer2 && answer[1] == that.answer);
				}
			}

		},
		showExplanations () {
			this.mistakesData.unshift(this.curEquation.parts)

			this.$refs.mistakes.mistakeAdded();
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
			this.mistakesData = [];
			this.twoAnswers = false;
		},
		getInputsOptions () {
			return {
				buttonsSections: [
					{
						type: 'default',
						name: 'operations', 
            namedValues: true,
						values: [
              ['quadratic', 'x<sup>2</sup> + x + c = 0'],
              ['incomplete quadratic', 'x<sup>2</sup> + x = 0'],
              ['linear', 'x + a = 0'],
            ], 
						toggleAllButton: false,
						areAllEnabled: false
					}
				],
				isCoefficientBased: true,
				rangeValues: [0.25, 0.5, 1, 2, 4],
				coefficientValue: 4
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
