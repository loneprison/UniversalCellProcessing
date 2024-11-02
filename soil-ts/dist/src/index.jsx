import * as _ from 'soil-ts';
import * as ul from 'utilsLibrary';
var activeItem = _.getActiveComp();
var firstLayer = _.getFirstSelectedLayer();
var layer1 = activeItem === null || activeItem === void 0 ? void 0 : activeItem.layer(1);
if (firstLayer && layer1 && _.isRasterLayer(firstLayer) && _.isRasterLayer(layer1)) {
    var timeRemap = _.getProperty(firstLayer, ["timeRemap"]);
    var timeRemap2 = _.getProperty(layer1, ["timeRemap"]);
    if (_.isProperty(timeRemap) && _.isProperty(timeRemap2)) {
        layer1.timeRemapEnabled = true;
        ul.setKeyframeValuesToProperty(timeRemap2, ul.getKeyframeObjects(timeRemap));
        $.writeln(_.stringify(ul.getKeyframeObjects(firstLayer.marker)));
    }
}
function getLayerStylesObject(rasterLayer) {
    var _a;
    if (!((_a = _.getProperty(rasterLayer, ['ADBE Layer Styles'])) === null || _a === void 0 ? void 0 : _a.canSetEnabled))
        return;
    return ul.getPropertyListObject(rasterLayer, ['ADBE Layer Styles']);
}
function getEffectGroupObject(rasterLayer) {
    return ul.getPropertyListObject(rasterLayer, ['ADBE Effect Parade']);
}
function getVectorsGroupObject(shapeLayer) {
    return ul.getPropertyListObject(shapeLayer, ['ADBE Root Vectors Group']);
}
function getTimeRemappingObject(rasterLayer) {
    return ul.canSetTimeRemapEnabled(rasterLayer) ? _.getKeyframeValues(rasterLayer.timeRemap) : undefined;
}
