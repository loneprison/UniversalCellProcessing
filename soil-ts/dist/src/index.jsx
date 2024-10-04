import * as _ from "soil-ts";
import * as ULib from "utilsLibrary";
var activeItem = _.getActiveComp();
var fristLayet = _.getFirstSelectedLayer();
_.getFirstSelectedLayer;
if (activeItem) {
    if (fristLayet) {
        var layerStyles = fristLayet.property("ADBE Layer Styles");
        var object = {};
        var log = {};
        var targetString = ["!value 属性在值类型为 CUSTOM_VALUE 的 Property 上不可读!"];
        if (layerStyles.canSetEnabled) {
            if (_.isPropertyGroup(layerStyles)) {
                for (var i = 1; i <= layerStyles.numProperties; i++) {
                    var eachLayerStyles = layerStyles.property(i);
                    var matchName = eachLayerStyles.matchName;
                    var name = eachLayerStyles.name;
                    var keyName = "layerStyles_".concat(i);
                    var isEnabled = eachLayerStyles.enabled;
                    if (_.isPropertyGroup(eachLayerStyles) &&
                        (eachLayerStyles.canSetEnabled || matchName == "ADBE Blend Options Group")) {
                        var _a = ULib.getPropertiesObject(eachLayerStyles), values = _a.values, expressions = _a.expressions;
                        object[keyName] = {
                            matchName: matchName,
                            name: name,
                            isEnabled: isEnabled,
                            values: values,
                            expressions: expressions
                        };
                    }
                }
            }
        }
        _.omit(object, targetString);
        alert(_.stringify(object));
    }
}
function getEffectOfLayer(layer) {
    var effects = layer.property("ADBE Effect Parade");
    var object = {};
    var log = {};
    var targetString = "!value 属性在值类型为 CUSTOM_VALUE 的 Property 上不可读!";
    if (_.isPropertyGroup(effects)) {
        for (var i = 1; i <= effects.numProperties; i++) {
            var effect = effects.property(i);
            var matchName = effect.matchName;
            var name = effect.name;
            var keyName = "effect_".concat(i);
            var isEnabled = effect.enabled;
            if (_.isPropertyGroup(effect)) {
                var _a = ULib.getPropertiesObject(effect), values = _a.values, expressions = _a.expressions;
                object[keyName] = {
                    matchName: matchName,
                    name: name,
                    isEnabled: isEnabled,
                    values: values,
                    expressions: expressions
                };
            }
        }
    }
    _.forOwn(object, function (value, key) {
        var _a = object[key], matchName = _a.matchName, name = _a.name, values = _a.values;
        var keysToDelete = [];
        _.forOwn(values, function (effectValue, effectKey) {
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
        _.forEach(keysToDelete, function (effectKey) {
            delete object[key].values[effectKey];
        });
    });
    return { effectObj: object, log: log };
}
