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
const selfKey = "S0000 selfProperty"

if (_.isLayer(firstLayer)) {
    const dataObject = getRootPropertyData(firstLayer)
    $.writeln(_.stringify(dataObject))
    _.logJson(dataObject)
} else {
    $.writeln("请选择图层")
}



function getRootPropertyData(rootProperty: _PropertyClasses): PropertyDataStructure {
    let data: PropertyDataStructure = {};
    if (_.isProperty(rootProperty) || _.isPropertyGroup(rootProperty)) {
        data = processProperty(rootProperty);
    } else if (_.isLayer(rootProperty)) {
        data = getLayerData(rootProperty);
    }
    return data
}

function processProperty(property: _PropertyClasses | PropertyGroup, index?: number): PropertyDataStructure {
    let data: PropertyDataStructure = {};
    const matchName = property?.matchName

    if (_.isPropertyGroup(property)) {
        // 如果是属性组，递归处理
        const groupKey = `G${_.padStart(index?.toString() || "1", 4, "0")} ${matchName}`;
        data[groupKey] = getPropertyGroupData(property);
    } else if (_.canSetPropertyValue(property)) {
        // 如果是可以设置值的属性，处理它
        const key = `P${_.padStart(index?.toString() || "1", 4, "0")} ${matchName}`;
        data[key] = getPropertyData(property);
    }

    return data;
}

function getPropertyGroupData(propertyGroup: PropertyGroup): PropertyDataStructure {
    let data: PropertyDataStructure = {};

    const selfMetadata = getSelfMetadata(propertyGroup);
    // 添加元数据
    if (!_.isEmpty(selfMetadata)) {
        data[selfKey] = selfMetadata;
    }
    for (let i = 1; i <= propertyGroup.numProperties; i++) {
        const property = _.getProperty(propertyGroup, [i]);
        if (property) {
            // 递归处理属性
            const propertyData = processProperty(property, i);
            // 合并属性数据
            data = { ...data, ...propertyData };
        }
    }
    return data;
}

function getLayerData(layer: Layer): PropertyDataStructure {
    let data: PropertyDataStructure = {};

    //  除了文本层的的源文本会读取错误以及图层样式是永远被读取的两个问题
    //  用这个方法读取事实上是没有问题的
    //  但是为了保证不读取无用数据这里使用人工排除/筛选根属性的方法
    //  for(let i = 1;i<=layer.numProperties;i++){
    //      const property = _.getProperty(layer, [i]);
    //      const propertyData = processProperty(property, i);
    //      data = { ...data, ...propertyData };
    //   }

    // Marker不做判断会对空标记做value的读取
    const marker = layer.marker
    if (marker.numKeys > 0) {
        data = { ...data, ...manualGetRootPropertyData(marker) }
    }

    // 所有类型图层上都存在transform属性数据
    data = { ...data, ...manualGetRootPropertyData(layer.transform) }

    if (_.isRasterLayer(layer)) {
        data[selfKey] = getSelfMetadataByRasterLayer(layer)

        data = {
            ...data,
            ...manualGetRootPropertyData(layer.effect),
        }

        const layerStyle = layer.layerStyle
        if (layerStyle.canSetEnabled == true) {
            let layerStyleDate = {
                ...{
                "S0000 selfProperty": {
                    enabled: layerStyle.enabled
                }
            },
            ...manualGetRootPropertyData(layerStyle.blendingOption)
            }
            for (let i = 2; i <= layerStyle.numProperties; i++) {
                if(layerStyle.property(i).canSetEnabled==true){
                    layerStyleDate = {
                        ...layerStyleDate,
                        ...manualGetRootPropertyData(layerStyle.property(i) as PropertyGroup)
                    }
                }
            }

            data = {...data,...{[`G${_.padStart(layerStyle.propertyIndex.toString(), 4,"0")} ${layerStyle.matchName}`]:layerStyleDate}}
        }

        if (layer.threeDLayer) {
            //少判断了，明天检查
            data = {
                ...data,
                ...manualGetRootPropertyData(_.getProperty(layer, ["ADBE Extrsn Options Group"])),
                ...manualGetRootPropertyData(layer.materialOption),
            }
        }

        if (layer.hasAudio) {
            data = {
                ...data,
                ...manualGetRootPropertyData(layer.audio),
            }
        }

        if (_.isAVLayer(layer)) {
            if (layer.canSetTimeRemapEnabled && layer.timeRemapEnabled) {
                data = {
                    ...data,
                    ...manualGetRootPropertyData(layer.timeRemap),
                    //这个肯定有问题
                    ...manualGetRootPropertyData(_.getProperty(layer, ["ADBE Plane Options Group"])),
                }
            }

            if (_.isCompLayer(layer)) {
                data = {
                    ...data,
                    ...manualGetRootPropertyData(_.getProperty(layer, ["ADBE Layer Overrides"])),
                }
            }
        } else if (_.isTextLayer(layer)) {
            data = { ...data, ...manualGetRootPropertyData((layer as TextLayer).text) }
        } else if (_.isShapeLayer(layer)) {
            data = { ...data, ...manualGetRootPropertyData(_.getProperty(layer, ["ADBE Root Vectors Group"])) }
        }
    } else {
        data[selfKey] = getSelfMetadataByBaseLayer(layer)
        if (_.isCameraLayer(layer)) {
            data = { ...data, ...manualGetRootPropertyData(layer.cameraOption) }
        } else if (_.isLightLayer(layer)) {
            data = { ...data, ...manualGetRootPropertyData(layer.lightOption) }
        }
    }

    return data;
}

function manualGetRootPropertyData(rootProperty: CanSetValueProperty | PropertyGroup): PropertyDataStructure {
    let data: PropertyDataStructure = {};

    const { prefix, nested } = _.isProperty(rootProperty)
        ? { prefix: 'P', nested: getPropertyData(rootProperty) }
        : { prefix: 'G', nested: getPropertyGroupData(rootProperty) };

    data[`${prefix}${_.padStart(rootProperty.propertyIndex.toString(), 4,"0")} ${rootProperty.matchName}`] = nested
    return data
}

function getPropertyData(property: CanSetValueProperty): PropertyValueData {
    let data: PropertyValueData = {}

    data.name = property.name

    if (property.numKeys > 0) {
        data.Keyframe = _.getKeyframeValues(property);
    } else {
        data.value = property.value;
    }

    if (property.expressionEnabled) {
        data.expression = property.expression;
    }
    return data
}

function getSelfMetadata(propertyGroup: PropertyGroup): PropertyMetadata {
    let data: PropertyMetadata = {};
    if (propertyGroup.canSetEnabled) data.enabled = propertyGroup.enabled;
    if (_.isNamedGroupType(propertyGroup) && _.isIndexedGroupType(propertyGroup.propertyGroup(1))) data.name = propertyGroup.name;

    return data;
}

function getSelfMetadataByBaseLayer(layer: Layer): BaseLayerMetadata {
    let data: BaseLayerMetadata = getSelfMetadata(layer);

    return {
        ...data,
        autoOrient: layer.autoOrient,
        inPoint: layer.inPoint,
        outPoint: layer.outPoint,
        startTime: layer.startTime,
        stretch: layer.stretch,
        time: layer.time,
        label: layer.label,
        locked: layer.locked,
        shy: layer.shy,
        solo: layer.solo,
    };
}

function getSelfMetadataByRasterLayer(layer: RasterLayer): RasterLayerMetadata {
    let data: RasterLayerMetadata = getSelfMetadataByBaseLayer(layer);

    return {
        ...data,
        adjustmentLayer: layer.adjustmentLayer,
        audioEnabled: layer.audioEnabled,
        blendingMode: layer.blendingMode,
        effectsActive: layer.effectsActive,
        environmentLayer: layer.environmentLayer,
        frameBlendingType: layer.frameBlendingType,
        timeRemapEnabled: layer.timeRemapEnabled,
        guideLayer: layer.guideLayer,
        motionBlur: layer.motionBlur,
        preserveTransparency: layer.preserveTransparency,
        quality: layer.quality,
        samplingQuality: layer.samplingQuality,
        trackMatteType: layer.trackMatteType,
        height: layer.height,
        width: layer.width
    };
}

