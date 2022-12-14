<template>
	<div id="mistakes">
		<div class="mistakes_header" ref="mistakesHeader">
			<div class="mistake_cross"></div>
		</div>
		<div ref="explanations_container">
			<div></div>
			<div v-for="(equation, index) in mistakesData" :key="index" class="explanation_wrapper">
				<div class="equation_wrapper">
					<div class="equation_with_answer" v-html="equation[0][0]" :ref="index == 0 ? 'last_mistake' : 'no_ref'"></div>
				</div>
				<div class="explanation_container equation">
					<template v-for="(part, index) in equation" :key="index">
						<template v-if="typeof part[0] == 'string'">
							<div class="left" :class="{last: index == equation.length - 1}">
								{{ part[0] }}
							</div>
							<div :class="{right: part[1] != '', last: index == equation.length - 1}">{{ part[1] }}</div>
						</template>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: "MistakesFT",
  props: {
		mistakesData: Array
	},
  data() {
    return {
			mistakes: 0
    }
  },
	emits: ['focusToTopButton'],
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
						
			let that = this;
			setTimeout(() => {
				that.$refs.last_mistake[0].scrollIntoView({behavior: "smooth"});
				setTimeout(() => {
					that.$emit('focusToTopButton');
				}, 500)
			}, 500)
		},
		deactivateMistakesHeader() {
			this.$refs.mistakesHeader.classList.remove('active');
		}
  }
};
</script>