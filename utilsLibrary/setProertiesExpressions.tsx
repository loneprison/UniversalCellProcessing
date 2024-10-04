import {forOwn,isProperty } from "soil-ts";

function setProertiesExpressions(propertyGroup: PropertyGroup, Expressions: propertyExpression): void {
    forOwn(Expressions, function (Expression: string, matchName: string) {
        const property = propertyGroup.property(matchName);
        if (isProperty(property)&&property.canSetExpression) {
            property.expression = Expression
        }
    });
}

export default setProertiesExpressions;