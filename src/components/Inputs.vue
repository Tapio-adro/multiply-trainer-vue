<template>
  <div>
    
    <div class="header">
      <span 
        id="multiplication" 
        class="actionSign"
        :class="{active: operationsData.multiplication}"
        @click="toggleOperation('multiplication')"
      >×</span> 
      & 
      <span 
        id="division" 
        class="actionSign"
        :class="{active: operationsData.division}"
        @click="toggleOperation('division')"
      >÷</span>
    </div>
    <div class="nums_holder">
      <div 
        v-for="(numberItem, index) in numbersData" :key="index"
        class="numbers"
        @click="toggleNumber(index)"
        :class="{active: numberItem.isEnabled}"
      >
        {{ numberItem.num }}
      </div>
      <div 
        class="select_all_button"
        @click="toggleAllNumbers()"
        ref="toggleNumbersButton"
      >
        <div class="squares"></div>
        <div class="squares"></div>
        <div class="squares"></div>
        <div class="squares"></div>
      </div>
    </div>
    <input type="range" class="range" min="0" max="4" step="1" value="0"
      ref="range"
      @input="refreshEquationsAmount()"
    >
    <div class="range_value">{{ equationsAmount }}</div>

  </div>
</template>

<script>
export default {
  name: "Inputs",
  props: {
    inputsOptions: Object
  },
  data() {
    return {
      
    }
  },
  methods: {
    toggleOperation(op) {
			this.operationsData[op] = !this.operationsData[op];
			if (!Object.values(this.operationsData).some(value => value)) {
				if (op == 'multiplication') {
					this.operationsData['division'] = true;
				} else {
					this.operationsData['multiplication'] = true;
				}
			}
			this.refreshEquationsAmount();
		},
		toggleNumber(index) {
			this.numbersData[index].isEnabled = !this.numbersData[index].isEnabled;
			this.refreshEquationsAmount();
		},
		toggleAllNumbers() {
			let button = this.$refs.toggleNumbersButton;
			let that = this;

			button.classList.toggle('active');
			
			let nums = [2, 3, 4, 5, 6, 7, 8, 9];
			let curInterval = setInterval(function() {
				let num = nums.shift();
				let numItem = that.numbersData[num - 2];
				if (button.classList.contains('active')) {
					numItem.isEnabled = true;
				} else {
					numItem.isEnabled = false;
				}
				that.refreshEquationsAmount();
				if (nums.length == 0) {
					clearInterval(curInterval);
				}
			}, 50);
		},
		refreshEquationsAmount() {
			let rangeValues = [0.25, 0.5, 1, 2, 4];
			this.rangeData.coefficient = rangeValues[this.$refs.range.value];

			let enabledNumbersAmount = this.numbersData.filter(num => num.isEnabled).length;

			let enabledOperationsAmount = 0;
			enabledOperationsAmount += this.operationsData.division ? 1 : 0;
			enabledOperationsAmount += this.operationsData.multiplication ? 1 : 0;

			let defaultAmount = enabledNumbersAmount * enabledOperationsAmount * 8;
			this.equationsAmount = rangeValues[this.$refs.range.value] * defaultAmount;
		}
  },
};
</script>