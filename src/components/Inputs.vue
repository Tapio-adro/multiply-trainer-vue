<template>
  <div id="inputs">
    <div class="buttons_row"
      v-for="(buttonsRow, rowIndex) in buttonsRows" :key="rowIndex"
    >
      <div v-if="buttonsRow.type == 'multiplication_header'">
        <div class="header">
          <button 
            :class="{active: buttonsRow.buttons[0].isEnabled}"
            @click="toggleButton(rowIndex, 0)"
          >×</button> 
          & 
          <button 
          :class="{active: buttonsRow.buttons[1].isEnabled}"
            @click="toggleButton(rowIndex, 1)"
          >÷</button>
        </div>
      </div>
      <div v-else>
        <button 
          v-for="(button, index) in buttonsRow.buttons" :key="index"
          :class="{active: button.isEnabled}"
          @click="toggleButton(rowIndex, index)"
        >
          {{ button.value }}
        </button>
        <div 
          v-if="buttonsRow.toggleAllButton"
          class="toggle_all_button"
          @click="toggleAllButtons(rowIndex)"
          :ref="'toggleButtons' + rowIndex"
          :class="{active: buttonsRow.isToggleAllButtonEnabled}"
        >
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
    <!-- 
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
    <div class="range_value">{{ equationsAmount }}</div> -->

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
      buttonsRows: [

      ]
    }
  },
  mounted() {
    console.log(this.inputsOptions);
    this.initInputsObjects();
    // // set nums data
		// let defaultNums = [2, 3, 4, 5, 6, 7, 8, 9];
		// for (let key in defaultNums) {
		// 	let num = defaultNums[key];
		// 	this.numbersData[key] = {num, isEnabled: false}
		// 	if (num == 2) {
		// 		this.numbersData[key].isEnabled = true;
		// 	}
		// }
		// // set operations data
		// this.operationsData = {
		// 	multiplication: true,
		// 	division: false
		// }
		// let that = this;
		// document.addEventListener('keydown', function(e) {
		// 	if (e.key == 'Enter') {
		// 		that.processEnterInput();
		// 	}
		// });
		// this.refreshEquationsAmount();
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
		toggleButton(row, index) {
      if(this.buttonsRows[row].type == 'multiplication_header') {
        let buttons = this.buttonsRows[row].buttons;
        buttons[index].isEnabled = !buttons[index].isEnabled;
        if (buttons.every((button) => {
          return !button.isEnabled;
        })) {
          if (index == 0) {
            buttons[1].isEnabled = true;
          } else {
            buttons[0].isEnabled = true;
          }
        }
        return;
      }
			this.buttonsRows[row].buttons[index].isEnabled = !this.buttonsRows[row].buttons[index].isEnabled;
			// this.refreshEquationsAmount();
      this.refreshToggleAllButton(row)
		},
		toggleAllButtons(rowIndex) {
			let that = this;
      let buttonsRow = this.buttonsRows[rowIndex];

			let index = 0;
			let curInterval = setInterval(function() {
        let button = buttonsRow.buttons[index]
				if (!buttonsRow.isToggleAllButtonEnabled) {
					button.isEnabled = false;
				} else {
					button.isEnabled = true;
				}
				// that.refreshEquationsAmount();
				if (index == buttonsRow.buttons.length - 1) {
					clearInterval(curInterval);
				}
				index += 1
			}, 50);
      buttonsRow.isToggleAllButtonEnabled = !buttonsRow.isToggleAllButtonEnabled;
		},
    refreshToggleAllButton(row) {
      let buttonsRow = this.buttonsRows[row];
      buttonsRow.isToggleAllButtonEnabled = buttonsRow.buttons.every((button) => {
        return button.isEnabled;
      })
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
		},
    initInputsObjects() {
      let inputsOptions = this.inputsOptions
      for (let section of inputsOptions.buttonsSections) {
        let buttonsRow = {
          name: section.name,
          type: section.type,
          toggleAllButton: section.toggleAllButton,
          isToggleAllButtonEnabled: false,
          buttons: []
        }
        for (let value of section.values) {
          buttonsRow.buttons.push({value, isEnabled: false});
        }
        buttonsRow.buttons[0].isEnabled = true;
        console.log(this.buttonsRows);
        this.buttonsRows.push(buttonsRow);
      }
    }
  },
};
</script>