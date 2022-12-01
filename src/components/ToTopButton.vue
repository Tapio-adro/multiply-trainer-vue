<template>
	<div id="to_top_wrapper" class="hiden" @click="srollToTop">
		<button id="to_top_container" ref="button">
			<div id="to_top_button"></div>
		</button>
	</div>
</template>

<script>
export default {
  name: "ToTopButton",
  props: {

	},
  data() {
    return {
      
    }
  },
  methods: {
		srollToTop() {
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
			setTimeout(() => {
				this.$parent.$refs.equationArea.$refs.answerInput.focus();
			}, 500)
		},
		focus() {
			this.$refs.button.focus();
		}
  }
};
</script>