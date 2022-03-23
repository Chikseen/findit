<template>
  <div class="project_settings">
    <h1>Project Settings</h1>
    <div class="project_settings_content">
      <div>
        <h3>Share Project</h3>
        <h6>In order to share this project you need the E-Mail address of the person you wan</h6>
      </div>
      <div class="project_settings_content_iac">
        <ReactiveInputField class="project_settings_content_iac_input" :text="'E-Mail'" @change="typeof $event == 'string' ? (shareWithText = $event) : ''" />
        <p>Send Invite with:</p>
        <div class="project_settings_content_iac_access">
          <Button :text="'Read Only'" @mouseup="sendInvite(0)" />
          <Button :text="'Full Access'" @mouseup="sendInvite(1)" />
          <Button :text="'Admin'" @mouseup="sendInvite(2)" />
        </div>
      </div>
    </div>
    <div class="project_settings_content">
      <div>
        <h3>Access</h3>
        <h6 v-if="!access.everyone">Here you can controll who have access to your project</h6>
      </div>
      <div v-if="!access.everyone">
        <hr />
        <h3>Admin</h3>
        <div v-if="access.admin.length > 0">
          <div v-for="user in access.admin" :key="user" class="project_settings_userList">
            <p>{{ user }}</p>
            <div class="project_settings_userList_buttons">
              <Button :text="'FULL ACCESS'" @mouseup="changeAccess(1, user)" />
              <Button :text="'READ ONLY'" @mouseup="changeAccess(0, user)" />
              <Button :text="'REMOVE'" @mouseup="changeAccess(3, user)" />
            </div>
          </div>
        </div>
        <div v-else>
          <p>There are no users who have Admin access!</p>
        </div>
        <hr />
        <h3>Full Access</h3>
        <div v-if="access.full.length > 0">
          <div v-for="user in access.full" :key="user" class="project_settings_userList">
            <p>{{ user }}</p>
            <div class="project_settings_userList_buttons">
              <Button :text="'READ ONLY'" @mouseup="changeAccess(0, user)" />
              <Button :text="'ADMIN'" @mouseup="changeAccess(2, user)" />
              <Button :text="'REMOVE'" @mouseup="changeAccess(3, user)" />
            </div>
          </div>
        </div>
        <div v-else>
          <p>There are no useres that have full access on this project!</p>
        </div>
        <hr />
        <h3>Read Only</h3>
        <div v-if="access.readOnly.length > 0">
          <div v-for="user in access.readOnly" :key="user" class="project_settings_userList">
            <p>{{ user }}</p>
            <div class="project_settings_userList_buttons">
              <Button :text="'FULL ACCESS'" @mouseup="changeAccess(1, user)" />
              <Button :text="'ADMIN'" @mouseup="changeAccess(2, user)" />
              <Button :text="'REMOVE'" @mouseup="changeAccess(3, user)" />
            </div>
          </div>
        </div>
        <div v-else>
          <p>There are no users who only have read access!</p>
        </div>
        <div class="project_settings_content_iac"></div>
        <div>
          <CTA :text="'Public for everyone'" @mouseup="changeAccess(4)" />
        </div>
      </div>
      <div v-else>
        <h6>This project is visible for everyone who have the project ID</h6>
        <CTA :text="'Mange visibilty manuely'" @mouseup="changeAccess(4)" />
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
import CTA from "@/assets/CTA.vue";

import api from "@/apiService";

export default {
  components: {
    SettingIcon,
    ReactiveInputField,
    Button,
    CTA,
  },
  props: {
    access: { type: Object, default: () => {} },
  },
  methods: {
    async sendInvite(accessLevel) {
      const data = await api.projectcall("projects/sendInvite", {
        shareWith: this.shareWithText,
        shareBy: localStorage.getItem("usr"),
        projectID: sessionStorage.getItem("projectID"),
        accessLevel: accessLevel,
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
        if (data.isError) this.$store.commit("setMessage", data);
        this.$router.push("/Home");
      } else {
        console.log("cancel delete request");
      }
    },
    async changeAccess(toLevel, userToChange) {
      const data = await api.projectcall("projects/changeAccess", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        userToChange: userToChange,
        toLevel: toLevel,
      });
      if (data.isError) this.$store.commit("setMessage", data);
    },
  },
};
</script>

<style lang="scss">
.project_settings {
  width: 100%;
  height: 100%;
  background-color: rgb(245, 245, 245);
  border-radius: 15px 0 0 15px;
  transition: 0.5s all;
  z-index: 10;

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
    box-shadow: 1px 1px 5px 3px rgba(50, 50, 10, 0.08);
    border-radius: 5px;
    margin: 15px;
    padding: 5px;
    &_iac {
      display: flex;
      flex-direction: column;
      &_input {
        width: 95%;
      }
      &_access {
        display: flex;
      }
    }
  }

  &_content > div > h6 {
    margin: 0;
  }

  &_userList {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    height: 120px;

    &_buttons {
      display: flex;
      flex-direction: row;
      height: 50px;
    }
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
