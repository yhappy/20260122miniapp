// pages/map/map.js

// 引入景点解析器
const spotParser = require('../../utils/spot-parser')

// 景点详情URL模板（每个景点对应不同的URL）
const SPOT_DETAIL_URL = 'https://www.fjsen.com/wap/zhuanti/2026-02/05/content_32129000.htm'

// 城市配置数据
const {
  CITY_CONFIG
} = require('./config/city-config')

Page({
  data: {
    backButtonTop: 0, // 返回按钮位置
    currentCity: 'fuzhou', // 当前城市
    cityConfig: null, // 当前城市配置
    showDetailPopup: false, // 是否显示详情弹窗
    selectedItem: null, // 当前选中的景点信息
    spotDetail: null, // 景点详情数据
    cities: [{
        id: 1,
        name: '福州',
        key: 'fuzhou',
        image: 'https://app5.fjsen.com/h5/20260122/images/福州.png'
      },
      {
        id: 2,
        name: '厦门',
        key: 'xiamen',
        image: 'https://app5.fjsen.com/h5/20260122/images/厦门.png'
      },
      {
        id: 3,
        name: '漳州',
        key: 'zhangzhou',
        image: 'https://app5.fjsen.com/h5/20260122/images/漳州.png'
      },
      {
        id: 4,
        name: '泉州',
        key: 'quanzhou',
        image: 'https://app5.fjsen.com/h5/20260122/images/泉州.png'
      },
      {
        id: 5,
        name: '三明',
        key: 'sanming',
        image: 'https://app5.fjsen.com/h5/20260122/images/三明.png'
      },
      {
        id: 6,
        name: '莆田',
        key: 'putian',
        image: 'https://app5.fjsen.com/h5/20260122/images/莆田.png'
      },
      {
        id: 7,
        name: '南平',
        key: 'nanping',
        image: 'https://app5.fjsen.com/h5/20260122/images/南平.png'
      },
      {
        id: 8,
        name: '龙岩',
        key: 'longyan',
        image: 'https://app5.fjsen.com/h5/20260122/images/龙岩.png'
      },
      {
        id: 9,
        name: '宁德',
        key: 'ningde',
        image: 'https://app5.fjsen.com/h5/20260122/images/宁德.png'
      },
      {
        id: 10,
        name: '平潭',
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
        leftColumnCount: defaultConfig.leftColumnCount || Math.ceil(defaultConfig.items.length / 2)
      })
      wx.setNavigationBarTitle({
        title: defaultConfig.name
      })
      return
    }

    // 使用配置中的 leftColumnCount，如果没有配置则自动计算
    const leftColumnCount = config.leftColumnCount || Math.ceil(config.items.length / 2)

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
      return
    }

    // 切换到新城市
    this.loadCityConfig(city.key)
  },

  /**
   * 点击地图标记点
   */
  onDotTap(e) {
    const item = e.currentTarget.dataset.item
    console.log('点击了标记点:', item)

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    })

    // 显示加载提示
    wx.showLoading({
      title: '加载中...',
      mask: false
    })

    // 从远程获取景点详情数据
    spotParser.getSpotDetail(SPOT_DETAIL_URL)
      .then(spotDetail => {
        // 隐藏加载提示
        wx.hideLoading()

        // 调试日志：检查解析后的数据
        console.log('解析后的 openingHours:', spotDetail.openingHours)
        console.log('openingHours 包含换行符:', spotDetail.openingHours.includes('\n'))

        // 显示详情弹窗，同时存储景点基础数据和详情数据
        this.setData({
          showDetailPopup: true,
          selectedItem: item,
          spotDetail: spotDetail
        })
      })
      .catch(err => {
        console.error('获取景点详情失败:', err)

        // 隐藏加载提示
        wx.hideLoading()

        // 显示错误提示
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none',
          duration: 2000
        })

        // 仍然显示弹窗，使用默认数据
        this.setData({
          showDetailPopup: true,
          selectedItem: item,
          spotDetail: null
        })
      })
  },

  /**
   * 关闭详情弹窗
   */
  closeDetailPopup() {
    console.log('关闭详情弹窗')

    this.setData({
      showDetailPopup: false
    })

    // 等待动画结束后再清空数据
    setTimeout(() => {
      this.setData({
        selectedItem: null
      })
    }, 300)
  },

  /**
   * 阻止事件冒泡（防止点击弹窗内容时关闭弹窗）
   */
  stopPropagation() {
    // 空函数，仅用于阻止事件冒泡
  },

  /**
   * 导航前往景点
   */
  navigateToSpot() {
    const item = this.data.selectedItem
    const spotDetail = this.data.spotDetail
    console.log('导航前往:', item, spotDetail)

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    })

    // 使用解析后的坐标数据，如果没有则使用默认值
    const latitude = spotDetail && spotDetail.latitude ? parseFloat(spotDetail.latitude) : 26.078379
    const longitude = spotDetail && spotDetail.longitude ? parseFloat(spotDetail.longitude) : 119.297252
    const name = spotDetail && spotDetail.title ? spotDetail.title : item.content
    const address = spotDetail && spotDetail.address ? spotDetail.address : '福州市鼓楼区澳门路1号'

    console.log('导航参数:', {
      latitude,
      longitude,
      name,
      address
    })

    // 使用微信内置地图导航
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: name,
      address: address,
      scale: 18,
      success: () => {
        console.log('打开地图成功')
      },
      fail: (err) => {
        console.error('打开地图失败:', err)
        wx.showToast({
          title: '打开地图失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 拨打电话
   */
  makePhoneCall() {
    const spotDetail = this.data.spotDetail
    const phoneNumber = spotDetail && spotDetail.contact ? spotDetail.contact : '0591-87622782'
    console.log('拨打电话:', phoneNumber)

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    })

    wx.showModal({
      title: '拨打电话',
      content: `是否拨打 ${phoneNumber}？`,
      confirmText: '拨打',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phoneNumber,
            success: () => {
              console.log('拨打电话成功')
            },
            fail: (err) => {
              console.error('拨打电话失败:', err)
              wx.showToast({
                title: '拨打失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },

  /**
   * 分享景点
   */
  onShareAppMessage() {
    const item = this.data.selectedItem
    const spotDetail = this.data.spotDetail
    console.log('分享景点:', item, spotDetail)

    return {
      title: spotDetail && spotDetail.title ? spotDetail.title : (item ? item.content : '林则徐纪念馆'),
      path: '/pages/map/map?city=' + (this.data.currentCity || 'fuzhou'),
      imageUrl: spotDetail && spotDetail.cover ? spotDetail.cover : 'https://www.fjsen.com/images/2026-01/05/32110370_5abbc451-3e99-4dfb-8178-c798a39c1c62copy.png',
      success: () => {
        console.log('分享成功')
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (err) => {
        console.error('分享失败:', err)
      }
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    const item = this.data.selectedItem
    const spotDetail = this.data.spotDetail
    console.log('分享到朋友圈:', item, spotDetail)

    return {
      title: spotDetail && spotDetail.title ? spotDetail.title + ' - 福州古厝的典型代表' : '林则徐纪念馆 - 福州古厝的典型代表',
      query: 'city=' + (this.data.currentCity || 'fuzhou'),
      imageUrl: spotDetail && spotDetail.cover ? spotDetail.cover : 'https://www.fjsen.com/images/2026-01/05/32110370_5abbc451-3e99-4dfb-8178-c798a39c1c62copy.png'
    }
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack()
  }
})