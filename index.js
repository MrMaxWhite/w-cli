#!/usr/bin/env node

// 告诉执行器使用node来执行当前脚本代码
// 使用node开发命令行工具所执行的js脚本必须在顶部写#!/usr/bin/env node

// 用于处理用户输入的命令，可以自动解析命令和参数
const program = require('commander')
// 模板引擎，将用户提交的信息动态填充到package.json文件中
const handlebars = require('handlebars')
// [命令行交互]通用的命令行用户界面集合，用于和用户进行交互
const inquirer = require('inquirer')
const fs = require('fs')
// [视觉美化]在终端显示下载动画
const ora = require('ora')
// [视觉美化]可以给终端的字体格式化，如加颜色、改变字体等
const chalk = require('chalk')
// [视觉美化]可以在终端中显示出叉叉或打钩符号
const logSymbols = require('log-symbols')

const templates = require('./templates')

// process.argv 原生获取命令行的方式，可获取到用户输入的命令，获取到的是一个数组，
// 如在终端输入 w-cli init a b c , init所在数组的位置是2，a在3，以此类推
// 适用原生获取比较麻烦，可借助commander模块处理

program
  .version('1.0.0') // -v 或--version 输出版本号

program
  .command('init <template-name> [project-name]')
  .description('Initialize the project template')
  .action((templateName, projectName) => {
    console.log(templateName, projectName)
    // loading 提示
    const spinner = ora('Downloading the template...').start() //正在下载中

    // git clone模板
    let exec = require('child_process').exec;
    let cmd = 'git clone https://github.com/MrMaxWhite/w-cli-template-1';
    exec(cmd,{ encoding: 'utf-8' },function(error, stdout, stderr) {
      if (error) {
        spinner.fail() //下载失败
        console.log(logSymbols.error, chalk.red(error))
        return
      }

      spinner.succeed() //下载成功

      // 重命名文件
      fs.renameSync(`./w-cli-${templateName}`,`./${projectName}`)

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
    });
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
