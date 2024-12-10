// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: {未填写/未公开}
// - 2024/12/10 15:45:45

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
    var arrayProto = Array.prototype;
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeJoin = arrayProto.join;
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
    var reIsUint = /^(?:0|[1-9]\d*)$/;
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
    function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && or(type === "number", reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
    }
    function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value);
        var isArg = !isArr && isArguments(value);
        var skipIndexes = isArr || isArg;
        var length = value.length;
        var result = new Array(skipIndexes ? length : 0);
        var index = skipIndexes ? -1 : length;
        while (++index < length) {
            result[index] = "".concat(index);
        }
        for (var key in value) {
            if (has(value, key) && !(skipIndexes && (key === "length" || isIndex(key, length)))) {
                result.push(key);
            }
        }
        return result;
    }
    function isLength(value) {
        return typeof value === "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isArrayLike(value) {
        return value != null && typeof value !== "function" && isLength(value.length);
    }
    function keys(object) {
        if (object == null) {
            return [];
        }
        if (isArrayLike(object)) {
            return arrayLikeKeys(object);
        }
        var result = [];
        for (var key in object) {
            if (has(object, key)) {
                result.push(key);
            }
        }
        return result;
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
    var pathDesktop = Folder.desktop;
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
    var isFile = createIsNativeType(File);
    function newFile(path) {
        return new File(path);
    }
    function castFile(file) {
        return isFile(file) ? file : newFile(file);
    }
    function createPath() {
        return nativeJoin.call(arguments, Folder.fs === "Windows" ? "\\" : "/");
    }
    function newFolder(path) {
        return new Folder(path);
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
    function writeFile(path, content, encoding, mode) {
        if (encoding === void 0) {
            encoding = "utf-8";
        }
        if (mode === void 0) {
            mode = "w";
        }
        var file = castFile(path);
        file.encoding = encoding;
        var fileFolder = newFolder(file.path);
        if (!fileFolder.exists) {
            fileFolder.create();
        }
        return file.open(mode) && file.write(content) && file.close();
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
    function writeJson(path, object, indent) {
        if (indent === void 0) {
            indent = 4;
        }
        return writeFile(path, stringify(object, indent));
    }
    function logJson(object) {
        writeJson(createPath(pathDesktop.toString(), "soil_log.json"), object);
    }
    function getTextDocumentValue(value) {
        return {
            text: value.text,
            applyFill: value.applyFill,
            applyStroke: value.applyStroke,
            font: value.font,
            fontSize: value.fontSize,
            justification: value.justification,
            leading: value.leading,
            tracking: value.tracking,
            fillColor: value.applyFill ? value.fillColor : undefined,
            strokeColor: value.applyStroke ? value.strokeColor : undefined,
            strokeOverFill: value.applyStroke ? value.strokeOverFill : undefined,
            strokeWidth: value.applyStroke ? value.strokeWidth : undefined,
            boxTextSize: value.boxText ? value.boxTextSize : undefined
        };
    }
    var firstLayer = getFirstSelectedLayer();
    var selfKey = "S0000 selfProperty";
    if (isLayer(firstLayer)) {
        var dataObject = getRootPropertyData(firstLayer);
        logJson(dataObject);
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
            var groupKey = "G".concat(padStart((index === null || index === void 0 ? void 0 : index.toString()) || "1", 4, "0"), " ").concat(matchName);
            data[groupKey] = getPropertyGroupData(property);
        } else if (canSetPropertyValue(property) && property.isModified) {
            var key = "P".concat(padStart((index === null || index === void 0 ? void 0 : index.toString()) || "1", 4, "0"), " ").concat(matchName);
            data[key] = getPropertyData(property);
        }
        return data;
    }
    function getLayerData(layer) {
        var _a;
        var data = {};
        var marker = layer.marker;
        if (marker.numKeys > 0) {
            data = __assign(__assign({}, data), manualGetRootPropertyData(marker));
        }
        var transformData = manualGetRootPropertyData(layer.transform);
        var transformKey = keys(transformData)[0];
        var excludeTransformKey;
        if (transformData.dimensionsSeparated) {
            excludeTransformKey = /^ADBE Position$/;
        } else {
            excludeTransformKey = /ADBE Position_\d+/;
        }
        forOwn(transformData[transformKey], function(value, key) {
            if (excludeTransformKey.test(key)) {
                delete transformData[transformKey][key];
            }
        });
        if (!isEmpty(transformData)) {
            data = __assign(__assign({}, data), transformData);
        }
        if (isRasterLayer(layer)) {
            data[selfKey] = getSelfMetadataByRasterLayer(layer);
            data = __assign(__assign({}, data), manualGetRootPropertyData(layer.effect));
            var layerStyle = layer.layerStyle;
            if (layerStyle.canSetEnabled == true) {
                var layerStyleDate = __assign({
                    "S0000 selfProperty": {
                        enabled: layerStyle.enabled
                    }
                }, manualGetRootPropertyData(layerStyle.blendingOption));
                for (var i = 2; i <= layerStyle.numProperties; i++) {
                    if (layerStyle.property(i).canSetEnabled == true) {
                        layerStyleDate = __assign(__assign({}, layerStyleDate), manualGetRootPropertyData(layerStyle.property(i), true));
                    }
                }
                data = __assign(__assign({}, data), (_a = {}, _a["G".concat(padStart(layerStyle.propertyIndex.toString(), 4, "0"), " ").concat(layerStyle.matchName)] = layerStyleDate, 
                _a));
            }
            if (layer.threeDLayer) {
                data = __assign(__assign(__assign({}, data), manualGetRootPropertyData(layer.geometryOption)), manualGetRootPropertyData(layer.materialOption));
            }
            if (layer.hasAudio) {
                data = __assign(__assign({}, data), manualGetRootPropertyData(layer.audio));
            }
            if (isAVLayer(layer)) {
                if (layer.canSetTimeRemapEnabled && layer.timeRemapEnabled) {
                    data = __assign(__assign({}, data), manualGetRootPropertyData(layer.timeRemap));
                }
                if (isCompLayer(layer)) {}
            } else if (isTextLayer(layer)) {
                var textObject = manualGetRootPropertyData(layer.text);
                var textDocument = textObject["G0002 ADBE Text Properties"]["P0001 ADBE Text Document"];
                if (textDocument.value) {
                    textDocument.value = getTextDocumentValue(textDocument.value);
                } else if (textDocument.Keyframe) {
                    textDocument.Keyframe = forEach(textDocument.Keyframe, function(Keyframe) {
                        Keyframe.keyValue = getTextDocumentValue(Keyframe.keyValue);
                    });
                }
                textObject["G0002 ADBE Text Properties"]["P0001 ADBE Text Document"] = textDocument;
                data = __assign(__assign({}, data), textObject);
            } else if (isShapeLayer(layer)) {
                data = __assign(__assign({}, data), manualGetRootPropertyData(getProperty(layer, [ "ADBE Root Vectors Group" ])));
            }
        } else {
            data[selfKey] = getSelfMetadataByBaseLayer(layer);
            if (isCameraLayer(layer)) {
                data = __assign(__assign({}, data), manualGetRootPropertyData(layer.cameraOption));
            } else if (isLightLayer(layer)) {
                data = __assign(__assign({}, data), manualGetRootPropertyData(layer.lightOption));
            }
        }
        return data;
    }
    function manualGetRootPropertyData(rootProperty, isModified) {
        if (isModified === void 0) {
            isModified = rootProperty.isModified;
        }
        var data = {};
        if (!isModified) {
            return data;
        }
        var _a = isProperty(rootProperty) ? {
            prefix: "P",
            nested: getPropertyData(rootProperty)
        } : {
            prefix: "G",
            nested: getPropertyGroupData(rootProperty)
        }, prefix = _a.prefix, nested = _a.nested;
        data["".concat(prefix).concat(padStart(rootProperty.propertyIndex.toString(), 4, "0"), " ").concat(rootProperty.matchName)] = nested;
        return data;
    }
    function getPropertyData(property) {
        var data = {};
        data.name = property.name;
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
    function getPropertyGroupData(propertyGroup) {
        var data = {};
        var selfMetadata = getSelfMetadata(propertyGroup);
        if (!isEmpty(selfMetadata)) {
            data[selfKey] = selfMetadata;
        }
        for (var i = 1; i <= propertyGroup.numProperties; i++) {
            var property = getProperty(propertyGroup, [ i ]);
            var propertyData = processProperty(property, i);
            data = __assign(__assign({}, data), propertyData);
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
        if (isTextLayer(layer)) {
            data = __assign(__assign({}, data), {
                threeDPerChar: layer.threeDPerChar
            });
        }
        return __assign(__assign({}, data), {
            adjustmentLayer: layer.adjustmentLayer,
            audioEnabled: layer.audioEnabled,
            blendingMode: layer.blendingMode,
            effectsActive: layer.effectsActive,
            environmentLayer: layer.environmentLayer,
            frameBlendingType: layer.frameBlendingType,
            timeRemapEnabled: layer.timeRemapEnabled,
            threeDLayer: layer.threeDLayer,
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
