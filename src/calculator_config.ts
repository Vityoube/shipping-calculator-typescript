import {Decimal} from "decimal.js";
import 'dotenv/config';
import process from "node:process";

export class CalculatorConfig {
    private _rateRanges = new Map<Decimal, Decimal>();
    private _rateScale: number = 0;
    private _roundingMode: Decimal.Rounding = Decimal.ROUND_CEIL;

    private static readonly PRECISION_PROPERTY = "precision";
    private static readonly ROUNDING_MODE_PROPERTY = "roundingMode";
    private static readonly RANGE_PREFIX = "range.";


    constructor(rateRanges: Map<Decimal, Decimal>, rateScale: number, roundingMode: Decimal.Rounding) {
        this._rateRanges = rateRanges;
        this._rateScale = rateScale;
        this._roundingMode = roundingMode;
    }

    private static throwError(message: string): never {
        throw new Error(message);
    }

    static loadConfig(): CalculatorConfig {
        const rateScaleRaw = process.env[CalculatorConfig.PRECISION_PROPERTY] as string;
        if (!rateScaleRaw) {
            throw new Error("precision is not provided");
        }
        const rateScale = parseInt(rateScaleRaw);
        const roundingModeRaw = process.env[CalculatorConfig.ROUNDING_MODE_PROPERTY] as string;
        if (!roundingModeRaw) {
            throw new Error("roundingMode is not provided");
        }
        const roundingMode = CalculatorConfig.parseRoundingMode(roundingModeRaw);
        const rateRanges = new Map<Decimal, Decimal>(Object.entries(process.env)
            .filter(([key]) => key.startsWith(CalculatorConfig.RANGE_PREFIX))
            .map(([key, value]) => [Decimal(key.replace(CalculatorConfig.RANGE_PREFIX, "")), Decimal(value as string)]))
        if (!rateRanges) {
            throw new Error("rateRanges is not provided");
        }
        return new CalculatorConfig(rateRanges, rateScale, roundingMode);
    }

    private static parseRoundingMode(roundingModeRaw: string) : Decimal.Rounding {
        switch (roundingModeRaw.toUpperCase()) {
            case "ROUND_UP":
                return Decimal.ROUND_UP;
            case "ROUND_DOWN":
                return Decimal.ROUND_DOWN;
            case "ROUND_CEIL":
                return Decimal.ROUND_CEIL;
            case "ROUND_FLOOR":
                return Decimal.ROUND_FLOOR;
            case "ROUND_HALF_UP":
                return Decimal.ROUND_HALF_UP;
            case "ROUND_HALF_DOWN":
                return Decimal.ROUND_HALF_DOWN;
            case "ROUND_HALF_EVEN":
                return Decimal.ROUND_HALF_EVEN;
            case "ROUND_HALF_CEIL":
                return Decimal.ROUND_HALF_CEIL;
            case "ROUND_HALF_FLOOR":
                return Decimal.ROUND_HALF_FLOOR;
            default:
                    throw new Error(`Unknown rounding mode: ${roundingModeRaw}`);
        }
    }


}