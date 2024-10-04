import { isCustomValueProperty, isNoValueProperty, isProperty } from "soil-ts";

/**
* 案例：提取效果的属性和表达式
* const { values, expressions } = getPropertiesObject(PropertyGroup);
*/
function getPropertiesObject(PropertyGroup: PropertyGroup): { values: propertyValues, expressions: propertyExpression } {
    let values: propertyValues = {};
    let expressions: propertyExpression = {};

    for (let i = 1; i <= PropertyGroup.numProperties; i++) {
        const property = PropertyGroup.property(i);
        if (isProperty(property) && property.isModified) {
                values[property.matchName] = isCustomValueProperty(property)?
                "!value 属性在值类型为 CUSTOM_VALUE 的 Property 上不可读!":isNoValueProperty(property)?
                "!value 属性在值类型为 NO_VALUE 的 Property 上不可读!":property.value;
            if (property.expressionEnabled) {
                expressions[property.matchName] = property.expression;
            }
        }
    }

    return { values, expressions };
}

export default getPropertiesObject