// pages/cover/cover.js
Page({
  /**
   * 页面的生命周期函数
   */
  onLoad(options) {
    console.log('封面页面加载')
  },

  /**
   * 页面初次渲染完成
   */
  onReady() {
    console.log('封面页面渲染完成')
  },

  /**
   * s1p1 图片点击事件
   */
  onS1P1Click() {
    console.log('点击了 s1p1 图片，准备跳转到 home 页面')

    // 添加点击反馈震动
    wx.vibrateShort({
      type: 'light'
    })

    // 使用 redirectTo 重定向跳转到 home 页面
    wx.redirectTo({
      url: '/pages/home/home',
      success: () => {
        console.log('跳转到 home 页面成功')
      }
    })
  }
})
