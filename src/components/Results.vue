<template>

<div id="results" ref="resultsElem">
	<div id="results_inner">
		<div id="results_content" ref="resultsContent">
			<section>
				<h2>Результат</h2>
				<h3>Оцінка: {{ results.mark }}</h3>
				<div class="progress_bar">
					<div class="progress_line" ref="progressLine"></div>
				</div>
				<h3 class="progress_percent">{{ results.percent }}</h3>
			</section>
			<section>
				<h2>Статистика</h2>
				<table>
					<tr>
						<td>Всього прикладів:</td>
						<td>{{ results.maxPoints }}</td>
					</tr>
					<tr>
						<td>Правильних відповідей:</td>
						<td>{{ results.curPoints }}</td>
					</tr>
					<tr>
						<td>Час виконання:</td>
						<td>{{ results.duration }}</td>
					</tr>
					<tr>
						<td class="lastTd">Середній час виконання одного виразу:</td>
						<td class="lastTd">{{ results.durationAverage }}</td>
					</tr>
				</table>
			</section>
			<div class="buttonHolder">
				<div class="acceptButton" @click="emit('accept')">✓</div>
			</div>
		</div>
	</div>
</div>

</template>

<script>
export default {
  name: "Results",
  props: {
    results: Object
  },
	emits: ['accept']
};
</script>