// pages/home/home.js
Page({
  /**
   * 页面的生命周期函数
   */
  onLoad(options) {
    console.log('home 页面加载')
  },

  /**
   * 页面初次渲染完成
   */
  onReady() {
    console.log('home 页面渲染完成')
  },

  /**
   * s2p1 图片点击事件 - 跳转到地图页面
   */
  onS2P1Click() {
    console.log('点击了 s2p1 图片，准备跳转到 map 页面')

    // 添加点击反馈震动
    wx.vibrateShort({
      type: 'light'
    })

    // 跳转到地图页面
    wx.navigateTo({
      url: '/pages/map/map',
      success: () => {
        console.log('跳转到 map 页面成功')
      },
      fail: (err) => {
        console.error('跳转失败:', err)
      }
    })
  },

  /**
   * s2p2 图片点击事件 - 跳转到主题页面
   */
  onS2P2Click() {
    console.log('点击了 s2p2 图片，准备跳转到 themes 页面')

    // 添加点击反馈震动
    wx.vibrateShort({
      type: 'light'
    })

    // 跳转到主题页面
    wx.navigateTo({
      url: '/pages/themes/themes',
      success: () => {
        console.log('跳转到 themes 页面成功')
      },
      fail: (err) => {
        console.error('跳转失败:', err)
      }
    })
  }
})
