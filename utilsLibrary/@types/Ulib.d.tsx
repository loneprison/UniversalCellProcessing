type BlendingModeString =
    | "正常"
    | "溶解"
    | "动态抖动溶解"
    | "变暗"
    | "相乘"
    | "颜色加深"
    | "经典颜色加深"
    | "线性加深"
    | "较深的颜色"
    | "相加"
    | "变亮"
    | "屏幕"
    | "颜色减淡"
    | "经典颜色减淡"
    | "线性减淡"
    | "较浅的颜色"
    | "叠加"
    | "柔光"
    | "强光"
    | "线性光"
    | "亮光"
    | "点光"
    | "纯色混合"
    | "差值"
    | "经典差值"
    | "排除"
    | "相减"
    | "相除"
    | "色相"
    | "饱和度"
    | "颜色"
    | "发光度"
    | "模板 Apha"
    | "模板亮度"
    | "轮廓 Apha"
    | "轮廓亮度"
    | "Alpha 添加"
    | "冷光预乘";

type TrackMatteTypeString =
    | "Alpha 遮罩"
    | "Alpha 反转遮罩"
    | "亮度遮罩"
    | "亮度反转遮罩"
    | "无"


//专门为了addEffects效果而建立的类型,AdbePath是效果的匹配名，string是属性的匹配名，第一个数值用来存value，第二个数值用来存表达式
interface propertyExpression {
    [key: string]: string
};

interface propertyValues{
    [key: string]: any
}; 

interface propertyGroupObj {
    [key: string]: {
        matchName: string;
        name:string;
        isEnabled:Boolean;
        values: {
            [key: string]: any
        }; 
        expressions: propertyExpression
    };
}

//  effectObj case
// {
//     effect1: {
//         effectName: "F's SelectColor",
//         propertyValue: {
//             "F's SelectColor-0001": true,
//         },
//         propertyExpression: {
//             "F's SelectColor-0003": `true`,
//         }
//     }
// };
