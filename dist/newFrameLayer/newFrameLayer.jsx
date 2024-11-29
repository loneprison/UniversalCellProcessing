// 本脚本基于Soil开发
// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)
// Soil Github: https://github.com/RaymondClr/Soil

// 脚本作者: loneprison (qq: 769049918)
// Github: {未填写/未公开}
// - 2024/11/29 16:19:22

(function() {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function has(object, key) {
        return object != null && hasOwnProperty.call(object, key);
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
    function getActiveItem() {
        return app.project.activeItem;
    }
    function getActiveComp() {
        var item = getActiveItem();
        return isCompItem(item) ? item : undefined;
    }
    function setUndoGroup(undoString, func) {
        app.beginUndoGroup(undoString);
        func();
        app.endUndoGroup();
    }
    function showError(message) {
        alert(message);
    }
    function addMultipleProperty(rootProperty, pathArray) {
        forEach(pathArray, function(path) {
            addProperty(rootProperty, path);
        });
    }
    function createFrameLayer(nowItem) {
        var shapeLayer = nowItem.layers.addShape();
        shapeLayer.name = "frame";
        var contents = shapeLayer.property("ADBE Root Vectors Group");
        var vectorGroup = addProperty(contents, [ "ADBE Vector Group" ]);
        addMultipleProperty(vectorGroup, [ [ "ADBE Vector Shape - Rect" ], [ "ADBE Vector Shape - Rect" ], [ "ADBE Vector Filter - Merge" ], [ "ADBE Vector Graphic - Fill" ] ]);
    }
    function main() {
        var nowItem = getActiveComp();
        if (!nowItem || !isCompItem(nowItem)) {
            return showError("请先选择一个图层/合成");
        }
        createFrameLayer(nowItem);
    }
    setUndoGroup("newFrameLayer", main);
}).call(this);
