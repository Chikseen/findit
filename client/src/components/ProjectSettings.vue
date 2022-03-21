<template>
  <div class="project_settings">
    <div class="project_settings_icon_wrapper">
      <SettingIcon class="project_settings_icon" @click="$emit('detoggle')" :isToggeld="true" />
    </div>
    <div class="project_settings_content">
      <div>
        <h3>Share Project</h3>
        <h6>In order to share this project you need the E-Mail address of the person you wan</h6>
      </div>
      <div class="project_settings_content_iac">
        <ReactiveInputField class="project_settings_content_iac_input" :text="'E-Mail'" @change="typeof $event == 'string' ? (shareWithText = $event) : ''" />
        <Button :text="'Send Invite'" @mouseup="sendInvite" />
      </div>
    </div>
    <div class="project_settings_content">
      <div>
        <h3>Delete Project</h3>
        <h6>This operation cant be undo</h6>
      </div>
      <div class="project_settings_content_iac">
        <Button :text="'Delete Project'" @mouseup="deletProject" />
      </div>
    </div>
  </div>
</template>

<script>
import SettingIcon from "@/assets/icons/setting.vue";
import ReactiveInputField from "@/components/reactiveInputField.vue";
import Button from "@/assets/Button.vue";

import api from "@/apiService";

export default {
  components: {
    SettingIcon,
    ReactiveInputField,
    Button,
  },
  methods: {
    async sendInvite() {
      console.log("call");
      const data = await api.projectcall("projects/sendInvite", {
        shareWith: this.shareWithText,
        shareBy: localStorage.getItem("usr"),
        projectID: sessionStorage.getItem("projectID"),
      });
      this.$store.commit("setMessage", data);
    },
    async deletProject() {
      let val = confirm("Are you sure to want delete this Project");
      if (val == true) {
        const data = await api.projectcall("projects/delete", {
          projectID: sessionStorage.getItem("projectID"),
          SID: localStorage.getItem("sessionID"),
          user: localStorage.getItem("usr"),
        });
        this.$router.push("/Home");
      } else {
        console.log("cancel delete request");
      }
    },
  },
};
</script>

<style lang="scss">
.project_settings {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 750px;
  height: 100%;
  background-color: rgb(245, 245, 245);
  border-radius: 15px 0 0 15px;
  box-shadow: 1px 1px 10px 3px rgba(50, 50, 10, 0.3);
  transition: 0.5s all;

  display: flex;
  flex-direction: column;

  &_icon {
    width: 75px;
    height: 75px;
    margin: 15px 15px 15px 0;

    &_wrapper {
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }
  }

  &_content {
    border: 1px solid #79787852;
    border-radius: 5px;
    margin: 15px;
    padding: 5px;
    &_iac {
      display: flex;
      flex-direction: column;
      &_input {
        width: 95%;
      }
    }
  }
  &_content > div > h6 {
    margin: 0;
  }
}

@media only screen and (max-width: 750px) {
  .project_settings {
    width: 100%;
    border-radius: 0;

    &_icon {
      width: 35px;
      height: 35px;
      margin: 5px 5px 20px 0;
    }
  }
}
</style>
