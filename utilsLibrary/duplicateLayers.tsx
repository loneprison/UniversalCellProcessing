function duplicateLayers(getLayer: Layer, quantity = 1): Layer[] {
    const layers: Layer[] = []; // 创建一个数组来存储复制的图层
    for (let i = 0; i < quantity; i++) {
        layers.push(getLayer.duplicate()); // 复制图层并将其添加到数组中
    }
    return layers; // 返回所有复制的图层
}

export default duplicateLayers