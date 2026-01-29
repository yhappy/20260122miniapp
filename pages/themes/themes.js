// pages/themes/themes.js
Page({
  data: {
    statusBarHeight: 0,
    backButtonTop: 0
  },

  /**
   * 页面的生命周期函数
   */
  onLoad(options) {
    console.log('themes 页面加载')

    // 获取系统信息，计算返回按钮位置
    this.getSystemInfo()
  },

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync()
    console.log('系统信息:', systemInfo)

    // 计算状态栏高度（px转rpx）
    const screenWidth = systemInfo.screenWidth
    const screenHeight = systemInfo.screenHeight
    const statusBarHeight = systemInfo.statusBarHeight

    // px 转 rpx（以 iPhone 6 为基准，750rpx = 375px）
    const rpxRatio = 750 / screenWidth
    const statusBarHeightInRpx = statusBarHeight * rpxRatio

    console.log('状态栏高度:', statusBarHeight, 'px =', statusBarHeightInRpx, 'rpx')

    this.setData({
      statusBarHeight: statusBarHeightInRpx,
      backButtonTop: statusBarHeightInRpx
    })
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
  },

  /**
   * s3p1 点击事件 - 跳转到 news 页面
   */
  onS3P1Click() {
    console.log('点击了 s3p1 图片，准备跳转到 news 页面')

    // 添加点击反馈震动
    wx.vibrateShort({
      type: 'light'
    })

    // 跳转到新闻页面，携带参数 320551
    wx.navigateTo({
      url: '/pages/news/news?themeId=320551',
      success: () => {
        console.log('跳转到 news 页面成功')
      },
      fail: (err) => {
        console.error('跳转失败:', err)
      }
    })
  }
})
