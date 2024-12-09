import * as _ from 'soil-ts';
import * as ul from 'utilsLibrary';
/*
    该模块属于功能缺失的状态
    实在不想写了先搁置
    目前已知问题
        3.无法读取文本属性，严格来说是无法读取源文本，需要手动进行干预排除
        4.当位置属性没开启分离状态时候，分离状态的属性值会被读取为"propertyValue": 0,但按理说这种情况就不应该被读取
        5.当图层样式未开启的状态，混合选项依然会被错误的读取出来
*/

const firstLayer = _.getFirstSelectedLayer();
const selfKey = "S0000 selfProperty"

if (_.isLayer(firstLayer)) {
    const dataObject = getRootPropertyData(firstLayer)
    $.writeln(_.stringify(dataObject))
    _.logJson(getLayerDataOld(firstLayer))
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
    } else if (_.canSetPropertyValue(property) && property.isModified) {
        // 如果是可以设置值的属性，处理它
        const key = `P${_.padStart(index?.toString() || "1", 4, "0")} ${matchName}`;
        data[key] = getPropertyData(property);
    }

    return data;
}

function getLayerDataOld(layer: Layer): PropertyDataStructure {
    let data: PropertyDataStructure = {};

    for (let i = 1; i <= layer.numProperties; i++) {
        const property = _.getProperty(layer, [i]);
        const propertyData = processProperty(property, i);
        data = { ...data, ...propertyData };
    }
    return data
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

    // Marker不应该空标记做value的读取
    const marker = layer.marker
    if (marker.numKeys > 0) {
        data = {
            ...data,
            ...manualGetRootPropertyData(marker)
        }
    }


    // 所有类型图层上都存在transform属性数据
    let transformData = manualGetRootPropertyData(layer.transform)//返回一个对象

    // 人工排除分离XYZ的值
    const transformKey = _.keys(transformData)[0];
    let excludeTransformKey: RegExp;
    if (transformData.dimensionsSeparated) {
        excludeTransformKey = /^ADBE Position$/; // 已分离，排除 "ADBE Position"
    } else {
        excludeTransformKey = /ADBE Position_\d+/; // 未分离，排除 "ADBE Position_0", "ADBE Position_1", 等
    }
    _.forOwn(transformData[transformKey], (value, key) => {
        if (excludeTransformKey.test(key))
            delete transformData[transformKey][key];
    })

    if (!_.isEmpty(transformData)) {
        data = { ...data, ...transformData };
    }


    if (_.isRasterLayer(layer)) {
        data[selfKey] = getSelfMetadataByRasterLayer(layer)

        data = {
            ...data,
            ...manualGetRootPropertyData(layer.effect),
        }

        // 图层样式的判断比较复杂...,如果不做干预会全读取,单纯的判断isModified又会导致默认参数无法被读取
        // 因此需要用canSetEnabled来强行判断

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
                if (layerStyle.property(i).canSetEnabled == true) {
                    layerStyleDate = {
                        ...layerStyleDate,
                        ...manualGetRootPropertyData(layerStyle.property(i) as PropertyGroup, true)
                    }
                }
            }

            data = {
                ...data,
                ...{ [`G${_.padStart(layerStyle.propertyIndex.toString(), 4, "0")} ${layerStyle.matchName}`]: layerStyleDate }
            }
        }

        // 几何选项和材质选项
        // 直接使用geometryOption可以自动匹配是读取ADBE Plane Options Group还是ADBE Extrsn Options Group
        // 因此在读取这个属性时使用getProperty反而是个错误的选择
        if (layer.threeDLayer) {
            data = {
                ...data,
                ...manualGetRootPropertyData(layer.geometryOption),
                ...manualGetRootPropertyData(layer.materialOption),
            }
        }

        // 音频简单判断即可
        if (layer.hasAudio) {
            data = {
                ...data,
                ...manualGetRootPropertyData(layer.audio),
            }
        }

        if (_.isAVLayer(layer)) {
            // 严格来说只有素材/合成上存在时间重映射,不过给了API可以判断所以无所谓
            if (layer.canSetTimeRemapEnabled && layer.timeRemapEnabled) {
                data = {
                    ...data,
                    ...manualGetRootPropertyData(layer.timeRemap),
                }
            }

            if (_.isCompLayer(layer)) {
                // 读取子合成是个体力活...
            }

        } else if (_.isTextLayer(layer)) {
            // 需要人工排除Text暂未实现
            data = { ...data, ...manualGetRootPropertyData((layer as TextLayer).text) }
        } else if (_.isShapeLayer(layer)) {
            // 形状图层内容,没问题
            data = { ...data, ...manualGetRootPropertyData(_.getProperty(layer, ["ADBE Root Vectors Group"])) }
        }
    } else {
        data[selfKey] = getSelfMetadataByBaseLayer(layer)
        if (_.isCameraLayer(layer)) {
            // 摄像机属性,没问题
            data = { ...data, ...manualGetRootPropertyData(layer.cameraOption) }
        } else if (_.isLightLayer(layer)) {
            // 灯光选项,没问题
            data = { ...data, ...manualGetRootPropertyData(layer.lightOption) }
        }
    }

    return data;
}

/**
 * 根据给定的图层属性，获取其根属性数据,平时请使用getRootPropertyData,这个函数是为了做手动干预而存在的。
 * 
 * 该函数根据 `rootProperty` 的类型（`CanSetValueProperty` 或 `PropertyGroup`）来获取对应的属性数据。根据 `isModified` 参数判断是否强制读取属性数据。
 * 如果 `isModified` 为 `true`，则强制读取该属性。
 *
 * @param {CanSetValueProperty | PropertyGroup} rootProperty 目标属性对象，可以是一个可设置值的属性或一个属性组。
 * @param {boolean} [isModified=rootProperty.isModified] 是否强制读取属性数据。如果为 `false`，则返回空对象；如果为 `true`，则根据属性类型读取数据。
 * @returns {PropertyDataStructure} 包含根属性数据的对象。
 * @example
 * const rootProperty = _.getProperty(layer, [0]);
 * const propertyData = manualGetRootPropertyData(rootProperty);
 * $.writeln(_.stringify(propertyData));
 */
function manualGetRootPropertyData(rootProperty: CanSetValueProperty | PropertyGroup, isModified: Boolean = rootProperty.isModified): PropertyDataStructure {
    let data: PropertyDataStructure = {};
    if (!isModified) return data
    const { prefix, nested } = _.isProperty(rootProperty)
        ? { prefix: 'P', nested: getPropertyData(rootProperty) }
        : { prefix: 'G', nested: getPropertyGroupData(rootProperty) };

    data[`${prefix}${_.padStart(rootProperty.propertyIndex.toString(), 4, "0")} ${rootProperty.matchName}`] = nested
    return data
}

function getPropertyData(property: CanSetValueProperty): PropertyValueData {
    let data: PropertyValueData = {}

    // 调试用的临时属性
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


function getPropertyGroupData(propertyGroup: PropertyGroup): PropertyDataStructure {
    let data: PropertyDataStructure = {};

    const selfMetadata = getSelfMetadata(propertyGroup);
    // 添加元数据
    if (!_.isEmpty(selfMetadata)) {
        data[selfKey] = selfMetadata;
    }
    for (let i = 1; i <= propertyGroup.numProperties; i++) {
        const property = _.getProperty(propertyGroup, [i]);
        // 递归处理属性
        const propertyData = processProperty(property, i);
        // 合并属性数据
        data = { ...data, ...propertyData };
    }
    return data;
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

    if (_.isTextLayer(layer)) {
        data = {
            ...data,
            threeDPerChar: layer.threeDPerChar
        };
    }
    return {
        ...data,
        adjustmentLayer: layer.adjustmentLayer,
        audioEnabled: layer.audioEnabled,
        blendingMode: layer.blendingMode,
        effectsActive: layer.effectsActive,
        environmentLayer: layer.environmentLayer,
        frameBlendingType: layer.frameBlendingType,
        timeRemapEnabled: layer.timeRemapEnabled,
        threeDLayer: layer.threeDLayer,
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

