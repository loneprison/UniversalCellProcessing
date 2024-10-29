import { getProperty, isCustomValueProperty, isEmpty, isMaskPropertyGroup, isNamedGroupType, isNoValueProperty, isProperty, isPropertyGroup, isUndefined, padStart, tree } from "soil-ts";

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