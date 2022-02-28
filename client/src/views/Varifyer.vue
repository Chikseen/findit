<template>
  <div>
    <p>Validating your E-Mail</p>
    <p>Status</p>
    <p>{{ status }}</p>
  </div>
</template>

<script>
import api from "../apiService";

export default {
  name: "Varifyer",
  data() {
    return {
      status: {},
    };
  },
  methods: {
    async sendReq() {
      console.log("VerificationID", this.$route.query.verificationID);
      const data = await api.fetchData("user/validateEmail", {
        vid: this.$route.query.verificationID,
      });
      this.status = await data;
    },
  },
  mounted() {
    this.sendReq();
  },
};
</script>
