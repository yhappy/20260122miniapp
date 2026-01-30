// pages/map/map.js

// 城市配置数据
const CITY_CONFIG = {
  fuzhou: {
    name: '福州',
    code: '闽A',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/福州title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/福州map.png',
    textColumnsTop: '1050rpx', // 底部文字区域的top值
    leftColumnCount: 8, // 左列文字条目数
    dots: [{
        id: 1,
        top: '550rpx',
        left: '35%'
      },
      {
        id: 2,
        top: '650rpx',
        left: '50%'
      },
      {
        id: 3,
        top: '750rpx',
        left: '60%'
      },
      {
        id: 4,
        top: '580rpx',
        left: '45%'
      },
      {
        id: 5,
        top: '700rpx',
        left: '55%'
      },
      {
        id: 6,
        top: '800rpx',
        left: '40%'
      }
    ],
    texts: [{
        id: 1,
        content: '福州鼓岭·柱里'
      },
      {
        id: 2,
        content: '福州连江奇达村旗冠顶'
      },
      {
        id: 3,
        content: '晋安区春伦生态茶园'
      },
      {
        id: 4,
        content: '鼓楼区闽一口茶点茶馆'
      },
      {
        id: 5,
        content: '"周末戏相逢"公益性演出（福州西湖）'
      },
      {
        id: 6,
        content: '《冷月无声——吴石传奇》沉浸式戏剧'
      },
      {
        id: 7,
        content: '《最忆船政》实景演艺项目'
      },
      {
        id: 8,
        content: '福州达明美食街（台湾主题街区）'
      },
      {
        id: 9,
        content: '福建民俗博物馆"二十四节气里的闽式生活"'
      },
      {
        id: 10,
        content: '福州漆艺基地·闽漆胶囊工场'
      },
      {
        id: 11,
        content: '仓山区螺洲古镇'
      },
      {
        id: 12,
        content: '三坊七巷·山海福厝'
      },
      {
        id: 13,
        content: '烟台山亭下路'
      },
      {
        id: 14,
        content: '福道'
      },
      {
        id: 15,
        content: '中国船政文化博物馆'
      },
      {
        id: 16,
        content: '吴石故居（仓山区吴厝村）'
      },
      {
        id: 17,
        content: '林则徐纪念馆'
      }
    ]
  },
  xiamen: {
    name: '厦门',
    code: '闽D',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/厦门title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/厦门map.png',
    textColumnsTop: '900rpx', // 底部文字区域的top值
    leftColumnCount: 1, // 左列文字条目数
    dots: [{
        id: 1,
        top: '550rpx',
        left: '40%'
      },
      {
        id: 2,
        top: '650rpx',
        left: '50%'
      }
    ],
    texts: [{
        id: 1,
        content: '鼓浪屿'
      },
      {
        id: 2,
        content: '南普陀寺'
      }
    ]
  }
  // 其他城市配置可以在此添加
}

Page({
  data: {
    backButtonTop: 0, // 返回按钮位置
    currentCity: 'fuzhou', // 当前城市
    cityConfig: null, // 当前城市配置
    cities: [{
        id: 1,
        name: '福州',
        code: '闽A',
        key: 'fuzhou',
        image: 'https://app5.fjsen.com/h5/20260122/images/福州.png'
      },
      {
        id: 2,
        name: '莆田',
        code: '闽B',
        key: 'putian',
        image: 'https://app5.fjsen.com/h5/20260122/images/莆田.png'
      },
      {
        id: 3,
        name: '泉州',
        code: '闽C',
        key: 'quanzhou',
        image: 'https://app5.fjsen.com/h5/20260122/images/泉州.png'
      },
      {
        id: 4,
        name: '厦门',
        code: '闽D',
        key: 'xiamen',
        image: 'https://app5.fjsen.com/h5/20260122/images/厦门.png'
      },
      {
        id: 5,
        name: '漳州',
        code: '闽E',
        key: 'zhangzhou',
        image: 'https://app5.fjsen.com/h5/20260122/images/漳州.png'
      },
      {
        id: 6,
        name: '龙岩',
        code: '闽F',
        key: 'longyan',
        image: 'https://app5.fjsen.com/h5/20260122/images/龙岩.png'
      },
      {
        id: 7,
        name: '三明',
        code: '闽G',
        key: 'sanming',
        image: 'https://app5.fjsen.com/h5/20260122/images/三明.png'
      },
      {
        id: 8,
        name: '南平',
        code: '闽H',
        key: 'nanping',
        image: 'https://app5.fjsen.com/h5/20260122/images/南平.png'
      },
      {
        id: 9,
        name: '宁德',
        code: '闽J',
        key: 'ningde',
        image: 'https://app5.fjsen.com/h5/20260122/images/宁德.png'
      },
      {
        id: 10,
        name: '平潭',
        code: '闽K',
        key: 'pingtan',
        image: 'https://app5.fjsen.com/h5/20260122/images/平潭.png'
      }
    ]
  },

  onLoad(options) {
    // 获取传入的城市参数，默认为福州
    const cityKey = options.city || 'fuzhou'
    console.log('当前城市:', cityKey)

    // 加载城市配置
    this.loadCityConfig(cityKey)

    // 获取系统信息，计算返回按钮位置
    this.getSystemInfo()
  },

  /**
   * 加载城市配置
   */
  loadCityConfig(cityKey) {
    const config = CITY_CONFIG[cityKey]

    if (!config) {
      console.warn('未找到城市配置:', cityKey, '使用默认配置（福州）')
      // 如果没有配置，使用福州作为默认
      const defaultConfig = CITY_CONFIG.fuzhou
      this.setData({
        cityConfig: defaultConfig,
        currentCity: 'fuzhou',
        leftColumnCount: defaultConfig.leftColumnCount || Math.ceil(defaultConfig.texts.length / 2)
      })
      wx.setNavigationBarTitle({
        title: defaultConfig.name
      })
      return
    }

    // 使用配置中的 leftColumnCount，如果没有配置则自动计算
    const leftColumnCount = config.leftColumnCount || Math.ceil(config.texts.length / 2)

    this.setData({
      cityConfig: config,
      currentCity: cityKey,
      leftColumnCount: leftColumnCount
    })

    wx.setNavigationBarTitle({
      title: config.name
    })

    console.log('加载城市配置:', config, '左列条目数:', leftColumnCount)
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
   * 点击城市
   */
  onCityTap(e) {
    const city = e.currentTarget.dataset.city
    console.log('点击了城市:', city)

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    })

    // 如果点击的是当前城市，不做处理
    if (city.key === this.data.currentCity) {
      wx.showToast({
        title: `当前已是${city.name}`,
        icon: 'none',
        duration: 1500
      })
      return
    }

    // 切换到新城市
    wx.showModal({
      title: '切换城市',
      content: `是否切换到${city.name}？`,
      success: (res) => {
        if (res.confirm) {
          this.loadCityConfig(city.key)
          wx.showToast({
            title: `已切换到${city.name}`,
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack()
  }
})