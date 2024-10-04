import { isNoValueProperty} from "soil-ts"

/**
 * 检查属性是否为原始值
 */
function isOriginalPropertyValue(property: Property): boolean {
    return !isNoValueProperty(property) && property.isModified
}

export default isOriginalPropertyValue