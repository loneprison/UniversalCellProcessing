import { addPropertyAlone, forOwn, isPropertyGroup, setPropertiesValues } from "soil-ts";
import setPropertiesExpressions from "./setPropertiesExpressions";
function addEffects(layer, effectObj) {
    var effcts = layer.property("ADBE Effect Parade");
    forOwn(effectObj, function (_a, key) {
        var name = _a.name, values = _a.values, expressions = _a.expressions, matchName = _a.matchName;
        var newEffect = addPropertyAlone(effcts, [matchName]);
        if (isPropertyGroup(newEffect)) {
            if (name) {
                newEffect.name = name;
            }
            if (values) {
                setPropertiesValues(newEffect, values);
            }
            if (expressions) {
                setPropertiesExpressions(newEffect, expressions);
            }
        }
    });
}
export default addEffects;
