function isIndexedGroupType(property: _PropertyClasses): boolean {
    return property.propertyType == PropertyType.INDEXED_GROUP;
}

export default isIndexedGroupType;
