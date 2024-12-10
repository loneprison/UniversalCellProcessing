import * as _ from 'soil-ts';




/* ===============================================================================================================

    实际功能区

=============================================================================================================== */




/**
 * 添加一个调整图层，支持形状图层或固态图层。
 *
 * @param {CompItem} compItem 合成项，目标合成中将添加调整图层。
 * @param {boolean} [useShapeLayer=true] 是否使用形状图层，默认为 `true`，如果为 `false` 则添加固态图层。
 * @param {string} [layerName="adjustment"] 图层名称，默认为 `"adjustment"`。
 * @param {ThreeDColorValue} [layerColor=[1, 1, 1]] 图层颜色，默认为 `[1, 1, 1]`（白色）。
 * @returns {AVLayer | ShapeLayer} 返回添加的图层，可能是 `AVLayer`（固态图层）或 `ShapeLayer`（形状图层）。
 * @since 0.1.0
 * @category Library
 * @example
 *
 * ```ts
 * const compItem = app.project.activeItem;
 * const adjustmentLayer = addAdjustmentLayer(compItem, true, "Adjustment Layer", [0.5, 0.2, 0.8]);
 * // 结果：在合成中添加一个名为 "Adjustment Layer" 的形状图层，颜色为 [0.5, 0.2, 0.8]。
 *
 * const adjustmentLayer2 = addAdjustmentLayer(compItem, false, "Adjustment Layer", [0.1, 0.1, 0.1]);
 * // 结果：在合成中添加一个名为 "Adjustment Layer" 的固态图层，颜色为 [0.1, 0.1, 0.1]。
 * ```
 */

function addAdjustmentLayer(compItem: CompItem, useShapeLayer: Boolean = true, layerName: string = "adjustment", layerColor: ThreeDColorValue = [1, 1, 1]): AVLayer | ShapeLayer {
    let newAdjust: AVLayer | ShapeLayer
    const getLayers: LayerCollection = compItem.layers
    if (useShapeLayer) {
        const vectorData: PropertyDataStructure = {
            "S0000 selfProperty": {
                "name": layerName
            },
            "G0001 ADBE Root Vectors Group": {
                "G0001 ADBE Vector Shape - Rect": {
                    "P0002 ADBE Vector Rect Size": {
                        "expression": "[width,height]"
                    }
                },
                "G0002 ADBE Vector Graphic - Fill": {
                    "P0004 ADBE Vector Fill Color": {
                        "value": [1, 1, 1, 1]
                    }
                }
            },
            "G0002 ADBE Transform Group": {
                "P0002 ADBE Position": {
                    "expression": "[thisComp.width,thisComp.height]/2"
                }
            }
        }

        newAdjust = getLayers.addShape()
        setPropertyByData(newAdjust, vectorData)
    } else {
        newAdjust = getLayers.addSolid(layerColor, layerName, compItem.width, compItem.height, 1, compItem.duration);
    }
    newAdjust.adjustmentLayer = true;
    newAdjust.label = 10; // 10 对应淡紫色
    return newAdjust
}




/**
 * 复制图层并返回一个包含所有复制图层的数组。
 *
 * 根据参数 `quantity` 指定要复制的图层数量，并且可以选择是否包含原始图层。
 * 默认情况下，原始图层会被包含在返回的数组中。
 *
 * @param {Layer} getLayer 要复制的原始图层。
 * @param {number} [quantity=1] 要复制的图层数量，默认为 1。
 * @param {boolean} [includesSelf=true] 是否包括原始图层在返回的数组中，默认为 `true`。
 * @returns {Layer[]} 包含所有复制图层的数组。
 * @since 0.1.0
 * @category Library
 * @example
 *
 * ```ts
 * const layer = compItem.layer(1);
 * const duplicatedLayers = duplicateLayers(layer, 3);
 * // 结果：将原始图层以及两个复制的图层一起返回。
 *
 * const duplicatedLayersWithoutSelf = duplicateLayers(layer, 3, false);
 * // 结果：只返回两个复制的图层，原始图层不包括在内。
 * ```
 */

export function duplicateLayers(getLayer: Layer, quantity: number = 1, includesSelf: boolean = true): Layer[] {
    const layers: Layer[] = includesSelf ? [getLayer] : []; // 创建一个数组来存储复制的图层

    for (let i = 0; i < quantity; i++) {
        layers.push(getLayer = getLayer.duplicate()); // 复制图层并将其添加到数组中
    }
    return layers; // 返回所有复制的图层
}





/* ===============================================================================================================

    类型守卫类函数

=============================================================================================================== */




/**
 * 判断图层是否可以设置时间重映射
 *
 * @param {string} content 要复制的文本内容。
 * @returns {void} 无返回值。
 * @since 0.1.0
 * @category Library
 */
export function canSetTimeRemapEnabled(layer: RasterLayer): boolean {
    return layer.canSetTimeRemapEnabled;
}




/* ===============================================================================================================

    Set类函数

=============================================================================================================== */




function setPropertyValue(property: Property, dataObject: PropertyValueData) {
    // 设置 property 的值
    if (_.has(dataObject, 'value')) {
        property.setValue(dataObject.value)
    }

    // 设置表达式
    if (_.has(dataObject, 'expression')) {
        property.expression = dataObject.expression
    }
}




function setSelfProperty(property: _PropertyClasses, dataObject: PropertyMetadata) {
    // 设置显示
    if (_.has(dataObject, 'enabled')) {
        property.enabled = dataObject.enabled
    }

    // 设置 property 的名字
    if (_.has(dataObject, 'name')) {
        property.name = dataObject.name
    }
}




/**
 * 根据给定的属性数据，将属性值设置到目标图层或属性上。
 * 
 * ！！！注意，由于getPropertyListObject尚未完善，因此仅建议将其用于指定属性而非整个图层,或者你可以选择将数据打印出来后进行人工筛选
 *
 * 该函数会遍历 `propertyData` 中的每个键值对，根据键的前缀（`S`、`G`、`P`）决定如何设置对应的属性：
 * - `S`：表示 `PropertyGroup` 自身需要被设置的属性。
 * - `G`：表示 `PropertyGroup` 的数据，`PropertyGroup` 的子类可以是 `Property` 和 `PropertyGroup`。
 * - `P`：表示 `Property` 的数据。
 *
 * @param {PropertyClasses} rootProperty 目标属性的根属性类。
 * @param {PropertyDataStructure | NestedPropertyGroup} propertyData 包含要设置的属性数据。
 * @returns {void} 无返回值。
 * @since 0.1.0
 * @category Library
 * @example
 *
 * ```ts
 * const selectedLayers = _.getSelectedLayers();
 * if (selectedLayers.length == 2) {
 *     const propertyData = ul.getPropertyListObject(selectedLayers[0],["ADBE Effect Parade"]);
 *     ul.setPropertyByData(_.getProperty(selectedLayers[1],["ADBE Effect Parade"]), propertyData);
 * }
 * // 结果：将第一个选中图层的属性数据设置到第二个图层。
 * ```
 */

// 递归遍历每一层
export function setPropertyByData(rootProperty: _PropertyClasses, propertyData: PropertyDataStructure) {

    _.forOwn(propertyData, (value, key) => {

        if (_.startsWith(key, "S", 0)) {
            setSelfProperty(rootProperty, (value as PropertyMetadata))
            return
        }
        const subProperty = _.addPropertyAlone(rootProperty, [key.substring(6)])

        // 如果当前是一个 Group（包含子项）
        if (_.startsWith(key, "G", 0)) {
            setPropertyByData(subProperty, value as PropertyDataStructure)
        } else if (_.startsWith(key, "P", 0)) {
            if (_.isProperty(subProperty)) {
                setPropertyValue(subProperty, (value as PropertyValueData))
            } else {
                alert(`在${key}键上遇到了错误\n该属性不为Property`)
            }
        } else {
            alert(`在${key}键上遇到了未定义的错误\n【旧版的数据格式可能不支持】\n请检查你的脚本是否为最新`)
            return
        }
    })
}



/* ===============================================================================================================

    Get类函数

=============================================================================================================== */




export function getTextDocumentValue(value: TextDocument): canSetTextDocument {
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
    }
}




/**
 * 根据遮罩类型名称获取对应的遮罩类型枚举值。
 *
 * 该函数根据传入的中文名称返回对应的 `TrackMatteType` 枚举值。
 * 如果传入的名称不匹配任何已知的遮罩类型，则返回 `undefined`。
 *
 * @param {TrackMatteTypeString} name 遮罩类型的中文名称。
 * @returns {TrackMatteType} 对应的 `TrackMatteType` 枚举值。
 * @since 0.1.0
 * @category Library
 * @example
 *
 * ```ts
 * const matteType = getTrackMatteTypeByName("Alpha 遮罩");
 * // 结果：返回 TrackMatteType.ALPHA。
 *
 * const unknownMatteType = getTrackMatteTypeByName("未知类型");
 * // 结果：返回 undefined。
 * ```
 */
export function getTrackMatteTypeByName(name: TrackMatteTypeString): TrackMatteType {
    const trackMatteTypes: Record<string, TrackMatteType> = {
        "Alpha 遮罩": TrackMatteType.ALPHA,
        "Alpha 反转遮罩": TrackMatteType.ALPHA_INVERTED,
        "亮度遮罩": TrackMatteType.LUMA,
        "亮度反转遮罩": TrackMatteType.LUMA_INVERTED,
        "无": TrackMatteType.NO_TRACK_MATTE,
    };

    return trackMatteTypes[name]; // 如果输入的中文名称不匹配任何枚举值，则返回 undefined
}




/**
 * 根据混合模式名称获取对应的混合模式枚举值。
 *
 * 该函数根据传入的中文名称返回对应的 `BlendingMode` 枚举值，如果传入的名称不匹配任何已知的混合模式，则默认返回 `BlendingMode.NORMAL`。
 *
 * @param {BlendingModeString} name 混合模式的中文名称。
 * @returns {BlendingMode} 对应的 `BlendingMode` 枚举值。
 * @since 0.1.0
 * @category Library
 * @example
 *
 * ```ts
 * const blendingMode = getBlendingModeByName("溶解");
 * // 结果：返回 BlendingMode.DISSOLVE。
 *
 * const defaultBlendingMode = getBlendingModeByName("不存在的混合模式");
 * // 结果：返回 BlendingMode.NORMAL。
 * ```
 */
export function getBlendingModeByName(name: BlendingModeString): BlendingMode {
    const blendingModes: Record<string, BlendingMode> = {
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
        "冷光预乘": BlendingMode.LUMINESCENT_PREMUL,
    };

    return blendingModes[name] || BlendingMode.NORMAL; // 如果输入的中文名称不匹配任何枚举值，则返回 BlendingMode.NORMAL
}





/* ===============================================================================================================

    其他-功能型函数

=============================================================================================================== */




/**
 * 按图层索引排序选中的图层
 * @param {Layer[]} layerArray - 被选中的图层数组
 * @param {string} order - 排序顺序，`asc` 为升序，`desc` 为降序
 * @returns {Layer[]} 排序后的图层数组
 */

export function sortLayersByIndex(layerArray: Layer[], order: string = 'asc'): Layer[] {
    return layerArray.sort((a, b) => {
        if (order === 'asc') {
            return a.index - b.index;  // 升序
        } else {
            return b.index - a.index;  // 降序
        }
    });
}




/**
 * 按图层名称排序选中的图层
 * @param {Layer[]} layerArray - 被选中的图层数组
 * @param {string} order - 排序顺序，`asc` 为升序，`desc` 为降序
 * @returns {Layer[]} 排序后的图层数组
 */
export function sortLayersByName(layerArray: Layer[], order: string = 'asc'): Layer[] {
    return layerArray.sort((a, b) => {
        // 提取图层名称中的数字部分和字符部分
        const getSortKey = (name: string) => {
            const numberPart = name.match(/\d+$/);  // 提取结尾的数字部分（如果有）
            const textPart = name.replace(/\d+$/, ''); // 提取数字以外的字符部分

            // 返回一个包含数字和字符的对象，确保数字部分优先
            return {
                number: numberPart ? parseInt(numberPart[0], 10) : NaN,  // 没有数字则返回NaN
                text: textPart
            };
        };

        const keyA = getSortKey(a.name);
        const keyB = getSortKey(b.name);

        // 先比较数字部分，数字存在时优先排序
        if (!isNaN(keyA.number) && !isNaN(keyB.number)) {
            return order === 'asc' ? keyA.number - keyB.number : keyB.number - keyA.number;
        } else if (!isNaN(keyA.number)) {
            return order === 'asc' ? -1 : 1;  // 如果a有数字而b没有，数字排前
        } else if (!isNaN(keyB.number)) {
            return order === 'asc' ? 1 : -1;  // 如果b有数字而a没有，数字排前
        }

        // 如果没有数字，则按字母部分排序
        return order === 'asc' ? keyA.text.localeCompare(keyB.text) : keyB.text.localeCompare(keyA.text);
    });
}




/**
 * 将文本内容复制到剪贴板。
 *
 * 根据不同操作系统（Windows 或其他）选择合适的命令来执行复制操作。
 * 在 macOS 上使用 `pbcopy`，在 Windows 上使用 `clip`。
 *
 * @param {string} content 要复制的文本内容。
 * @returns {void} 无返回值。
 * @since 0.1.0
 * @category Library
 * @example
 *
 * ```ts
 * copyToClipboard("Hello, world!");
 * // 结果：将 "Hello, world!" 复制到剪贴板。
 * ```
 */

export function copyToClipboard(content: string): void {
    var cmd: string;
    var isWindows = $.os.indexOf("Windows") !== -1;

    // 将内容转换为字符串,TS里面其实没必要这个步骤，但是为了考虑不完全在TS里编译出来的代码的情况加上这条
    content = content.toString();

    // 根据操作系统选择合适的命令
    if (!isWindows) {
        cmd = 'echo "' + content + '" | pbcopy';
    } else {
        cmd = 'cmd.exe /c cmd.exe /c "echo ' + content + ' | clip"';
    }

    // 执行系统命令
    system.callSystem(cmd);
}