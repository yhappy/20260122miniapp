/**
 * 新闻抓取和解析工具模块
 */

/**
 * 将 HTTP URL 转换为 HTTPS
 * @param {string} url - 原始URL
 * @returns {string} HTTPS URL
 */
function convertToHTTPS(url) {
  if (url && url.startsWith('http://')) {
    return url.replace('http://', 'https://')
  }
  return url
}

/**
 * 发起网络请求获取网页内容
 * @param {string} url - 请求的URL
 * @returns {Promise<string>} 返回HTML内容
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    // 自动将 HTTP 转换为 HTTPS
    const httpsUrl = convertToHTTPS(url)

    console.log('请求URL：', httpsUrl)

    wx.request({
      url: httpsUrl,
      method: 'GET',
      header: {
        'content-type': 'text/html'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`请求失败，状态码：${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 从HTML中提取新闻列表数据 - wap 版本
 * 结构：<ul class="clear tuwenlist clearfix"><li><a href="...">...</a></li></ul>
 * @param {string} html - HTML内容
 * @returns {Array} 新闻列表数组
 */
function parseNewsList(html) {
  const newsList = []

  try {
    console.log('开始解析 wap 版本新闻列表')

    // 匹配 <ul class="clear tuwenlist clearfix">
    const ulRegex = /<ul[^>]*class=["']clear tuwenlist clearfix["'][^>]*>[\s\S]*?<\/ul>/i
    const ulMatch = html.match(ulRegex)

    if (!ulMatch) {
      console.error('未找到 clear tuwenlist clearfix 区域')
      return []
    }

    const ulHTML = ulMatch[0]
    console.log('成功提取 tuwenlist 区域')

    // 匹配 <li><a href="完整链接"><img src="..."></a><h2><a href="完整链接">标题</a></h2></li>
    // 注意：标题中可能包含<br>标签，需要特殊处理
    const newsItemRegex = /<li[^>]*>\s*<a[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>\s*<h2[^>]*><a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a><\/h2>\s*<\/li>/gi

    let match
    let count = 0
    const maxCount = 200 // 最多提取200条新闻

    while ((match = newsItemRegex.exec(ulHTML)) !== null && count < maxCount) {
      const imgUrl = match[2]     // 图片URL
      const newsUrl = match[3]     // 新闻详情链接
      let title = match[4].trim()   // 新闻标题

      // 清理标题中的HTML标签和<br>标签
      title = title
        .replace(/<[^>]+>/g, '')     // 移除所有HTML标签
        .replace(/<br\s*\/?>/gi, '')  // 移除<br>和<br />
        .replace(/&nbsp;/g, ' ')       // 替换HTML实体
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&mdash;/g, '—')
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .trim()

      // 清理图片URL
      const cleanImgUrl = imgUrl.replace(/&amp;/g, '&')

      // 过滤掉无效标题
      if (title && title.length > 3 &&
          !title.includes('上一页') &&
          !title.includes('下一页') &&
          !title.includes('尾页') &&
          !title.match(/^[\d\s]+$/) &&
          !title.includes('更多>>') &&
          !title.includes('点击排行')) {

        newsList.push({
          id: Date.now() + count,
          title: title,
          url: newsUrl,         // 保存完整的新闻链接
          imgUrl: cleanImgUrl,    // 保存图片URL
          content: '',           // 列表页没有内容详情
        })
        console.log(`新闻 ${count + 1}:`, title)
        count++
      }
    }

    console.log('成功解析新闻数量：', newsList.length)

    return newsList

  } catch (error) {
    console.error('解析新闻列表失败：', error)
    return []
  }
}

/**
 * 从新闻URL中提取日期
 * @param {string} url - 新闻URL
 * @returns {string} 格式化的日期字符串
 */
function extractDateFromUrl(url) {
  try {
    // URL格式：https://www.fjsen.com/zhuanti/2026-01/05/content_32110035.htm
    const dateRegex = /\/(\d{4})-(\d{1,2})-(\d{1,2})\//
    const match = url.match(dateRegex)

    if (match) {
      const year = match[1]
      const month = match[2].padStart(2, '0')
      const day = match[3].padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    // 如果无法从URL提取，使用当前日期
    const now = new Date()
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
  } catch (error) {
    return '2026-01-05'
  }
}

/**
 * 备用方案：直接匹配连字符开头的新闻项
 * @param {string} html - HTML内容
 * @returns {Array} 新闻列表数组
 */
function parseNewsListFallback(html) {
  const newsList = []

  try {
    // 移除HTML标签，只保留文本内容
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')

    // 按行分割
    const lines = textContent.split('\n').filter(line => line.trim())

    let count = 0

    for (let line of lines) {
      line = line.trim()

      // 匹配：- 日期标题 格式
      const match = line.match(/^-\s*(\d{4}-\d{2}-\d{2})\s+(.+)$/)

      if (match && count < 100) {
        const date = match[1]
        const title = match[2].trim()

        if (title.length > 3 &&
            !title.includes('上一页') &&
            !title.includes('下一页') &&
            !title.match(/^\d+$/)) {

          newsList.push({
            id: Date.now() + count,
            title: title,
            content: '',
            time: `${date} ${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            author: '东南网',
            readCount: Math.floor(Math.random() * 5000) + 100
          })

          count++
        }
      }
    }

    console.log('备用方案解析新闻数量：', newsList.length)
    return newsList

  } catch (error) {
    console.error('备用方案解析失败：', error)
    return []
  }
}

/**
 * 获取新闻列表
 * @param {string} url - 新闻列表页URL
 * @returns {Promise<Array>} 新闻列表数组
 */
async function getNewsList(url) {
  try {
    // 显示加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 获取HTML内容
    const html = await fetchHTML(url)

    // 解析新闻列表
    const newsList = parseNewsList(html)

    // 隐藏加载提示
    wx.hideLoading()

    return newsList

  } catch (error) {
    wx.hideLoading()
    wx.showToast({
      title: '加载失败',
      icon: 'none'
    })
    console.error('获取新闻列表失败：', error)
    return []
  }
}

/**
 * 格式化新闻详情（模拟生成）
 * @param {string} title - 新闻标题
 * @returns {string} 新闻详情内容
 */
function generateNewsDetail(title) {
  return `【新闻详情】\n\n${title}\n\n这是从东南网厦门频道抓取的最新新闻。更多精彩内容，请访问原文链接查看。\n\n来源：东南网厦门频道`
}

/**
 * 解析新闻详情页
 * @param {string} html - HTML内容
 * @param {string} url - 新闻URL
 * @returns {Object} 新闻详情对象
 */
function parseNewsDetail(html, url) {
  try {
    const article = {
      content: ''  // 只保留富文本内容
    }

    // 提取 phone_content 区域的完整 HTML 内容
    const phoneContentRegex = /<div[^>]*class="phone_content"[^>]*>([\s\S]*?)<\/div>\s*<script[^>]*ipa_bottom\.js/i;
    const phoneContentMatch = html.match(phoneContentRegex)

    if (phoneContentMatch) {
      // 提取 HTML 内容并处理样式
      let content = phoneContentMatch[1].trim()

      // 1. 给所有图片添加内联样式
      content = content.replace(/<img([^>]*?)>/gi, (match, attrs) => {
        const imgStyle = 'max-width: 100%; height: auto; display: block;'
        if (attrs.includes('style=')) {
          return match.replace(/style=["']([^"']*)["']/i, (styleMatch, styleContent) => {
            return `style="${styleContent}; ${imgStyle}"`
          })
        } else {
          return `<img${attrs} style="${imgStyle}">`
        }
      })

      // 2. 给 h1 标签添加字体大小样式
      content = content.replace(/<h1([^>]*?)>/gi, (match, attrs) => {
        const h1Style = 'text-align: center;line-height: 50px;font-size: 24px;padding: 20px 0 0 0; font-weight: normal;'
        if (attrs.includes('style=')) {
          return `<h1 style="${h1Style}">`
        } else {
          return `<h1${attrs} style="${h1Style}">`
        }
      })

      // 3. 给 p 标签添加字体大小样式
      //  content = content.replace(/<p([^>]*?)>/gi, (match, attrs) => {
      //   const pStyle = 'text-indent: 2em; text-align: justify; margin-bottom: 15px;'
      //   if (attrs.includes('style=')) {
      //     return `<p style="${pStyle}">`
      //   } else {
      //     return `<p${attrs} style="${pStyle}">`
      //   }
      // })
    
      article.content = content
      console.log('成功提取 phone_content 内容', article)

    } else {
      console.warn('未找到 phone_content 区域')
    }

    console.log('成功解析新闻详情')
    return article

  } catch (error) {
    console.error('解析新闻详情失败：', error)
    return null
  }
}

/**
 * 获取新闻详情
 * @param {string} url - 新闻详情页URL
 * @returns {Promise<Object>} 新闻详情对象
 */
async function getNewsDetail(url) {
  try {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    const html = await fetchHTML(url)
    const article = parseNewsDetail(html, url)

    wx.hideLoading()

    return article

  } catch (error) {
    wx.hideLoading()
    wx.showToast({
      title: '加载失败',
      icon: 'none'
    })
    console.error('获取新闻详情失败：', error)
    return null
  }
}

module.exports = {
  fetchHTML,
  parseNewsList,
  getNewsList,
  generateNewsDetail,
  parseNewsDetail,
  getNewsDetail
}
