<template>
  <div class="render_controll">
    <h3>CONTROLLPANEL</h3>
    <div>
      <div class="render_controll_group">
        <h4>Mode</h4>
        <div class="render_controll_selection">
          <label> Position </label>
          <input type="radio" name="mode" v-model="main_selected" value="0" />
        </div>
        <div class="render_controll_selection">
          <label> Scale </label>
          <input type="radio" name="mode" v-model="main_selected" value="1" />
        </div>
        <div class="render_controll_selection">
          <label> Lock around </label>
          <input type="radio" name="mode" v-model="main_selected" value="2" />
        </div>
      </div>
    </div>
    <div class="render_controll_group" v-if="main_selected != 2">
      <label> Level to watch </label>
      <div class="render_controll_selection">
        <input type="range" min="0" :max="maxLevel" v-model="level_selected" />
        <label> {{ level_selected }} </label>
      </div>
    </div>
    <div class="render_controll_group" v-if="main_selected == 1">
      <label> Settings </label>
      <div class="render_controll_selection">
        <label> Decrease </label>
        <input type="radio" name="mode-scale" v-model="scale_selected" value="0" />
      </div>
      <div class="render_controll_selection">
        <label> Increse </label>
        <input type="radio" name="mode-scale" v-model="scale_selected" value="1" />
      </div>
    </div>
    <Button :text="'List View'" @click="$emit('detoogle')" />
  </div>
</template>

<script>
import Button from "../../assets/Button.vue";

export default {
  components: {
    Button,
  },
  props: {
    maxLevel: { type: Number, default: 0 },
  },
  data() {
    return {
      main_selected: 0,
      scale_selected: 0,
      level_selected: 0,
    };
  },
  watch: {
    main_selected() {
      this.$emit("main_selected", this.main_selected);
      //this.$store.commit("setMainSelected", this.scale_selected);
    },
    scale_selected() {
      this.$emit("scale_selected", this.scale_selected);
      //this.$store.commit("setScaleSelected", this.scale_selected);
    },
    level_selected() {
      this.$emit("level_selected", this.level_selected);
      //this.$store.commit("setScaleSelected", this.scale_selected);
    },
  },
};
</script>

<style lang="scss">
.render_controll {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 210px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: $main-light;
  z-index: 99;
  border-radius: 10px;
  box-shadow: 1px 1px 4px 2px rgba(50, 50, 10, 0.1);

  &_selection {
    display: flex;
    justify-content: space-between;
    margin: 0 30px;
  }
  &_group {
    padding: 5px 0;
    margin: 5px 0;
    border: 1px solid rgba(160, 155, 155, 0.568);
    border-radius: 5px;
    box-shadow: 1px 1px 4px 2px rgba(50, 50, 10, 0.1);
  }

  overflow: hidden;
}

.render_controll h4,
h3 {
  margin: 5px;
}
</style>
