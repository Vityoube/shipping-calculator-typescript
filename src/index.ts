import {Calculator} from "./calculator.js";
import {Decimal} from "decimal.js";

function main() {
    let calculator = new Calculator();
    console.log(calculator.calculate(Decimal("9.56")));
}

main();