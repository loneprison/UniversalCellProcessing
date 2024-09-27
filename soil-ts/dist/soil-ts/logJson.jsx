import { pathDesktop } from "./_internal/_global";
import writeJson from "./writeJson";
import createPath from "./createPath";
function logJson(object) {
    writeJson(createPath(pathDesktop.toString(), "soil_log.json"), object);
}
export default logJson;
