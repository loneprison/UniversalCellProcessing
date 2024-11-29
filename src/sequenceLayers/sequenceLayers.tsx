import * as _ from 'soil-ts';
import * as ul from 'utilsLibrary';

const getSortMode = (modeStr: "index" | "name") => { return modeStr }
const getSelectMode = (modeStr: "current" | "internal") => { return modeStr }
const isAllCompLayer = (layerArray: Layer[]): layerArray is AVLayer[] => !_.some(layerArray, layer => !_.isCompLayer(layer));

function main() {
    const sortMode = getSortMode("index")
    const selectMode = getSelectMode("current")
    if (selectMode == "current") {
        let selectedLayers = _.getSelectedLayers()
        let activeComp = _.getActiveComp()
        if (selectedLayers && activeComp) {
            const frameDuration = 1 / activeComp.frameRate; // 每帧的时间（秒）
            const layerDuration = frameDuration; // 每个图层持续1帧

            if (sortMode == 'index') {
                // 按照图层 index 从大到小排序
                selectedLayers = ul.sortLayersByIndex(selectedLayers, "desc")
            } else {
                // 按照图层 index 从大到小排序
                selectedLayers = ul.sortLayersByName(selectedLayers, "desc")
            }
            // 初始化开始时间
            let currentStartTime = 0;

            // 设置无间隙的序列排序
            _.forEach(selectedLayers, function (layer) {
                layer.outPoint = layerDuration; // 设置结束时间
                layer.startTime = frameDuration * currentStartTime++; // 下一图层的开始时间直接跟随

                // 将图层移到合成的顶部，确保排序后图层位置正确
                layer.moveToBeginning();
            });

            // 将合成时长调整为图层的总时长
            activeComp.duration = selectedLayers.length * frameDuration;
        }
    } else {
        let selectedLayers = _.getSelectedLayers()

        if (isAllCompLayer(selectedLayers)) {
            _.forEach(selectedLayers, (layer) => {
                const comp = layer.source

                if (_.isCompItem(comp)) {
                    let layerArray: Layer[]
                    if (sortMode == 'index') {
                        // 按照图层 index 从大到小排序
                        layerArray = ul.sortLayersByIndex(selectedLayers, "desc")
                    } else {
                        // 按照图层 index 从大到小排序
                        layerArray = ul.sortLayersByName(selectedLayers, "desc")
                    }
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
}

_.setUndoGroup("SequenceLayers", main);
