import PropertyParser from "./PropertyParser";
function getPropertyListObject(validPropertyGroup, AdbePath) {
    var propertyParser = new PropertyParser;
    return propertyParser.getPropertyListObject(validPropertyGroup, AdbePath);
}
export default getPropertyListObject;
