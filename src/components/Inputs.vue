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
    <input type="range" class="slider" 
      :min="sliderData.min" 
      :max="sliderData.max" 
      :step="sliderData.step" 
      v-model="sliderData.value"
      ref="slider"
      @input="refreshEquationsAmount()"
    >
    <div class="equations_amount">{{ equationsAmount }}</div>

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
      buttonsRows: [],
      sliderData: {},
      equationsAmount: 0
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
			  this.refreshEquationsAmount();
        return;
      }
			this.buttonsRows[row].buttons[index].isEnabled = !this.buttonsRows[row].buttons[index].isEnabled;
			this.refreshEquationsAmount();
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
				that.refreshEquationsAmount();
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
      let inputsOptions = this.inputsOptions
      let sliderData = this.sliderData
      if (inputsOptions.isCoefficientBased) {
			  this.sliderData.coefficient = this.inputsOptions.rangeValues[sliderData.value];
        let equationsAmount = 1;
        for (let buttonsRow of this.buttonsRows) {
          equationsAmount *= buttonsRow.buttons.filter((button) => {
            return button.isEnabled;
          }).length;
        }
        equationsAmount *= this.sliderData.coefficient * inputsOptions.coefficientValue;
        this.equationsAmount = equationsAmount;
      } else {
        this.equationsAmount = sliderData.value;
      }
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
      let rangeValues = inputsOptions.rangeValues;
      if (!inputsOptions.isCoefficientBased) {
        this.sliderData = {
          min: rangeValues.min,
          max: rangeValues.max,
          step: rangeValues.step,
          value: rangeValues.min + (rangeValues.max - rangeValues.min) / 2
        }
      } else {
        this.sliderData = {
          min: 0,
          max: rangeValues.length - 1,
          step: 1,
          value: Math.round(rangeValues.length / 2) - 1
        }      
      }
      this.refreshEquationsAmount();
    }
  },
};
</script>