import * as _ from 'soil-ts';
import * as ul from 'utilsLibrary';

let firstLayer = _.getFirstSelectedLayer();

if (firstLayer) {
    let dateObject:AnyObject = {}
    for (let i = 0; i < firstLayer.numProperties; i++) {
        const property = _.getProperty(firstLayer, [i])
        const matchName = property?.matchName
        if (_.isPropertyGroup(property)) {
            dateObject[`G${_.padStart(i.toString(), 4, "0")} ${matchName}`] = ul.getPropertyListObject(property)
        }else if(_.isProperty(property)&&_.canSetPropertyValue(property)){
            dateObject[`P${_.padStart(i.toString(), 4, "0")} ${matchName}`] = _.getKeyframeValues(property)
        }
    }
    $.writeln(_.stringify(dateObject))
} else {
    $.writeln("请选择图层")
}
