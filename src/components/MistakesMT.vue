<template>
  <div>
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
</template>

<script>
export default {
  name: "MistakesMT",
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