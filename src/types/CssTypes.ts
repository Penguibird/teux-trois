type CSSAbsoluteUnit = "cm" | "mm" | "in" | "px" | "pt" | "pc";

type CSSRelativeUnit = "em" | "ex" | "ch" | "rem" | "vw" | "vh" | "vmin" | "vmax" | "%";

type CSSLength = `${number}${CSSAbsoluteUnit | CSSRelativeUnit}`

export type { CSSAbsoluteUnit, CSSRelativeUnit, CSSLength };