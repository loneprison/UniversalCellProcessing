import * as _ from "soil-ts";
import * as ULib from "utilsLibrary";
var activeItem = _.getActiveComp();
var fristLayet = _.getFirstSelectedLayer();
_.getFirstSelectedLayer;
if (activeItem) {
    if (fristLayet) {
        var obj_3 = ULib.getPropertylesObject(fristLayet, ["ADBE Effect Parade"]);
        if (obj_3) {
            var _a = ULib.removeTargetValues(obj_3), effectObj = _a.object, effectLog = _a.log;
            alert(_.stringify(effectObj));
        }
    }
}
