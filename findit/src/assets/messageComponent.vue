<template>
  <div
    class="message_wrapper"
    v-if="showMessage"
    :class="{ isError: msg.isError }"
  >
    <p>
      {{ msg.msg }}
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      showMessage: false,
      msg: {},
    };
  },
  computed: mapState(["message"]),
  watch: {
    message() {
      this.showMessage = true;
      this.msg = this.message;
      setTimeout(() => {
        this.showMessage = false;
      }, 5000);
    },
  },
};
</script>

<style >
.message_wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;

  z-index: -1;

  background-color: rgba(250, 235, 215, 0.445);
}
.isError {
  background-color: rgba(223, 88, 83, 0.747)
}
</style>