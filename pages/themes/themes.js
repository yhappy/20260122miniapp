// pages/themes/themes.js
Page({
  data: {
    themes: [
      {
        id: 1,
        icon: '🏛️',
        title: '历史文化',
        description: '探索城市的历史底蕴与文化传承',
        count: 128
      },
      {
        id: 2,
        icon: '🍜',
        title: '美食探索',
        description: '品味地道美食，发现味蕾惊喜',
        count: 256
      },
      {
        id: 3,
        icon: '🎭',
        title: '艺术展览',
        description: '精彩艺术展览，陶冶情操',
        count: 89
      },
      {
        id: 4,
        icon: '🏞️',
        title: '自然风光',
        description: '亲近自然，享受城市绿洲',
        count: 167
      },
      {
        id: 5,
        icon: '🛍️',
        title: '购物攻略',
        description: '购物指南，发现好物',
        count: 201
      },
      {
        id: 6,
        icon: '🎪',
        title: '娱乐休闲',
        description: '休闲娱乐，放松身心',
        count: 145
      },
      {
        id: 7,
        icon: '🏗️',
        title: '建筑之美',
        description: '欣赏城市建筑，感受设计魅力',
        count: 78
      },
      {
        id: 8,
        icon: '🚇',
        title: '交通出行',
        description: '便捷出行，畅游全城',
        count: 92
      },
      {
        id: 9,
        icon: '🎓',
        title: '教育培训',
        description: '学习充电，提升自我',
        count: 134
      },
      {
        id: 10,
        icon: '💼',
        title: '职场发展',
        description: '职业规划，助力成长',
        count: 178
      }
    ]
  },

  /**
   * 进入稿件列表页
   */
  goToNews(e) {
    const themeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/news/news?themeId=${themeId}`
    })
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack()
  }
})
