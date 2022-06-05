<script>
import api from "@/apiService";

export default {
  async mounted() {
    console.log(await api.get("user/validate?token=" + this.$route.query.token));
    console.log("push");
    const res = await api.get("user/check");
    this.$store.commit("setLoginState", res.status);
    this.$router.push("/");
  },
};
</script>
