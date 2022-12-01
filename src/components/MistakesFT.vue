<template>
	<div class="mistakes_header" ref="mistakesHeader">
		<div class="mistake_cross"></div>
	</div>
</template>

<script>
export default {
  name: "MistakesFT",
  props: {
    mistakes: Array
  },
  data() {
    return {
      
    }
  },
  methods: {
    mistakeAdded() {
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
		deactivateMistakesHeader() {
			let uncorrectedMistakes = this.mistakes.filter((mistake) => {
				return mistake.state == 'neutral';
			});
			if (uncorrectedMistakes.length == 0) {
				this.$refs.mistakesHeader.classList.remove('active');
			}
		}
  }
};
</script>