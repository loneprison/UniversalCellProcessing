import { addPropertyAlone, forOwn, isPropertyGroup, setPropertiesValues } from "soil-ts";
import setProertiesExpressions from "./setProertiesExpressions";

//该function只能配合指定格式的Obj使用
function addeffects(layer: Layer, effectObj: AnyObject):void {
    const effcts = layer.property("ADBE Effect Parade")

    forOwn(effectObj, ({name, values, expressions, matchName }, key) => {
        const newEffect = addPropertyAlone(effcts, [matchName]);

        if (isPropertyGroup(newEffect)) {
            if(name){
                newEffect.name = name;
            }
            if (values) {
                setPropertiesValues(newEffect, values);
            }
            if (expressions) {
                setProertiesExpressions(newEffect,expressions)
            }
        }
    });
}

export default addeffects;
