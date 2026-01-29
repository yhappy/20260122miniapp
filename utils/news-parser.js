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
      title: '',
      content: '',
      pubtime: '',
      author: '',
      source: '',
      editor: '',
      url: url
    }

    // 提取标题 - 在 cont_head 里面
    const contHeadRegex = /<div[^>]*class="cont-head"[^>]*>[\s\S]*?)<\/div>/i
    const contHeadMatch = html.match(contHeadRegex)

    if (contHeadMatch) {
      const contHeadHTML = contHeadMatch[1]
      // 提取标题（通常在 h1 标签中）
      const titleRegex = /<h1[^>]*>(.*?)<\/h1>/i
      const titleMatch = contHeadHTML.match(titleRegex)
      if (titleMatch) {
        article.title = titleMatch[1]
          .replace(/<[^>]+>/g, '') // 移除HTML标签
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim()
      }
    }

    // 提取正文 - 在 cont-news 里面，只提取 p 标签内容
    const contNewsRegex = /<div[^>]*class="cont-news"[^>]*>[\s\S]*?<\/div>/i
    const contNewsMatch = html.match(contNewsRegex)

    if (contNewsMatch) {
      const contNewsHTML = contNewsMatch[1]

      // 只提取 p 标签的内容
      const pTagRegex = /<p[^>]*>(.*?)<\/p>/gi
      const paragraphs = []
      let pMatch

      while ((pMatch = pTagRegex.exec(contNewsHTML)) !== null) {
        const paragraph = pMatch[1]
          // 移除 p 标签内的其他 HTML 标签
          .replace(/<[^>]+>/g, '')
          // 替换 HTML 实体
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&mdash;/g, '—')
          .replace(/&ldquo;/g, '"')
          .replace(/&rdquo;/g, '"')
          .trim()

        // 只添加非空段落
        if (paragraph) {
          paragraphs.push(paragraph)
        }
      }

      // 用换行符连接所有段落
      article.content = paragraphs.join('\n\n')
    }

    // 提取元信息
    // 发布时间
    const pubtimeRegex = /<span[^>]*id="pubtime_baidu"[^>]*>(.*?)<\/span>/i
    const pubtimeMatch = html.match(pubtimeRegex)
    if (pubtimeMatch) {
      article.pubtime = pubtimeMatch[1]
        .replace(/&nbsp;/g, '')
        .trim()
    }

    // 作者
    const authorRegex = /<span[^>]*id="author_baidu"[^>]*>(.*?)<\/span>/i
    const authorMatch = html.match(authorRegex)
    if (authorMatch) {
      article.author = authorMatch[1]
        .replace(/作者：\s*/, '')
        .replace(/&nbsp;/g, ' ')
        .trim()
    }

    // 来源
    const sourceRegex = /<span[^>]*id="source_baidu"[^>]*>(.*?)<\/span>/i
    const sourceMatch = html.match(sourceRegex)
    if (sourceMatch) {
      article.source = sourceMatch[1]
        .replace(/来源：\s*/, '')
        .replace(/&nbsp;/g, ' ')
        .trim()
    }

    // 责任编辑
    const editorRegex = /<span[^>]*id="editor_baidu"[^>]*>(.*?)<\/span>/i
    const editorMatch = html.match(editorRegex)
    if (editorMatch) {
      article.editor = editorMatch[1]
        .replace(/责任编辑：\s*/, '')
        .replace(/&nbsp;/g, ' ')
        .trim()
    }

    console.log('成功解析新闻详情：', article)
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
