import { addProperty, getProperty, isPropertyGroup, setPropertyValue } from "soil-ts";
import setPropertiesExpressions from "./setPropertiesExpressions";
function addAdjustmentLayer(compItem, useShapeLayer, layerName, layerColor) {
    if (useShapeLayer === void 0) { useShapeLayer = true; }
    if (layerName === void 0) { layerName = "adjustment"; }
    if (layerColor === void 0) { layerColor = [1, 1, 1]; }
    var newAdjust;
    var getLayers = compItem.layers;
    if (useShapeLayer) {
        newAdjust = getLayers.addShape();
        newAdjust.name = layerName;
        var VectorsGroup = newAdjust.property('ADBE Root Vectors Group');
        addProperty(VectorsGroup, ['ADBE Vector Shape - Rect']);
        addProperty(VectorsGroup, ['ADBE Vector Graphic - Fill']);
        var rect = getProperty(VectorsGroup, ['ADBE Vector Shape - Rect']);
        isPropertyGroup(rect) && setPropertiesExpressions(rect, { "ADBE Vector Rect Size": "[width,height]" });
        setPropertyValue(VectorsGroup, ['ADBE Vector Graphic - Fill', "ADBE Vector Fill Color"], layerColor);
        newAdjust.position.expression = '[thisComp.width,thisComp.height]/2';
    }
    else {
        newAdjust = getLayers.addSolid(layerColor, layerName, compItem.width, compItem.height, 1, compItem.duration);
    }
    newAdjust.adjustmentLayer = true;
    newAdjust.label = 10;
    return newAdjust;
}
export default addAdjustmentLayer;
