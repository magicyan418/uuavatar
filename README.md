# UU Avatar Generator

一个基于 Next.js 和 Multiavatar 的头像生成器，可以根据名字生成独特的头像。

## 功能特点

- 🎨 根据输入的名字生成独特的头像
- 🔄 支持随机名字生成
- 📥 支持下载高清 PNG 格式头像
- 🖼️ 高分辨率输出（10倍原始分辨率）
- 🎯 简洁美观的用户界面
- ⚡ 实时预览

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Multiavatar

## 使用方法

1. 在输入框中输入任意名字
2. 头像会实时更新
3. 点击"随机名字"按钮可以获取随机名字
4. 点击"下载头像"按钮可以下载高清 PNG 格式的头像

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
.
├── app/
│   └── uuavatar/
│       └── page.tsx    # 主页面组件
├── public/             # 静态资源
└── package.json        # 项目配置
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
