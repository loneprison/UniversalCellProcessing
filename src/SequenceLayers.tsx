import * as _ from 'soil-ts';
import * as ul from 'utilsLibrary';


function main() {
    let selectedLayers = _.getSelectedLayers()
    let activeComp = _.getActiveComp()
    if (selectedLayers && activeComp) {
        const frameDuration = 1 / activeComp.frameRate; // 每帧的时间（秒）
        const layerDuration = frameDuration; // 每个图层持续1帧

        // 按照图层 index 从大到小排序
        selectedLayers.sort((a, b) => b.index - a.index);

        // 初始化开始时间
        let currentStartTime = 0;

        // 设置无间隙的序列排序
        _.forEach(selectedLayers, function (layer) {
            layer.inPoint = currentStartTime; // 设置起始时间
            layer.outPoint = currentStartTime + layerDuration; // 设置结束时间
            currentStartTime += layerDuration; // 下一图层的开始时间直接跟随
        });

        // 将合成时长调整为图层的总时长
        activeComp.duration = selectedLayers.length * frameDuration;
    }
}

_.setUndoGroup("SequenceLayers", main);
