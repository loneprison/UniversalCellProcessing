function duplicateLayers(getLayer: Layer, quantity:number = 1,includesSelf:boolean = true): Layer[] {
    const layers: Layer[] = includesSelf?[getLayer]:[]; // 创建一个数组来存储复制的图层

    for (let i = 0; i < quantity; i++) {
        layers.push(getLayer = getLayer.duplicate()); // 复制图层并将其添加到数组中
    }
    return layers; // 返回所有复制的图层
}

export default duplicateLayers