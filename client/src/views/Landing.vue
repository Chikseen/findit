<template>
  <div>
    <Render style="margin-top:20px"/>
    <h1>You may will not see this page</h1>
    <h2>This is This site About</h2>
    <h3>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aspernatur ab dolorem blanditiis, enim iste in eum reprehenderit quasi id cumque porro
      deleniti odio provident commodi, atque quibusdam? Tempora, incidunt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum laudantium iste vel
      tenetur in sunt dolore dignissimos quod consectetur culpa. Molestias labore harum repellendus aspernatur reprehenderit esse quod, incidunt dolor! Lorem
      ipsum dolor sit amet consectetur adipisicing elit. Mollitia tenetur expedita autem numquam iure laboriosam corrupti recusandae, nesciunt nobis vero
      accusamus itaque atque unde repellat, animi facilis laudantium quae sunt?
    </h3>
    <hr />
    <hr />
    <hr />
    <h3>here should be dummy projects</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure quia laboriosam ratione est quos molestiae distinctio excepturi maxime inventore, rerum
      placeat libero facilis ex dolores tempore voluptatem doloremque ab aperiam. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit aliquid qui
      necessitatibus velit sit, dignissimos quo sint consequuntur inventore obcaecati maxime unde repellat nam voluptatem quae fugiat optio reprehenderit
      officiis? Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro voluptatum dolor magnam labore sit! Sapiente quaerat laudantium, quam illo quia
      dignissimos blanditiis amet asperiores, dolores nostrum praesentium, et iste sequi.
    </p>
    <hr />
    <hr />
    <hr />
    <button @mouseup="login">LOGIN</button>
  </div>
</template>

<script>
import Render from "../components/Render.vue";

export default {
  name: "landing",
  components: {
    Render,
  },
  methods: {
    login() {
      this.$router.push("/login");
    },
  },
};
</script>

<style></style>
