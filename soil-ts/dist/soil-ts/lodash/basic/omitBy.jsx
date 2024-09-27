import has from "../#has";
function omitBy(object, predicate) {
    var result = {};
    for (var key in object) {
        if (has(object, key) && !predicate(object[key])) {
            result[key] = object[key];
        }
    }
    return result;
}
export default omitBy;
