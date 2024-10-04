import { addProperty, getProperty, isPropertyGroup, setPropertyValue } from "soil-ts";
import setProertiesExpressions from "./setProertiesExpressions";

function addAdjustmentLayer(compItem: CompItem, useShapeLayer: Boolean = true, layerName: string = "adjustment", layerColor: ThreeDColorValue = [1, 1, 1]): AVLayer|ShapeLayer {
    let newAdjust:AVLayer|ShapeLayer
    const getLayers: LayerCollection = compItem.layers
    if (useShapeLayer) {
        newAdjust = getLayers.addShape()
        newAdjust.name = layerName
        const VectorsGroup = newAdjust.property('ADBE Root Vectors Group');
        addProperty(VectorsGroup, ['ADBE Vector Shape - Rect'])
        addProperty(VectorsGroup, ['ADBE Vector Graphic - Fill']);
        const rect = getProperty(VectorsGroup, ['ADBE Vector Shape - Rect'])
        isPropertyGroup(rect)&&setProertiesExpressions(rect, { "ADBE Vector Rect Size": "[width,height]" })
        setPropertyValue(VectorsGroup, ['ADBE Vector Graphic - Fill', "ADBE Vector Fill Color"], layerColor)

        // 设置图层的位置和透明度
        newAdjust.position.expression = '[thisComp.width,thisComp.height]/2';
    } else {
        newAdjust = getLayers.addSolid(layerColor, layerName, compItem.width, compItem.height, 1, compItem.duration);
    }
    newAdjust.adjustmentLayer = true;
    newAdjust.label = 10; // 10 对应淡紫色
    return newAdjust
}

export default addAdjustmentLayer