// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: {未填写/未公开}
// - 2024/12/4 13:50:27

(function() {
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
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeToString = objectProto.toString;
    var nativeFloor = Math.floor;
    var INFINITY = 1 / 0;
    var MAX_ARRAY_LENGTH = 4294967295;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    var charCodeOfDot = ".".charCodeAt(0);
    var reEscapeChar = /\\(\\)?/g;
    var rePropName = /[^.[\]]+|\[(?:([^"'][^[]*)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f";
    var reComboHalfMarksRange = "\\ufe20-\\ufe2f";
    var rsComboSymbolsRange = "\\u20d0-\\u20ff";
    var rsComboMarksExtendedRange = "\\u1ab0-\\u1aff";
    var rsComboMarksSupplementRange = "\\u1dc0-\\u1dff";
    var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange + rsComboMarksExtendedRange + rsComboMarksSupplementRange;
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsAstral = "[".concat(rsAstralRange, "]");
    var rsCombo = "[".concat(rsComboRange, "]");
    var rsFitz = "\\ud83c[\\udffb-\\udfff]";
    var rsModifier = "(?:".concat(rsCombo, "|").concat(rsFitz, ")");
    var rsNonAstral = "[^".concat(rsAstralRange, "]");
    var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
    var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
    var rsZWJ = "\\u200d";
    var reHasUnicode = RegExp("[".concat(rsZWJ + rsAstralRange + rsComboRange + rsVarRange, "]"));
    var reOptMod = "".concat(rsModifier, "?");
    var rsOptVar = "[".concat(rsVarRange, "]?");
    var rsOptJoin = "(?:".concat(rsZWJ, "(?:").concat([ rsNonAstral, rsRegional, rsSurrPair ].join("|"), ")").concat(rsOptVar + reOptMod, ")*");
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsNonAstralCombo = "".concat(rsNonAstral).concat(rsCombo, "?");
    var rsSymbol = "(?:".concat([ rsNonAstralCombo, rsCombo, rsRegional, rsSurrPair, rsAstral ].join("|"), ")");
    var reUnicode = RegExp("".concat(rsFitz, "(?=").concat(rsFitz, ")|").concat(rsSymbol + rsSeq), "g");
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
    function isArguments(value) {
        return isObjectLike(value) && getTag(value) == "[object Arguments]";
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
    function isLength(value) {
        return typeof value === "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isArrayLike(value) {
        return value != null && typeof value !== "function" && isLength(value.length);
    }
    function slice(array, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
            return [];
        }
        start = start == null ? 0 : start;
        end = end === undefined ? length : end;
        if (start < 0) {
            start = -start > length ? 0 : length + start;
        }
        end = end > length ? length : end;
        if (end < 0) {
            end += length;
        }
        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var index = -1;
        var result = new Array(length);
        while (++index < length) {
            result[index] = array[index + start];
        }
        return result;
    }
    function castSlice(array, start, end) {
        var length = array.length;
        end = end === undefined ? length : end;
        return !start && end >= length ? array : slice(array, start, end);
    }
    function hasUnicode(string) {
        return reHasUnicode.test(string);
    }
    function asciiToArray(string) {
        return string.split("");
    }
    function unicodeToArray(string) {
        return string.match(reUnicode) || [];
    }
    function stringToArray(string) {
        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
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
    function isEmpty(value) {
        if (value == null) {
            return true;
        }
        if (isArrayLike(value) && (isArray(value) || typeof value === "string" || isArguments(value))) {
            return !value.length;
        }
        for (var key in value) {
            if (has(value, key)) {
                return false;
            }
        }
        return true;
    }
    function isString(value) {
        var type = typeof value;
        return type === "string" || type === "object" && value != null && !isArray(value) && getTag(value) == "[object String]";
    }
    function baseToString(value) {
        if (typeof value === "string") {
            return value;
        }
        if (isArray(value)) {
            return "".concat(map(value, baseToString));
        }
        var result = "".concat(value);
        return result === "0" && 1 / value === -INFINITY ? "-0" : result;
    }
    function asciiSize(string) {
        return string.length;
    }
    function unicodeSize(string) {
        var result = reUnicode.lastIndex = 0;
        while (reUnicode.test(string)) {
            ++result;
        }
        return result;
    }
    function stringSize(string) {
        return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }
    function repeat(string, n) {
        var result = "";
        if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
            return result;
        }
        do {
            if (n % 2) {
                result += string;
            }
            n = nativeFloor(n / 2);
            if (n) {
                string += string;
            }
        } while (n);
        return result;
    }
    function createPadding(length, chars) {
        chars = chars === undefined ? " " : baseToString(chars);
        var charsLength = chars.length;
        if (charsLength < 2) {
            return charsLength ? repeat(chars, length) : chars;
        }
        var result = repeat(chars, Math.ceil(length / stringSize(chars)));
        return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join("") : result.slice(0, length);
    }
    function padStart(string, length, chars) {
        var strLength = stringSize(string);
        return strLength < length ? createPadding(length - strLength, chars) + string : string || "";
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
        return isProperty(property) && property.propertyValueType === PropertyValueType.COLOR;
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
    function createIsAVLayer(callback) {
        return function(value) {
            return isAVLayer(value) && callback(value);
        };
    }
    var isCameraLayer = createIsNativeType(CameraLayer);
    var isCompLayer = createIsAVLayer(function(layer) {
        return isCompItem(layer.source);
    });
    function isIndexedGroupType(property) {
        return isPropertyGroup(property) && property.propertyType == PropertyType.INDEXED_GROUP;
    }
    var isLightLayer = createIsNativeType(LightLayer);
    function isNamedGroupType(property) {
        return isPropertyGroup(property) && property.propertyType == PropertyType.NAMED_GROUP;
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
    var firstLayer = getFirstSelectedLayer();
    var selfKey = "S0000 selfProperty";
    if (isRasterLayer(firstLayer)) {
        var dataObject = getRootPropertyData(firstLayer);
        $.writeln(stringify(dataObject));
    } else {
        $.writeln("请选择图层");
    }
    function getRootPropertyData(rootProperty) {
        var data = {};
        if (isProperty(rootProperty) || isPropertyGroup(rootProperty)) {
            data = processProperty(rootProperty);
        } else if (isLayer(rootProperty)) {
            data = getLayerData(rootProperty);
        }
        return data;
    }
    function processProperty(property, index) {
        var data = {};
        var matchName = property === null || property === void 0 ? void 0 : property.matchName;
        if (isPropertyGroup(property)) {
            var selfMetadata = getSelfMetadata(property);
            if (!isEmpty(selfMetadata)) {
                data[selfKey] = selfMetadata;
            }
            var groupKey = "G".concat(padStart((index === null || index === void 0 ? void 0 : index.toString()) || "1", 4, "0"), " ").concat(matchName);
            data[groupKey] = getPropertyGroupData(property);
        } else if (canSetPropertyValue(property)) {
            var key = "P".concat(padStart((index === null || index === void 0 ? void 0 : index.toString()) || "1", 4, "0"), " ").concat(matchName);
            data[key] = getPropertyData(property);
        }
        return data;
    }
    function getPropertyGroupData(propertyGroup) {
        var data = {};
        for (var i = 0; i < propertyGroup.numProperties; i++) {
            var property = getProperty(propertyGroup, [ i ]);
            if (property) {
                var propertyData = processProperty(property, i);
                data = __assign(__assign({}, data), propertyData);
            }
        }
        return data;
    }
    function getLayerData(layer) {
        var data = {};
        if (isAVLayer(layer)) {
            if (isCompLayer(layer)) {} else {
                data[selfKey] = getSelfMetadataByRasterLayer(layer);
            }
        } else if (isTextLayer(layer)) {
            data[selfKey] = getSelfMetadataByRasterLayer(layer);
        } else if (isShapeLayer(layer)) {
            data[selfKey] = getSelfMetadataByRasterLayer(layer);
        } else if (isCameraLayer(layer)) {
            data[selfKey] = getSelfMetadataByBaseLayer(layer);
        } else if (isLightLayer(layer)) {
            data[selfKey] = getSelfMetadataByBaseLayer(layer);
        }
        for (var i = 0; i < layer.numProperties; i++) {
            var property = getProperty(layer, [ i ]);
            var propertyData = processProperty(property, i);
            data = __assign(__assign({}, data), propertyData);
        }
        return data;
    }
    function getPropertyData(property) {
        var data = {};
        if (property.numKeys > 0) {
            data.Keyframe = getKeyframeValues(property);
        } else {
            data.value = property.value;
        }
        if (property.expressionEnabled) {
            data.expression = property.expression;
        }
        return data;
    }
    function getSelfMetadata(propertyGroup) {
        var data = {};
        if (propertyGroup.canSetEnabled) {
            data.enabled = propertyGroup.enabled;
        }
        if (isNamedGroupType(propertyGroup) && isIndexedGroupType(propertyGroup.propertyGroup(1))) {
            data.name = propertyGroup.name;
        }
        return data;
    }
    function getSelfMetadataByBaseLayer(layer) {
        var data = getSelfMetadata(layer);
        return __assign(__assign({}, data), {
            autoOrient: layer.autoOrient,
            inPoint: layer.inPoint,
            outPoint: layer.outPoint,
            startTime: layer.startTime,
            stretch: layer.stretch,
            time: layer.time,
            label: layer.label,
            locked: layer.locked,
            shy: layer.shy,
            solo: layer.solo
        });
    }
    function getSelfMetadataByRasterLayer(layer) {
        var data = getSelfMetadataByBaseLayer(layer);
        return __assign(__assign({}, data), {
            adjustmentLayer: layer.adjustmentLayer,
            audioEnabled: layer.audioEnabled,
            blendingMode: layer.blendingMode,
            effectsActive: layer.effectsActive,
            environmentLayer: layer.environmentLayer,
            frameBlendingType: layer.frameBlendingType,
            timeRemapEnabled: layer.timeRemapEnabled,
            guideLayer: layer.guideLayer,
            motionBlur: layer.motionBlur,
            preserveTransparency: layer.preserveTransparency,
            quality: layer.quality,
            samplingQuality: layer.samplingQuality,
            trackMatteType: layer.trackMatteType,
            height: layer.height,
            width: layer.width
        });
    }
}).call(this);
