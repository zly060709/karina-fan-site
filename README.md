# KR11 FAN PROJECT · 柳智敏（KARINA）主题站

以 landonorris.com 全站为蓝本的非商业粉丝项目复刻 · 7 页静态站 + JSON 数据驱动。

## 本地预览

```bash
cd karina-site
python -m http.server 8099
# 打开 http://127.0.0.1:8099
```

（或任意静态服务器；直接双击 index.html 也能看，但 fetch data/*.json 需要 http 协议。）

## 结构

```
karina-site/
├─ index.html          首页（hero 照片咬合 / 跑马灯 / pin 横向里程 / 双栏 / 时代碟墙 / 五周年概念碟 / 代言墙 / 社交 / 页脚拨转唱片）
├─ on-stage.html       ON STAGE（53 位 / 10 榜首 / 43 场计数 · 时代标签 2020-2025 · 高光 · pre-debut · KSPO DOME 可视化 · 日程 · 碟墙）
├─ off-stage.html      OFF STAGE（Gaming / Fashion Weeks / Backstage / Fan Art 四卡 + 社交）
├─ schedule.html       SCHEDULE（日程 JSON 驱动 + ALL STAGES 卡墙）
├─ lookbook.html       LOOKBOOK（概念再版碟 ×4 + CORE 系列 ×8 + SCRIPT 双配色 · 非卖品）
├─ 404.html            Strayed into KWANGYA 彩蛋页
├─ legal/              粉丝项目版隐私政策 / 服务条款（含免责声明全文）
├─ data/               discs.json（10 时代碟）· results.json（19 张 ALL STAGES 卡）· schedule.json
└─ assets/
   ├─ css/site.css     设计 Token + 全组件（宇宙黑 #0C0C10 + 电光钴蓝 #2E55FF 单强调色纪律）
   ├─ js/main.js       discSVG 参数化黑胶工厂 + F01-F17 交互（预加载 LOADINA / 全屏菜单 / 滚轮平滑 /
   │                    pin 横向滚动 / 跑马灯 / 碟墙 / 计数 / 时代标签 / 日程 / 卡墙 / 拨转唱片 / 视差）
   ├─ img/karina/      柳智敏公开照片 20 张（网络公开图源，版权归原作者）
   ├─ img/scenes/      AI 氛围图（本机 ComfyUI · SDXL 生成）
   └─ svg/             自绘矢量：logo / 签名 / favicon / 10 张时代碟（随 JS 参数化渲染）/ 国旗 20 / 场馆线稿 7 / 周边 mockup 8
```

## 核心设定（对应计划书）

- **个人符号**：黑胶唱片（用户选定）——「一次回归一张碟」，五种真实压碟工艺：洒溅 / 蚀刻 / 铬镜 / 蛇鳞纹 / 星芒满铺
- **命名体系**：KR11（KR = KARINA · 11 = 生日 04.11）
- **色彩**：宇宙黑 #0C0C10 / 冷白 #F2F4F8 / 电光钴蓝 #2E55FF（唯一强调色）/ 铬银 #C9CFDA / 冰洋红 #FF3EC8（<1%）
- **数据纪律**：只收公开可查证事实；未核验一律「—」或「待官宣」
- **免责**：非官方粉丝项目，与 SM Entertainment / aespa / KARINA 无关联；页脚 + 法务页双投放

## 已验证交互（F01-F18）

F01 LOADINA 彩蛋可重播 · F02 全屏菜单悬停换图 · F03 竖屏闸门 · F04 滚轮平滑+无障碍开关 ·
F05 pin 横向滚动 + TAP TO LOCK 巡游 · F06 无缝跑马灯 · F09 碟墙双态 · F10 计数 · F11 时代标签 ·
F12 日程国旗行 · F13 JSON 卡墙 · F14 拖拽拨转唱片（惯性）· F15 代言墙 · F16 静态订阅 · F17 无 Rive 降级 · F18 lookbook 无交易

## 部署

静态站，Cloudflare Pages / GitHub Pages / Vercel 直接拖 `karina-site/` 即可。
建议域名加 `fan` 前缀，避免与艺人官方域名混淆。
