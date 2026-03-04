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

    // 匹配 <li><a href="..."><img src="..."></a><h2><a href="...">标题</a></h2></li>
    // 图片是可选的,如果为空则使用默认图片
    const newsItemRegex = /<li[^>]*>\s*<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<h2[^>]*><a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a><\/h2>\s*<\/li>/gi

    let match
    let count = 0
    const maxCount = 200 // 最多提取200条新闻

    while ((match = newsItemRegex.exec(ulHTML)) !== null && count < maxCount) {
      const newsUrl1 = match[1] // 第一个<a>的href (可能是图片链接)
      const contentBetween = match[2] // <a>和<h2>之间的内容(可能包含img)
      const newsUrl2 = match[3] // 第二个<a>的href (新闻详情链接)
      const title = match[4].trim() // 新闻标题

      console.log(`第 ${count + 1} 次匹配 - 原始标题: ${title.substring(0, 50)}...`)

      // 从contentBetween中提取图片URL
      const imgMatch = contentBetween.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/i)
      let imgUrl = imgMatch ? imgMatch[1] : ''

      // 如果图片URL为空,使用默认图片
      if (!imgUrl) {
        imgUrl = 'https://app5.fjsen.com/h5/20260122/images/s2p3.png'
        console.log(`新闻 ${count + 1} 使用默认图片`)
      }

      // 清理标题中的HTML标签和<br>标签
      let cleanTitle = title
        .replace(/<[^>]+>/g, '') // 移除所有HTML标签
        .replace(/<br\s*\/?>/gi, '') // 移除<br>和<br />
        .replace(/&nbsp;/g, ' ') // 替换HTML实体
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&mdash;/g, '—')
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .trim()

      console.log(`第 ${count + 1} 次匹配 - 清理后标题: ${cleanTitle.substring(0, 50)}...`)

      // 清理图片URL
      const cleanImgUrl = imgUrl.replace(/&amp;/g, '&')

      // 检查标题是否是网址
      if (cleanTitle.startsWith('http://') || cleanTitle.startsWith('https://') || cleanTitle.startsWith('www.')) {
        console.log(`第 ${count + 1} 次匹配 - 标题是网址,跳过`)
        continue
      }

      // 过滤掉无效标题
      if (cleanTitle && cleanTitle.length > 3 &&
          !cleanTitle.includes('上一页') &&
          !cleanTitle.includes('下一页') &&
          !cleanTitle.includes('尾页') &&
          !cleanTitle.match(/^[\d\s]+$/) &&
          !cleanTitle.includes('更多>>') &&
          !cleanTitle.includes('点击排行')) {

        newsList.push({
          id: Date.now() + count,
          title: cleanTitle,
          url: newsUrl2, // 使用第二个<a>的href作为新闻链接
          imgUrl: cleanImgUrl, // 保存图片URL
          content: '', // 列表页没有内容详情
        })
        console.log(`✓ 添加新闻 ${count + 1}:`, cleanTitle)
        count++
      } else {
        console.log(`✗ 跳过第 ${count + 1} 次匹配: 标题不满足条件`)
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
      content: '' // 只保留富文本内容
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
        // 检查是否已经存在 class 属性
        if (/class=["']/.test(attrs)) {
          // 如果存在 class，就在原有的 class 属性值里追加 h1Class
          return match.replace(/class=(["'])(.*?)\1/, 'class=$1$2 h1Class$1');
        } else {
          // 如果不存在 class，直接添加 class="h1Class"
          return `<h1${attrs} class="h1Class">`;
        }
      });

      // 3. 给 p 标签添加字体大小样式
      content = content.replace(/<p([^>]*?)>/gi, (match, attrs) => {
        // 检查是否已经存在 class 属性
        if (/class=["']/.test(attrs)) {
          // 如果存在 class，就在原有的 class 值后面追加 pClass
          // 这里的正则会匹配 class="xxx" 或 class='xxx' 并替换为 class="xxx pClass"
          return match.replace(/class=(["'])(.*?)\1/, 'class=$1$2 pClass$1');
        } else {
          // 如果不存在 class，直接在属性后面添加 class="pClass"
          // 注意保留原有的其他属性（如 id, data-* 等）
          return `<p${attrs} class="pClass">`;
        }
      });

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

/**
 * 解析指定URL页面的 id="content" 区域内容
 * @param {string} url - 目标URL
 * @returns {Promise<Object>} 包含 content 字段的对象
 */
async function getContentById(url) {
  try {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    const html = await fetchHTML(url)

    console.log('HTML内容长度:', html.length)

    // 先尝试查找 id="content" 的位置
    const contentIndex = html.toLowerCase().indexOf('id="content"')
    console.log('找到 id="content" 的位置:', contentIndex)

    if (contentIndex === -1) {
      console.warn('HTML中不包含 id="content"')
      wx.hideLoading()
      return {
        content: '<div style="padding: 20rpx; color: #999;">未找到内容区域</div>'
      }
    }

    // 使用更可靠的方法：从 id="content" 开始，找到对应的结束标签
    // 1. 找到 <td id="content"> 的开始位置
    const tdStartRegex = /<td[^>]*id="content"[^>]*>/i;
    const tdStartMatch = html.match(tdStartRegex)

    if (!tdStartMatch) {
      console.warn('未找到 <td id="content"> 开始标签')
      wx.hideLoading()
      return {
        content: '<div style="padding: 20rpx; color: #999;">未找到内容区域</div>'
      }
    }

    const startIndex = html.indexOf(tdStartMatch[0])
    console.log('td 标签开始位置:', startIndex)

    // 2. 从开始位置向后查找对应的 </td>
    let currentIndex = startIndex + tdStartMatch[0].length
    let stack = 1 // 栈深度，用于匹配嵌套的 td
    let content = ''
    let foundEnd = false

    while (currentIndex < html.length && stack > 0) {
      const nextTdStart = html.indexOf('<td', currentIndex)
      const nextTdEnd = html.indexOf('</td>', currentIndex)

      if (nextTdEnd === -1) {
        // 没有找到结束标签，使用剩余所有内容
        content = html.substring(currentIndex)
        console.warn('未找到 </td> 结束标签，使用剩余内容')
        break
      }

      if (nextTdStart !== -1 && nextTdStart < nextTdEnd) {
        // 遇到嵌套的 td，增加栈深度
        stack++
        currentIndex = nextTdStart + 1
      } else {
        // 遇到 </td>，减少栈深度
        stack--
        if (stack === 0) {
          // 找到匹配的结束标签
          content = html.substring(currentIndex, nextTdEnd)
          foundEnd = true
          console.log('找到匹配的 </td> 标签，位置:', nextTdEnd)
        } else {
          currentIndex = nextTdEnd + 5 // 跳过 </td>
        }
      }
    }

    console.log('提取的原始内容长度:', content.length)
    console.log('原始内容前200字符:', content.substring(0, 200))

    // 3. 处理样式
    let processedContent = content.trim()

    // 1. 给所有图片添加内联样式
    processedContent = processedContent.replace(/<img([^>]*?)>/gi, (match, attrs) => {
      const imgStyle = 'max-width: 100%; height: auto; display: block; margin: 20rpx auto; border-radius: 8rpx;'
      if (attrs.includes('style=')) {
        return match.replace(/style=["']([^"']*)["']/i, (styleMatch, styleContent) => {
          return `style="${styleContent}; ${imgStyle}"`
        })
      } else {
        return `<img${attrs} style="${imgStyle}">`
      }
    })

    // 2. 给所有 p 标签添加内联样式
    processedContent = processedContent.replace(/<p([^>]*?)>/gi, (match, attrs) => {
      const pStyle = 'font-size: 28rpx; color: #333; line-height: 1.3; margin-bottom: 2px;'
      if (attrs.includes('style=')) {
        return match.replace(/style=["']([^"']*)["']/i, (styleMatch, styleContent) => {
          return `<p${attrs.replace(/style=["'][^"']*["']/i, '')} style="${styleContent}; ${pStyle}">`
        })
      } else {
        return `<p${attrs} style="${pStyle}">`
      }
    })

    // 3. 移除不需要的 div 和 textarea
    processedContent = processedContent.replace(/<div id="player"[^>]*>[\s\S]*?<\/div>/gi, '')
    processedContent = processedContent.replace(/<textarea[^>]*>[\s\S]*?<\/textarea>/gi, '')

    console.log('成功提取并处理 content 区域，最终长度:', processedContent.length)
    console.log('处理后内容前200字符:', processedContent.substring(0, 200))
    console.log('处理后内容后200字符:', processedContent.substring(Math.max(0, processedContent.length - 200)))

    wx.hideLoading()

    return {
      content: processedContent
    }

  } catch (error) {
    wx.hideLoading()
    console.error('获取 content 区域失败：', error)
    return {
      content: '<div style="padding: 20rpx; color: #999;">加载失败，请重试</div>'
    }
  }
}

module.exports = {
  fetchHTML,
  parseNewsList,
  getNewsList,
  generateNewsDetail,
  parseNewsDetail,
  getNewsDetail,
  getContentById
}