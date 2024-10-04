import { isCustomValueProperty, isNoValueProperty, isProperty } from "soil-ts";
function getPropertiesObject(PropertyGroup) {
    var values = {};
    var expressions = {};
    for (var i = 1; i <= PropertyGroup.numProperties; i++) {
        var property = PropertyGroup.property(i);
        if (isProperty(property) && property.isModified) {
            values[property.matchName] = isCustomValueProperty(property) ?
                "!value 属性在值类型为 CUSTOM_VALUE 的 Property 上不可读!" : isNoValueProperty(property) ?
                "!value 属性在值类型为 NO_VALUE 的 Property 上不可读!" : property.value;
            if (property.expressionEnabled) {
                expressions[property.matchName] = property.expression;
            }
        }
    }
    return { values: values, expressions: expressions };
}
export default getPropertiesObject;
