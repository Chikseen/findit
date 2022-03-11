<template>
  <button class="CTA" @mouseup="emitData">{{ text }}</button>
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

<style lang="scss">
.CTA {
  height: 100%;
  width: calc(100% - 20px);
  margin: 10px;
  border-radius: 10px;
  border: 0;
  font-size: 1.5rem;
  background-color: $green;
  box-shadow: 2px 2px 5px 5px rgba(50, 50, 50, 0.2);
  cursor: pointer;
  transition: all 0.4s;
}

.CTA:hover {
  box-shadow: 2px 2px 10px 5px rgba(50, 50, 50, 0.3);
  transform: translateX(-2px) translateY(-2px);
}
</style>
