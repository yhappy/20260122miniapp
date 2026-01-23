// pages/home/home.js
Page({
  /**
   * 进入城市地图页
   */
  goToMap() {
    wx.navigateTo({
      url: '/pages/map/map'
    })
  },

  /**
   * 进入十大主题页
   */
  goToThemes() {
    wx.navigateTo({
      url: '/pages/themes/themes'
    })
  }
})
