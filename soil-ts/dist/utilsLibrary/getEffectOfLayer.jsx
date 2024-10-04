import { forEach, forOwn, isPropertyGroup } from "soil-ts";
import getPropertiesObject from "./getPropertiesObject";
function getEffectOfLayer(layer) {
    var effects = layer.property("ADBE Effect Parade");
    var object = {};
    var log = {};
    var targetString = "!value 属性在值类型为 CUSTOM_VALUE 的 Property 上不可读!";
    if (isPropertyGroup(effects)) {
        for (var i = 1; i <= effects.numProperties; i++) {
            var effect = effects.property(i);
            var matchName = effect.matchName;
            var name = effect.name;
            var keyName = "effect".concat(i);
            if (isPropertyGroup(effect)) {
                var _a = getPropertiesObject(effect), values = _a.values, expressions = _a.expressions;
                object[keyName] = {
                    matchName: matchName,
                    name: name,
                    values: values,
                    expressions: expressions
                };
            }
        }
    }
    forOwn(object, function (value, key) {
        var _a = object[key], matchName = _a.matchName, name = _a.name, values = _a.values;
        var keysToDelete = [];
        forOwn(values, function (effectValue, effectKey) {
            if (effectValue === targetString) {
                if (!log[key]) {
                    log[key] = {
                        matchName: matchName,
                        name: name,
                        values: {}
                    };
                }
                log[key].values[effectKey] = effectValue;
                keysToDelete.push(effectKey);
            }
        });
        forEach(keysToDelete, function (effectKey) {
            delete object[key].values[effectKey];
        });
    });
    return { effectObj: object, log: log };
}
export default getEffectOfLayer;
