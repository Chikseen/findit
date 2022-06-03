<script>
import api from "@/apiService";

export default {
  async mounted() {
    console.log(await api.get("user/validate?token=" + this.$route.query.token));
    console.log("push");
    this.$router.push("/");
  },
};
</script>
