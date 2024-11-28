import * as _ from 'soil-ts';
import * as ul from 'utilsLibrary';


function main() {
    let selectedLayers = _.getSelectedLayers(); // 获取选中的所有图层

    if (selectedLayers && selectedLayers.length > 0) {
        _.forEach(selectedLayers, function (layer) {
            // 判断该图层是否为合成项
            if (_.isCompItem(layer)) {
                let compItem = layer; // 如果是合成项，则当前图层即为合成项

                const frameDuration = 1 / compItem.frameRate; // 每帧的时间（秒）
                const layerDuration = frameDuration; // 每个图层持续 1 帧

                let selectedLayersInComp = compItem.selectedLayers; // 获取当前合成中的选中图层
                if (selectedLayersInComp) {
                    // 按照图层 index 从大到小排序
                    selectedLayersInComp.sort((a, b) => b.index - a.index);

                    // 初始化开始时间
                    let currentStartTime = 0;

                    // 设置无间隙的序列排序
                    _.forEach(selectedLayersInComp, function (layer) {
                        layer.inPoint = currentStartTime; // 设置起始时间
                        layer.outPoint = currentStartTime + layerDuration; // 设置结束时间
                        currentStartTime += layerDuration; // 下一图层的开始时间直接跟随
                    });

                    // 将合成时长调整为图层的总时长
                    compItem.duration = selectedLayersInComp.length * frameDuration;
                }
            }
        });
    }

}

_.setUndoGroup("SequenceLayers", main);
