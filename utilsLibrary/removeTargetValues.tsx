import { forOwn, indexOf, omitBy } from "soil-ts";

//该方法和getPropertiesObject为强关联
//所有间接使用过getPropertiesObject的方法都需要用此方法预先去除一遍不可读的object
function removeTargetValues(object: propertyGroupObj): { object: propertyGroupObj, log: AnyObject } {
    const targetStrings = [
        "!value 属性在值类型为 CUSTOM_VALUE 的 Property 上不可读!",
        "!value 属性在值类型为 NO_VALUE 的 Property 上不可读!"
    ];
    const log: AnyObject = {}

    forOwn(object, (group, groupKey) => {
        forOwn(group.values, (value, key) => {
            if (indexOf(targetStrings, value) !== -1) {
                // 记录日志
                if (!log[groupKey]) {
                    const { matchName, name } = group;
                    log[groupKey] = {
                        matchName,
                        name,
                        values: {}
                    };
                }
                const logValues = log[groupKey]["values"];
                logValues[key] = value;

                // 直接删除符合条件的键值对
                delete group.values[key];
            }
        });

        // 因为无名重写的omitBy拿不到key的值因此我记录不到key
        // 但我觉得我应该记录它，因此这里改用第二层forown

        // group.values = omitBy(group.values, (value) => {
        //     if (indexOf(targetStrings, value) !== -1) {
        //         log[];
        //         return true;  // 返回 true 表示删除该键值对
        //     }
        //     return false;
        // });
    });
    return { object, log }
}

export default removeTargetValues