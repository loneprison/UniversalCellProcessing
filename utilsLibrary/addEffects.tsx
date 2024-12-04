import { addPropertyAlone, forOwn, isPropertyGroup, setPropertiesValues } from "soil-ts";
import setPropertiesExpressions from "./setPropertiesExpressions";

//该function只能配合指定格式的Obj使用
function addEffects(layer: Layer, effectObj: AnyObject):void {
    const effects = layer.property("ADBE Effect Parade")

    forOwn(effectObj, ({name, values, expressions, matchName }, key) => {
        const newEffect = addPropertyAlone(effects, [matchName]);

        if (isPropertyGroup(newEffect)) {
            if(name){
                newEffect.name = name;
            }
            if (values) {
                setPropertiesValues(newEffect, values);
            }
            if (expressions) {
                setPropertiesExpressions(newEffect,expressions)
            }
        }
    });
}

export default addEffects;
