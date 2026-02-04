// pages/map/map.js

// 城市配置数据
const CITY_CONFIG = {
  fuzhou: {
    name: '福州',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/福州title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/福州map.png',
    textColumnsTop: '1050rpx', // 底部文字区域的top值
    leftColumnCount: 8, // 左列文字条目数
    items: [{
        id: 1,
        content: '福州鼓岭·柱里',
        dot: {
          top: '540rpx',
          left: '530rpx'
        }
      },
      {
        id: 2,
        content: '福州连江奇达村旗冠顶',
        dot: {
          top: '490rpx',
          left: '600rpx'
        }
      },
      {
        id: 3,
        content: '晋安区春伦生态茶园',
        dot: {
          top: '530rpx',
          left: '400rpx'
        }
      },
      {
        id: 4,
        content: '鼓楼区闽一口茶点茶馆',
        dot: {
          top: '650rpx',
          left: '465rpx'
        }
      },
      {
        id: 5,
        content: '"周末戏相逢"公益性演出（福州西湖）',
        dot: {
          top: '420rpx',
          left: '400rpx'
        }
      },
      {
        id: 6,
        content: '《冷月无声——吴石传奇》沉浸式戏剧',
        dot: {
          top: '730rpx',
          left: '430rpx'
        }
      },
      {
        id: 7,
        content: '《最忆船政》实景演艺项目',
        dot: {
          top: '780rpx',
          left: '480rpx'
        }
      },
      {
        id: 8,
        content: '福州达明美食街（台湾主题街区）',
        dot: {
          top: '620rpx',
          left: '220rpx'
        }
      },
      {
        id: 9,
        content: '福建民俗博物馆"二十四节气里的闽式生活"',
        dot: {
          top: '450rpx',
          left: '270rpx'
        }
      },
      {
        id: 10,
        content: '福州漆艺基地·闽漆胶囊工场',
        dot: {
          top: '520rpx',
          left: '165rpx'
        }
      },
      {
        id: 11,
        content: '仓山区螺洲古镇',
        dot: {
          top: '920rpx',
          left: '530rpx'
        }
      },
      {
        id: 12,
        content: '三坊七巷·山海福厝',
        dot: {
          top: '820rpx',
          left: '340rpx'
        }
      },
      {
        id: 13,
        content: '烟台山亭下路',
        dot: {
          top: '760rpx',
          left: '270rpx'
        }
      },
      {
        id: 14,
        content: '福道',
        dot: {
          top: '650rpx',
          left: '75rpx'
        }
      },
      {
        id: 15,
        content: '中国船政文化博物馆',
        dot: {
          top: '710rpx',
          left: '510rpx'
        }
      },
      {
        id: 16,
        content: '吴石故居（仓山区吴厝村）',
        dot: {
          top: '790rpx',
          left: '70rpx'
        }
      },
      {
        id: 17,
        content: '林则徐纪念馆',
        dot: {
          top: '790rpx',
          left: '395rpx'
        }
      }
    ]
  },
  xiamen: {
    name: '厦门',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/厦门title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/厦门map.png',
    textColumnsTop: '1150rpx', // 底部文字区域的top值
    leftColumnCount: 5, // 左列文字条目数
    items: [{
        id: 1,
        content: '厦门同安环东浪漫线',
        dot: {
          top: '700rpx',
          left: '400rpx'
        }
      },
      {
        id: 2,
        content: '湖里区郑福星老茶故事馆',
        dot: {
          top: '1000rpx',
          left: '360rpx'
        }
      },
      {
        id: 3,
        content: '厦门金三都土笋冻体验店',
        dot: {
          top: '530rpx',
          left: '570rpx'
        }
      },
      {
        id: 4,
        content: '厦门 "屿见闽南·时光幻境"',
        dot: {
          top: '850rpx',
          left: '130rpx'
        }
      },
      {
        id: 5,
        content: '同安区同字厝',
        dot: {
          top: '450rpx',
          left: '200rpx'
        }
      },
      {
        id: 6,
        content: '思明区沙坡尾艺术街区避风坞',
        dot: {
          top: '930rpx',
          left: '310rpx'
        }
      },
      {
        id: 7,
        content: '筼筜湖健身步道',
        dot: {
          top: '430rpx',
          left: '340rpx'
        }
      },
      {
        id: 8,
        content: '厦门国际邮轮母港',
        dot: {
          top: '840rpx',
          left: '500rpx'
        }
      },
      {
        id: 9,
        content: '陈嘉庚纪念馆',
        dot: {
          top: '700rpx',
          left: '270rpx'
        }
      }
    ]
  },
  zhangzhou: {
    name: '漳州',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/漳州title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/漳州map.png',
    textColumnsTop: '1150rpx', // 底部文字区域的top值
    leftColumnCount: 5, // 左列文字条目数
    items: [{
        id: 1,
        content: '漳州漳浦火山岛纪念碑谷',
        dot: {
          top: '680rpx',
          left: '550rpx'
        }
      },
      {
        id: 2,
        content: '漳浦县天福茶博物院茶道教室',
        dot: {
          top: '720rpx',
          left: '600rpx'
        }
      },
      {
        id: 3,
        content: '《后港年华》行浸式夜游项目',
        dot: {
          top: '600rpx',
          left: '480rpx'
        }
      },
      {
        id: 4,
        content: '漳州古城青年路美食区',
        dot: {
          top: '560rpx',
          left: '400rpx'
        }
      },
      {
        id: 5,
        content: '漳州平和县克拉克红绿彩非遗传习所',
        dot: {
          top: '640rpx',
          left: '350rpx'
        }
      },
      {
        id: 6,
        content: '长泰燕集山居民宿',
        dot: {
          top: '500rpx',
          left: '380rpx'
        }
      },
      {
        id: 7,
        content: '南靖县云水谣德风楼广场',
        dot: {
          top: '540rpx',
          left: '280rpx'
        }
      },
      {
        id: 8,
        content: '东山县苏峰山环岛路',
        dot: {
          top: '760rpx',
          left: '520rpx'
        }
      },
      {
        id: 9,
        content: '漳州月港海丝馆',
        dot: {
          top: '520rpx',
          left: '450rpx'
        }
      },
      {
        id: 10,
        content: '谷文昌纪念馆',
        dot: {
          top: '800rpx',
          left: '580rpx'
        }
      }
    ]
  },
  quanzhou: {
    name: '泉州',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/泉州title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/泉州map.png',
    textColumnsTop: '1250rpx', // 底部文字区域的top值
    leftColumnCount: 7, // 左列文字条目数
    items: [{
        id: 1,
        content: '泉州清源山 "柒望"云端会客厅',
        dot: {
          top: '560rpx',
          left: '400rpx'
        }
      },
      {
        id: 2,
        content: '安溪县八马茶业观光工厂',
        dot: {
          top: '640rpx',
          left: '520rpx'
        }
      },
      {
        id: 3,
        content: '泉州南音艺苑活态传承展演体验基地',
        dot: {
          top: '600rpx',
          left: '380rpx'
        }
      },
      {
        id: 4,
        content: '泉州鲤城区"老店新作"体验工坊',
        dot: {
          top: '580rpx',
          left: '350rpx'
        }
      },
      {
        id: 5,
        content: '泉州非遗馆入戏工坊',
        dot: {
          top: '620rpx',
          left: '320rpx'
        }
      },
      {
        id: 6,
        content: '泉州五店市国潮街区',
        dot: {
          top: '700rpx',
          left: '450rpx'
        }
      },
      {
        id: 7,
        content: '青普文化行馆·晋江梧林',
        dot: {
          top: '720rpx',
          left: '520rpx'
        }
      },
      {
        id: 8,
        content: '鲤城七栩钟楼酒店',
        dot: {
          top: '540rpx',
          left: '280rpx'
        }
      },
      {
        id: 9,
        content: '南安英良石材自然历史博物馆',
        dot: {
          top: '660rpx',
          left: '480rpx'
        }
      },
      {
        id: 10,
        content: '晋江九十九溪流域田园风光',
        dot: {
          top: '680rpx',
          left: '380rpx'
        }
      },
      {
        id: 11,
        content: '闽台对渡文化节',
        dot: {
          top: '740rpx',
          left: '420rpx'
        }
      },
      {
        id: 12,
        content: '泉州海外交通史博物馆',
        dot: {
          top: '560rpx',
          left: '320rpx'
        }
      },
      {
        id: 13,
        content: '泉州欧乐堡海洋王国乐园',
        dot: {
          top: '640rpx',
          left: '250rpx'
        }
      },
      {
        id: 14,
        content: '晋江经验馆',
        dot: {
          top: '680rpx',
          left: '350rpx'
        }
      }
    ]
  },
  sanming: {
    name: '三明',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/三明title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/三明map.png',
    textColumnsTop: '1150rpx', // 底部文字区域的top值
    leftColumnCount: 4, // 左列文字条目数
    items: [{
        id: 1,
        content: '三明泰宁环大金湖观光热气球',
        dot: {
          top: '480rpx',
          left: '580rpx'
        }
      },
      {
        id: 2,
        content: '三元区棠园·大众茶馆',
        dot: {
          top: '520rpx',
          left: '450rpx'
        }
      },
      {
        id: 3,
        content: '三明醉有才大食堂',
        dot: {
          top: '560rpx',
          left: '400rpx'
        }
      },
      {
        id: 4,
        content: '福建（泰宁） 乡村非物质文化遗产博览苑',
        dot: {
          top: '600rpx',
          left: '620rpx'
        }
      },
      {
        id: 5,
        content: '万寿岩遗址博物馆数字化展厅',
        dot: {
          top: '500rpx',
          left: '350rpx'
        }
      },
      {
        id: 6,
        content: '泰宁耕读李家森林风景道',
        dot: {
          top: '540rpx',
          left: '550rpx'
        }
      },
      {
        id: 7,
        content: '中央苏区反" 围剿"纪念馆',
        dot: {
          top: '580rpx',
          left: '280rpx'
        }
      }
    ]
  },
  putian: {
    name: '莆田',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/莆田title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/莆田map.png',
    textColumnsTop: '1150rpx', // 底部文字区域的top值
    leftColumnCount: 3, // 左列文字条目数
    items: [{
        id: 1,
        content: '《印象·妈祖》文旅演艺',
        dot: {
          top: '720rpx',
          left: '480rpx'
        }
      },
      {
        id: 2,
        content: '莆田兴化府历史文化街区县巷"非遗一条街"',
        dot: {
          top: '640rpx',
          left: '420rpx'
        }
      },
      {
        id: 3,
        content: '湄洲岛泊澜清风民宿',
        dot: {
          top: '780rpx',
          left: '520rpx'
        }
      },
      {
        id: 4,
        content: '木兰溪"水上巴士"',
        dot: {
          top: '580rpx',
          left: '380rpx'
        }
      },
      {
        id: 5,
        content: '莆田盐场',
        dot: {
          top: '680rpx',
          left: '580rpx'
        }
      },
      {
        id: 6,
        content: '湄洲岛妈祖文化旅游区',
        dot: {
          top: '740rpx',
          left: '500rpx'
        }
      }
    ]
  },
  nanping: {
    name: '南平',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/南平title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/南平map.png',
    textColumnsTop: '1250rpx', // 底部文字区域的top值
    leftColumnCount: 6, // 左列文字条目数
    items: [{
        id: 1,
        content: '南平武夷山国家公园六曲揽胜观景平台',
        dot: {
          top: '560rpx',
          left: '580rpx'
        }
      },
      {
        id: 2,
        content: '武夷山市半米茶席',
        dot: {
          top: '600rpx',
          left: '520rpx'
        }
      },
      {
        id: 3,
        content: '武夷山市世界红茶小镇桐木村',
        dot: {
          top: '640rpx',
          left: '620rpx'
        }
      },
      {
        id: 4,
        content: '《建州胜筵》全景沉浸式主题餐秀',
        dot: {
          top: '520rpx',
          left: '350rpx'
        }
      },
      {
        id: 5,
        content: '《月映武夷》大型舞台秀',
        dot: {
          top: '580rpx',
          left: '480rpx'
        }
      },
      {
        id: 6,
        content: '南平建瓯市饕餮广场',
        dot: {
          top: '500rpx',
          left: '280rpx'
        }
      },
      {
        id: 7,
        content: '南平建盏文化创意园',
        dot: {
          top: '540rpx',
          left: '320rpx'
        }
      },
      {
        id: 8,
        content: '武夷山五夫古镇兴贤书院',
        dot: {
          top: '620rpx',
          left: '420rpx'
        }
      },
      {
        id: 9,
        content: '武夷山九曲溪山盟海誓浪漫游',
        dot: {
          top: '600rpx',
          left: '550rpx'
        }
      },
      {
        id: 10,
        content: '光泽杉关古驿道',
        dot: {
          top: '480rpx',
          left: '250rpx'
        }
      },
      {
        id: 11,
        content: '建阳崇阳溪漫游道',
        dot: {
          top: '560rpx',
          left: '380rpx'
        }
      },
      {
        id: 12,
        content: '考亭书院',
        dot: {
          top: '540rpx',
          left: '300rpx'
        }
      }
    ]
  },
  longyan: {
    name: '龙岩',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/龙岩title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/龙岩map.png',
    textColumnsTop: '1150rpx', // 底部文字区域的top值
    leftColumnCount: 4, // 左列文字条目数
    items: [{
        id: 1,
        content: '龙岩冠豸山九龙湖休闲区',
        dot: {
          top: '560rpx',
          left: '550rpx'
        }
      },
      {
        id: 2,
        content: '漳平市永福樱花茶园',
        dot: {
          top: '620rpx',
          left: '620rpx'
        }
      },
      {
        id: 3,
        content: '龙岩长汀古城" ⽩⽇·上房揭瓦"',
        dot: {
          top: '500rpx',
          left: '280rpx'
        }
      },
      {
        id: 4,
        content: '龙岩客家大院美食园',
        dot: {
          top: '540rpx',
          left: '350rpx'
        }
      },
      {
        id: 5,
        content: '龙岩非遗文创园',
        dot: {
          top: '580rpx',
          left: '420rpx'
        }
      },
      {
        id: 6,
        content: '永定土楼·客家香叙酒店',
        dot: {
          top: '600rpx',
          left: '500rpx'
        }
      },
      {
        id: 7,
        content: '上杭汀江绿道',
        dot: {
          top: '520rpx',
          left: '380rpx'
        }
      },
      {
        id: 8,
        content: '古田会议会址',
        dot: {
          top: '480rpx',
          left: '450rpx'
        }
      }
    ]
  },
  ningde: {
    name: '宁德',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/宁德title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/宁德map.png',
    textColumnsTop: '1150rpx', // 底部文字区域的top值
    leftColumnCount: 5, // 左列文字条目数
    items: [{
        id: 1,
        content: '宁德霞浦"洞见·蓝" 空间',
        dot: {
          top: '540rpx',
          left: '530rpx'
        }
      },
      {
        id: 2,
        content: '福鼎市绿雪芽非遗工坊',
        dot: {
          top: '490rpx',
          left: '600rpx'
        }
      },
      {
        id: 3,
        content: '嵛山镇海岛音乐会',
        dot: {
          top: '530rpx',
          left: '400rpx'
        }
      },
      {
        id: 4,
        content: '宁德霞浦太康路美食一条街',
        dot: {
          top: '650rpx',
          left: '465rpx'
        }
      },
      {
        id: 5,
        content: '屏南县一溪云公众空间',
        dot: {
          top: '420rpx',
          left: '400rpx'
        }
      },
      {
        id: 6,
        content: '周宁鲤鱼溪鱼祭广场',
        dot: {
          top: '730rpx',
          left: '430rpx'
        }
      },
      {
        id: 7,
        content: '福鼎嵛山岛环岛路',
        dot: {
          top: '780rpx',
          left: '480rpx'
        }
      },
      {
        id: 8,
        content: '宁德霞浦三沙花竹村观日地标',
        dot: {
          top: '620rpx',
          left: '220rpx'
        }
      },
      {
        id: 9,
        content: '下党乡红色研学实践教育基地',
        dot: {
          top: '450rpx',
          left: '270rpx'
        }
      }
    ]
  },
  pingtan: {
    name: '平潭',
    titleImage: 'https://app5.fjsen.com/h5/20260122/images/平潭title.png',
    mapImage: 'https://app5.fjsen.com/h5/20260122/images/平潭map.png',
    textColumnsTop: '1150rpx', // 底部文字区域的top值
    leftColumnCount: 4, // 左列文字条目数
    items: [{
        id: 1,
        content: '平潭 68 海里景区"两岸同心窗"',
        dot: {
          top: '580rpx',
          left: '480rpx'
        }
      },
      {
        id: 2,
        content: '"岚起山海图"夜游演艺',
        dot: {
          top: '640rpx',
          left: '520rpx'
        }
      },
      {
        id: 3,
        content: '平潭孤独咖啡馆',
        dot: {
          top: '520rpx',
          left: '380rpx'
        }
      },
      {
        id: 4,
        content: '平潭橘树里海景民宿',
        dot: {
          top: '680rpx',
          left: '420rpx'
        }
      },
      {
        id: 5,
        content: '壳丘头遗址博物馆',
        dot: {
          top: '480rpx',
          left: '350rpx'
        }
      },
      {
        id: 6,
        content: '北部生态廊道',
        dot: {
          top: '560rpx',
          left: '280rpx'
        }
      },
      {
        id: 7,
        content: '平潭22号国际游艇码头',
        dot: {
          top: '620rpx',
          left: '320rpx'
        }
      },
      {
        id: 8,
        content: '中国水下考古·平潭展示体验馆',
        dot: {
          top: '600rpx',
          left: '400rpx'
        }
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
    showDetailPopup: false, // 是否显示详情弹窗
    selectedItem: null, // 当前选中的景点信息
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
   * 点击地图标记点
   */
  onDotTap(e) {
    const item = e.currentTarget.dataset.item
    console.log('点击了标记点:', item)

    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    })

    // 显示详情弹窗
    this.setData({
      showDetailPopup: true,
      selectedItem: item
    })
  },

  /**
   * 关闭详情弹窗
   */
  closeDetailPopup() {
    console.log('关闭详情弹窗')

    this.setData({
      showDetailPopup: false,
      selectedItem: null
    })
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
    console.log('导航前往:', item)

    wx.showToast({
      title: '正在规划路线...',
      icon: 'loading',
      duration: 2000
    })

    // 这里可以调用微信地图API进行导航
    // wx.openLocation({
    //   latitude: item.latitude,
    //   longitude: item.longitude,
    //   name: item.content,
    //   address: item.address,
    //   scale: 18
    // })
  },

  /**
   * 分享景点
   */
  shareSpot() {
    const item = this.data.selectedItem
    console.log('分享景点:', item)

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    wx.showToast({
      title: '点击右上角分享',
      icon: 'none',
      duration: 2000
    })
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack()
  }
})