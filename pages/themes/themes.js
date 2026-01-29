// pages/themes/themes.js
Page({
  /**
   * 页面的生命周期函数
   */
  onLoad(options) {
    console.log('themes 页面加载')
  },

  /**
   * 页面初次渲染完成
   */
  onReady() {
    console.log('themes 页面渲染完成')
  },

  /**
   * 返回上一页
   */
  goBack() {
    console.log('点击返回按钮')

    // 添加震动反馈
    wx.vibrateShort({
      type: 'light'
    })

    // 返回上一页
    wx.navigateBack({
      success: () => {
        console.log('返回成功')
      },
      fail: (err) => {
        console.error('返回失败:', err)
        // 如果无法返回（比如是首页），则跳转到 home
        wx.switchTab({
          url: '/pages/home/home'
        })
      }
    })
  }
})
