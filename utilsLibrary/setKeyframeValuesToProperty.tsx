import { map, setKeyframeValues } from "soil-ts";

function setKeyframeValuesToProperty(property: Property, keyframeArray: Array<KeyframeWithoutProperty>) {
    setKeyframeValues(map(keyframeArray, (keyframe) => {
        return {
            ...keyframe,
            property: property
        } as Keyframe;
    }));
}

export default setKeyframeValuesToProperty;