function parseJson(string) {
    try {
        return Function("", "return (" + string + ")")();
    }
    catch (error) {
        return null;
    }
}
export default parseJson;
