// Raymond Yan (raymondclr@foxmail.com / qq: 1107677019) - 2024年9月28日 上午1:30:26
// 哔哩哔哩：https://space.bilibili.com/634669（无名打字猿）
// 爱发电：https://afdian.net/a/raymondclr
// 脚本作者：loneprison
(function() {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeToString = objectProto.toString;
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
    function isString(value) {
        var type = typeof value;
        return type === "string" || type === "object" && value != null && !isArray(value) && getTag(value) == "[object String]";
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
    function addProperty(rootProperty, path) {
        var index = 0;
        var length = path.length;
        var nested = rootProperty;
        while (nested && isAddableProperty(nested) && index < length) {
            var name = path[index++];
            var next = nested.property(name);
            if (next) {
                nested = next;
            } else if (nested.canAddProperty(name)) {
                nested = nested.addProperty(name);
            }
        }
        return index && index === length ? nested : undefined;
    }
    var isProperty = createIsNativeType(Property);
    function getActiveItem() {
        return app.project.activeItem;
    }
    function getActiveComp() {
        var item = getActiveItem();
        return isCompItem(item) ? item : undefined;
    }
    function baseGetPropertyByIndex(value, index) {
        return 0 < index && index <= value.numProperties ? value.property(index) : null;
    }
    function getProperty(rootProperty, path) {
        var index = 0;
        var length = path.length;
        var nested = rootProperty;
        while (nested && isAddableProperty(nested) && index < length) {
            var name = path[index++];
            nested = isString(name) ? nested.property(name) : baseGetPropertyByIndex(nested, name);
        }
        return index && index === length ? nested : undefined;
    }
    function setPropertyValue(rootProperty, path, value) {
        var property = addProperty(rootProperty, path);
        if (isProperty(property)) {
            property.setValue(value);
            return property;
        }
    }
    function addAdjustmentLayer(compItem, useShapeLayer, layerName, layerColor) {
        if (useShapeLayer === void 0) {
            useShapeLayer = true;
        }
        if (layerName === void 0) {
            layerName = "addAdjustment";
        }
        if (layerColor === void 0) {
            layerColor = [ 1, 1, 1 ];
        }
        var newAdjust;
        var getLayers = compItem.layers;
        if (useShapeLayer) {
            newAdjust = getLayers.addShape();
            newAdjust.name = layerName;
            var VectorsGroup = newAdjust.property("ADBE Root Vectors Group");
            addProperty(VectorsGroup, [ "ADBE Vector Shape - Rect" ]);
            addProperty(VectorsGroup, [ "ADBE Vector Graphic - Fill" ]);
            getProperty(VectorsGroup, [ "ADBE Vector Shape - Rect", "ADBE Vector Rect Size" ]).expression = "[width,height]";
            setPropertyValue(VectorsGroup, [ "ADBE Vector Graphic - Fill", "ADBE Vector Fill Color" ], layerColor);
            newAdjust.position.expression = "[thisComp.width,thisComp.height]/2";
        } else {
            newAdjust = getLayers.addSolid(layerColor, layerName, compItem.width, compItem.height, 1, compItem.duration);
        }
        newAdjust.adjustmentLayer = true;
        newAdjust.label = 10;
        return newAdjust;
    }
    var activeItem = getActiveComp();
    if (activeItem) {
        var layer_1 = addAdjustmentLayer(activeItem, true);
        addProperty(layer_1.effect, [ "F's SelectColor" ]);
    }
}).call(this);
