function copyToClipboard(content) {
    var cmd;
    var isWindows = $.os.indexOf("Windows") !== -1;
    content = content.toString();
    if (!isWindows) {
        cmd = 'echo "' + content + '" | pbcopy';
    }
    else {
        cmd = 'cmd.exe /c cmd.exe /c "echo ' + content + ' | clip"';
    }
    system.callSystem(cmd);
}
export default copyToClipboard;
