import { addPropertyAlone, forOwn, has, isProperty, startsWith } from "soil-ts"

function setPropertyValue(property: Property, dataObject: PropertyValueData) {
    // 设置 property 的值
    if (has(dataObject, 'value')) {
        property.setValue(dataObject.value)
    }

    // 设置表达式
    if (has(dataObject, 'expression')) {
        property.expression = dataObject.expression
    }
}

function setSelfProperty(property: _PropertyClasses, dataObject: PropertyMetadata) {
    // 设置显示
    if (has(dataObject, 'enabled')) {
        property.enabled = dataObject.enabled
    }

    // 设置 property 的名字
    if (has(dataObject, 'name')) {
        property.name = dataObject.name
    }
}

/**
 * 根据给定的属性数据，将属性值设置到目标图层或属性上。
 * 
 * ！！！注意，由于getPropertyListObject尚未完善，因此仅建议将其用于指定属性而非整个图层,或者你可以选择将数据打印出来后进行人工筛选
 *
 * 该函数会遍历 `propertyData` 中的每个键值对，根据键的前缀（`S`、`G`、`P`）决定如何设置对应的属性：
 * - `S`：表示 `PropertyGroup` 自身需要被设置的属性。
 * - `G`：表示 `PropertyGroup` 的数据，`PropertyGroup` 的子类可以是 `Property` 和 `PropertyGroup`。
 * - `P`：表示 `Property` 的数据。
 *
 * @param {PropertyClasses} rootProperty 目标属性的根属性类。
 * @param {PropertyDataStructure | NestedPropertyGroup} propertyData 包含要设置的属性数据。
 * @returns {void} 无返回值。
 * @since 0.1.0
 * @category Utility
 * @example
 *
 * ```ts
 * const selectedLayers = _.getSelectedLayers();
 * if (selectedLayers.length == 2) {
 *     const propertyData = ul.getPropertyListObject(selectedLayers[0],["ADBE Effect Parade"]);
 *     ul.setPropertyByData(_.getProperty(selectedLayers[1],["ADBE Effect Parade"]), propertyData);
 * }
 * // 结果：将第一个选中图层的属性数据设置到第二个图层。
 * ```
 */

// 递归遍历每一层
function setPropertyByData(rootProperty: _PropertyClasses, propertyData: PropertyDataStructure ) {

    forOwn(propertyData, (value, key) => {

        if (startsWith(key, "S", 0)) {
            setSelfProperty(rootProperty, (value as PropertyMetadata))
            return
        }
        const subProperty = addPropertyAlone(rootProperty, [key.substring(6)])

        // 如果当前是一个 Group（包含子项）
        if (startsWith(key, "G", 0)) {
            setPropertyByData(subProperty, value as PropertyDataStructure)
        } else if (startsWith(key, "P", 0)) {
            if (isProperty(subProperty)) {
                setPropertyValue(subProperty, (value as PropertyValueData))
            }else{
                alert(`在${key}键上遇到了错误\n该属性不为Property`)
            }
        } else {
            alert(`在${key}键上遇到了未定义的错误\n【旧版的数据格式可能不支持】\n请检查你的脚本是否为最新`)
            return
        }
    })
}

export default setPropertyByData