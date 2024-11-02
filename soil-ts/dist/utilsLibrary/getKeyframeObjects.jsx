import { getKeyframeValues, map } from "soil-ts";
function getKeyframeObjects(property) {
    var KeyframeArray = getKeyframeValues(property);
    return map(KeyframeArray, function (Keyframe) {
        return {
            keyTime: Keyframe.keyTime,
            keyValue: Keyframe.keyValue,
            keySelected: Keyframe.keySelected,
            keyInTemporalEase: Keyframe.keyInTemporalEase,
            keyOutTemporalEase: Keyframe.keyOutTemporalEase,
            keyTemporalContinuous: Keyframe.keyTemporalContinuous,
            keyTemporalAutoBezier: Keyframe.keyTemporalAutoBezier,
            keyInInterpolationType: Keyframe.keyInInterpolationType,
            keyOutInterpolationType: Keyframe.keyOutInterpolationType,
            keyInSpatialTangent: Keyframe.keyInSpatialTangent,
            keyOutSpatialTangent: Keyframe.keyOutSpatialTangent,
            keySpatialAutoBezier: Keyframe.keySpatialAutoBezier,
            keySpatialContinuous: Keyframe.keySpatialContinuous,
            keyRoving: Keyframe.keyRoving,
            keyLabel: Keyframe.keyLabel
        };
    });
}
export default getKeyframeObjects;
