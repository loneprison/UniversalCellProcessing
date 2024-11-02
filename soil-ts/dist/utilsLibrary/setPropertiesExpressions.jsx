import { forOwn, isProperty } from "soil-ts";
function setPropertiesExpressions(propertyGroup, Expressions) {
    forOwn(Expressions, function (expression, matchName) {
        var property = propertyGroup.property(matchName);
        if (isProperty(property) && property.canSetExpression) {
            property.expression = expression;
        }
    });
}
export default setPropertiesExpressions;
