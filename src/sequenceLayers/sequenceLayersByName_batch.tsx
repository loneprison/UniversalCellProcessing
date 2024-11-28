import * as _ from 'soil-ts';
import * as ul from 'utilsLibrary';


const isAllCompLayer = (layerArray: Layer[]): layerArray is AVLayer[] => !_.some(layerArray, layer => !_.isCompLayer(layer));

function main() {
    let selectedLayers = _.getSelectedLayers()

    if (isAllCompLayer(selectedLayers)) {
        _.forEach(selectedLayers, (layer) => {
            const comp = layer.source

            if (_.isCompItem(comp)) {
                let layerArray = ul.sortLayersByName(_.collectionToArray(comp.layers), "desc")
                if (layerArray.length == 0) return
                let currentStartTime = 0;

                const frameDuration = 1 / comp.frameRate; // 每帧的时间（秒）
                const layerDuration = frameDuration; // 每个图层持续1帧

                _.forEach(layerArray, (layer_) => {
                    // 设置图层的结束时间和开始时间
                    layer_.outPoint = layerDuration;
                    layer_.startTime = frameDuration * currentStartTime++;

                    // 将图层移到合成的顶部，确保排序后图层位置正确
                    layer.moveToBeginning();
                })

                // 更新合成的持续时间
                comp.duration = frameDuration * currentStartTime
            }

        })
    } else {
        alert("不能选择非comp图层");
    }
}

_.setUndoGroup("SequenceLayers", main);
