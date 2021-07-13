/*
 * @Author       : daiwei
 * @Date         : 2021-07-13 10:39:52
 * @LastEditors  : daiwei
 * @LastEditTime : 2021-07-13 11:19:34
 * @FilePath     : \vue-bpmn-flow\.eslintrc.js
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    // 'plugin:vue/essential',
    // '@vue/standard'
  ],
  parserOptions: {
    // parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
