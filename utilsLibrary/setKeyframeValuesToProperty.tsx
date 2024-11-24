import { map, setKeyframeValues } from "soil-ts";

function setKeyframeValuesToProperty(property: Property, keyframeArray: Array<KeyframeWithoutProperty>) {
    setKeyframeValues(property,map(keyframeArray, (keyframe) => {
        return {
            ...keyframe,
        };
    }));
}

export default setKeyframeValuesToProperty;