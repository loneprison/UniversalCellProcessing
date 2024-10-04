import { isNoValueProperty } from "soil-ts";
function isOriginalPropertyValue(property) {
    return !isNoValueProperty(property) && property.isModified;
}
export default isOriginalPropertyValue;
