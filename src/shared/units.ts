import { Unit, UnitMap } from "uom";
import { Units, unitLookup } from "uom-units";

const mcg = Unit.divideNumber('MicroGram', 1000, Units.MilliGram)

const unitMap: UnitMap.UnitMap = {
    g: Units.Gram,
    mg: Units.MilliGram,
    µg: mcg,
    mcg
}

export const deserializeUnit: UnitMap.UnitLookup = (serializedUnit: string | undefined): Unit.Unit<unknown> => {
    if (!serializedUnit) {
        return undefined;
    }

    serializedUnit = serializedUnit.toLowerCase();
    return unitLookup(serializedUnit) || unitMap[serializedUnit];
}