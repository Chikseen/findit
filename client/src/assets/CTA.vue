<template>
  <div>
    <button @mouseup="emitData">{{ text }}</button>
  </div>
</template>

<script>
export default {
  props: {
    text: { type: String, default: "CTANAME" },
  },
  data() {
    return {};
  },
  methods: {
    emitData() {
      this.$emit("click");
    },
  },
};
</script>
