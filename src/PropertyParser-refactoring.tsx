import * as _ from 'soil-ts';
import * as ul from 'utilsLibrary';
/*
    该模块属于功能缺失的状态
    实在不想写了先搁置
    目前已知问题
        1.无法读取关键帧，而比较重要的标记和时间重映射都属于key，所以都无法被获取
        2.无法读取例如摄像机属性和灯光属性设置，因为他们不属于PropertyGroup
        3.无法读取文本属性，会中途报错
        4.当位置属性没开启分离状态时候，分离状态的属性值会被读取为"propertyValue": 0,但按理说这种情况就不应该被读取
        5.当图层样式未开启的状态，混合选项依然会被错误的读取出来
    暂时想到的解决方案
        1.重构isSpecifiedProperty的部分，将这部分暴露出去做手动调整，人为控制属性
        2.应当完善getPropertyListObject的开头处理部分，如果这里不解决前面读不出来的属性全都会被一键带过
*/

const firstLayer = _.getFirstSelectedLayer();

if (firstLayer) {
    const dateObject = getPropertyDate(firstLayer)
    $.writeln(_.stringify(dateObject))
} else {
    $.writeln("请选择图层")
}


/**
 * 获取指定属性组的属性数据结构。
 *
 * 遍历 `rootProperty` 中的每个属性，并将属性信息以分层的结构存储为 `PropertyDataStructure`：
 * - `Gxxxx`: 表示 `PropertyGroup` 类型的子项，包含递归的子属性数据。
 * - `Pxxxx`: 表示 `Property` 类型的子项，包含属性的值、关键帧值及表达式。
 *
 * @param {PropertyGroup} rootProperty 要处理的属性组。
 * @returns {PropertyDataStructure} 返回包含所有属性数据的对象。
 * @since 0.1.0
 * @category Utility
 * @example
 *
 * ```ts
 * const firstLayer = _.getFirstSelectedLayer();
 *
 * if (firstLayer) {
 *     const dateObject = getPropertyDate(firstLayer);
 *     $.writeln(_.stringify(dateObject));
 * } else {
 *     $.writeln("请选择图层");
 * }
 * ```
 * // 结果：在控制台中打印选中图层的属性数据结构。
 */
function getPropertyDate(rootProperty: PropertyGroup): PropertyDataStructure {
    let date: PropertyDataStructure = {};

    for (let i = 0; i < rootProperty.numProperties; i++) {
        const property = _.getProperty(rootProperty, [i]);
        const matchName = property?.matchName || "Unnamed";

        if (property && _.isPropertyGroup(property)) {
            const groupKey = `G${_.padStart(i.toString(), 4, "0")} ${matchName}`;
            date[groupKey] = getPropertyDate(property);
        } else if (property && _.canSetPropertyValue(property)) {
            const key = `P${_.padStart(i.toString(), 4, "0")} ${matchName}`;
            const propertyValueDate: PropertyValueDate = (date[key] = {});

            if (property.numKeys > 0) {
                propertyValueDate.Keyframe = _.getKeyframeValues(property);
            } else {
                propertyValueDate.value = property.value;
            }

            if (property.expressionEnabled) {
                propertyValueDate.expression = property.expression;
            }
        }
    }

    return date;
}
