// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: {未填写/未公开}
// - 2024/12/1 03:25:07

(function() {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeToString = objectProto.toString;
    var INFINITY = 1 / 0;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    var charCodeOfDot = ".".charCodeAt(0);
    var reEscapeChar = /\\(\\)?/g;
    var rePropName = /[^.[\]]+|\[(?:([^"'][^[]*)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    function has(object, key) {
        return object != null && hasOwnProperty.call(object, key);
    }
    function getTag(value) {
        if (value == null) {
            return value === undefined ? "[object Undefined]" : "[object Null]";
        }
        return nativeToString.call(value);
    }
    function isArray(value) {
        return getTag(value) == "[object Array]";
    }
    function or() {
        var index = -1;
        var length = arguments.length;
        while (++index < length) {
            if (arguments[index]) {
                return true;
            }
        }
        return false;
    }
    function isKey(value, object) {
        if (isArray(value)) {
            return false;
        }
        var type = typeof value;
        if (type === "number" || type === "boolean" || value == null) {
            return true;
        }
        return or(reIsPlainProp.test(value), !reIsDeepProp.test(value), object != null && value in Object(object));
    }
    function trimString(string) {
        return string.replace(/^\s+/, "").replace(/\s+$/, "");
    }
    function stringToPath(string) {
        var result = [];
        if (string.charCodeAt(0) === charCodeOfDot) {
            result.push("");
        }
        string.replace(rePropName, function(match, expression, quote, subString) {
            var key = match;
            if (quote) {
                key = subString.replace(reEscapeChar, "$1");
            } else if (expression) {
                key = trimString(expression);
            }
            result.push(key);
        });
        return result;
    }
    function castPath(value, object) {
        if (isArray(value)) {
            return value;
        }
        return isKey(value, object) ? [ value ] : stringToPath(value);
    }
    function toKey(value) {
        if (typeof value === "string") {
            return value;
        }
        var result = "".concat(value);
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function baseGet(object, path) {
        var partial = castPath(path, object);
        var index = 0;
        var length = partial.length;
        while (object != null && index < length) {
            object = object[toKey(partial[index++])];
        }
        return index && index == length ? object : undefined;
    }
    function get(object, path, defaultValue) {
        var result = object == null ? undefined : baseGet(object, path);
        return result === undefined ? defaultValue : result;
    }
    function map(array, iteratee) {
        var index = -1;
        var length = array == null ? 0 : array.length;
        var result = new Array(length);
        while (++index < length) {
            result[index] = iteratee(array[index], index, array);
        }
        return result;
    }
    function filter(array, predicate) {
        var index = -1;
        var resIndex = 0;
        var length = array == null ? 0 : array.length;
        var result = [];
        while (++index < length) {
            var value = array[index];
            if (predicate(value, index, array)) {
                result[resIndex++] = value;
            }
        }
        return result;
    }
    function forEach(array, iteratee) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
            if (iteratee(array[index], index, array) === false) {
                break;
            }
        }
        return array;
    }
    function isNil(value) {
        return value == null;
    }
    function isString(value) {
        var type = typeof value;
        return type === "string" || type === "object" && value != null && !isArray(value) && getTag(value) == "[object String]";
    }
    function createIsNativeType(nativeObject) {
        return function(value) {
            return value != null && value instanceof nativeObject;
        };
    }
    var IS_KEY_LABEL_EXISTS = parseFloat(app.version) > 22.5;
    var PROPERTY_INTERPOLATION_TYPE = [ 6612, 6613, 6614 ];
    var isCompItem = createIsNativeType(CompItem);
    function isLayer(value) {
        return has(value, "containingComp") && isCompItem(value.containingComp) && value.parentProperty === null && value.propertyDepth === 0;
    }
    var isMaskPropertyGroup = createIsNativeType(MaskPropertyGroup);
    var isPropertyGroup = createIsNativeType(PropertyGroup);
    function isAddableProperty(value) {
        return isPropertyGroup(value) || isMaskPropertyGroup(value) || isLayer(value);
    }
    function getValidInterpolationTypes(property) {
        return filter(PROPERTY_INTERPOLATION_TYPE, function(enumNumber) {
            return property.isInterpolationTypeValid(enumNumber);
        });
    }
    function isHoldInterpolationTypeOnly(property) {
        var validInterpolationTypes = getValidInterpolationTypes(property);
        return validInterpolationTypes.length === 1 && validInterpolationTypes[0] === KeyframeInterpolationType.HOLD;
    }
    function canSetKeyframeVelocity(property) {
        return !isHoldInterpolationTypeOnly(property);
    }
    var isProperty = createIsNativeType(Property);
    function isCustomValueProperty(property) {
        return isProperty(property) && property.propertyValueType === PropertyValueType.CUSTOM_VALUE;
    }
    function isNoValueProperty(property) {
        return isProperty(property) && property.propertyValueType === PropertyValueType.NO_VALUE;
    }
    function canSetPropertyValue(property) {
        return isProperty(property) && !isNoValueProperty(property) && !isCustomValueProperty(property);
    }
    function isColorProperty(property) {
        return isProperty(property) && property.propertyValueType === PropertyValueType.COLOR;
    }
    function createGetAppProperty(path) {
        return function() {
            return get(app, path);
        };
    }
    var getFirstSelectedLayer = createGetAppProperty([ "project", "activeItem", "selectedLayers", "0" ]);
    function baseGetPropertyByIndex(value, name) {
        return 0 < name && name <= value.numProperties ? value.property(name) : null;
    }
    function getProperty(rootProperty, path) {
        var index = 0;
        var length = path.length;
        var nested = rootProperty;
        while (nested && isAddableProperty(nested) && index < length) {
            var name = path[index++];
            nested = isString(name) ? nested.property(name) : baseGetPropertyByIndex(nested, name);
        }
        return index && index === length ? nested : null;
    }
    function mapTemporalEaseValueToClasses(keyTemporalEaseValue) {
        return map(keyTemporalEaseValue, function(keyframeEase) {
            var speed = keyframeEase.speed;
            var influence = keyframeEase.influence;
            return new KeyframeEase(speed, influence === 0 ? 0.1 : influence);
        });
    }
    function setKeyframeValues(property, keyframeValues) {
        if (keyframeValues.length === 0) {
            return;
        }
        forEach(keyframeValues, function(keyframe) {
            var keyTime = keyframe.keyTime;
            var keyValue = keyframe.keyValue;
            property.setValueAtTime(keyTime, keyValue);
        });
        var isSpatialValue = property.isSpatial && !isColorProperty(property);
        var canSetVelocity = canSetKeyframeVelocity(property);
        forEach(keyframeValues, function(keyframe) {
            var keyIndex = property.nearestKeyIndex(keyframe.keyTime);
            var keyInSpatialTangent = keyframe.keyInSpatialTangent;
            var keyOutSpatialTangent = keyframe.keyOutSpatialTangent;
            var keySpatialAutoBezier = keyframe.keySpatialAutoBezier;
            var keySpatialContinuous = keyframe.keySpatialContinuous;
            var keyInTemporalEase = keyframe.keyInTemporalEase;
            var keyOutTemporalEase = keyframe.keyOutTemporalEase;
            var keyTemporalContinuous = keyframe.keyTemporalContinuous;
            var keyTemporalAutoBezier = keyframe.keyTemporalAutoBezier;
            var keyInInterpolationType = keyframe.keyInInterpolationType;
            var keyOutInterpolationType = keyframe.keyOutInterpolationType;
            var keyRoving = keyframe.keyRoving;
            var keyLabel = keyframe.keyLabel;
            var keySelected = keyframe.keySelected;
            if (isSpatialValue) {
                !isNil(keyInSpatialTangent) && property.setSpatialTangentsAtKey(keyIndex, keyInSpatialTangent, keyOutSpatialTangent);
                !isNil(keySpatialAutoBezier) && property.setSpatialAutoBezierAtKey(keyIndex, keySpatialAutoBezier);
                !isNil(keySpatialContinuous) && property.setSpatialContinuousAtKey(keyIndex, keySpatialContinuous);
                !isNil(keyRoving) && property.setRovingAtKey(keyIndex, keyRoving);
            }
            if (canSetVelocity) {
                !isNil(keyInTemporalEase) && property.setTemporalEaseAtKey(keyIndex, mapTemporalEaseValueToClasses(keyInTemporalEase), !isNil(keyOutTemporalEase) ? mapTemporalEaseValueToClasses(keyOutTemporalEase) : void 0);
            }
            !isNil(keyTemporalContinuous) && property.setTemporalContinuousAtKey(keyIndex, keyTemporalContinuous);
            !isNil(keyTemporalAutoBezier) && property.setTemporalAutoBezierAtKey(keyIndex, keyTemporalAutoBezier);
            !isNil(keyInInterpolationType) && property.setInterpolationTypeAtKey(keyIndex, keyInInterpolationType, !isNil(keyOutInterpolationType) ? keyOutInterpolationType : void 0);
            if (IS_KEY_LABEL_EXISTS) {
                !isNil(keyLabel) && property.setLabelAtKey(keyIndex, keyLabel);
            }
            !isNil(keySelected) && property.setSelectedAtKey(keyIndex, keySelected);
        });
    }
    var firstLayer = getFirstSelectedLayer();
    var keyDate = [ {
        "keyTime": 0,
        "keyValue": [ 1178.5, 663, 0 ],
        "keySelected": false,
        "keyInTemporalEase": [ {
            "influence": 16.666666667,
            "speed": 0
        } ],
        "keyOutTemporalEase": [ {
            "influence": 16.666666667,
            "speed": 255.143499755859
        } ],
        "keyTemporalContinuous": false,
        "keyTemporalAutoBezier": false,
        "keyInInterpolationType": 6612,
        "keyOutInterpolationType": 6612,
        "keyInSpatialTangent": [ -35.436595916748, 0, 0 ],
        "keyOutSpatialTangent": [ 35.436595916748, 0, 0 ],
        "keySpatialAutoBezier": true,
        "keySpatialContinuous": true,
        "keyRoving": false,
        "keyLabel": 0
    }, {
        "keyTime": 0.83333333333333,
        "keyValue": [ 1391.11958312988, 663, 0 ],
        "keySelected": false,
        "keyInTemporalEase": [ {
            "influence": 16.666666667,
            "speed": 255.143499755859
        } ],
        "keyOutTemporalEase": [ {
            "influence": 16.666666667,
            "speed": 0
        } ],
        "keyTemporalContinuous": false,
        "keyTemporalAutoBezier": false,
        "keyInInterpolationType": 6612,
        "keyOutInterpolationType": 6612,
        "keyInSpatialTangent": [ -35.436595916748, 0, 0 ],
        "keyOutSpatialTangent": [ 35.436595916748, 0, 0 ],
        "keySpatialAutoBezier": true,
        "keySpatialContinuous": true,
        "keyRoving": false,
        "keyLabel": 0
    } ];
    if (firstLayer) {
        var position = getProperty(firstLayer, [ "ADBE Transform Group", "ADBE Position" ]);
        if (isProperty(position) && canSetPropertyValue(position) && position.numKeys > 0) {
            setKeyframeValues(position, keyDate);
        } else {
            $.writeln("No keyframes found on the Position property.");
        }
    } else {
        $.writeln("No layer selected or invalid selection.");
    }
}).call(this);
