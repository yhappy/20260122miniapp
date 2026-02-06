# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供项目指导。

## 项目概述

这是一个微信小程序项目——"城市探索",专注于福建省城市的展示与探索。项目使用微信小程序原生框架开发,展示福建省9个地级市和平潭综合实验区的文化、新闻和地理信息。

### 核心功能
- **封面动画**:多层图片动画效果展示
- **城市选择**:福建省10个区域(9市+平潭)的交互式地图
- **景点展示**:每个城市包含多个景点,支持查看详情和导航
- **新闻资讯**:从东南网专题页面实时抓取新闻内容
- **主题分类**:十大闽式生活主题分类浏览

## 开发环境

### 开发工具
- 微信开发者工具
- AppID: `wxf9e3b68a6cca198f`

### 编译配置 (project.config.json)
```json
{
  "es6": true,              // ES6 转换
  "minified": true,         // 代码压缩
  "minifyWXML": true,       // WXML 压缩
  "minifyWXSS": true,       // WXSS 压缩
  "enhance": true,          // 增强编译
  "lazyCodeLoading": "requiredComponents"  // 按需注入
}
```

### 代码规范
- Tab 大小: 2 空格
- 使用 ES6+ 语法
- 模块化: `module.exports` / `require()`

## 项目架构

### 页面流程图
```
封面页 (cover)
   ↓ 点击 s1p1
城市地图页 (home)
   ├─→ 点击城市标签 → 地图页 (map)
   └─→ 点击 s2p2 → 主题页 (themes)
       ↓ 点击主题
       新闻列表页 (news)
           ↓ 点击新闻项
           新闻详情页 (news-detail)
```

### 全局配置 (app.json)
- **入口页**: `pages/cover/cover`
- **组件框架**: glass-easel
- **按需加载**: requiredComponents

## 核心模块

### 1. 地图页模块 (pages/map/)

**架构特点**:配置驱动的城市景点展示系统

**关键文件**:
- `map.js` - 页面逻辑
- `config/city-config.js` - 城市配置数据

**城市配置结构**:
```javascript
{
  [cityKey]: {
    name: '城市名',
    titleImage: '标题图片URL',
    mapImage: '地图背景图片URL',
    textColumnsTop: '文字区域top值(rpx)',
    leftColumnCount: 左列景点数量,
    items: [{
      id: 景点ID,
      content: '景点名称',
      dot: {
        top: '标记点top值(rpx)',
        left: '标记点left值(rpx)'
      }
    }]
  }
}
```

**核心逻辑**:
1. 通过 URL 参数 `city` 加载对应城市配置
2. 动态计算返回按钮位置(基于状态栏高度)
3. 点击标记点时,使用 `spot-parser` 从远程获取详情
4. 支持导航、拨打电话、分享等功能

**坐标系统**:
- 使用 `rpx` 单位(750rpx = 屏幕宽度)
- 标记点通过绝对定位叠加在地图背景上

### 2. 新闻解析模块 (utils/news-parser.js)

**功能**:从东南网页面抓取和解析新闻内容

**核心函数**:

**fetchHTML(url)**
- 自动 HTTP → HTTPS 转换
- 返回 Promise<string>

**parseNewsList(html)**
- 解析 wap 版本新闻列表
- 目标结构: `<ul class="clear tuwenlist clearfix">`
- 提取: 图片URL、新闻链接、标题
- 清理 HTML 实体和标签
- 过滤无效标题(分页按钮等)
- 最多提取 200 条

**parseNewsDetail(html, url)**
- 提取区域: `<div class="phone_content">`
- 自动添加样式:
  - 图片: `max-width: 100%; height: auto; display: block;`
  - H1: 添加 `h1Class` 样式类
  - P: 添加 `pClass` 样式类
- 返回富文本 HTML 供 `<rich-text>` 组件渲染

**导出接口**:
```javascript
module.exports = {
  fetchHTML,
  parseNewsList,
  getNewsList,
  parseNewsDetail,
  getNewsDetail
}
```

### 3. 景点解析模块 (utils/spot-parser.js)

**功能**:从远程 HTML 提取景点详情数据

**目标结构**:表格单元格内的 `id` 属性
```html
<td id="dot-cover">...</td>
<td id="dot-title">...</td>
<td id="dot-contact">...</td>
<td id="dot-address">...</td>
<td id="dot-latitude">...</td>
<td id="dot-longitude">...</td>
<td id="dot-opening-hours">...</td>
<td id="dot-description">...</td>
```

**核心函数**:

**extractContentById(html, id)**
- 提取纯文本内容
- 移除所有 HTML 标签
- 替换 HTML 实体字符

**extractContentWithLineBreaks(html, id)**
- 保留段落换行
- 将 `</p>` 转换为 `\n`
- 清理多余空格

**parseSpotDetail(html)**
- 返回结构化对象
- 字段: cover, title, contact, address, latitude, longitude, openingHours, description

**使用示例** (map.js):
```javascript
const spotParser = require('../../utils/spot-parser')
const SPOT_DETAIL_URL = 'https://www.fjsen.com/wap/zhuanti/...'

spotParser.getSpotDetail(SPOT_DETAIL_URL)
  .then(spotDetail => {
    // 处理数据
  })
```

### 4. 主题页模块 (pages/themes/)

**功能**:十大闽式生活主题入口

**主题 ID 映射**:
```javascript
320551 → 观山阅海
320552 → 茶和天下
320553 → 福见好戏
320554 → 福地美食
320555 → 非遗国潮
320556 → 古厝新宿
320557 → 闽韵福游
320558 → 绿道慢活
320559 → 福海扬帆
320560 → 福祉绵延
```

**跳转逻辑**:
```javascript
wx.navigateTo({
  url: `/pages/news/news?themeId=${themeId}`
})
```

### 5. 新闻列表页 (pages/news/)

**数据源**:
```javascript
const newsUrl = `https://www.fjsen.com/wap/zhuanti/node_${themeId}.htm`
```

**降级策略**:
- 实时抓取失败时,使用本地测试数据
- 显示提示: "使用本地数据"

**下拉刷新**:支持 `onPullDownRefresh()`

### 6. 新闻详情页 (pages/news-detail/)

**URL 处理**:
```javascript
// 自动转换为 wap 版本
if (url.includes('www.fjsen.com/') && !url.includes('/wap/')) {
  wapUrl = url.replace('www.fjsen.com/', 'www.fjsen.com/wap/')
}
```

**渲染方式**:
- 使用 `<rich-text>` 组件渲染富文本
- 样式类在解析时自动注入

## UI 系统

### 图片资源

**CDN 地址**: `https://app5.fjsen.com/h5/20260122/images/`

**命名规范**:
```
s1p{编号}.{ext} - 封面页图片
s2p{编号}.{ext} - 首页图片
s3p{编号}.{ext} - 主题页图片
{城市名}.png - 城市标签(如:福州.png)
{城市名}title.png - 城市标题
{城市名}map.png - 城市地图背景
```

**图片模式**:
```xml
<image mode="aspectFill">  <!-- 裁剪填充 -->
<image mode="widthFix">    <!-- 宽度自适应,高度按比例 -->
```

### 布局系统

**全屏容器**:
```css
.container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
```

**绝对定位居中**:
```css
.element {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```

**Z-index 分层**:
- 0: 背景层
- 1-5: 内容层
- 6-8: 交互层
- 100+: 浮动按钮层

### 动画系统

**淡入动画**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animation {
  animation: fadeIn 2s ease-out 0s forwards;
}
```

**脉冲动画**:
```css
@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.9; }
}
```

**GPU 加速原则**:
- 优先使用 `transform` 和 `opacity`
- 避免动画 `left`/`top`

## 交互模式

### 页面跳转

**重定向(关闭当前页)**:
```javascript
wx.redirectTo({ url: '/pages/home/home' })
```

**导航(保留当前页)**:
```javascript
wx.navigateTo({
  url: `/pages/news/news?themeId=${themeId}`
})
```

**返回**:
```javascript
wx.navigateBack()
```

### 用户反馈

**触觉反馈**:
```javascript
wx.vibrateShort({ type: 'light' })
```

**加载提示**:
```javascript
wx.showLoading({ title: '加载中...', mask: true })
wx.hideLoading()
```

**Toast 提示**:
```javascript
wx.showToast({
  title: '操作成功',
  icon: 'success',
  duration: 2000
})
```

**模态对话框**:
```javascript
wx.showModal({
  title: '确认',
  content: '是否继续?',
  success: (res) => {
    if (res.confirm) { /* 确认 */ }
  }
})
```

### 导航功能

**打开微信地图**:
```javascript
wx.openLocation({
  latitude: 26.078379,
  longitude: 119.297252,
  name: '景点名称',
  address: '详细地址',
  scale: 18
})
```

**拨打电话**:
```javascript
wx.makePhoneCall({
  phoneNumber: '0591-12345678'
})
```

## 数据流

### 新闻数据流
```
东南网专题页
  ↓ wx.request
HTML 内容
  ↓ news-parser.getNewsList()
结构化新闻列表
  ↓ setData()
页面渲染
  ↓ 点击新闻
news-parser.getNewsDetail()
  ↓
富文本 HTML
  ↓ <rich-text>
详情页展示
```

### 景点数据流
```
map.js 传入 city 参数
  ↓
加载 city-config.js 配置
  ↓
渲染地图背景和标记点
  ↓ 点击标记点
spot-parser.getSpotDetail()
  ↓
远程 HTML 解析
  ↓
景点详情对象
  ↓ setData()
弹窗展示详情
  ↓ 点击导航
wx.openLocation()
```

### 页面间数据传递
```javascript
// 发送方
wx.navigateTo({
  url: `/pages/map/map?city=${cityKey}`
})

// 接收方
onLoad(options) {
  const cityKey = options.city
}
```

## 常用工具函数

### URL 编解码
```javascript
const encodedUrl = encodeURIComponent(url)
const decodedUrl = decodeURIComponent(encodedUrl)
```

### px 转 rpx
```javascript
const systemInfo = wx.getSystemInfoSync()
const rpxRatio = 750 / systemInfo.screenWidth
const rpxValue = pxValue * rpxRatio
```

### 获取状态栏高度
```javascript
const statusBarHeight = wx.getSystemInfoSync().statusBarHeight
```

## 开发注意事项

### 域名配置
- 需要在小程序后台配置合法域名
- 本地开发: "详情" → "本地设置" → 勾选"不校验合法域名"

### 网络请求
- 所有请求自动转换为 HTTPS
- 使用 `wx.request` 发起请求
- 超时时间: 默认 60秒

### 正则表达式技巧
```javascript
// 匹配 HTML 内容
const regex = /<div class="content">([\s\S]*?)<\/div>/

// 移除 HTML 标签
text.replace(/<[^>]+>/g, '')

// 替换 HTML 实体
text
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ')
```

### 调试技巧
1. 使用 `console.log` 输出调试信息
2. 开启"真机调试"测试实际设备
3. 使用"性能监控"检查流畅度
4. 临时边框: `border: 1rpx solid red`

### 性能优化
- 按需注入组件
- 代码压缩(WXML, WXSS, JS)
- 图片使用 CDN 加速
- 动画使用 GPU 加速属性
- 避免频繁 setData

### 常见问题

**图片不显示**
- 检查 URL 是否正确
- 确认域名已备案

**网络请求失败**
- 检查域名白名单
- 确认协议为 HTTPS

**动画卡顿**
- 使用 `transform` 代替 `left`/`top`
- 避免在动画中使用 `box-shadow`

**页面跳转失败**
- 检查 app.json 中是否注册页面
- 确认路径以 `/` 开头

## 代码示例

### 添加新城市配置

在 `pages/map/config/city-config.js` 中添加:

```javascript
const CITY_CONFIG = {
  // ... 现有城市
  newcity: {
    name: '新城',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/新城title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/新城map.png',
    textColumnsTop: '1150rpx',
    leftColumnCount: 5,
    items: [
      {
        id: 1,
        content: '景点名称',
        dot: { top: '500rpx', left: '400rpx' }
      }
      // ... 更多景点
    ]
  }
}
```

### 修改新闻源

编辑 `pages/news/news.js`:
```javascript
const NEWS_URL = 'https://your-news-source.com/list.htm'
```

确保 `news-parser.js` 的解析规则匹配新源。

### 自定义导航栏

页面配置 `*.json`:
```json
{
  "navigationStyle": "custom",
  "navigationBarTitleText": "页面标题"
}
```

WXML 添加返回按钮:
```xml
<view class="top-bar" style="top: {{backButtonTop}}rpx">
  <view class="back-btn" bindtap="goBack">
    <text>← 返回</text>
  </view>
</view>
```

JS 计算位置:


## 项目结构

```
├── app.js                  # 小程序入口
├── app.json                # 全局配置
├── project.config.json     # 项目配置
├── pages/                  # 页面目录
│   ├── cover/              # 封面页(入口)
│   ├── home/               # 城市选择页
│   ├── map/                # 地图景点页
│   │   └── config/
│   │       └── city-config.js  # 城市配置数据
│   ├── themes/             # 主题列表页
│   ├── news/               # 新闻列表页
│   └── news-detail/        # 新闻详情页
└── utils/                  # 工具模块
    ├── util.js             # 通用工具
    ├── news-parser.js      # 新闻解析器
    └── spot-parser.js      # 景点解析器
```
