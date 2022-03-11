<template>
  <button class="button" @mouseup="emitData">{{ text }}</button>
</template>

<script>
export default {
  props: {
    text: { type: String, default: "buttonNAME" },
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
.button {
  height: 100%;
  width: calc(100% - 20px);
  margin: 10px;
  border-radius: 5px;
  border: 0;
  font-size: 1rem;
  background-color: none;
  box-shadow: 1px 1px 5px 2px rgba(50, 50, 10, 0.2);
  cursor: pointer;
  transition: all 0.4s;
}

.button:hover {
  box-shadow: 2px 2px 5px 3px rgba(50, 50, 20, 0.25);
  transform: translateX(-2px) translateY(-2px);
}
</style>
