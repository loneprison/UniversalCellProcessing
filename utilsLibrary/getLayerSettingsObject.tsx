import PropertyParser from "./PropertyParser";

function getLayerSettingsObject(layer: Layer) {
    const object = {
        adjustmentLayer: false,         // 设置调整图层
        audioEnabled: true,             // 激活音频
        autoOrient: 4212,               // 图层自动定向
        blendingMode: 5212,             // 图层混合模式
        effectsActive: true,            // 效果是否活动                        
        enabled: true,                  // 是否开启图层小眼睛
        environmentLayer: false,        // 是否环境图层
        frameBlendingType: 4012,        // 帧混合类型
        guideLayer: false,              // 是否参考图层
        height: 3000,                   // 图层/合成高度
        id: 45,                         // 图层ID
        inPoint: 0,                     // 图层入点
        index: 2,                       // 图层顺序
        label: 1,                       // 标签
        locked: false,                  // 锁
        matchName: "ADBE AV Layer",     // 匹配名
        motionBlur: false,              // 运动模糊
        name: "浅色 青色 纯色 2",        // 图层命名
        numProperties: 15,
        outPoint: 20,                   // 图层出点
        preserveTransparency: false,    // 保留透明度设置
        quality: 4614,                  // 图层质量与采样
        samplingQuality: 4812,          // 图层采样方法
        shy: false,                     // 图层隐藏
        solo: false,                    // 图层独显
        startTime: 0,                   // 开始时间
        stretch: 100,                   // 图层拉伸
        threeDLayer: false,             // 3D 图层设置
        threeDPerChar: false,           // 逐字 3D 化设置
        time: 0,                        // 时间
        timeRemapEnabled: false,        // 时间重新映射设置
        trackMatteType: 5012,           // 轨迹遮罩设置
        width: 3000,                    // 图层宽度
    }

    return object
}

export default getLayerSettingsObject