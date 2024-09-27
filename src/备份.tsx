import * as _ from "soil-ts";
import * as ULib from "utilsLibrary";
// utilsLibrary基于Soil二次开发

let activeItem = _.getActiveComp();

//if (activeItem) {
//    alert(a);
//}
//function a(){
//return ULib.getBlendingModeByName("正常")
//}

activeItem && ULib.addAdjustmentLayer(activeItem, true);


//思路笔记
//存json
//暂不考虑多图层多重预合成情况
//就是简易cell转只存在调整图层/cell层/固态层的情况
//不考虑形状图层作为调整图层以外的情况
//效果读取为json，未来再考虑ffx

//考虑添加以下函数
//复制图层(指定数量)
//创建固态层(指定数量)
//创建调整图层(指定数量，可选是否用形状图层替代固态层作为调整图层)
//添加效果，并且如果传入二级参数可以更改效果参数
//根据上一个函数写一个读取数组批量添加效果
//设置混合模式(半解决)
//设置轨道遮罩(半解决)
//父级和链接？动画流程里cell层得上吗，不过姑且写一份
//变换，实际上只或者说只能记录不透明度，因为其他的是cell处理中禁止动的
//图层样式，可能较难
//设置图层设置，例如上锁，小眼睛，独显，隐藏三维等乱七八糟的