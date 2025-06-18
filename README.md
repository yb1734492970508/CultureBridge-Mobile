# CultureBridge Mobile App

## 项目概述

CultureBridge Mobile 是基于 React Native/Expo 开发的跨平台移动应用，旨在为用户提供文化交流和语言学习的移动端体验。

## 技术栈

- **框架**: Expo (React Native)
- **导航**: React Navigation v6
- **状态管理**: React Hooks
- **网络请求**: Axios
- **实时通信**: Socket.IO Client
- **图标**: Expo Vector Icons

## 项目结构

```
CultureBridge-Mobile/
├── App.js                 # 主应用入口
├── src/
│   ├── screens/           # 屏幕组件
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ChatScreen.js
│   │   ├── LearningScreen.js
│   │   └── ProfileScreen.js
│   ├── components/        # 可复用组件
│   ├── services/          # API 服务层
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   └── index.js
│   ├── utils/            # 工具函数
│   └── constants/        # 常量配置
│       └── index.js
├── package.json
└── README.md
```

## 核心功能

### 1. 用户认证
- 用户注册和登录
- JWT Token 管理
- 自动登录状态保持

### 2. 首页
- 欢迎横幅
- 快速操作入口
- 精选话题展示
- 最近活动记录

### 3. 聊天功能
- 在线用户展示
- 聊天室列表
- 实时消息（Socket.IO）
- 翻译工具集成

### 4. 学习模块
- 课程列表和进度
- 每日学习目标
- 成就徽章系统
- 学习统计数据

### 5. 个人资料
- 用户信息管理
- 学习统计展示
- 设置和偏好
- 快速操作

## API 集成

应用通过 RESTful API 与后端服务通信：

- **认证 API**: `/api/auth/*`
- **用户 API**: `/api/users/*`
- **聊天 API**: `/api/chat/*`
- **学习 API**: `/api/learning/*`
- **奖励 API**: `/api/rewards/*`

## 开发和运行

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
# Web 版本
npm run web

# Android 版本
npm run android

# iOS 版本
npm run ios
```

### 访问应用
- Web: http://localhost:8081
- 移动端: 使用 Expo Go 扫描二维码

## 设计特点

### UI/UX 设计
- 现代化的 Material Design 风格
- 响应式布局适配不同屏幕
- 直观的导航和交互体验
- 一致的颜色主题和字体规范

### 性能优化
- 组件懒加载
- 图片优化和缓存
- API 请求缓存
- 内存管理优化

### 国际化支持
- 多语言界面
- 实时翻译功能
- 本地化内容适配

## 后续开发计划

1. **API 集成完善**: 连接真实后端服务
2. **Socket.IO 实时通信**: 实现实时聊天功能
3. **离线支持**: 添加离线数据缓存
4. **推送通知**: 集成消息推送服务
5. **性能优化**: 代码分割和懒加载
6. **测试覆盖**: 单元测试和集成测试
7. **应用发布**: 打包发布到应用商店

## 注意事项

- 确保后端服务正常运行（http://localhost:5000）
- 开发时需要配置正确的 API 基础 URL
- 移动端测试需要使用 Expo Go 应用
- 生产环境需要配置相应的环境变量

## 贡献指南

1. Fork 项目仓库
2. 创建功能分支
3. 提交代码更改
4. 创建 Pull Request

---

*CultureBridge Mobile - 连接世界文化的移动学习平台*

