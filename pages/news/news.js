// pages/news/news.js
const newsParser = require('../../utils/news-parser.js')

const NEWS_URL = 'https://xm.fjsen.com/node_163616.htm'

Page({
  data: {
    newsList: [],
    loading: false,
    error: false
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '新闻资讯'
    })

    // 加载新闻数据
    this.loadNews()
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

      // 使用封装的函数获取新闻列表
      const newsList = await newsParser.getNewsList(NEWS_URL)

      if (newsList.length > 0) {
        this.setData({
          newsList: newsList,
          loading: false
        })
      } else {
        // 如果没有获取到数据，使用测试数据
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
    const fallbackNews = [
      {
        id: Date.now(),
        title: '无法加载在线新闻，显示测试数据',
        content: '请检查网络连接或稍后重试',
        time: new Date().toISOString().split('T')[0] + ' 10:00',
        author: '系统提示',
        readCount: 0
      }
    ]

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
    const { item } = e.currentTarget.dataset

    if (!item || !item.url) {
      wx.showToast({
        title: '新闻链接无效',
        icon: 'none'
      })
      return
    }

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
      title: '没有更多新闻了',
      icon: 'none'
    })
  }
})
