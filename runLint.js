const chokidar = require('chokidar');
const execSh = require('exec-sh');
console.log(111)
// 监听多目录的变化
chokidar.watch(['./controller', './router']).on('all', (event, path) => {
    // 文件修改了，自动执行eslint检测语法
    if (event === 'change') {
        // console.log(path)
        execSh("npm run lint", function (err) {
            console.log("Exit code: ", err);
        });
    }
});