<template>
  <div class="reactiveInputField" @keyup.enter="enter">
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
    submitOnEnter: { type: Boolean, default: false },
  },
  data() {
    return {
      value: "",
    };
  },
  methods: {
    enter() {
      this.$emit("enter", this.value);
      this.value = "";
    },
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
  padding: 10px;
  width: calc(100% - 20px);

  &_label {
    text-align: left;
    transition: all 0.5s;
    margin-left: 5px;
    z-index: -11;

    &_up {
      color: rgb(41, 41, 39);
    }

    &_down {
      transform: translateY(28px);
      color: rgba(41, 41, 39, 0.5);
    }
  }

  &_input {
    height: 2rem;
    background-color: rgb(0, 0, 0, 0);
    box-shadow: 2px 2px 4px 2px rgba(50, 50, 10, 0.1);
    border: 1px solid #c5c4c4b2;
    border-radius: 8px;
  }
}
</style>
