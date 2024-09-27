import isCompItem from "./isCompItem";
import isFolderItem from "./isFolderItem";
import isFootageItem from "./isFootageItem";
function isItem(value) {
    return isCompItem(value) || isFootageItem(value) || isFolderItem(value);
}
export default isItem;
