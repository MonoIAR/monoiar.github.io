---
title: 快速上手 // 安装汉化包
description: 从零开始安装 MIAR 汉化补丁的完整流程，包含 PCVR 与 Quest 双平台说明。
order: 1
category: 入门
tags: ["安装", "汉化包"]
updated: 2026-08-16
toc: true
---

这是一篇占位文档，用于演示文档页面的排版样式。正式内容将由社区成员补充。

## 安装前准备

在开始之前，请先确认你的设备满足以下条件，并**关闭正在运行的游戏进程**。

> 提示：汉化补丁不修改任何游戏本体文件，卸载时删除对应目录即可完全还原。

## 安装步骤

1. 下载最新汉化压缩包。
2. 将压缩包解压到临时目录。
3. 复制对应平台的文件到目标目录。
4. 重新启动游戏验证汉化是否生效。

### PCVR 平台

PCVR 版本需要将文件放入 BONELAB 的插件目录：

| 平台 | 目标目录 |
| --- | --- |
| PCVR (Steam) | `.../BONELAB/BONELAB_Data/Plugins/` |
| Quest (Link/Air Link) | 见下方章节 |

复制完成后，可以在命令行中快速验证：

```bash
# 占位命令 —— 校验插件目录结构
echo "MIAR OK"
ls -la "$HOME/.steam/steam/steamapps/common/BONELAB/BONELAB_Data/Plugins/"
```

### Quest 平台

Quest 端安装请使用侧载工具（如 `adb`），将文件推送到 `Android/data/` 对应目录下。

---

更多细节请参见《联机服务器配置》与《常见问题排查》两篇文档。
