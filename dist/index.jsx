// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: {未填写/未公开}
// - 2024/11/25 01:42:25

(function() {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeToString = objectProto.toString;
    var INFINITY = 1 / 0;
    var MAX_ARRAY_LENGTH = 4294967295;
    var MAX_SAFE_INTEGER = 9007199254740991;
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
    function isObjectLike(value) {
        return typeof value === "object" && value !== null;
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
    function forOwn(object, iteratee) {
        for (var key in object) {
            if (has(object, key)) {
                if (iteratee(object[key], key, object) === false) {
                    break;
                }
            }
        }
        return object;
    }
    function isDate(value) {
        return isObjectLike(value) && getTag(value) == "[object Date]";
    }
    function isNil(value) {
        return value == null;
    }
    function isString(value) {
        var type = typeof value;
        return type === "string" || type === "object" && value != null && !isArray(value) && getTag(value) == "[object String]";
    }
    function times(n, iteratee) {
        if (n < 1 || n > MAX_SAFE_INTEGER) {
            return [];
        }
        var index = -1;
        var length = Math.min(n, MAX_ARRAY_LENGTH);
        var result = new Array(length);
        while (++index < length) {
            result[index] = iteratee(index);
        }
        index = MAX_ARRAY_LENGTH;
        n -= MAX_ARRAY_LENGTH;
        while (++index < n) {
            iteratee(index);
        }
        return result;
    }
    function createIsNativeType(nativeObject) {
        return function(value) {
            return value != null && value instanceof nativeObject;
        };
    }
    var IS_KEY_LABEL_EXISTS = parseFloat(app.version) > 22.5;
    var PROPERTY_INTERPOLATION_TYPE = [ 6612, 6613, 6614 ];
    var jsonEscapes = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\v": "\\v",
        '"': '\\"',
        "\\": "\\\\"
    };
    var reEscapedJson = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var reHasEscapedJson = new RegExp(reEscapedJson.source);
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
    function isCustomValueProperty(property) {
        return property.propertyValueType === PropertyValueType.CUSTOM_VALUE;
    }
    function isNoValueProperty(property) {
        return property.propertyValueType === PropertyValueType.NO_VALUE;
    }
    var isProperty = createIsNativeType(Property);
    function canSetPropertyValue(property) {
        return isProperty(property) && !isNoValueProperty(property) && !isCustomValueProperty(property);
    }
    function getKeyframeValueByIndex(property, keyIndex, isSpatialValue, isCustomValue) {
        return {
            keyTime: property.keyTime(keyIndex),
            keyValue: isCustomValue ? null : property.keyValue(keyIndex),
            keySelected: property.keySelected(keyIndex),
            keyInTemporalEase: property.keyInTemporalEase(keyIndex),
            keyOutTemporalEase: property.keyOutTemporalEase(keyIndex),
            keyTemporalContinuous: property.keyTemporalContinuous(keyIndex),
            keyTemporalAutoBezier: property.keyTemporalAutoBezier(keyIndex),
            keyInInterpolationType: property.keyInInterpolationType(keyIndex),
            keyOutInterpolationType: property.keyOutInterpolationType(keyIndex),
            keyInSpatialTangent: isSpatialValue ? property.keyInSpatialTangent(keyIndex) : null,
            keyOutSpatialTangent: isSpatialValue ? property.keyOutSpatialTangent(keyIndex) : null,
            keySpatialAutoBezier: isSpatialValue ? property.keySpatialAutoBezier(keyIndex) : null,
            keySpatialContinuous: isSpatialValue ? property.keySpatialContinuous(keyIndex) : null,
            keyRoving: isSpatialValue ? property.keyRoving(keyIndex) : null,
            keyLabel: IS_KEY_LABEL_EXISTS ? property.keyLabel(keyIndex) : null
        };
    }
    function isColorProperty(property) {
        return property.propertyValueType === PropertyValueType.COLOR;
    }
    function getKeyframeValues(property, predicate) {
        var isSpatialValue = property.isSpatial && !isColorProperty(property);
        var isCustomValue = isCustomValueProperty(property);
        var result = [];
        times(property.numKeys, function(index) {
            var keyIndex = index + 1;
            {
                result.push(getKeyframeValueByIndex(property, keyIndex, isSpatialValue, isCustomValue));
            }
        });
        return result;
    }
    function getActiveItem() {
        return app.project.activeItem;
    }
    function getActiveComp() {
        var item = getActiveItem();
        return isCompItem(item) ? item : undefined;
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
    var isAVLayer = createIsNativeType(AVLayer);
    var isShapeLayer = createIsNativeType(ShapeLayer);
    var isTextLayer = createIsNativeType(TextLayer);
    function isRasterLayer(layer) {
        return isAVLayer(layer) || isShapeLayer(layer) || isTextLayer(layer);
    }
    function concatJson(head, partial, gap, mind, tail) {
        return gap ? head + "\n" + gap + partial.join(",\n" + gap) + "\n" + mind + tail : head + partial.join(",") + tail;
    }
    function concatJsonKey(string) {
        return reHasEscapedJson.test(string) ? '"' + escapeJsonKey(string) + '"' : '"' + string + '"';
    }
    function concatSpaceIndent(n) {
        var indent = "", index = -1;
        while (++index < n) {
            indent += " ";
        }
        return indent;
    }
    function escapeJsonKey(string) {
        return string.replace(reEscapedJson, function(matched) {
            var escaped = has(jsonEscapes, matched) ? jsonEscapes[matched] : undefined;
            return isString(escaped) ? escaped : hexEncode(matched);
        });
    }
    function getPrimitiveValue(value) {
        return isDate(value) ? value.toString() : value.valueOf();
    }
    function hexEncode(string) {
        return "\\u" + ("0000" + string.charCodeAt(0).toString(16)).slice(-4);
    }
    function stringify(value, indent) {
        if (indent === void 0) {
            indent = 4;
        }
        return stringifyValue(value, isString(indent) ? indent : concatSpaceIndent(indent), "");
    }
    function stringifyArray(array, indent, gap) {
        var mind = gap;
        gap += indent;
        var partial = [];
        forEach(array, function(value, index) {
            partial[index] = stringifyValue(value, indent, gap);
        });
        return partial.length === 0 ? "[]" : concatJson("[", partial, gap, mind, "]");
    }
    function stringifyObject(object, indent, gap) {
        var mind = gap;
        gap += indent;
        var colon = gap ? ": " : ":";
        var partial = [];
        forOwn(object, function(value, key) {
            partial.push(concatJsonKey(key) + colon + stringifyValue(value, indent, gap));
        });
        return partial.length === 0 ? "{}" : concatJson("{", partial, gap, mind, "}");
    }
    function stringifyValue(value, indent, gap) {
        if (value == null) {
            return "null";
        }
        var primitive = getPrimitiveValue(value);
        switch (typeof primitive) {
          case "string":
            return concatJsonKey(primitive);

          case "number":
            return isFinite(primitive) ? String(primitive) : "null";

          case "boolean":
            return String(primitive);

          case "object":
            return isArray(primitive) ? stringifyArray(primitive, indent, gap) : stringifyObject(primitive, indent, gap);

          case "function":
            return '"' + escapeJsonKey(primitive.toString()) + '"';

          default:
            return "null";
        }
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
    function getKeyframeObjects(property) {
        var KeyframeArray = getKeyframeValues(property);
        return map(KeyframeArray, function(Keyframe) {
            return {
                keyTime: Keyframe.keyTime,
                keyValue: Keyframe.keyValue,
                keySelected: Keyframe.keySelected,
                keyInTemporalEase: Keyframe.keyInTemporalEase,
                keyOutTemporalEase: Keyframe.keyOutTemporalEase,
                keyTemporalContinuous: Keyframe.keyTemporalContinuous,
                keyTemporalAutoBezier: Keyframe.keyTemporalAutoBezier,
                keyInInterpolationType: Keyframe.keyInInterpolationType,
                keyOutInterpolationType: Keyframe.keyOutInterpolationType,
                keyInSpatialTangent: Keyframe.keyInSpatialTangent,
                keyOutSpatialTangent: Keyframe.keyOutSpatialTangent,
                keySpatialAutoBezier: Keyframe.keySpatialAutoBezier,
                keySpatialContinuous: Keyframe.keySpatialContinuous,
                keyRoving: Keyframe.keyRoving,
                keyLabel: Keyframe.keyLabel
            };
        });
    }
    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) {
                    if (Object.prototype.hasOwnProperty.call(s, p)) {
                        t[p] = s[p];
                    }
                }
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function setKeyframeValuesToProperty(property, keyframeArray) {
        setKeyframeValues(property, map(keyframeArray, function(keyframe) {
            return __assign({}, keyframe);
        }));
    }
    var activeItem = getActiveComp();
    var firstLayer = getFirstSelectedLayer();
    var layer1 = activeItem === null || activeItem === void 0 ? void 0 : activeItem.layer(1);
    if (firstLayer && layer1 && isRasterLayer(firstLayer) && isRasterLayer(layer1)) {
        var timeRemap = getProperty(firstLayer, [ "timeRemap" ]);
        var timeRemap2 = getProperty(layer1, [ "timeRemap" ]);
        if (isProperty(timeRemap) && isProperty(timeRemap2)) {
            layer1.timeRemapEnabled = true;
            if (canSetPropertyValue(timeRemap)) {
                setKeyframeValuesToProperty(timeRemap2, getKeyframeObjects(timeRemap));
                $.writeln(stringify(getKeyframeObjects(firstLayer.marker)));
            }
        }
    }
}).call(this);
