function trimPrefsBlankChar(string) {
    return string.replace(/^\t+/gm, "").replace(/^"/gm, "").replace(/\\$/gm, "").replace(/"$/gm, "").replace(/\n/g, "");
}
export default trimPrefsBlankChar;
