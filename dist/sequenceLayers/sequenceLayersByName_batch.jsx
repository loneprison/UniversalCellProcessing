// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: {未填写/未公开}
// - 2024/11/29 01:43:26

(function() {
    var objectProto = Object.prototype;
    var nativeToString = objectProto.toString;
    var INFINITY = 1 / 0;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    var charCodeOfDot = ".".charCodeAt(0);
    var reEscapeChar = /\\(\\)?/g;
    var rePropName = /[^.[\]]+|\[(?:([^"'][^[]*)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
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
    function some(array, predicate) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
            if (predicate(array[index], index, array)) {
                return true;
            }
        }
        return false;
    }
    function createIsNativeType(nativeObject) {
        return function(value) {
            return value != null && value instanceof nativeObject;
        };
    }
    var isCompItem = createIsNativeType(CompItem);
    function collectionEach(collection, iteratee) {
        var index = 0;
        var length = collection.length + 1;
        while (++index < length) {
            if (iteratee(collection[index], index, collection) === false) {
                break;
            }
        }
        return collection;
    }
    function collectionToArray(collection) {
        var result = Array(collection.length);
        collectionEach(collection, function(item, index) {
            result[index - 1] = item;
        });
        return result;
    }
    function createGetAppProperty(path) {
        return function() {
            return get(app, path);
        };
    }
    var getSelectedLayers = createGetAppProperty([ "project", "activeItem", "selectedLayers" ]);
    var isAVLayer = createIsNativeType(AVLayer);
    function createIsAVLayer(callback) {
        return function(value) {
            return isAVLayer(value) && callback(value);
        };
    }
    var isCompLayer = createIsAVLayer(function(layer) {
        return isCompItem(layer.source);
    });
    function setUndoGroup(undoString, func) {
        app.beginUndoGroup(undoString);
        func();
        app.endUndoGroup();
    }
    function sortLayersByName(layerArray, order) {
        return layerArray.sort(function(a, b) {
            var getSortKey = function(name) {
                var numberPart = name.match(/\d+$/);
                var textPart = name.replace(/\d+$/, "");
                return {
                    number: numberPart ? parseInt(numberPart[0], 10) : NaN,
                    text: textPart
                };
            };
            var keyA = getSortKey(a.name);
            var keyB = getSortKey(b.name);
            if (!isNaN(keyA.number) && !isNaN(keyB.number)) {
                return keyB.number - keyA.number;
            } else if (!isNaN(keyA.number)) {
                return 1;
            } else if (!isNaN(keyB.number)) {
                return -1;
            }
            return keyB.text.localeCompare(keyA.text);
        });
    }
    var isAllCompLayer = function(layerArray) {
        return !some(layerArray, function(layer) {
            return !isCompLayer(layer);
        });
    };
    function main() {
        var selectedLayers = getSelectedLayers();
        if (isAllCompLayer(selectedLayers)) {
            forEach(selectedLayers, function(layer) {
                var comp = layer.source;
                if (isCompItem(comp)) {
                    var layerArray = sortLayersByName(collectionToArray(comp.layers));
                    if (layerArray.length == 0) {
                        return;
                    }
                    var currentStartTime_1 = 0;
                    var frameDuration_1 = 1 / comp.frameRate;
                    var layerDuration_1 = frameDuration_1;
                    forEach(layerArray, function(layer_) {
                        layer_.outPoint = layerDuration_1;
                        layer_.startTime = frameDuration_1 * currentStartTime_1++;
                        layer.moveToBeginning();
                    });
                    comp.duration = frameDuration_1 * currentStartTime_1;
                }
            });
        } else {
            alert("不能选择非comp图层");
        }
    }
    setUndoGroup("SequenceLayers", main);
}).call(this);
