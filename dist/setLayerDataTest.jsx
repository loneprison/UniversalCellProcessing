// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: {未填写/未公开}
// - 2024/12/11 16:59:52

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
    function startsWith(string, target, position) {
        var length = string.length;
        position = position == null ? 0 : position;
        if (position < 0) {
            position = 0;
        } else if (position > length) {
            position = length;
        }
        target = "".concat(target);
        return string.slice(position, position + target.length) == target;
    }
    function createIsNativeType(nativeObject) {
        return function(value) {
            return value != null && value instanceof nativeObject;
        };
    }
    var isCompItem = createIsNativeType(CompItem);
    function isLayer(value) {
        return has(value, "containingComp") && isCompItem(value.containingComp) && value.parentProperty === null && value.propertyDepth === 0;
    }
    var isMaskPropertyGroup = createIsNativeType(MaskPropertyGroup);
    var isPropertyGroup = createIsNativeType(PropertyGroup);
    function isAddableProperty(value) {
        return isPropertyGroup(value) || isMaskPropertyGroup(value) || isLayer(value);
    }
    function addPropertyAlone(rootProperty, path) {
        var index = 0;
        var length = path.length;
        var nested = rootProperty;
        while (nested && isAddableProperty(nested) && index < length) {
            var name = String(path[index++]);
            nested = nested.canAddProperty(name) ? nested.addProperty(name) : nested.property(name);
        }
        return index && index === length ? nested : undefined;
    }
    var isProperty = createIsNativeType(Property);
    function createGetAppProperty(path) {
        return function() {
            return get(app, path);
        };
    }
    var getFirstSelectedLayer = createGetAppProperty([ "project", "activeItem", "selectedLayers", "0" ]);
    var isTextDocument = createIsNativeType(TextDocument);
    function setPropertyValueByData(property, dataObject) {
        if (has(dataObject, "value")) {
            if (isTextDocument(property.value)) {
                var textObject = dataObject.value;
                var textValue_1 = property.value;
                forOwn(textObject, function(value, key) {
                    if (value) {
                        textValue_1[key] = value;
                    }
                });
                property.setValue(textValue_1);
            } else {
                property.setValue(dataObject.value);
            }
        }
        if (has(dataObject, "expression")) {
            property.expression = dataObject.expression;
        }
    }
    function setSelfProperty(property, dataObject) {
        if (has(dataObject, "enabled")) {
            property.enabled = dataObject.enabled;
        }
        if (has(dataObject, "name")) {
            property.name = dataObject.name;
        }
    }
    function setPropertyByData(rootProperty, propertyData) {
        forOwn(propertyData, function(value, key) {
            if (startsWith(key, "S", 0)) {
                setSelfProperty(rootProperty, value);
                return;
            }
            var subProperty = addPropertyAlone(rootProperty, [ key.substring(6) ]);
            if (startsWith(key, "G", 0)) {
                setPropertyByData(subProperty, value);
            } else if (startsWith(key, "P", 0)) {
                if (isProperty(subProperty)) {
                    setPropertyValueByData(subProperty, value);
                } else {
                    alert("在".concat(key, "键上遇到了错误\n该属性不为Property"));
                }
            } else {
                alert("在".concat(key, "键上遇到了未定义的错误\n【旧版的数据格式可能不支持】\n请检查你的脚本是否为最新"));
                return;
            }
        });
    }
    var firstLayer = getFirstSelectedLayer();
    var data = {
        "G0005 ADBE Transform Group": {
            "P0002 ADBE Position": {
                "name": "位置",
                "value": [ 428, 410, 0 ]
            }
        },
        "G0002 ADBE Text Properties": {
            "P0001 ADBE Text Document": {
                "name": "源文本",
                "value": {
                    "text": "文本动画",
                    "applyFill": true,
                    "applyStroke": false,
                    "font": "MaokenZhuyuanTi-Regular",
                    "fontSize": 50,
                    "justification": 7415,
                    "leading": 45,
                    "tracking": 150,
                    "fillColor": [ 1, 1, 1 ],
                    "strokeColor": null,
                    "strokeOverFill": null,
                    "strokeWidth": null,
                    "boxTextSize": null
                }
            }
        }
    };
    setPropertyByData(firstLayer, data);
}).call(this);
