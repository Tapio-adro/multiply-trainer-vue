<template>
  <div id="inputs" ref="inputElems">
    <div 
      v-for="(buttonsRow, rowIndex) in buttonsRows" :key="rowIndex"
      class="buttons_row"
      :class="{header: buttonsRow.type == 'header'}"
    >
      <div v-if="buttonsRow.subType == 'multiplication_header'">
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
  </div>
</template>

<script>
export default {
  name: "Inputs",
  props: {
    inputsOptions: Object,
    passInputs: Boolean,
    equationsAmount: Number
  },
  data() {
    return {
      buttonsRows: [],
      sliderData: {}
    }
  },
  emits: ['passInputsData', 'update:equationsAmount'],
  watch: {
    passInputs() {
      if(!this.passInputs) {
        this.$refs.inputElems.classList.remove('inactive');
      } else {
        this.$refs.inputElems.classList.add('inactive');
        this.passInputsToParent();
      } 
    }
  },
  mounted() {
    this.initInputsObjects();
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
        this.$emit('update:equationsAmount', equationsAmount);
      } else {
        this.$emit('update:equationsAmount', sliderData.value);
      }
		},
    initInputsObjects() {
      let inputsOptions = this.inputsOptions
      for (let section of inputsOptions.buttonsSections) {
        let buttonsRow = {
          name: section.name,
          type: section.type,
          subType: section.subType,
          toggleAllButton: section.toggleAllButton,
          isToggleAllButtonEnabled: false,
          buttons: []
        }
        for (let value of section.values) {
          let isEnabled = section.areAllEnabled ? true : false;
          buttonsRow.buttons.push({value, isEnabled});
        }
        buttonsRow.buttons[0].isEnabled = true;
        this.buttonsRows.push(buttonsRow);
      }
      let rangeValues = inputsOptions.rangeValues;
      if (!inputsOptions.isCoefficientBased) {
        this.sliderData = {
          min: rangeValues.min,
          max: rangeValues.max,
          step: rangeValues.step,
          value: rangeValues.value
        }
      } else {
        this.sliderData = {
          min: 0,
          max: rangeValues.length - 1,
          step: 1,
          value: 0
          // value: Math.round(rangeValues.length / 2) - 1
        }    
      }
      this.refreshEquationsAmount();
    },
    passInputsToParent() {
      for (let buttonsRow of this.buttonsRows) {
        if(!buttonsRow.buttons.some((button) => {
          return button.isEnabled;
        })) {
          buttonsRow.buttons[0].isEnabled = true;
        } 
      }
      this.refreshEquationsAmount();

      let inputsData = [];
      for (let row of this.buttonsRows) {
        let valuesArray = row.buttons.filter((button) => {
          return button.isEnabled;
        }).map((button) => {
          return button.value;
        })
        inputsData.push(valuesArray);
      }
      if (this.inputsOptions.isCoefficientBased) {
        inputsData.push(this.sliderData.coefficient);
      } else {
        inputsData.push(this.sliderData.value);
      }
      this.$emit('passInputsData', inputsData)
    }
  },
};
</script>