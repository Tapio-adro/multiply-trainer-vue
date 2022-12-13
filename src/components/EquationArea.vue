<template>

<div id="equation_area" ref="area">
  <div ref="inner" class="inner" :class="{flex_column: equationTrainer && signLook == 'submit'}">
    <div v-if="displayRawHTML" class="equation_text" :class="{fraction: !equationTrainer}" ref="equationText" v-html="equationText"></div>
    <div v-else class="equation_text" ref="equationText">{{ equationText }}</div>
    <div class="answer_area" :class="{change_height: signLook == 'submit'}">
      <span v-if="equationTrainer" v-show="signLook == 'submit'" class="x_holder"><span class="x">x</span> =&nbsp;</span>
      <input type="number" class="answer_text hiden" ref="answerInput" v-model="answer" @input="checkInputValue">
      <template v-if="twoAnswers && signLook == 'submit'">
        &nbsp;
        <span v-if="equationTrainer" v-show="signLook == 'submit'" class="x_holder"><span class="x">x</span> =&nbsp;</span>
        <input type="number" class="answer_text" ref="answerInput2" v-model="answer2" @input="checkInputValue2">
      </template>
      <button class="sign start" @click="this.$emit('signClicked')" ref="sign">
        <div id="sign_start"></div>
      </button>
    </div>
  </div>
  <div class="checkmark hiden none" ref="checkmark">
    <i class="fa fa-check" aria-hidden="true"></i>
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
    },
    equationTrainer: {
      default: false,
      type: Boolean
    },
    twoAnswers: {
      default: false,
      type: Boolean
    },
    answer2: {
      default: false,
      type: [Number, String]
    }
  },
  emits: ['update:answer', 'update:answer2', 'signClicked', 'update:equationText', 'update:signLook'],
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
    },
    answer2() {
      this.$emit('update:answer2', this.answer2);
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
        case 'checkmark':
					sign.setAttribute('class', 'sign');
					sign.classList.add(type);
					sign.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
					break;
			}
		},
    toggleAnswerInput() {
			let answerInput = this.$refs.answerInput;
			answerInput.classList.toggle('hiden');
		},
    changeEquationText(str, rightAnswer = false) {
      if (rightAnswer) {
        this.$refs.inner.classList.add('hiden');
        let that = this;
        setTimeout(() => {
          that.$refs.inner.classList.add('none');
          that.$refs.checkmark.classList.remove('none');
          that.$refs.checkmark.classList.remove('hiden');
          setTimeout(() => {
            that.$refs.checkmark.classList.add('hiden');
            setTimeout(() => {
              that.$refs.checkmark.classList.add('none');
              that.$refs.inner.classList.remove('none');
              that.$refs.inner.classList.remove('hiden');
              that.$emit('update:equationText', str);
					    this.$refs.answerInput.focus();
            }, 250)
          }, 500)
        }, 250)
        return;
      }
			this.$refs.equationText.classList.add('hiden');
			let that = this;
			setTimeout(function() {
        that.$emit('update:equationText', str);
				that.$refs.equationText.classList.remove('hiden');
			}, 250);
		},
    checkInputValue(e) {
      if (Number(this.answer) > 99) {
        let elem = this.$refs.answerInput;
        elem.value = String(elem.value).slice(0, 2);
      }
    },
    checkInputValue2(e) {
      if (Number(this.answer2) > 99) {
        let elem = this.$refs.answerInput2;
        elem.value = String(elem.value).slice(0, 2);
      }
    }
  },
};
</script>