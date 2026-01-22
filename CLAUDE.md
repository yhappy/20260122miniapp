# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个微信小程序项目，使用微信小程序原生框架开发。

## 项目结构

```
├── app.js          # 小程序入口文件，包含 App() 实例和全局数据
├── app.json        # 小程序全局配置（页面路由、窗口样式等）
├── app.wxss        # 全局样式表
├── pages/          # 页面目录
│   ├── index/      # 首页
│   └── logs/       # 日志页面
├── utils/          # 工具函数
│   └── util.js     # 时间格式化工具
├── project.config.json       # 项目配置文件
└── sitemap.json             # 索引配置
```

## 架构说明

### 页面结构
每个页面由四个文件组成：
- `.js` - 页面逻辑
- `.json` - 页面配置
- `.wxml` - 页面结构（类似 HTML）
- `.wxss` - 页面样式（类似 CSS）

### 全局配置 (app.json)
- `pages` 数组定义页面路径，第一项为首页
- `window` 对象配置全局窗口样式
- `componentFramework` 使用 "glass-easel" 组件框架
- `lazyCodeLoading` 启用按需注入

### 全局数据管理
- `app.js` 中的 `globalData` 用于存储全局状态
- 使用 `getApp()` 在页面中访问全局数据

### 本地存储
- 使用 `wx.getStorageSync()` 和 `wx.setStorageSync()` 进行同步存储
- 项目中用于记录用户访问日志

## 开发注意事项

### API 调用
- 使用 `wx.login()` 进行用户登录
- 使用 `wx.getUserProfile()` 获取用户信息（需要用户授权）
- 使用 `wx.navigateTo()` 进行页面跳转

### 能力检测
- 使用 `wx.canIUse()` 检测 API 可用性
- 示例：`wx.canIUse('getUserProfile')`、`wx.canIUse('input.type.nickname')`

### 模块导出
- 工具函数使用 `module.exports` 导出
- 使用 `require()` 引入模块

## 项目配置

### 编译设置 (project.config.json)
- ES6 转换已启用
- 代码压缩已启用（WXML、WXSS、JS）
- 使用增强编译
- Tab 大小为 2 空格
