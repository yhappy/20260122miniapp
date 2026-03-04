// pages/news/news.js
const newsParser = require('../../utils/news-parser.js')

// 默认新闻源（厦门频道）
const DEFAULT_NEWS_URL = 'https://xm.fjsen.com/node_163616.htm'

Page({
  data: {
    newsList: [],
    loading: false,
    error: false,
    currentUrl: '', // 当前新闻URL
    backButtonTop: 0 // 返回按钮位置
  },

  onLoad(options) {
    // 获取主题ID参数
    const themeId = options.themeId || '320551' // 默认使用历史文化专题
    console.log('接收到的 themeId:', themeId)

    // 拼接专题网址 - 使用新的wap站点
    const newsUrl = `https://www.fjsen.com/wap/zhuanti/node_${themeId}.htm`
    console.log('拼接后的新闻URL:', newsUrl)

    // 保存到 data 中，供后续使用
    this.setData({
      currentUrl: newsUrl
    })

    // 获取系统信息，计算返回按钮位置
    this.getSystemInfo()

    // 根据主题ID设置不同的标题
    const themeTitles = {
      320551: '观山阅海',
      320552: '茶和天下',
      320553: '福见好戏',
      320554: '福地美食',
      320555: '非遗国潮',
      320556: '古厝新宿',
      320557: '闽韵福游',
      320558: '绿道慢活',
      320559: '福海扬帆',
      320560: '福祉绵延'
    }

    const title = themeTitles[themeId] || '闽式生活'

    wx.setNavigationBarTitle({
      title: title
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

      // 使用动态URL获取新闻列表
      const newsList = await newsParser.getNewsList(this.data.currentUrl)

      console.log('获取到的新闻:', newsList)

      if (newsList.length > 0) {
        // 加载特殊内容并插入到列表最前面
        await this.loadSpecialContentAndInsert(newsList)

        this.setData({
          newsList: newsList,
          loading: false
        })
      } else {
        // 如果没有获取到数据，使用测试数据
        console.warn('未获取到新闻数据，使用降级方案')
        this.useFallbackData()
      }

    } catch (error) {
      console.error('加载新闻失败：', error)
      this.useFallbackData()
    }
  },

  /**
   * 加载特殊内容并插入到新闻列表最前面
   */
  async loadSpecialContentAndInsert(newsList) {
    try {
      console.log('正在加载特殊内容...')

      // 固定URL获取 id="content" 区域的详细内容
      const specialContentUrl = 'https://www.fjsen.com/wap/zhuanti/2026-03/04/content_32143156.htm'
      console.log('请求URL:', specialContentUrl)

      // 使用新方法获取 content 区域
      const result = await newsParser.getContentById(specialContentUrl)

      console.log('获取结果:', result)
      console.log('内容长度:', result?.content?.length)

      if (result && result.content) {
        // 创建特殊的新闻项
        const specialItem = {
          id: 'special-' + Date.now(),
          title: '闽式生活·山海福建',  // 特殊标题
          specialContent: result.content,
          isSpecialItem: true,  // 标记为特殊项
          url: specialContentUrl  // 保留原始URL
        }

        // 插入到列表最前面
        newsList.unshift(specialItem)

        console.log('特殊内容插入成功，当前列表长度:', newsList.length)
        console.log('specialContent前200字符:', specialItem.specialContent.substring(0, 200))
      } else {
        console.warn('获取特殊内容失败，不插入特殊项')
      }
    } catch (error) {
      console.error('加载特殊内容失败：', error)
      // 失败时不插入特殊项，继续显示原有新闻列表
    }
  },

  /**
   * 从HTML中提取纯文本
   */
  extractPlainTextFromHTML(html) {
    if (!html) return ''

    // 移除所有HTML标签
    let text = html
      .replace(/<[^>]+>/g, '') // 移除HTML标签
      .replace(/&nbsp;/g, ' ') // 替换空格实体
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&mdash;/g, '—')
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')

    // 移除多余的空格和换行
    text = text
      .replace(/\s+/g, ' ')
      .trim()

    return text
  },

  /**
   * 使用测试数据作为后备
   */
  useFallbackData() {
    const fallbackNews = [{
      id: Date.now(),
      title: '无法加载在线新闻，显示测试数据',
      content: '请检查网络连接或稍后重试',
      time: new Date().toISOString().split('T')[0] + ' 10:00',
      author: '系统提示',
      readCount: 0
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
    return
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