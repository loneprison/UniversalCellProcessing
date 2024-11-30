import { addProperty, getProperty, isPropertyGroup, setPropertyValue } from "soil-ts";
import setPropertiesExpressions from "./setPropertiesExpressions";
import { setPropertyByDate } from "utilsLibrary";

/**
 * 添加一个调整图层，支持形状图层或固态图层。
 *
 * @param {CompItem} compItem 合成项，目标合成中将添加调整图层。
 * @param {boolean} [useShapeLayer=true] 是否使用形状图层，默认为 `true`，如果为 `false` 则添加固态图层。
 * @param {string} [layerName="adjustment"] 图层名称，默认为 `"adjustment"`。
 * @param {ThreeDColorValue} [layerColor=[1, 1, 1]] 图层颜色，默认为 `[1, 1, 1]`（白色）。
 * @returns {AVLayer | ShapeLayer} 返回添加的图层，可能是 `AVLayer`（固态图层）或 `ShapeLayer`（形状图层）。
 * @since 0.1.0
 * @category Soil
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
        const vectorDate = {
            "S0000 selfProperty": {
                "name": layerName
            },
            "G0001 ADBE Root Vectors Group": {
                "G0001 ADBE Vector Shape - Rect": {
                    "P0002 ADBE Vector Rect Size": {
                        "propertyExpression": "[width,height]"
                    }
                },
                "G0002 ADBE Vector Graphic - Fill": {
                    "P0004 ADBE Vector Fill Color": {
                        "propertyValue": [1, 1, 1, 1]
                    }
                }
            },
            "G0002 ADBE Transform Group": {
                "P0002 ADBE Position": {
                    "propertyExpression": "[thisComp.width,thisComp.height]/2"
                }
            }
        }

        newAdjust = getLayers.addShape()
        setPropertyByDate(newAdjust, vectorDate)
    } else {
        newAdjust = getLayers.addSolid(layerColor, layerName, compItem.width, compItem.height, 1, compItem.duration);
    }
    newAdjust.adjustmentLayer = true;
    newAdjust.label = 10; // 10 对应淡紫色
    return newAdjust
}

export default addAdjustmentLayer