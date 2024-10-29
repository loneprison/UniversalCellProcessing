import * as _ from 'soil-ts';
import * as ULib from 'utilsLibrary';
// utilsLibrary基于Soil二次开发

// let UISource = {
//     button1: ["myButton", [0, 0, 100, 25], "按钮"],
//     button2: ["myButton", [0, 0, 100, 25], "按钮"]
// }

// let elements = _.tree.parse(UISource);

let activeItem = _.getActiveComp();
let firstLayer = _.getFirstSelectedLayer();

if (firstLayer && _.isRasterLayer(firstLayer)) {
    let object:AnyObject = {}
    for (let i = 1; i < firstLayer.numProperties; i++) {
        const property = firstLayer.property(i)
        const name = property.name
        if (property) {
            object[name] = ULib.getPropertyListObject(firstLayer, [name]);
        }
    }
    $.writeln(_.stringify(object))
}

function getLayerStylesObject(rasterLayer: RasterLayer) {
    return ULib.getPropertyListObject(rasterLayer, ['ADBE Layer Styles']);
}

function getEffectGroupObject(rasterLayer: RasterLayer) {
    return ULib.getPropertyListObject(rasterLayer, ['ADBE Effect Parade']);
}

function getVectorsGroupObject(shapeLayer: ShapeLayer) {
    return ULib.getPropertyListObject(shapeLayer, ['ADBE Root Vectors Group']);
}

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
