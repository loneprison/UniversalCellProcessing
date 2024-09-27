import castFile from "./_internal/_castFile";
function executeFile(path) {
    var file = castFile(path);
    if (!file.exists) {
        return false;
    }
    return file.execute();
}
export default executeFile;
