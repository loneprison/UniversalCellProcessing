function copyToClipboard(content:string) {
    var cmd;
    var isWindows = $.os.indexOf("Windows") !== -1;

    // 将内容转换为字符串
    content = content.toString();

    // 根据操作系统选择合适的命令
    if (!isWindows) {
        cmd = 'echo "' + content + '" | pbcopy';
    } else {
        cmd = 'cmd.exe /c cmd.exe /c "echo ' + content + ' | clip"';
    }

    // 执行系统命令
    system.callSystem(cmd);
}

export default copyToClipboard