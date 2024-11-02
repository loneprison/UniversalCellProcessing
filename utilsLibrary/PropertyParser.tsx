import { getProperty, isCustomValueProperty, isEmpty, isMaskPropertyGroup, isNamedGroupType, isNoValueProperty, isProperty, isPropertyGroup, isUndefined, padStart, tree } from "soil-ts";

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

class PropertySerializer {
    public static getPropertyObject(property: Property): AnyObject {
        const object: AnyObject = {};
        const unreadableType = PropertySerializer.getUnreadableType(property);
        object.propertyValue = unreadableType
            ? `!value 属性在值类型为 ${unreadableType} 的 Property 上不可读!`
            : property.value;

        if (property.expressionEnabled) {
            object.propertyExpression = property.expression;
        }

        return object;
    }

    private static getUnreadableType(property: Property): string | undefined {
        if (isNoValueProperty(property)) return "NO_VALUE";
        if (isCustomValueProperty(property)) return "CUSTOM_VALUE";
        return undefined;
    }
}


class PropertyParser {
    private getPropertyGroupMetadata(propertyGroup: _PropertyClasses): AnyObject {
        const object: AnyObject = {};
        if (propertyGroup.canSetEnabled) object.enabled = propertyGroup.enabled
        if (!isNamedGroupType(propertyGroup.propertyGroup(1))) object.name = propertyGroup.name;
        return object;
    }

    private isSpecifiedProperty(rootProperty: _PropertyClasses, isLayerStyles: boolean): rootProperty is PropertyGroup | MaskPropertyGroup {
        const isValidGroupProperty = isPropertyGroup(rootProperty) || isMaskPropertyGroup(rootProperty)
        const isNormalPropertyGroup = !isLayerStyles && isValidGroupProperty;
        const isLayerStyleProperty = isLayerStyles && rootProperty.canSetEnabled;
        const isBlendOptions = rootProperty.matchName === "ADBE Blend Options Group";

        return isNormalPropertyGroup || isLayerStyleProperty || isBlendOptions;
    }

    public getPropertyListObject(rootProperty: PropertyGroup | MaskPropertyGroup, path?: AdbePath): AnyObject | undefined {
        const propertyGroup = path ? getProperty(rootProperty, path) : rootProperty;
        if (!isPropertyGroup(propertyGroup) && !isMaskPropertyGroup(propertyGroup)) return undefined;

        const object: AnyObject = {};
        const isLayerStyles = propertyGroup.matchName === "ADBE Layer Styles";

        const selfMetadata = this.getPropertyGroupMetadata(propertyGroup);
        if (!isEmpty(selfMetadata)) object["0000 | selfProperty"] = selfMetadata;

        for (let i = 1; i <= propertyGroup.numProperties; i++) {
            const property = propertyGroup.property(i);
            const matchName = property.matchName;
            const keyName = `${padStart(i.toString(), 4, "0")} ${matchName}`;

            if (this.isSpecifiedProperty(property, isLayerStyles)) {
                object[keyName] = this.getPropertyListObject(property, undefined);
            } else if (isProperty(property) && property.isModified) {
                object[keyName] = PropertySerializer.getPropertyObject(property);
            }
        }

        return object;
    }
}


export default PropertyParser