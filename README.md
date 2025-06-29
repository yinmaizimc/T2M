# 思维导图生成工具

本项目是一个基于 React + markmap 的极简思维导图生成工具，支持：
- 结构化文本（如 Markdown）一键生成可编辑思维导图
- 通过 DeepSeek 搜索自动生成大纲并转为导图
- 支持导图 SVG 下载
- 界面简洁直观

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置 DeepSeek API Key
编辑 `src/utils/deepseek.ts`，将 `YOUR_DEEPSEEK_API_KEY` 替换为你的 DeepSeek API Key。

### 3. 启动项目
```bash
npm run dev
```

浏览器访问终端输出的本地地址（如 http://localhost:5173 ）。

## 主要依赖
- [React](https://react.dev/)
- [markmap-lib](https://github.com/markmap/markmap)
- [markmap-view](https://github.com/markmap/markmap)
- [MUI](https://mui.com/)
- [axios](https://axios-http.com/)

## 目录结构
```
├── src/
│   ├── components/
│   │   ├── MarkdownInput.tsx
│   │   ├── MindMapEditor.tsx
│   │   └── SearchToMarkdown.tsx
│   ├── utils/
│   │   └── deepseek.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
```

## 功能演示
- 左侧输入 Markdown 或通过关键词搜索生成大纲
- 右侧自动渲染思维导图
- 一键下载 SVG

---
如有问题欢迎反馈！
