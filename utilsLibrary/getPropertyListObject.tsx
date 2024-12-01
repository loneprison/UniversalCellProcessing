import PropertyParser from "./PropertyParser";

function getPropertyListObject(validPropertyGroup: PropertyGroup | MaskPropertyGroup, AdbePath?: AdbePath) {
    const propertyParser = new PropertyParser

    return propertyParser.getPropertyListObject(validPropertyGroup, AdbePath);
}

export default getPropertyListObject