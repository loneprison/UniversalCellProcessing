import { forOwn, indexOf } from "soil-ts";
function removeTargetValues(object) {
    var targetStrings = [
        "!value 属性在值类型为 CUSTOM_VALUE 的 Property 上不可读!",
        "!value 属性在值类型为 NO_VALUE 的 Property 上不可读!"
    ];
    var log = {};
    forOwn(object, function (value, key) {
        var nested = object.nestedProperty;
        nested = !nested || removeTargetValues(object.nestedProperty).object;
        if (value.values) {
            forOwn(value.values, function (nestedValue, nestedKey) {
                if (indexOf(targetStrings, nestedValue) !== -1) {
                    delete object.values[nestedKey];
                }
            });
        }
    });
    return { object: object, log: log };
}
export default removeTargetValues;
