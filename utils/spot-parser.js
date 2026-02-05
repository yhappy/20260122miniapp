// utils/spot-parser.js
// 景点详情数据解析器

/**
 * 从远程URL获取HTML内容
 * @param {string} url - 目标URL
 * @returns {Promise<string>} HTML内容
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    // 将 HTTP 自动转换为 HTTPS
    const httpsUrl = url.replace(/^http:/i, 'https:')

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
        console.error('请求失败:', err)
        reject(err)
      }
    })
  })
}

/**
 * 从HTML中提取指定ID的内容
 * @param {string} html - HTML字符串
 * @param {string} id - 目标元素ID
 * @returns {string} 提取的内容
 */
function extractContentById(html, id) {
  // 匹配 id="xxx" 的内容
  const regex = new RegExp(`id="${id}"[^>]*>([\\s\\S]*?)<\\/td>`, 'i')
  const match = html.match(regex)

  if (match && match[1]) {
    // 提取纯文本，移除HTML标签
    let content = match[1]
      .replace(/<[^>]+>/g, '') // 移除HTML标签
      .replace(/&quot;/g, '"') // 替换 &quot; 为 "
      .replace(/&amp;/g, '&') // 替换 &amp; 为 &
      .replace(/&lt;/g, '<') // 替换 &lt; 为 <
      .replace(/&gt;/g, '>') // 替换 &gt; 为 >
      .replace(/&nbsp;/g, ' ') // 替换空格实体
      .replace(/\s+/g, ' ') // 合并多余空格
      .trim()

    return content
  }

  return ''
}

/**
 * 从HTML中提取指定ID的内容（保留p标签并换行）
 * @param {string} html - HTML字符串
 * @param {string} id - 目标元素ID
 * @returns {string} 提取的内容
 */
function extractContentWithLineBreaks(html, id) {
  // 匹配 id="xxx" 的内容
  const regex = new RegExp(`id="${id}"[^>]*>([\\s\\S]*?)<\\/td>`, 'i')
  const match = html.match(regex)

  if (match && match[1]) {
    // 提取内容，处理p标签
    let content = match[1]
      // 移除外层的td标签
      .replace(/<\/?td[^>]*>/gi, '')
      // 先移除<p>开始标签
      .replace(/<p[^>]*>/gi, '')
      // 再将</p>替换为换行
      .replace(/<\/p>/gi, '\n')
      // 替换HTML实体字符
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      // 只移除行首的空格，保留段落内的空格
      .split('\n')
      .map(line => line.trim())
      .join('\n')

    console.log(`提取的 ${id} 内容:`, JSON.stringify(content)) // 调试日志

    return content
  }

  return ''
}

/**
 * 从HTML中提取图片URL
 * @param {string} html - HTML字符串
 * @param {string} id - 目标元素ID
 * @returns {string} 图片URL
 */
function extractImageById(html, id) {
  const regex = new RegExp(`id="${id}"[^>]*>[\\s\\S]*?<img[^>]*src="([^"]+)"`, 'i')
  const match = html.match(regex)

  if (match && match[1]) {
    return match[1].trim()
  }

  return ''
}

/**
 * 解析景点详情数据
 * @param {string} html - HTML字符串
 * @returns {object} 解析后的景点数据
 */
function parseSpotDetail(html) {
  const data = {
    cover: extractImageById(html, 'dot-cover'),
    title: extractContentById(html, 'dot-title'),
    contact: extractContentById(html, 'dot-contact'),
    address: extractContentById(html, 'dot-address'),
    latitude: extractContentById(html, 'dot-latitude'),
    longitude: extractContentById(html, 'dot-longitude'),
    openingHours: extractContentWithLineBreaks(html, 'dot-opening-hours'), // 使用保留换行的方法
    description: extractContentWithLineBreaks(html, 'dot-description') // 使用保留换行的方法
  }

  console.log('解析后的景点数据:', data)

  return data
}

/**
 * 获取景点详情
 * @param {string} url - 景点详情URL
 * @returns {Promise<object>} 景点数据
 */
function getSpotDetail(url) {
  return fetchHTML(url)
    .then(html => {
      return parseSpotDetail(html)
    })
    .catch(err => {
      console.error('获取景点详情失败:', err)
      throw err
    })
}

module.exports = {
  fetchHTML,
  extractContentById,
  extractContentWithLineBreaks,
  extractImageById,
  parseSpotDetail,
  getSpotDetail
}
