import {CalculatorConfig} from "./calculator_config.js";
import {Decimal} from "decimal.js";

export class Calculator {
    private readonly calculatorConfig: CalculatorConfig;

    constructor() {
        this.calculatorConfig = CalculatorConfig.loadConfig() ;
        Decimal.set({
            precision: this.calculatorConfig.rateScale,
            rounding: this.calculatorConfig.roundingMode
        });
    }

    public calculate(totalWeight: Readonly<Decimal>): Decimal {
        let rate = this.findRate(totalWeight);
        return rate.mul(totalWeight);
    }

    private findRate(totalWeight: Readonly<Decimal>): Decimal {
        let foundRate = this.calculatorConfig.rateRanges
            .entries()
            .filter(([key, _])=> key <= totalWeight )
            .map(([key, value]) => [(totalWeight.absoluteValue().sub(key) ), value])
            .reduce(([key1, value1],  [key2, value2], _ ) => {
                let diff1 = key1 as Decimal;
                let diff2 = key2 as Decimal;
                let rate1 = value1 as Decimal;
                let rate2 = value2 as Decimal
                if (diff1 < diff2) {
                    return [diff1, rate1];
                } else {
                    return [diff2, rate2];
                }
            })[1];
        if (!foundRate) {
            throw new Error("Could not find rate range for " + totalWeight);
        }
        return foundRate;
    }
}