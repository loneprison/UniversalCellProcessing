import { addProperty, forEach, map } from "soil-ts";

function addeffects(layer:AVLayer,effectArr:Array<AdbePath>) {
    const effectsPropertyGroup = layer.effect;
    forEach(effectArr,(effectName)=>{
        addProperty(effectsPropertyGroup,effectName)
    })
}

export default addeffects