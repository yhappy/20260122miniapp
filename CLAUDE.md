# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供项目指导。

## 项目概述

这是一个微信小程序项目——"城市探索"，专注于福建省城市的展示与探索。项目使用微信小程序原生框架开发，展示福建省9个地级市和平潭综合实验区的文化、新闻和地理信息。

### 核心功能
- 封面动画展示（多层图片动画效果）
- 福建省城市地图展示（闽A-闽K车牌代码标识）
- 新闻资讯聚合（从东南网厦门频道抓取）
- 地图定位与导航（微信地图组件）
- 主题分类浏览（十大主题分类）

## 技术架构

### 全局配置

**app.json** - 应用配置
```json
{
  "pages": [
    "pages/cover/cover",      // 封面页（首页）
    "pages/home/home",        // 城市地图页
    "pages/map/map",          // 地图导航页
    "pages/themes/themes",    // 主题列表页
    "pages/news/news",        // 新闻列表页
    "pages/news-detail/news-detail",  // 新闻详情页
    "pages/index/index",      // 默认示例页
    "pages/logs/logs"         // 日志页
  ],
  "window": {
    "navigationBarTitleText": "城市探索",
    "navigationBarTextStyle": "black",
    "navigationBarBackgroundColor": "#ffffff"
  },
  "componentFramework": "glass-easel",
  "lazyCodeLoading": "requiredComponents"
}
```

**project.config.json** - 编译配置
- ES6 转换：启用
- 代码压缩：启用（WXML、WXSS、JS）
- 增强编译：启用
- Tab 大小：2 空格

## 页面架构

### 1. 封面页 (Cover) - `pages/cover/`

**布局结构**
- 三层图片叠加系统
- 背景层：s1p15.jpg（全屏背景）
- 叠加层：s1p16.png、s1p3.png、s1p2.png（带入场动画）
- 交互层：s1p1.png（带呼吸动画，点击跳转）
- 底部装饰：s1p14.png（固定底部）

**动画模式**
- `fadeIn` - 淡入效果（2秒，0秒延迟）
- `rotateIn` - 旋转出现（1秒，1秒延迟）
- `slideUpFadeIn` - 从下到上淡入（1秒，2秒延迟）
- `pulse` - 呼吸脉冲效果（2秒循环，3秒后开始）

**交互逻辑**
```javascript
onS1P1Click() {
  wx.vibrateShort({ type: 'light' })  // 触觉反馈
  wx.redirectTo({ url: '/pages/home/home' })  // 重定向跳转
}
```

### 2. 城市地图页 (Home) - `pages/home/`

**布局结构**
- 相同背景：s1p15.jpg
- 装饰元素：6张叠加图片（s2p3-s2p9）
- **城市标签系统**：10个城市标签（福建9市+平潭）

**城市标签与车牌代码映射**
```
福州 (闽A) - fuzhou      - 0-1秒闪烁
莆田 (闽B) - putian       - 1-2秒闪烁
泉州 (闽C) - quanzhou     - 2-3秒闪烁
厦门 (闽D) - xiamen       - 3-4秒闪烁
漳州 (闽E) - zhangzhou    - 4-5秒闪烁
龙岩 (闽F) - longyan      - 5-6秒闪烁
三明 (闽G) - sanming      - 6-7秒闪烁
南平 (闽H) - nanping      - 7-8秒闪烁
宁德 (闽J) - ningde       - 8-9秒闪烁
平潭 (闽K) - pingtan      - 9-10秒闪烁
```

**动画模式**
- `fadeIn` - 淡入（各城市错开0.15秒）
- `{city}Blink` - 城市循环闪烁（10秒循环，每城市1秒）
- `cloudFloat` - 云彩漂浮（上下左右轻微浮动）

**定位模式**
- 使用绝对定位（`position: absolute`）
- 水平居中：`left: 50%; transform: translateX(-50%)`
- Z-index分层：0-8层

### 3. 地图页 (Map) - `pages/map/`

**地图组件**
```javascript
<map
  latitude="{{latitude}}"    // 纬度：26.082018
  longitude="{{longitude}}"  // 经度：119.296438
  markers="{{markers}}"      // 标记点
  show-location="{{true}}"   // 显示当前位置
  bindmarkertap="onMarkerTap"
/>
```

**覆盖层按钮**
- 返回按钮（左上角）
- 定位按钮（底部居中）
- 导航按钮（底部居中）

**导航功能**
```javascript
openWeChatLocation() {
  wx.openLocation({
    latitude, longitude, name, address, scale: 18
  })
}
```

### 4. 主题页 (Themes) - `pages/themes/`

**十大主题分类**
1. 历史文化 (🏛️) - 128篇
2. 美食探索 (🍜) - 256篇
3. 艺术展览 (🎭) - 89篇
4. 自然风光 (🏞️) - 167篇
5. 购物攻略 (🛍️) - 201篇
6. 娱乐休闲 (🎪) - 145篇
7. 建筑之美 (🏗️) - 78篇
8. 交通出行 (🚇) - 92篇
9. 教育培训 (🎓) - 134篇
10. 职场发展 (💼) - 178篇

**列表结构**
- 使用 `scroll-view` 实现垂直滚动
- 点击跳转到新闻列表页（带 themeId 参数）

### 5. 新闻列表页 (News) - `pages/news/`

**数据源**
- 来源：东南网厦门频道 (https://xm.fjsen.com/node_163616.htm)
- 实时抓取：使用 `news-parser.js` 工具模块

**加载策略**
```javascript
async loadNews() {
  try {
    const newsList = await newsParser.getNewsList(NEWS_URL)
    if (newsList.length > 0) {
      this.setData({ newsList, loading: false })
    } else {
      this.useFallbackData()  // 降级到测试数据
    }
  } catch (error) {
    this.useFallbackData()  // 降级到测试数据
  }
}
```

**状态管理**
- `loading` - 加载中状态
- `error` - 错误状态
- `newsList` - 新闻列表数据

### 6. 新闻详情页 (News-Detail) - `pages/news-detail/`

**数据结构**
```javascript
{
  title: '',      // 标题
  content: '',    // 正文（分段落）
  pubtime: '',    // 发布时间
  author: '',     // 作者
  source: '',     // 来源
  editor: '',     // 责编
  url: ''         // 原文链接
}
```

**元信息提取**
- 发布时间：`<span id="pubtime_baidu">`
- 作者：`<span id="author_baidu">`
- 来源：`<span id="source_baidu">`
- 责编：`<span id="editor_baidu">`

## 工具模块

### news-parser.js - 新闻解析器

**核心功能**
1. **fetchHTML(url)** - 获取网页HTML
   - 自动转换 HTTP → HTTPS
   - 使用 `wx.request` 发起请求

2. **parseNewsList(html)** - 解析新闻列表
   - 提取 `.cont-left` 区域
   - 匹配 `<li><span>日期</span><a href="...">标题</a></li>` 格式
   - 过滤无效标题（翻页按钮、纯数字等）
   - 最多提取200条新闻

3. **parseNewsDetail(html, url)** - 解析新闻详情
   - 提取标题：`.cont-head h1`
   - 提取正文：`.cont-news p` 标签
   - 提取元信息：通过 id 选择器

4. **HTML 清理**
   - 移除零宽字符：`&ZeroWidthSpace;`
   - 替换 HTML 实体：`&nbsp;`, `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&mdash;`, `&ldquo;`, `&rdquo;`
   - 移除 HTML 标签

**导出接口**
```javascript
module.exports = {
  fetchHTML,
  parseNewsList,
  getNewsList,
  parseNewsDetail,
  getNewsDetail
}
```

### util.js - 通用工具

**formatTime(date)** - 时间格式化
```javascript
formatTime(new Date())  // "2026/01/29 14:30:45"
```

## 样式系统

### 单位系统
- `rpx` - 响应式像素（750rpx = 屏幕宽度）
- `vh` - 视口高度（100vh = 全屏）

### 布局模式

**1. 全屏容器**
```css
.container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**2. 绝对定位居中**
```css
.element {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

**3. 绝对定位水平居中**
```css
.element {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```

**4. Z-index 分层**
- 0 - 背景层
- 1-5 - 内容层
- 6-8 - 交互层
- 100+ - 浮动按钮层

### 动画库

**淡入动画**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: fadeIn 2s ease-out 0s forwards;
}
```

**脉冲动画**
```css
@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.9; }
}
```

**云彩漂浮动画**
```css
@keyframes cloudFloat {
  0% { transform: translateX(-50%) translateY(0) scale(1); }
  25% { transform: translateX(calc(-50% + 8rpx)) translateY(-5rpx) scale(1.01); }
  50% { transform: translateX(-50%) translateY(-8rpx) scale(1.02); }
  75% { transform: translateX(calc(-50% - 8rpx)) translateY(-5rpx) scale(1.01); }
  100% { transform: translateX(-50%) translateY(0) scale(1); }
}
```

**城市闪烁动画（10秒循环）**
```css
@keyframes fuzhouBlink {
  0%, 10% { opacity: 1; transform: translateX(-50%) scale(1); }
  5% { opacity: 0.5; transform: translateX(-50%) scale(1.15); }
  10%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
}
```

## 图片资源管理

### 图片托管
- **CDN地址**：`https://app5.fjsen.com/h5/20260122/images/`
- **命名规范**：
  - 封面图：s1p{编号}.{扩展名}
  - 首页图：s2p{编号}.{扩展名}
  - 城市标签：{城市名}.png（如：福州.png、厦门.png）
  - 功能图标：{功能名}.png（如：location.png、navigation.png）

### 图片模式
```xml
<image src="..." mode="aspectFill"></image>  <!-- 裁剪填充 -->
<image src="..." mode="widthFix"></image>    <!-- 宽度自适应 -->
```

### 图片分类

**封面页图片**
- s1p15.jpg - 全屏背景
- s1p16.png - 顶部标题
- s1p3.png - 装饰元素
- s1p2.png - 中部装饰
- s1p1.png - 交互按钮（带脉冲动画）
- s1p14.png - 底部装饰

**首页图片**
- s1p15.jpg - 背景（共用）
- s2p3-s2p9 - 装饰元素（6张）
- s2p1.png, s2p2.png - 底部按钮
- 10个城市标签图（福州.png - 平潭.png）

## 页面配置

### 导航栏样式
大部分页面使用自定义导航栏：
```json
{
  "navigationBarTitleText": "页面标题",
  "navigationStyle": "custom"
}
```

### 自定义顶部返回按钮
```xml
<view class="top-bar">
  <view class="back-btn" bindtap="goBack">
    <text class="back-icon">←</text>
    <text class="back-text">返回</text>
  </view>
</view>
```

```javascript
goBack() {
  wx.navigateBack()
}
```

## 交互模式

### 页面跳转

**重定向（关闭当前页）**
```javascript
wx.redirectTo({ url: '/pages/home/home' })
```

**导航（保留当前页）**
```javascript
wx.navigateTo({ url: `/pages/news/news?themeId=${themeId}` })
```

**返回**
```javascript
wx.navigateBack()
```

### 触觉反馈
```javascript
wx.vibrateShort({ type: 'light' })  // 轻震
```

### 提示信息
```javascript
wx.showToast({
  title: '加载中...',
  icon: 'none',
  duration: 2000
})

wx.showModal({
  title: '提示',
  content: '确认操作？',
  success: (res) => { if (res.confirm) { /* 确认 */ } }
})
```

### 加载状态
```javascript
wx.showLoading({ title: '加载中...', mask: true })
// ... 操作 ...
wx.hideLoading()
```

### 动态设置导航栏标题
```javascript
wx.setNavigationBarTitle({ title: '新闻详情' })
```

## 数据流

### 新闻数据流
```
东南网页面 → wx.request → HTML内容 → news-parser解析 → 结构化数据 → 页面渲染
```

### 页面间数据传递
```javascript
// 发送方
wx.navigateTo({
  url: `/pages/news/news?themeId=${themeId}`
})

// 接收方
onLoad(options) {
  const themeId = options.themeId
}
```

## 全局状态管理

### app.js
```javascript
App({
  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
```

### 访问全局数据
```javascript
const app = getApp()
const userInfo = app.globalData.userInfo
```

### 本地存储
```javascript
// 同步存储
wx.setStorageSync('logs', logs)
const logs = wx.getStorageSync('logs') || []

// 异步存储
wx.setStorage({ key: 'key', data: value })
wx.getStorage({ key: 'key', success: (res) => {} })
```

## 页面生命周期

```javascript
Page({
  onLoad(options) {
    // 页面加载（只触发一次）
  },
  onReady() {
    // 页面初次渲染完成（只触发一次）
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面卸载
  },
  onPullDownRefresh() {
    // 下拉刷新
  },
  onReachBottom() {
    // 上拉触底
  },
  onShareAppMessage() {
    // 分享
    return {
      title: '分享标题',
      path: '/pages/index/index'
    }
  }
})
```

## 开发注意事项

### API 调用限制
- 需要在小程序后台配置合法域名
- 本地开发可在"开发者工具"→"详情"→"本地设置"中勾选"不校验合法域名"

### 能力检测
```javascript
if (wx.canIUse('getUserProfile')) {
  // 支持该 API
}
```

### 模块化
- 使用 `module.exports` 导出
- 使用 `require()` 引入
- 相对路径使用 `./` 或 `../`

### 布局调试
- 使用 `border: 1rpx solid red` 临时边框查看元素范围
- 使用 `background-color` 检查层叠顺序

### 性能优化
- 按需注入：`lazyCodeLoading: "requiredComponents"`
- 代码压缩：`minified: true`
- 图片使用 CDN 加速
- 动画使用 GPU 加速（transform、opacity）

### 常见问题
1. **图片不显示**：检查图片 URL 是否正确、域名是否已备案
2. **网络请求失败**：检查域名是否已添加到后台"服务器域名"
3. **动画不流畅**：避免使用 `left`/`top` 动画，使用 `transform`
4. **页面跳转失败**：检查 app.json 中是否已注册该页面

## 项目结构总结

```
├── app.js                  # 小程序入口
├── app.json                # 全局配置
├── app.wxss                # 全局样式（空）
├── project.config.json     # 项目配置
├── sitemap.json            # 索引配置
├── pages/                  # 页面目录
│   ├── cover/              # 封面页（首页）
│   │   ├── cover.js
│   │   ├── cover.json      # 自定义导航栏
│   │   ├── cover.wxml
│   │   └── cover.wxss      # 动画系统
│   ├── home/               # 城市地图页
│   │   ├── home.js
│   │   ├── home.json
│   │   ├── home.wxml       # 10个城市标签
│   │   └── home.wxss       # 城市闪烁动画
│   ├── map/                # 地图导航页
│   │   ├── map.js          # 经纬度：26.082018, 119.296438
│   │   ├── map.json
│   │   ├── map.wxml        # map组件+cover-view
│   │   └── map.wxss
│   ├── themes/             # 主题列表页
│   │   ├── themes.js       # 10大主题数据
│   │   ├── themes.json
│   │   ├── themes.wxml     # scroll-view列表
│   │   └── themes.wxss
│   ├── news/               # 新闻列表页
│   │   ├── news.js         # 调用news-parser
│   │   ├── news.json       # 自定义导航栏
│   │   ├── news.wxml       # 新闻列表
│   │   └── news.wxss
│   ├── news-detail/        # 新闻详情页
│   │   ├── news-detail.js  # 解析新闻详情
│   │   ├── news-detail.json
│   │   ├── news-detail.wxml
│   │   └── news-detail.wxss
│   ├── index/              # 默认示例页（未使用）
│   └── logs/               # 日志页（未使用）
├── utils/                  # 工具模块
│   ├── util.js             # 时间格式化
│   └── news-parser.js      # 新闻解析器（HTML抓取）
└── images/                 # 本地图片（未使用）
```

## 快速开始

1. **克隆项目**
   ```bash
   git clone <repository>
   cd miniprogram-1
   ```

2. **开发工具**
   - 下载"微信开发者工具"
   - 导入项目目录
   - AppID：使用测试号或项目的 AppID

3. **修改图片资源**
   - 所有图片在 `https://app5.fjsen.com/h5/20260122/images/`
   - 修改需要同步更新 CDN 上的图片

4. **修改新闻源**
   - 编辑 `pages/news/news.js` 中的 `NEWS_URL`
   - 确保 `news-parser.js` 的解析规则匹配新源

5. **调试技巧**
   - 使用 `console.log` 输出调试信息
   - 开启"真机调试"测试实际设备表现
   - 使用"性能监控"检查流畅度