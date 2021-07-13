#!/usr/bin/env node

// 使用node开发命令行工具所执行的js脚本必须在顶部写#!/usr/bin/env node

// 用于处理用户输入的命令，可以自动解析命令和参数
const program = require('commander')
// 下载并提取git仓库，如下载上传到git中的模板
const download = require('download-git-repo')
// 模板引擎，将用户提交的信息动态填充到文件中
const handlebars = require('handlebars')
// 通用的命令行用户界面集合，用于和用户进行交互
const inquirer = require('inquirer')
const fs = require('fs')
// 在终端显示下载动画
const ora = require('ora')
// 可以给终端的字体格式化，如加颜色、改变字体等
const chalk = require('chalk')
// 可以在终端中显示出叉叉或打钩符号
const logSymbols = require('log-symbols')
const templates = require('./templates')

program
  .version('1.0.0') // -v 或--version 输出版本号

program
  .command('init <template-name> [project-name]')
  .description('Initialize the project template')
  .action((templateName, projectName) => {
    console.log(templateName, projectName)
    // loading 提示
    const spinner = ora('Downloading the template...').start()

    // 下载模板
    // downloadUrl：仓库地址
    // projectName：下载路径
    const { downloadUrl } = templates[templateName]
    // 如果遇到控制台报错：Error: 'git clone' failed with status 128, 则download不要配置 { clone: true }
    download(downloadUrl, projectName, (err) => {
      if (err) {
        spinner.fail()
        console.log(logSymbols.error, chalk.red(err))
        return
      }

      spinner.succeed()

      // 使用向导的方式采集用户输入的值
      inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Please inpu project name',
        default: projectName
      }, {
        type: 'input',
        name: 'description',
        message: 'Please inpu project description'
      }, {
        type: 'input',
        name: 'author',
        message: 'Please inpu project author'
      }]).then((answers) => {
        // 把项目下的 package.json 文件读取出来
        const packagePath = `${projectName}/package.json`
        const packageContent = fs.readFileSync(packagePath, 'utf8')

        // 使用模板引擎把用户输入的数据解析到 package.json 文件中
        const packageResult = handlebars.compile(packageContent)(answers)

        // 解析完毕，把解析之后的结果重新写入 package.json 文件中
        fs.writeFileSync(packagePath, packageResult)

        console.log(logSymbols.success, chalk.yellow('初始化模板成功'))
      })
    })
  })

program
  .command('list')
  .description('View all available templates')
  .action(() => {
    for (let key in templates) {
      console.log(`
${key}  ${templates[key].description}`)
    }
  })

// 没有任何命令的时候输出使用帮助
if (!process.argv.slice(2).length) {
  program.outputHelp()
}

program.parse(process.argv)
