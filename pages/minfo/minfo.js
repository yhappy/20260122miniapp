// pages/minfo/minfo.js
const newsParser = require('../../utils/news-parser.js')

Page({
  data: {
    newsList: [],
    loading: false,
    error: false,
    backButtonTop: 0
  },

  onLoad(options) {
    console.log('minfo 页面加载')

    // 获取系统信息，计算返回按钮位置
    this.getSystemInfo()

    // 设置标题
    wx.setNavigationBarTitle({
      title: '闽式生活资讯'
    })

    // 加载新闻数据
    this.loadNews()
  },

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync()
    console.log('系统信息:', systemInfo)

    // 计算状态栏高度（px转rpx）
    const screenWidth = systemInfo.screenWidth
    const statusBarHeight = systemInfo.statusBarHeight

    // px 转 rpx（以 iPhone 6 为基准，750rpx = 375px）
    const rpxRatio = 750 / screenWidth
    const statusBarHeightInRpx = statusBarHeight * rpxRatio

    console.log('状态栏高度:', statusBarHeight, 'px =', statusBarHeightInRpx, 'rpx')

    this.setData({
      backButtonTop: statusBarHeightInRpx
    })
  },

  /**
   * 加载新闻数据
   */
  async loadNews() {
    try {
      this.setData({
        loading: true,
        error: false
      })

      // 闽式生活资讯的固定URL
      const newsUrl = 'https://www.fjsen.com/wap/zhuanti/node_320319.htm'
      console.log('新闻URL:', newsUrl)

      // 获取新闻列表
      const newsList = await newsParser.getNewsList(newsUrl)

      console.log('获取到的新闻数量:', newsList.length)

      if (newsList.length > 0) {
        this.setData({
          newsList: newsList,
          loading: false
        })
      } else {
        // 如果没有获取到数据，使用降级方案
        console.warn('未获取到新闻数据，使用降级方案')
        this.useFallbackData()
      }

    } catch (error) {
      console.error('加载新闻失败：', error)
      this.useFallbackData()
    }
  },

  /**
   * 使用测试数据作为后备
   */
  useFallbackData() {
    const fallbackNews = [{
      id: Date.now(),
      title: '无法加载在线新闻，显示测试数据',
      content: '请检查网络连接或稍后重试',
      imgUrl: 'https://app5.fjsen.com/h5/20260122/images/s2p3.png'
    }]

    this.setData({
      newsList: fallbackNews,
      loading: false,
      error: true
    })

    wx.showToast({
      title: '使用本地数据',
      icon: 'none'
    })
  },

  /**
   * 点击新闻项
   */
  onNewsTap(e) {
    const {
      item
    } = e.currentTarget.dataset

    if (!item || !item.url) {
      wx.showToast({
        title: '新闻链接无效',
        icon: 'none'
      })
      return
    }

    // 添加触觉反馈
    wx.vibrateShort({
      type: 'light'
    })

    // 跳转到新闻详情页
    wx.navigateTo({
      url: `/pages/news-detail/news-detail?url=${encodeURIComponent(item.url)}`
    })
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadNews().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底
   */
  onReachBottom() {
    wx.showToast({
      title: '没有更多了',
      icon: 'none'
    })
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack()
  }
})
