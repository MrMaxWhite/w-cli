# w-cli
项目脚手架命令行工具

## 实现思路：
1.项目模板放在github上

2.用户通过终端命令交互的方式下载不同的模板

3.经过模板引擎渲染定制的项目模板

4.当模板有变动时，只需要更新github上的模板即可，无需用户更新脚手架

## 如何生成命令，如在终端执行w-cli
1、npm init -y  生成package.json
2、在package.json配置 
  "bin": {
    "w-cli": "index.js"
  }
3、连接到全局，在当前目录执行 npm link，然后在终端就可以使用命令w-cli
4、接触用命令  npm unlink

## 命令行工具参数设计
w-cli -h|--help 查看使用帮助
w-cli -V|--version 查看工具的版本
w-cli list 列出所有可用模板
w-cli init <template-name> <project-name> 基于指定的模板进行项目初始化，<>表示必填

## npm发包
1、打开npmjs.com官方
2、注册一个npm账号
3、在npm检索是否有重名的包名
4、将 package.json 中的 name 修改为发布到npm上的包名(和本地项目名称无关)
5、打开控制台，执行 npm login，在控制台登录 npm
6、登录成功后，在项目下执行 npm publish，发布成功后npm官网上要等一段时间才能查询到
7、本地测试，执行npm i w-cli -g (如果本地原来开发的时候就npm link过呀先执行npm unlink)
8、执行w-cli的相关命令