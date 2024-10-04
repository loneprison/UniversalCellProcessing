import { forOwn, isProperty } from "soil-ts";
function setProertiesExpressions(propertyGroup, Expressions) {
    forOwn(Expressions, function (Expression, matchName) {
        var property = propertyGroup.property(matchName);
        if (isProperty(property) && property.canSetExpression) {
            property.expression = Expression;
        }
    });
}
export default setProertiesExpressions;
