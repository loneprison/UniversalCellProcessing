// Raymond Yan (raymondclr@foxmail.com / qq: 1107677019) - 2024年9月26日 下午10:02:38
// 哔哩哔哩：https://space.bilibili.com/634669（无名打字猿）
// 爱发电：https://afdian.net/a/raymondclr
// 脚本作者：loneprison
(function() {
    function createIsNativeType(nativeObject) {
        return function(value) {
            return value != null && value instanceof nativeObject;
        };
    }
    var isCompItem = createIsNativeType(CompItem);
    function getActiveItem() {
        return app.project.activeItem;
    }
    function getActiveComp() {
        var item = getActiveItem();
        return isCompItem(item) ? item : undefined;
    }
    function getBlendingModeByName(name) {
        var blendingModes = {
            "正常": BlendingMode.NORMAL,
            "溶解": BlendingMode.DISSOLVE,
            "动态抖动溶解": BlendingMode.DANCING_DISSOLVE,
            "变暗": BlendingMode.DARKEN,
            "相乘": BlendingMode.MULTIPLY,
            "颜色加深": BlendingMode.COLOR_BURN,
            "经典颜色加深": BlendingMode.CLASSIC_COLOR_BURN,
            "线性加深": BlendingMode.LINEAR_BURN,
            "较深的颜色": BlendingMode.DARKER_COLOR,
            "相加": BlendingMode.ADD,
            "变亮": BlendingMode.LIGHTEN,
            "屏幕": BlendingMode.SCREEN,
            "颜色减淡": BlendingMode.COLOR_DODGE,
            "经典颜色减淡": BlendingMode.CLASSIC_COLOR_DODGE,
            "线性减淡": BlendingMode.LINEAR_DODGE,
            "较浅的颜色": BlendingMode.LIGHTER_COLOR,
            "叠加": BlendingMode.OVERLAY,
            "柔光": BlendingMode.SILHOUETTE_LUMA,
            "强光": BlendingMode.HARD_LIGHT,
            "线性光": BlendingMode.LINEAR_LIGHT,
            "亮光": BlendingMode.VIVID_LIGHT,
            "点光": BlendingMode.PIN_LIGHT,
            "纯色混合": BlendingMode.HARD_MIX,
            "差值": BlendingMode.DIFFERENCE,
            "经典差值": BlendingMode.CLASSIC_DIFFERENCE,
            "排除": BlendingMode.EXCLUSION,
            "相减": BlendingMode.STENCIL_LUMA,
            "相除": BlendingMode.DIVIDE,
            "色相": BlendingMode.HUE,
            "饱和度": BlendingMode.SATURATION,
            "颜色": BlendingMode.COLOR,
            "发光度": BlendingMode.LUMINOSITY,
            "模板 Apha": BlendingMode.SOFT_LIGHT,
            "模板亮度": BlendingMode.STENCIL_ALPHA,
            "轮廓 Apha": BlendingMode.SUBTRACT,
            "轮廓亮度": BlendingMode.SILHOUETE_ALPHA,
            "Alpha 添加": BlendingMode.ALPHA_ADD,
            "冷光预乘": BlendingMode.LUMINESCENT_PREMUL
        };
        return blendingModes[name];
    }
    var activeItem = getActiveComp();
    if (activeItem) {
        alert(a);
    }
    function a() {
        return getBlendingModeByName("正常");
    }
}).call(this);
