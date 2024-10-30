import * as _ from "soil-ts";
import * as ULib from "utilsLibrary";
// utilsLibrary基于Soil二次开发

let activeItem = _.getActiveComp();
let firstLayer = _.getFirstSelectedLayer();

// if (activeItem) {
//     if (firstLayer) {
//         const {effectObj,log} = getEffectOfLayer(firstLayer);
//         const newLayer  = ULib.addAdjustmentLayer(activeItem)
//         ULib.addEffects(newLayer,effectObj)
//         newLayer.moveBefore(firstLayer)
//     }
// }