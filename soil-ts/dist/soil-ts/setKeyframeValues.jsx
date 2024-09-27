import { IS_KEY_LABEL_EXISTS } from "./_internal/_global";
import forEach from "./lodash/#forEach";
import canSetKeyframeVelocity from "./canSetKeyframeVelocity";
import mapTemporalEaseValueToClasses from "./_internal/_mapTemporalEaseValueToClasses";
import isProperty from "./isProperty";
function setKeyframeValues(keyframeValues, targetProperty) {
    if (keyframeValues.length === 0) {
        return;
    }
    var sourceProperty = keyframeValues[0].property;
    var property = isProperty(targetProperty) ? targetProperty : sourceProperty;
    if (property.propertyValueType !== sourceProperty.propertyValueType) {
        throw new Error("Incompatible property Value types");
    }
    forEach(keyframeValues, function (keyframe) {
        var keyTime = keyframe.keyTime;
        var keyValue = keyframe.keyValue;
        property.setValueAtTime(keyTime, keyValue);
    });
    forEach(keyframeValues, function (keyframe) {
        var keyIndex = property.nearestKeyIndex(keyframe.keyTime);
        var keyInSpatialTangent = keyframe.keyInSpatialTangent;
        var keyOutSpatialTangent = keyframe.keyOutSpatialTangent;
        var keySpatialAutoBezier = keyframe.keySpatialAutoBezier;
        var keySpatialContinuous = keyframe.keySpatialContinuous;
        var keyRoving = keyframe.keyRoving;
        var keyInTemporalEase = mapTemporalEaseValueToClasses(keyframe.keyInTemporalEase);
        var keyOutTemporalEase = mapTemporalEaseValueToClasses(keyframe.keyOutTemporalEase);
        var keyTemporalContinuous = keyframe.keyTemporalContinuous;
        var keyTemporalAutoBezier = keyframe.keyTemporalAutoBezier;
        var keyInInterpolationType = keyframe.keyInInterpolationType;
        var keyOutInterpolationType = keyframe.keyOutInterpolationType;
        var keyLabel = keyframe.keyLabel;
        if (property.isSpatial) {
            property.setSpatialTangentsAtKey(keyIndex, keyInSpatialTangent, keyOutSpatialTangent);
            property.setSpatialAutoBezierAtKey(keyIndex, keySpatialAutoBezier);
            property.setSpatialContinuousAtKey(keyIndex, keySpatialContinuous);
            property.setRovingAtKey(keyIndex, keyRoving);
        }
        if (canSetKeyframeVelocity(property)) {
            property.setTemporalEaseAtKey(keyIndex, keyInTemporalEase, keyOutTemporalEase);
        }
        property.setTemporalContinuousAtKey(keyIndex, keyTemporalContinuous);
        property.setTemporalAutoBezierAtKey(keyIndex, keyTemporalAutoBezier);
        property.setInterpolationTypeAtKey(keyIndex, keyInInterpolationType, keyOutInterpolationType);
        if (IS_KEY_LABEL_EXISTS) {
            property.setLabelAtKey(keyIndex, keyLabel);
        }
        property.setSelectedAtKey(keyIndex, keyframe.keySelected);
    });
}
export default setKeyframeValues;
