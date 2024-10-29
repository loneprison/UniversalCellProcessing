function isNamedGroupType(property: _PropertyClasses): boolean {
    return property.propertyType == PropertyType.NAMED_GROUP;
}

export default isNamedGroupType;
