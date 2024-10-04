function isCustomValueProperty(property: Property): boolean {
    return property.propertyValueType === PropertyValueType.CUSTOM_VALUE;
}

export default isCustomValueProperty;
