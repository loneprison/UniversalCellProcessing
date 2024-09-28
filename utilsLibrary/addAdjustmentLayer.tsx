import { addProperty, getProperty, isProperty, setPropertyValue } from "soil-ts";

function addAdjustmentLayer(compItem: CompItem, useShapeLayer: Boolean = true, layerName: string = "adjustment", layerColor: ThreeDColorValue = [1, 1, 1]): AVLayer {
    let newAdjust: AVLayer
    const getLayers: LayerCollection = compItem.layers
    if (useShapeLayer) {
        newAdjust = getLayers.addShape()
        newAdjust.name = layerName
        const VectorsGroup = newAdjust.property('ADBE Root Vectors Group');
        addProperty(VectorsGroup, ['ADBE Vector Shape - Rect'])
        addProperty(VectorsGroup, ['ADBE Vector Graphic - Fill']);
        (getProperty(VectorsGroup, ['ADBE Vector Shape - Rect', "ADBE Vector Rect Size"]) as Property).expression = "[width,height]";
        setPropertyValue(VectorsGroup, ['ADBE Vector Graphic - Fill',"ADBE Vector Fill Color"], layerColor)

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