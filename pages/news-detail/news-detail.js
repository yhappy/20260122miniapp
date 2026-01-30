// pages/news-detail/news-detail.js
const newsParser = require('../../utils/news-parser.js')

Page({
  data: {
    article: {
      content: ''  // 只保留富文本内容
    },
    loading: true,
    error: false,
    backButtonTop: 0  // 返回按钮位置
  },

  onLoad(options) {
    const { url } = options

    if (!url) {
      this.setData({
        loading: false,
        error: true
      })
      wx.showToast({
        title: '缺少新闻链接',
        icon: 'none'
      })
      return
    }

    // 获取系统信息，计算返回按钮位置
    this.getSystemInfo()

    // 解码URL（可能被编码了）
    const newsUrl = decodeURIComponent(url)

    // 加载新闻详情
    this.loadNewsDetail(newsUrl)
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
   * 加载新闻详情
   */
  async loadNewsDetail(url) {
    try {
      this.setData({
        loading: true,
        error: false
      })

      // 转换 URL 为 wap 版本
      // 例如：https://www.fjsen.com/zhuanti/2026-01/05/content_32110286.htm
      // 转换为：https://www.fjsen.com/wap/zhuanti/2026-01/05/content_32110286.htm
      let wapUrl = url
      if (url.includes('www.fjsen.com/') && !url.includes('/wap/')) {
        wapUrl = url.replace('www.fjsen.com/', 'www.fjsen.com/wap/')
        console.log('转换 URL 为 wap 版本:', url, '->', wapUrl)
      }

      const article = await newsParser.getNewsDetail(wapUrl)
      console.log(article)
      if (article && article.content) {
        this.setData({
          article: article,
          loading: false,
          error: false
        })
      } else {
        throw new Error('解析失败')
      }

    } catch (error) {
      console.error('加载新闻详情失败：', error)
      this.setData({
        loading: false,
        error: true
      })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack()
  }
})
