import {forOwn,isProperty } from "soil-ts";

function setProertiesExpressions(propertyGroup: PropertyGroup, Expressions: AnyObject): void {
    forOwn(Expressions, function (expression: string, matchName: string) {
        const property = propertyGroup.property(matchName);
        if (isProperty(property)&&property.canSetExpression) {
            property.expression = expression
        }
    });
}

export default setProertiesExpressions;