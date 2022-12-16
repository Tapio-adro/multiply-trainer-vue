<template>
	<div id="mistakes">
		<div class="mistakes_header" ref="mistakesHeader">
			<div class="mistake_cross"></div>
		</div>
		<div v-if="mistakesData.length != 0" ref="explanations_container">
			<div v-for="(equation, index) in mistakesData" :key="index" class="explanation_wrapper equation">
				<div class="equation_wrapper">
					<div class="equation_with_answer" v-html="equation[0][0]" :ref="index == 0 ? 'last_mistake' : 'no_ref'"></div>
				</div>
				<div class="explanation_container equation">
					<template v-for="(part, index) in equation" :key="index">
						<template v-if="typeof part[0] == 'string'">
							<div class="left elem" :class="{underline: index == equation.length - 1}" v-html="part[0]"></div>
							<div class="elem" :class="{right: part[1] != '', last: index == equation.length - 1}" v-html="part[1]"></div>
						</template>
						<template v-else>
							<div class="ors_holder">
								<div class="or_wrapper">
									<div class="or_figure"></div>
									<div class="or_holder">
										<div v-html="part[0][0]"></div>
										<div v-html="part[0][1]"></div>
									</div>
								</div>
								<div class="or_wrapper">
									<div class="or_figure"></div>
									<div class="or_holder">
										<div v-html="part[1][0]"></div>
										<div v-html="part[1][1]"></div>
									</div>
								</div>
							</div>
							<div class="elem right" v-html="part[2]"></div>
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
	emits: ['focusToTopButton'],
  methods: {
    mistakeAdded() {
			let mistakesAmount = this.mistakesData.length;
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