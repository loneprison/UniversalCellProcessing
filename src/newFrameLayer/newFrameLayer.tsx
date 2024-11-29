import * as _ from 'soil-ts';

function showError(message: string): void {
    alert(message);
}

//function createFrameLayer(nowItem: CompItem): void {
//    // 创建一个新的形状图层
//    const shapeLayer = nowItem.layers.addShape();
//    shapeLayer.name = 'frame';
//
//    const contents = shapeLayer.property('ADBE Root Vectors Group');
//
//    // 添加一个矩形形状组并设置属性
//    const frameGroup = _.addProperty(contents, ['ADBE Vector Group']);
//    frameGroup.name = 'frame';
//    const frameGroupContent = _.getProperty(frameGroup, ['ADBE Vectors Group']);
//
//    // 创建第一个矩形形状，并设置表达式
//    const shapeSizeA = _.addProperty(frameGroupContent, ['ADBE Vector Shape - Rect']);
//    const shapeSizeAProperty = _.getProperty(shapeSizeA, ['ADBE Vector Rect Size']) as Property;
//    shapeSizeAProperty.expression = '[thisComp.width,thisComp.height]';
//
//    // 创建第二个矩形形状，并检查是否为 Property 类型
//    const shapeSizeB = _.addProperty(frameGroupContent, ['ADBE Vector Shape - Rect']);
//    const shapeSizeBProperty = _.getProperty(shapeSizeB, ['ADBE Vector Rect Size']);
//
//    // 检查 shapeSizeBProperty 是否为 Property 类型
//    if (_.isProperty(shapeSizeBProperty)) {
//        _.setPropertyValue(shapeSizeBProperty, ['ADBE Vector Rect Size'], [1920, 1080]);
//    }
//
//    // 合并路径
//    const mergeShape = _.addProperty(frameGroupContent, ['ADBE Vector Filter - Merge']);
//    _.setPropertyValue(mergeShape, ['ADBE Vector Merge Type'], 5);
//
//    // 添加填充颜色
//    const fillShape = _.addProperty(frameGroupContent, ['ADBE Vector Graphic - Fill']);
//    _.setPropertyValue(fillShape, ['ADBE Vector Fill Color'], [35 / 255, 35 / 255, 35 / 255, 1]);
//
//    // 设置图层位置和透明度
//    shapeLayer.position.expression = '[thisComp.width,thisComp.height]/2';
//    shapeLayer.opacity.setValue(80);
//}

function addMultipleProperty(rootProperty: _PropertyClasses, pathArray: AdbePath[]) {
    _.forEach(pathArray, (path) => {
        _.addProperty(rootProperty, path)
    })
}

function createFrameLayer(nowItem: CompItem): void {
    // 创建一个新的形状图层
    const shapeLayer = nowItem.layers.addShape();
    shapeLayer.name = 'frame';
    const contents = shapeLayer.property('ADBE Root Vectors Group');
    const vectorGroup = _.addProperty(contents,
        [
            'ADBE Vector Group'

        ])
    addMultipleProperty(vectorGroup,
        [
            ['ADBE Vector Shape - Rect'],
            ['ADBE Vector Shape - Rect'],
            ['ADBE Vector Filter - Merge'],
            ['ADBE Vector Graphic - Fill']
        ])

}

function main(): void {
    const nowItem = _.getActiveComp();
    if (!nowItem || !_.isCompItem(nowItem)) {
        return showError('请先选择一个图层/合成');
    }

    createFrameLayer(nowItem);
}

// 使用 setUndoGroup 包裹 main 函数以支持撤销
_.setUndoGroup("newFrameLayer", main);
