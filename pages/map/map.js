// pages/map/map.js
Page({
  data: {
    backButtonTop: 0, // 返回按钮位置
    cities: [
      {
        id: 1,
        name: '福州',
        code: '闽A',
        image: 'https://app5.fjsen.com/h5/20260122/images/福州.png'
      },
      {
        id: 2,
        name: '莆田',
        code: '闽B',
        image: 'https://app5.fjsen.com/h5/20260122/images/莆田.png'
      },
      {
        id: 3,
        name: '泉州',
        code: '闽C',
        image: 'https://app5.fjsen.com/h5/20260122/images/泉州.png'
      },
      {
        id: 4,
        name: '厦门',
        code: '闽D',
        image: 'https://app5.fjsen.com/h5/20260122/images/厦门.png'
      },
      {
        id: 5,
        name: '漳州',
        code: '闽E',
        image: 'https://app5.fjsen.com/h5/20260122/images/漳州.png'
      },
      {
        id: 6,
        name: '龙岩',
        code: '闽F',
        image: 'https://app5.fjsen.com/h5/20260122/images/龙岩.png'
      },
      {
        id: 7,
        name: '三明',
        code: '闽G',
        image: 'https://app5.fjsen.com/h5/20260122/images/三明.png'
      },
      {
        id: 8,
        name: '南平',
        code: '闽H',
        image: 'https://app5.fjsen.com/h5/20260122/images/南平.png'
      },
      {
        id: 9,
        name: '宁德',
        code: '闽J',
        image: 'https://app5.fjsen.com/h5/20260122/images/宁德.png'
      },
      {
        id: 10,
        name: '平潭',
        code: '闽K',
        image: 'https://app5.fjsen.com/h5/20260122/images/平潭.png'
      }
    ]
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '城市地图'
    })

    // 获取系统信息，计算返回按钮位置
    this.getSystemInfo()
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

    // 显示提示
    wx.showToast({
      title: `选择了${city.name}（${city.code}）`,
      icon: 'none',
      duration: 2000
    })

    // TODO: 后续可以根据选择的城市显示地图或其他信息
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack()
  }
})
