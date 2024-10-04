import * as _ from "soil-ts";
import * as ULib from "utilsLibrary";
// utilsLibrary基于Soil二次开发

let activeItem = _.getActiveComp();
let fristLayet = _.getFirstSelectedLayer();

// if (activeItem) {
//     if (fristLayet) {
//         const {effectObj,log} = getEffectOfLayer(fristLayet);
//         const newLayer  = ULib.addAdjustmentLayer(activeItem)
//         ULib.addEffects(newLayer,effectObj)
//         newLayer.moveBefore(fristLayet)
//     }
// }