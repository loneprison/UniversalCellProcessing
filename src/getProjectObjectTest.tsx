import * as _ from 'soil-ts';
import * as ul from 'utilsLibrary';

let activeItem = _.getActiveComp();
let firstLayer = _.getFirstSelectedLayer();

if (firstLayer && _.isRasterLayer(firstLayer)) {

    $.writeln(_.stringify(ul.getPropertyListObject(firstLayer,[])))

}else{
    $.writeln("请选择形状图层")
}

// const selectedLayers = _.getSelectedLayers();
// if (selectedLayers.length == 2) {
//     const propertyData = ul.getPropertyListObject(selectedLayers[0],["ADBE Effect Parade"]);
//     ul.setPropertyByDate(_.getProperty(selectedLayers[1],["ADBE Effect Parade"]), propertyData);
// }


function getVectorsGroupObject(shapeLayer: ShapeLayer) {
    return ul.getPropertyListObject(shapeLayer, ['ADBE Root Vectors Group']);
}