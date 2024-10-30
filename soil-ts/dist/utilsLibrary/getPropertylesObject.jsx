import { getProperty, isCustomValueProperty, isNoValueProperty, isProperty, isPropertyGroup } from "soil-ts";
function getPropertiesObject(rootProperty, path) {
    var propertyGroup = path ? getProperty(rootProperty, path) : rootProperty;
    if (!propertyGroup)
        return undefined;
    var isLayerStyles = (path === null || path === void 0 ? void 0 : path.length) === 1 && path[0] === "ADBE Layer Styles";
    var object = {};
    if (isPropertyGroup(propertyGroup)) {
        for (var i = 1; i <= propertyGroup.numProperties; i++) {
            var property = propertyGroup.property(i);
            var keyName = "{".concat(i, " | ").concat(property.name, " | ").concat(property.matchName).concat(property.canSetEnabled ? " | " + property.enabled : "", "}");
            if ((!isLayerStyles && isPropertyGroup(property)) ||
                (isLayerStyles && property.canSetEnabled) ||
                property.matchName == "ADBE Blend Options Group") {
                var nested = object.nestedProperty || (object.nestedProperty = {});
                nested[keyName] = getPropertiesObject(property, undefined);
            }
            else if (isProperty(property) && property.isModified) {
                object.values || (object.values = {});
                object.values[property.matchName] = isNoValueProperty(property)
                    ? "!value 属性在值类型为 NO_VALUE 的 Property 上不可读!"
                    : isCustomValueProperty(property)
                        ? "!value 属性在值类型为 CUSTOM_VALUE 的 Property 上不可读!"
                        : property.value;
                if (property.expressionEnabled) {
                    object.expressions || (object.expressions = {});
                    object.expressions[property.matchName] = property.expression;
                }
            }
        }
    }
    return object;
}
export default getPropertiesObject;
