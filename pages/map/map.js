// pages/map/map.js
Page({
  data: {
    latitude: 26.082018,
    longitude: 119.296438,
    name: '鼓楼区闽一口茶点茶馆',
    address: '福建省福州市鼓楼区南街街道三坊七巷文儒坊8号',
    markers: [
      {
        id: 1,
        latitude: 26.082018,
        longitude: 119.296438,
        title: '鼓楼区闽一口茶点茶馆',
        iconPath: '',
        width: 30,
        height: 30,
        callout: {
          content: '鼓楼区闽一口茶点茶馆',
          color: '#333',
          fontSize: 14,
          borderRadius: 5,
          bgColor: '#fff',
          padding: 8,
          display: 'ALWAYS'
        }
      }
    ],
    polyline: []
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '鼓楼区闽一口茶点茶馆'
    })

    // 获取当前位置并移动到 
    this.moveToLocation()
  },

  onUnload() {
    // 页面卸载时恢复导航栏
    wx.showNavigationBar()
  },

  moveToLocation() {
    this.setData({
      latitude: 26.0808,
      longitude: 119.2965
    })
  },
 

  // 使用微信内置地图导航
  openWeChatLocation() {
    const { latitude, longitude, name, address } = this.data

    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: name,
      address: address,
      scale: 18
    })
  },

  onMarkerTap(e) {
    return
    const { markerId } = e.detail
    wx.showModal({
      title: '三坊七巷',
      content: '三坊七巷是国家5A级旅游景区，被誉为"里坊制度活化石"、"明清建筑博物馆"',
      confirmText: '去这里',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          this.openWeChatLocation()
        }
      }
    })
  },

  onRegionChange(e) {
    console.log('地图区域变化', e)
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack()
  }
})
