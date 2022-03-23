<template>
  <div>
    <div :class="[isExpand ? 'profileSettings_expand' : 'profileSettings_closed', 'profileSettings_icon']" @click="isExpand = !isExpand">
      <p v-if="toShow == 'profileconfig'">Profile</p>
      <p v-if="toShow == 'projectconfig'">Project</p>
    </div>
    <Transition name="profile-setting">
      <div v-if="isExpand" class="profileSettings_content">
        <ProfileSettings v-if="toShow == 'profileconfig'" />
        <ProjectSettings v-if="toShow == 'projectconfig'" :access="access" />
      </div>
    </Transition>
  </div>
</template>

<script>
import ProjectSettings from "@/components/ProjectSettings.vue";
import ProfileSettings from "@/components/ProfileSettings.vue";

export default {
  components: {
    ProjectSettings,
    ProfileSettings,
  },
  props: {
    toShow: { type: String },
    access: { type: Object, default: () => {} },
  },
  data() {
    return {
      isExpand: false,
    };
  },
};
</script>

<style lang="scss">
.profile-setting-enter-active,
.profile-setting-leave-active {
  transform: translateX(0);
}

.profile-setting-enter-from,
.profile-setting-leave-to {
  transform: translateX(100%);
}
/* _______ */

.profileSettings {
  position: fixed;
  background-color: $main;
  z-index: 1;
  top: 0;
  width: 5rem;
  height: 5rem;

  &_icon {
    position: relative;
    background-color: $main;
    box-shadow: 0px 0px 10px 5px #3f3f3f1f;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
    transition: 0.5s all;

    p {
      margin: 0;
      padding: 0;
    }
  }

  &_closed {
    right: 0;
    border-radius: 0 0 0 3rem;
    z-index: 0;
  }

  &_expand {
    right: 350px;
    border-radius: 5px 0 3rem 0;
    z-index: 50;
  }

  &_content {
    position: fixed;
    overflow-y: scroll;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    max-width: calc(350px + 5rem);
    background-color: rgb(245, 245, 245);
    border-radius: 15px 0 0 15px;
    box-shadow: 1px 1px 10px 3px rgba(50, 50, 10, 0.3);
    transition: 0.5s all;
    z-index: 10;
    display: flex;
    flex-direction: column;
  }
}
@media only screen and (max-width: 750px) {
  .profileSettings {
    &_content {
      border-radius: 0;
    }

    &_expand {
      margin-left: 50%;
    }
  }
}
</style>
