import {isProperty, isPropertyGroup, isPropertyType } from "soil-ts";

//慎用
function setPropertyValueByIndex(property: Property, pathIndex: number[], value: any): Property {
    let index = 0
    let nested = property
    while (index < pathIndex.length) {
        let a = property.property(pathIndex[index])
        nested = isProperty(a)?a:property
    }
    return nested;
}

export default setPropertyValueByIndex;
