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

<style>
.message_wrapper {
  position: fixed;
  bottom: 10px;
  left: 10px;
  width: calc(100% - 20px);

  z-index: 100;

  background-color: rgba(250, 235, 215, 0.445);
}
.isError {
  background-color: rgba(223, 88, 83, 0.747);
}
</style>
