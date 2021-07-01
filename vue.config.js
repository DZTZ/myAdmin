// const path = require("path");
// const CompressionPlugin = require("compression-webpack-plugin");
// function resolve(dir) {
//   // path.join()方法用于连接路径
//   return path.join(__dirname, dir);
// }
let cdn = {
  css: ["https://cdn.bootcdn.net/ajax/libs/ant-design-vue/1.7.2/antd.min.css"],
  js: [
    "https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.min.js",
    "https://cdn.jsdelivr.net/npm/vue-router@3.4.9/dist/vue-router.min.js",
    "https://cdn.jsdelivr.net/npm/vuex@3.6.0/dist/vuex.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.23.0/moment.min.js",
    "https://dztz.github.io/cdn/antd.min.js"
    // "https://cdn.bootcdn.net/ajax/libs/ant-design-vue/1.7.2/antd.min.js"
  ]
};
module.exports = {
  publicPath: "./",
  runtimeCompiler: true,
  productionSourceMap: false,
  lintOnSave: false,
  outputDir: "docs",
  configureWebpack: {
    externals: {
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      moment: "moment",
      "ant-design-vue": "antd"
    },
    plugins: [
      // new CompressionPlugin({
      //   test: /\.(js|css)?$/i, // 哪些文件要压缩
      //   filename: "[path].gz[query]", // 压缩后的文件名
      //   algorithm: "gzip", // 使用gzip压缩
      //   minRatio: 1, // 压缩率小于1才会压缩
      //   deleteOriginalAssets: true // 删除未压缩的文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false
      // })
    ]
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].cdn = cdn;
      return args;
    });
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */
          /*
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true
      }
    }
  }
  // assetsDir: 'static',
  // devServer: {
  //   proxy: {
  //     "/?s=": {
  //       target: "http://hd215.api.yesapi.cn", // 测试
  //       ws: false,
  //       changeOrigin: true,
  //       // pathRewrite: {
  //       //   "^/?s=": "/123"
  //       // }
  //     }
  //   }
  // }
};
