<template>
  <div class="reactiveInputField">
    <label :class="['reactiveInputField_label', value != '' ? 'reactiveInputField_label_up' : 'reactiveInputField_label_down']">{{ text }}</label>
    <input v-if="!isPassword && !isMail" class="reactiveInputField_input" type="text" v-model="value" />
    <input v-if="isPassword" class="reactiveInputField_input" type="password" v-model="value" />
    <input v-if="isMail" class="reactiveInputField_input" type="email" v-model="value" />
  </div>
</template>

<script>
export default {
  props: {
    text: { type: String, default: "" },
    isPassword: { type: Boolean, default: false },
    isMail: { type: Boolean, default: false },
  },
  data() {
    return {
      value: "",
    };
  },
  watch: {
    value() {
      this.$emit("change", this.value);
    },
  },
};
</script>

<style lang="scss">
.reactiveInputField {
  display: flex;
  flex-direction: column;
  margin: 10px auto;
  max-width: 250px;

  &_label {
    text-align: left;
    transition: all 0.5s;
    margin-left: 5px;
    z-index: -11;

    &_up {
      color: rgb(41, 41, 39);
    }

    &_down {
      transform: translateY(20px);
      color: rgba(41, 41, 39, 0.5);
    }
  }

  &_input {
    background-color: rgb(0, 0, 0, 0);
    border-radius: 8px;
  }
}
</style>
