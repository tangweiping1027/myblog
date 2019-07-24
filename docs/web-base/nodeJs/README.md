# node 与 nvm

## nvm 安装

### 下载

[安装包下载](https://github.com/coreybutler/nvm-windows/releases)

选择 nvm-setup.zip，下载后直接安装。

![图片](/nodejs/1.webp)

![图片](/nodejs/2.webp)

### 配置环境变量

这一步可能不是必须的，最近有人反映并经过我自己的重新安装使用，最新的版本的 nvm-for-windows 安装程序在安装完成之后已经帮您完成了环境变量的配置，因此这里你所需要做的是检查你的环境变量中是否已经包含以下选项，如果没有仍然还需要你乖乖的去设置，否则不可用。

![图片](/nodejs/3.webp)

### 验证是否安装成功

打开命令行，执行 nvm -v 命令后，出现一下类似的提示说明安装成功。

![图片](/nodejs/4.webp)

## 安装 nodeJS

使用 nvm install &lt; versiona&gt; [&lt;arch&gt;]命令下载需要的版本。arch 参数表示系统位数，默认是 64 位，如果是 32 位操作系统，需要执行命令：nvm install 6.9.0 32，出现下图表示安装完成：

![图片](/nodejs/5.webp)

### 使用特定 Node 版本

执行 nvm use &lt;version&gt; [&lt;arch&gt;] 命令开始使用特定版本。比如：nvm use 6.9.0 或者 nvm use 6.9.0 32

![图片](/nodejs/6.webp)

### 测试版本切换

刚刚下载了 node 6.9.0 版本并且成功使用，现在我们下载一个 6.10.3 版本，然后切换并使用。

![图片](/nodejs/7.webp)
