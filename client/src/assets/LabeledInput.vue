<template>
  <div>
    <div>
      <h5>{{ name }}</h5>
    </div>
    <div><input type="text" v-model="input" /></div>
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, default: "LABELNAME" },
  },
  data() {
    return {
      input: "",
    };
  },
  watch: {
    input() {
      this.$emit("change", this.input);
    },
  },
};
</script>
