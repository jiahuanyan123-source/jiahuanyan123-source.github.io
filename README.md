# 个人作品集网站

这是一个可以直接部署到 GitHub Pages 的静态个人作品集模板。它包含：

- 首页首屏
- 精选作品
- 记录时间线
- 关于我
- 联系入口
- 深浅主题切换
- 作品分类筛选

## 本地预览

在当前目录运行：

```powershell
python -m http.server 5173
```

然后打开：

```text
http://localhost:5173
```

## 部署到 GitHub Pages

1. 在 GitHub 创建一个新仓库。
2. 如果想用 GitHub 默认个人主页地址，把仓库命名为 `你的GitHub用户名.github.io`。
3. 把本目录的文件上传到仓库根目录。
4. 进入仓库 `Settings` -> `Pages`。
5. Source 选择 `Deploy from a branch`。
6. Branch 选择 `main`，目录选择 `/root`。
7. 保存后等待 GitHub 自动部署。

## 替换内容

- 在 `index.html` 里替换 `你的名字`、邮箱、社交链接、作品标题和说明。
- 替换 `assets/hero-workspace.png` 可以更换首屏图片。
- 在 `styles.css` 里修改颜色变量可以快速改变整体视觉风格。
