function getTrackMatteTypeByName(name) {
    var trackMatteTypes = {
        "Alpha 遮罩": TrackMatteType.ALPHA,
        "Alpha 反转遮罩": TrackMatteType.ALPHA_INVERTED,
        "亮度遮罩": TrackMatteType.LUMA,
        "亮度反转遮罩": TrackMatteType.LUMA_INVERTED,
        "无": TrackMatteType.NO_TRACK_MATTE
    };
    return trackMatteTypes[name];
}
export default getTrackMatteTypeByName;
