var exec = require('child_process').exec;
var fs = require("fs"); 
var cmd = 'git clone https://github.com/MrMaxWhite/w-cli-template-1';
exec(cmd,{ encoding: 'utf-8' },function(error, stdout, stderr) {
  // 获取命令执行的输出
  console.log("111")
  fs.renameSync('./w-cli-template-1','./nihao')
});

// const version = require('child_process').execSync('git clone https://github.com/MrMaxWhite/w-cli-template-1', { 'encoding': 'utf8' });
// console.log(version)

// const childProcess = require('child_process');
// const getVersion = () => {
//     return new Promise((resovle, reject) => {
//         childProcess.exec('git clone https://github.com/MrMaxWhite/w-cli-template-1', { encoding: 'utf-8' }, (stdout, error, status, output) => {
//             error ? reject(error) : resovle(stdout)
//         });
//     })
// }

// getVersion().then(res => {
//     console.log('222',res)
// }).catch(e => {
//     console.log(e)
// })