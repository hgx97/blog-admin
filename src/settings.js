module.exports = {
  title: '小星星',

  /**
   * @type {boolean} true | false
   * @description 是否在右面板显示设置
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description 是否显示标签栏
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否需要固定Header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description 是否在右边栏显示logo
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description 需要显示错误日志的环境
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
