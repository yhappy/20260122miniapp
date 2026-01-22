// pages/news-detail/news-detail.js
const newsParser = require('../../utils/news-parser.js')

Page({
  data: {
    article: {
      title: '',
      content: '',
      pubtime: '',
      author: '',
      source: '',
      editor: '',
      url: ''
    },
    loading: true,
    error: false
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

    // 解码URL（可能被编码了）
    const newsUrl = decodeURIComponent(url)

    this.setData({
      'article.url': newsUrl
    })

    // 加载新闻详情
    this.loadNewsDetail(newsUrl)
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

      const article = await newsParser.getNewsDetail(url)

      if (article) {
        this.setData({
          article: article,
          loading: false,
          error: false
        })

        // 设置导航栏标题
        wx.setNavigationBarTitle({
          title: '新闻详情'
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
   * 在浏览器中打开原文
   */
  openInBrowser() {
    const { url } = this.data.article

    if (url) {
      wx.showModal({
        title: '提示',
        content: '是否在浏览器中打开原文？',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '功能开发中',
              icon: 'none'
            })
          }
        }
      })
    }
  },

  /**
   * 分享新闻
   */
  onShareAppMessage() {
    const { title } = this.data.article
    return {
      title: title || '新闻详情',
      path: '/pages/news/news'
    }
  }
})
