<template>

<div id="equation_area" ref="area">
  <div v-if="displayRawHTML" class="equation_text fraction" ref="equationText" v-html="equationText"></div>
  <div v-else class="equation_text" ref="equationText">{{ equationText }}</div>
  <input type="number" class="answer_text hiden" ref="answerInput" v-model="answer" @input="checkInputValue">
  <div class="sign start" @click="this.$emit('signClicked')" ref="sign">
    <div id="sign_start"></div>
  </div>
</div>

</template>

<script>
export default {
  name: "EquationArea",
  props: {
    answer: [Number, String],
    equationText: String,
    trainingInProgress: Boolean,
    signLook: String,
    displayRawHTML: {
      default: false,
      type: Boolean
    }
  },
  emits: ['update:answer', 'signClicked', 'update:equationText'],
  watch: {
    trainingInProgress() {
      if (this.trainingInProgress) {
			  this.$refs.area.classList.toggle('active');
        this.toggleAnswerInput();
				this.$refs.answerInput.focus();
      } else {
        this.$refs.area.classList.toggle('active');
			  this.toggleAnswerInput();
      }
    },
    signLook() {
      this.changeSignTo(this.signLook);
    },
    answer() {
      this.$emit('update:answer', this.answer);
    }
  },
  methods: {
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
					sign.classList.add(type);
					sign.innerHTML = '↻';
					break;
        case 'accept':
					sign.setAttribute('class', 'sign');
					sign.classList.add(type);
					sign.innerHTML = '✓';
					break;
			}
		},
    toggleAnswerInput() {
			let answerInput = this.$refs.answerInput;
			answerInput.classList.toggle('hiden');
		},
    changeEquationText(str) {
			this.$refs.equationText.classList.add('hiden');
			let that = this;
			setTimeout(function() {
        that.$emit('update:equationText', str);
				that.$refs.equationText.classList.remove('hiden');
			}, 250);
		},
    checkInputValue(e) {
      if (Number(this.answer) > 99) {
        let elem = e.target;
        elem.value = String(elem.value).slice(0, 2);
      }
    }
  },
};
</script>