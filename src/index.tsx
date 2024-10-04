import * as _ from "soil-ts";
import * as ULib from "utilsLibrary";
// utilsLibrary基于Soil二次开发


// let UISource = {
//     button1: ["myButton", [0, 0, 100, 25], "按钮"],
//     button2: ["myButton", [0, 0, 100, 25], "按钮"]
// }


// let elements = _.tree.parse(UISource);




let activeItem = _.getActiveComp();
let fristLayet = _.getFirstSelectedLayer();
_.getFirstSelectedLayer

if (activeItem) {
    if (fristLayet) {
        // const obj_1 = getEffectOfLayer(fristLayet)
        // const obj_2 = getLayerStylesOfLayer(fristLayet)
        const obj_3 = getPropertylesObject(fristLayet, ["ADBE Effect Parade"])
        // const { object: effectObj, log: effectLog } = ULib.removeTargetValues(obj_1)
        // const { object: layerStylesObj, log: layerStylesLog } = ULib.removeTargetValues(obj_2)
        // alert(_.stringify(effectObj))
        // alert(_.stringify(layerStylesObj))
        alert(_.stringify(obj_3))
    }
}

function getPropertylesObject(rootProperty: _PropertyClasses, path?: AdbePath): AnyObject | undefined {
    const propertyGroup = path ? _.getProperty(rootProperty, path) : rootProperty;
    if (!propertyGroup) return undefined;

    const isLayerStyles = path?.length === 1 && path[0] === "ADBE Layer Styles";
    const object: AnyObject = {};  // 初始化返回对象

    if (_.isPropertyGroup(propertyGroup)) {
        for (let i = 1; i <= propertyGroup.numProperties; i++) {
            const property = propertyGroup.property(i);

            // 检查是否需要处理该组
            const keyName = `{${i} | ${property.name} | ${property.matchName}${property.canSetEnabled ? " | " + property.enabled : ""}}`;

            // 图层样式特殊处理或正常 PropertyGroup 处理
            if (!isLayerStyles && _.isPropertyGroup(property) ||        //正常的属性
                isLayerStyles && property.canSetEnabled ||              //图层样式下的子级需要特殊处理
                property.matchName == "ADBE Blend Options Group") {     //图层样式下的混合选项是个特殊情况
                // 初始化 nestedProperty 仅在需要时进行
                const nested = object.nestedProperty ||= {};
                nested[keyName] = getPropertylesObject(property, undefined);
            }
            // Property 的处理
            else if (_.isProperty(property) && property.isModified) {
                // 初始化 values
                object.values ||= {};
                object.values[property.matchName] = _.isNoValueProperty(property)
                    ? "!value 属性在值类型为 NO_VALUE 的 Property 上不可读!"
                    : _.isCustomValueProperty(property)
                        ? "!value 属性在值类型为 CUSTOM_VALUE 的 Property 上不可读!"
                        : property.value;

                // 初始化 expressions
                if (property.expressionEnabled) {
                    object.expressions ||= {};
                    object.expressions[property.matchName] = property.expression;
                }
            }
        }
    }

    return object;
}







// //我觉得获取效果和获取图层样式有不少逻辑可以合并，所以暂且不放入ulib中
// function getLayerStylesOfLayer(layer: Layer): propertyGroupObj {
//     const layerStyles = layer.property("ADBE Layer Styles")
//     const object: propertyGroupObj = {};

//     if (layerStyles.canSetEnabled) {//如果图层样式是canSetEnabled则为激活状态
//         if (_.isPropertyGroup(layerStyles)) {
//             for (let i = 1; i <= layerStyles.numProperties; i++) {
//                 const eachLayerStyles = layerStyles.property(i);
//                 const matchName = eachLayerStyles.matchName;
//                 const name = eachLayerStyles.name;
//                 const keyName = `layerStyles_${i}`;
//                 const isEnabled = eachLayerStyles.enabled;

//                 if (_.isPropertyGroup(eachLayerStyles) &&
//                     (eachLayerStyles.canSetEnabled || matchName == "ADBE Blend Options Group")) {
//                     //因为“混合选项”的canSetEnabled是false所以需要做另外判断
//                     const { values, expressions } = ULib.getPropertiesObject(eachLayerStyles);
//                     object[keyName] = {
//                         matchName,
//                         name,
//                         isEnabled,
//                         values,
//                         expressions
//                     };
//                 }
//             }
//         }
//     }

//     return object
// }

// function getEffectOfLayer(layer: Layer): propertyGroupObj {
//     const effects = layer.property("ADBE Effect Parade")
//     const object: propertyGroupObj = {};

//     if (_.isPropertyGroup(effects)) {
//         for (let i = 1; i <= effects.numProperties; i++) {
//             const effect = effects.property(i);
//             const matchName = effect.matchName;
//             const name = effect.name;
//             const keyName = `effect_${i}`;
//             const isEnabled = effect.enabled;

//             if (_.isPropertyGroup(effect)) {
//                 const { values, expressions } = ULib.getPropertiesObject(effect);
//                 object[keyName] = {
//                     matchName,
//                     name,
//                     isEnabled,
//                     values,
//                     expressions
//                 };
//             }
//         }
//     }

//     return object
// }


//addAdjustmentLayer需要解决图层应该创建在选择图层上方的问题 -另外写代码，代码不应该在函数内部

//思路笔记
//存json        已经写了effect的
//暂不考虑多图层多重预合成情况
//就是简易cell转只存在调整图层/cell层/固态层的情况
//不考虑形状图层作为调整图层以外的情况
//效果读取为json，未来再考虑ffx

//考虑添加以下函数
//复制图层(指定数量) √
//创建固态层(指定数量)
//创建调整图层(指定数量，可选是否用形状图层替代固态层作为调整图层) √
//添加效果，并且如果传入二级参数可以更改效果参数  --参考月离的写了个一键存取 √
//根据上一个函数写一个读取数组批量添加效果
//设置混合模式(半解决)
//设置轨道遮罩(半解决)
//父级和链接？动画流程里cell层得上吗，不过姑且写一份
//变换，实际上只或者说只能记录不透明度，因为其他的是cell处理中禁止动的
//图层样式，可能较难,月离写了抄月离的
//设置图层设置，例如上锁，小眼睛，独显，隐藏三维等乱七八糟的