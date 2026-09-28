# Agent手册、提示词模板及后话

[阅读教程](https://sng-commorai.github.io/agent-handbook/) · [飞书原稿](https://fcnj6tle53ti.feishu.cn/wiki/E198wVOmOiodK0ko4gPcL592nef)

关于 AI 基础概念、Agent 工作区、技能配置与使用心得的教程，持续撰写中。

网站保留原文和未完成的章节，提供章节导航、全文搜索、提示词复制、深浅色主题及手机阅读。正文来自 `tutorial.md`，网站为无前端依赖的静态页面。

## 后续更新

继续在飞书写作，需要发布时请 AI「将飞书教程同步到 SNG-Commorai/agent-handbook，保留原文」。同步步骤见 [SYNC.md](SYNC.md)。不会定时读取飞书或自动发布尚未确认的原稿。

## 本地构建

需要 Node.js 18 或以上版本。

```sh
npm ci
npm run build
npm run check
python3 -m http.server 8000
```

打开 `http://localhost:8000`。也可直接打开 `index.html` 阅读；复制按钮推荐在 HTTPS 或 localhost 下使用。

## 发布

GitHub Pages 使用 `main` 分支的根目录。将修改后的原稿、资源和构建结果一起提交，GitHub 自动发布更新。无需运行后台服务。

正文中的两个安装包按飞书原附件保存于 [Releases](https://github.com/SNG-Commorai/agent-handbook/releases/tag/tutorial-assets-20260928)。图片随站点保存。安装包未被修改或执行。

本次迁移没有另行授予原文或第三方附件的许可；相关说明以原文和各自发布者为准。
