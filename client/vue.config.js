const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});

var webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          MODE: process.env.VUE_APP_MODE,
        },
      }),
    ],
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/styles/_global.scss";
        `,
      },
    },
  },
  /*   devServer: {
    https: true,
  }, */
};
