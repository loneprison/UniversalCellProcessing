import { getProperty, isCustomValueProperty, isEmpty, isMaskPropertyGroup, isNamedGroupType, isNoValueProperty, isProperty, isPropertyGroup, padStart } from "soil-ts";
var PropertySerializer = (function () {
    function PropertySerializer() {
    }
    PropertySerializer.getPropertyObject = function (property) {
        var object = {};
        var unreadableType = PropertySerializer.getUnreadableType(property);
        object.propertyValue = unreadableType
            ? "!value \u5C5E\u6027\u5728\u503C\u7C7B\u578B\u4E3A ".concat(unreadableType, " \u7684 Property \u4E0A\u4E0D\u53EF\u8BFB!")
            : property.value;
        if (property.expressionEnabled) {
            object.propertyExpression = property.expression;
        }
        return object;
    };
    PropertySerializer.getUnreadableType = function (property) {
        if (isNoValueProperty(property))
            return "NO_VALUE";
        if (isCustomValueProperty(property))
            return "CUSTOM_VALUE";
        return undefined;
    };
    return PropertySerializer;
}());
var PropertyParser = (function () {
    function PropertyParser() {
    }
    PropertyParser.prototype.getPropertyGroupMetadata = function (propertyGroup) {
        var object = {};
        if (propertyGroup.canSetEnabled)
            object.enabled = propertyGroup.enabled;
        if (!isNamedGroupType(propertyGroup.propertyGroup(1)))
            object.name = propertyGroup.name;
        return object;
    };
    PropertyParser.prototype.isSpecifiedProperty = function (rootProperty, isLayerStyles) {
        var isValidGroupProperty = isPropertyGroup(rootProperty) || isMaskPropertyGroup(rootProperty);
        var isNormalPropertyGroup = !isLayerStyles && isValidGroupProperty;
        var isLayerStyleProperty = isLayerStyles && rootProperty.canSetEnabled;
        var isBlendOptions = rootProperty.matchName === "ADBE Blend Options Group";
        return isNormalPropertyGroup || isLayerStyleProperty || isBlendOptions;
    };
    PropertyParser.prototype.getPropertyListObject = function (rootProperty, path) {
        var propertyGroup = path ? getProperty(rootProperty, path) : rootProperty;
        if (!isPropertyGroup(propertyGroup) && !isMaskPropertyGroup(propertyGroup))
            return undefined;
        var object = {};
        var isLayerStyles = propertyGroup.matchName === "ADBE Layer Styles";
        var selfMetadata = this.getPropertyGroupMetadata(propertyGroup);
        if (!isEmpty(selfMetadata))
            object["0000 | selfProperty"] = selfMetadata;
        for (var i = 1; i <= propertyGroup.numProperties; i++) {
            var property = propertyGroup.property(i);
            var matchName = property.matchName;
            var keyName = "".concat(padStart(i.toString(), 4, "0"), " ").concat(matchName);
            if (this.isSpecifiedProperty(property, isLayerStyles)) {
                object[keyName] = this.getPropertyListObject(property, undefined);
            }
            else if (isProperty(property) && property.isModified) {
                object[keyName] = PropertySerializer.getPropertyObject(property);
            }
        }
        return object;
    };
    return PropertyParser;
}());
export default PropertyParser;
