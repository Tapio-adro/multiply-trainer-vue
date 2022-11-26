<template>

<div id="equation_area" ref="area">
  <div class="equation_text" ref="equationText">{{ equationText }}</div>
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
    signLook: String
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
			  this.toggleAnswerInput('none');
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
					sign.classList.add('reload');
					sign.innerHTML = '↻';
					break;
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