import { forOwn, indexOf, omitBy } from "soil-ts";

//该方法和getPropertiesObject为强关联
//所有间接使用过getPropertiesObject的方法都需要用此方法预先去除一遍不可读的object
function removeTargetValues(object: AnyObject): { object: AnyObject, log: AnyObject } {
    const targetStrings = [
        "!value 属性在值类型为 CUSTOM_VALUE 的 Property 上不可读!",
        "!value 属性在值类型为 NO_VALUE 的 Property 上不可读!"
    ];
    const log: AnyObject = {}

    forOwn(object, (value, key) => {
        let nested = object.nestedProperty
        nested = !nested || removeTargetValues(object.nestedProperty).object;
        if(value.values){
        forOwn(value.values, (nestedValue,nestedKey) => {
            if (indexOf(targetStrings,nestedValue) !== -1) {
                // 直接删除符合条件的键值对
                delete object.values[nestedKey];
            }
        })
    }
    });
    return { object, log }
}

export default removeTargetValues