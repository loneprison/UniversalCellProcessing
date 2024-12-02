import * as _ from 'soil-ts';
import * as ul from 'utilsLibrary';
/*
    该模块属于功能缺失的状态
    实在不想写了先搁置
    目前已知问题
        1.无法读取关键帧，而比较重要的标记和时间重映射都属于key，所以都无法被获取
        2.无法读取例如摄像机属性和灯光属性设置，因为他们不属于PropertyGroup
        3.无法读取文本属性，会中途报错
        4.当位置属性没开启分离状态时候，分离状态的属性值会被读取为"propertyValue": 0,但按理说这种情况就不应该被读取
        5.当图层样式未开启的状态，混合选项依然会被错误的读取出来
    暂时想到的解决方案
        1.重构isSpecifiedProperty的部分，将这部分暴露出去做手动调整，人为控制属性
        2.应当完善getPropertyListObject的开头处理部分，如果这里不解决前面读不出来的属性全都会被一键带过
*/

const firstLayer = _.getFirstSelectedLayer();

if (firstLayer) {
    const dateObject = getRootPropertyDate(firstLayer)
    $.writeln(_.stringify(dateObject))
} else {
    $.writeln("请选择图层")
}

function processProperty(property: _PropertyClasses | PropertyGroup, index?: number): PropertyDataStructure {
    let date: PropertyDataStructure = {};
    const matchName = property.matchName || "Unnamed";

    if (_.isPropertyGroup(property)) {
        const selfMetadata = getSelfMetadata(property);
        // 添加元数据
        if (!_.isEmpty(selfMetadata)) {
            date["S0000 selfProperty"] = selfMetadata;
        }
        // 如果是属性组，递归处理
        const groupKey = `G${_.padStart(index?.toString() || "1", 4, "0")} ${matchName}`;
        date[groupKey] = getPropertyGroupDate(property);
    } else if (_.canSetPropertyValue(property)) {
        // 如果是可以设置值的属性，处理它
        const key = `P${_.padStart(index?.toString() || "1", 4, "0")} ${matchName}`;
        date[key] = getPropertyDate(property);
    } else if (_.isAVLayer(property)) {
        const selfMetadata = getSelfMetadataByLayer(property);
        // 添加元数据
        if (!_.isEmpty(selfMetadata)) {
            date["S0000 selfProperty"] = selfMetadata;
        }
        // 递归处理
        const groupKey = `L${_.padStart(index?.toString() || "1", 4, "0")} ${matchName}`;
        date[groupKey] = getPropertyGroupDate(property);
    }

    return date;
}

function getRootPropertyDate(rootProperty: _PropertyClasses): PropertyDataStructure {
    return processProperty(rootProperty);
}

function getPropertyGroupDate(propertyGroup: PropertyGroup): PropertyDataStructure {
    let date: PropertyDataStructure = {};

    for (let i = 0; i < propertyGroup.numProperties; i++) {
        const property = _.getProperty(propertyGroup, [i]);
        if (property) {
            // 递归处理属性
            const propertyDate = processProperty(property, i);
            // 合并属性数据
            date = { ...date, ...propertyDate };
        }
    }
    return date;
}


function getPropertyDate(property: CanSetValueProperty): PropertyValueDate {
    let date: PropertyValueDate = {}
    if (property.numKeys > 0) {
        date.Keyframe = _.getKeyframeValues(property);
    } else {
        date.value = property.value;
    }

    if (property.expressionEnabled) {
        date.expression = property.expression;
    }
    return date
}

function getSelfMetadata(propertyGroup: PropertyGroup): PropertyMetadata {
    let date: PropertyMetadata = {};
    if (propertyGroup.canSetEnabled) date.enabled = propertyGroup.enabled
    if (_.isNamedGroupType(propertyGroup) && _.isIndexedGroupType(propertyGroup.propertyGroup(1))) date.name = propertyGroup.name;

    return date
}

function getSelfMetadataByLayer(layer: AVLayer): AVLayerMetadata {
    let date: AVLayerMetadata = getSelfMetadata(layer) as AVLayerMetadata;

    return _.assign(date, {
        adjustmentLayer: layer.adjustmentLayer,
        audioEnabled: layer.audioEnabled,
        autoOrient: layer.autoOrient,
        blendingMode: layer.blendingMode,
        effectsActive: layer.effectsActive,
        environmentLayer: layer.environmentLayer,
        frameBlendingType: layer.frameBlendingType,

        inPoint: layer.inPoint,
        outPoint: layer.outPoint,
        startTime: layer.startTime,
        stretch: layer.stretch,
        time: layer.time,
        timeRemapEnabled: layer.timeRemapEnabled,

        guideLayer: layer.guideLayer,
        label: layer.label,
        locked: layer.locked,
        motionBlur: layer.motionBlur,
        preserveTransparency: layer.preserveTransparency,
        quality: layer.quality,
        samplingQuality: layer.samplingQuality,
        shy: layer.shy,
        solo: layer.solo,
        trackMatteType: layer.trackMatteType,

        height: layer.height,
        width: layer.width
    });
}