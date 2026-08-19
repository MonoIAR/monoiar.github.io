---
title: FAQ常见问题解答
description: 【MIAR内部用】一些常见问题
order: 2
category: 问答
tags: ["模组", "安装", "汉化包"]
updated: 2026-08-20
toc: false
---

这是MIAR的FAQ页面，不管你打算在群里问什么问题，你都可以先看看以下列表中有没有你找的。

在你问任何事情之前，请确保你知道如何翻墙（也称科学上网），或者你能够稳定访问GitHub。

---

你需要分辨“SDK Mod”和“Code Mod”。

SDK Mod，顾名思义，是使用BONELAB官方SDK制作的内容模组，通常是关卡、玩家模型、道具，需要安装到`%USERPROFILE%\AppData\LocalLow\Stress Level Zero\BONELAB\Mods`（你可以直接在文件管理器地址栏输入这段内容）

而Code Mod是基于MelonLoader运行的插件性质模组，需要安装到你**游戏目录**的Mods文件夹。

Code Mod可以直接使用 [BonelabModManager](/docs/install-bonelab-zh#自动安装) 快速管理。

---

出现`[INTERNAL FAILURE] Failed to Execute Cpp2IL!`报错？来试试这个方法：

找到你的游戏安装目录，打开
`MelonLoader\Dependencies\Il2CppAssemblyGenerator\Cpp2IL`
里面有个Cpp2IL.exe，用QQ群文件的`/Cpp2IL/Cpp2IL.exe`替换掉。