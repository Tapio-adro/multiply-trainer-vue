<template>
	<div id="mistakes">
		<div class="mistakes_header" ref="mistakesHeader">
			<div class="mistake_cross"></div>
		</div>
		<div ref="mistakes_container"></div>
	</div>
</template>

<script>
export default {
  name: "MistakesFT",
  props: {

	},
  data() {
    return {
			mistakes: 0
    }
  },
  methods: {
    mistakeAdded() {
			this.mistakes += 1;
			let mistakesAmount = this.mistakes;
			if (mistakesAmount == 1) {
				this.$refs.mistakesHeader.classList.add('active');
			} else {
				this.$refs.mistakesHeader.classList.add('active');
				this.$refs.mistakesHeader.innerHTML += '<div class="mistake_cross"></div>';
			}
		},
		deactivateMistakesHeader() {
			this.$refs.mistakesHeader.classList.remove('active');
		}
  }
};
</script>