// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: {未填写/未公开}
// - 2024/12/10 15:45:33

(function() {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function has(object, key) {
        return object != null && hasOwnProperty.call(object, key);
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
    function duplicateLayers(getLayer, quantity, includesSelf) {
        if (quantity === void 0) {
            quantity = 1;
        }
        if (includesSelf === void 0) {
            includesSelf = true;
        }
        var layers = includesSelf ? [ getLayer ] : [];
        for (var i = 0; i < quantity; i++) {
            layers.push(getLayer = getLayer.duplicate());
        }
        return layers;
    }
    function canSetTimeRemapEnabled(layer) {
        return layer.canSetTimeRemapEnabled;
    }
    function setPropertyValue(property, dataObject) {
        if (has(dataObject, "value")) {
            property.setValue(dataObject.value);
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
                    setPropertyValue(subProperty, value);
                } else {
                    alert("在".concat(key, "键上遇到了错误\n该属性不为Property"));
                }
            } else {
                alert("在".concat(key, "键上遇到了未定义的错误\n【旧版的数据格式可能不支持】\n请检查你的脚本是否为最新"));
                return;
            }
        });
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
    function getTrackMatteTypeByName(name) {
        var trackMatteTypes = {
            "Alpha 遮罩": TrackMatteType.ALPHA,
            "Alpha 反转遮罩": TrackMatteType.ALPHA_INVERTED,
            "亮度遮罩": TrackMatteType.LUMA,
            "亮度反转遮罩": TrackMatteType.LUMA_INVERTED,
            "无": TrackMatteType.NO_TRACK_MATTE
        };
        return trackMatteTypes[name];
    }
    function getBlendingModeByName(name) {
        var blendingModes = {
            "正常": BlendingMode.NORMAL,
            "溶解": BlendingMode.DISSOLVE,
            "动态抖动溶解": BlendingMode.DANCING_DISSOLVE,
            "变暗": BlendingMode.DARKEN,
            "相乘": BlendingMode.MULTIPLY,
            "颜色加深": BlendingMode.COLOR_BURN,
            "经典颜色加深": BlendingMode.CLASSIC_COLOR_BURN,
            "线性加深": BlendingMode.LINEAR_BURN,
            "较深的颜色": BlendingMode.DARKER_COLOR,
            "相加": BlendingMode.ADD,
            "变亮": BlendingMode.LIGHTEN,
            "屏幕": BlendingMode.SCREEN,
            "颜色减淡": BlendingMode.COLOR_DODGE,
            "经典颜色减淡": BlendingMode.CLASSIC_COLOR_DODGE,
            "线性减淡": BlendingMode.LINEAR_DODGE,
            "较浅的颜色": BlendingMode.LIGHTER_COLOR,
            "叠加": BlendingMode.OVERLAY,
            "柔光": BlendingMode.SILHOUETTE_LUMA,
            "强光": BlendingMode.HARD_LIGHT,
            "线性光": BlendingMode.LINEAR_LIGHT,
            "亮光": BlendingMode.VIVID_LIGHT,
            "点光": BlendingMode.PIN_LIGHT,
            "纯色混合": BlendingMode.HARD_MIX,
            "差值": BlendingMode.DIFFERENCE,
            "经典差值": BlendingMode.CLASSIC_DIFFERENCE,
            "排除": BlendingMode.EXCLUSION,
            "相减": BlendingMode.SUBTRACT,
            "相除": BlendingMode.DIVIDE,
            "色相": BlendingMode.HUE,
            "饱和度": BlendingMode.SATURATION,
            "颜色": BlendingMode.COLOR,
            "发光度": BlendingMode.LUMINOSITY,
            "模板 Alpha": BlendingMode.STENCIL_ALPHA,
            "模板亮度": BlendingMode.STENCIL_LUMA,
            "轮廓 Alpha": BlendingMode.SILHOUETE_ALPHA,
            "轮廓亮度": BlendingMode.SILHOUETTE_LUMA,
            "Alpha 添加": BlendingMode.ALPHA_ADD,
            "冷光预乘": BlendingMode.LUMINESCENT_PREMUL
        };
        return blendingModes[name] || BlendingMode.NORMAL;
    }
    function sortLayersByIndex(layerArray, order) {
        if (order === void 0) {
            order = "asc";
        }
        return layerArray.sort(function(a, b) {
            if (order === "asc") {
                return a.index - b.index;
            } else {
                return b.index - a.index;
            }
        });
    }
    function sortLayersByName(layerArray, order) {
        if (order === void 0) {
            order = "asc";
        }
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
                return order === "asc" ? keyA.number - keyB.number : keyB.number - keyA.number;
            } else if (!isNaN(keyA.number)) {
                return order === "asc" ? -1 : 1;
            } else if (!isNaN(keyB.number)) {
                return order === "asc" ? 1 : -1;
            }
            return order === "asc" ? keyA.text.localeCompare(keyB.text) : keyB.text.localeCompare(keyA.text);
        });
    }
    function copyToClipboard(content) {
        var cmd;
        var isWindows = $.os.indexOf("Windows") !== -1;
        content = content.toString();
        if (!isWindows) {
            cmd = 'echo "' + content + '" | pbcopy';
        } else {
            cmd = 'cmd.exe /c cmd.exe /c "echo ' + content + ' | clip"';
        }
        system.callSystem(cmd);
    }
    export { canSetTimeRemapEnabled, copyToClipboard, duplicateLayers, getBlendingModeByName, getTextDocumentValue, getTrackMatteTypeByName, setPropertyByData, sortLayersByIndex, sortLayersByName };
}).call(this);
