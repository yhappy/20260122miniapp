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
   * s2p1 图片点击事件 - 跳转到地图页面（默认福州）
   */
  onS2P1Click() {
    console.log('点击了 s2p1 图片，准备跳转到 map 页面')

    // 添加点击反馈震动
    wx.vibrateShort({
      type: 'light'
    })

    // 跳转到地图页面，默认福州
    wx.navigateTo({
      url: '/pages/map/map?city=fuzhou',
      success: () => {
        console.log('跳转到 map 页面成功')
      },
      fail: (err) => {
        console.error('跳转失败:', err)
      }
    })
  },

  /**
   * 城市标签点击事件 - 跳转到地图页面并传递城市参数
   */
  onCityTap(e) {
    const cityKey = e.currentTarget.dataset.city
    console.log('点击了城市标签:', cityKey)

    // 添加点击反馈震动
    wx.vibrateShort({
      type: 'light'
    })

    // 跳转到地图页面，传递城市参数
    wx.navigateTo({
      url: `/pages/map/map?city=${cityKey}`,
      success: () => {
        console.log(`跳转到 map 页面成功，城市: ${cityKey}`)
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
