<template>
  <div>
    <button class="button" @click="emitData">{{ text }}</button>
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

<style>
.button {
  width: 100%;
  height: 50px;
}
</style>