function duplicateLayers(getLayer, quantity, includesSelf) {
    if (quantity === void 0) { quantity = 1; }
    if (includesSelf === void 0) { includesSelf = true; }
    var layers = includesSelf ? [getLayer] : [];
    for (var i = 0; i < quantity; i++) {
        layers.push(getLayer.duplicate());
    }
    return layers;
}
export default duplicateLayers;
