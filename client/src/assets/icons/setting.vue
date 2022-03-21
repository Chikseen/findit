<template>
  <div class="logo">
    <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path v-if="!isToggeld" d="M2 1A1 1 0 002 4L8 4A1 1 0 008 1M2 6A1 1 0 002 9L8 9A1 1 0 008 6" />
      <path v-if="isToggeld" d="M6 2 2 4C0 5 0 6 2 7L6 9C8 10 9 9 7 8L5 7C3 6 3 5 5 4L7 3C9 2 8 1 6 2" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    isToggeld: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss">
.logo,
.logo > svg {
  height: 100%;
}
</style>
