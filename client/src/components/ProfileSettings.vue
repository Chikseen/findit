<template>
  <div class="profile_settings">
    <h1>Profile Settings</h1>
    <div class="profile_settings_content">
      <div>
        <h3>Language</h3>
        <h6>A selection will be here soon</h6>
      </div>
    </div>
    <div class="profile_settings_content">
      <div>
        <h3>More Settings</h3>
        <h6>Here will be more settings soon</h6>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.profile_settings {
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
    }
  }
  &_content > div > h6 {
    margin: 0;
  }
}

@media only screen and (max-width: 750px) {
  .profile_settings {
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
