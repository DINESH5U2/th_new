export const goldColor = "#F2AA4CFF";
export const darkColor = "#101820FF";
export const gruppoFont = ['"Gruppo"', "cursive"].join(",");

const goldButtonBase = {
  fontFamily: gruppoFont,
  backgroundColor: darkColor,
  color: goldColor,
  border: `1px solid ${goldColor}`
};

const goldButtonHover = {
  "&:hover": {
    backgroundColor: goldColor,
    color: "#fff"
  }
};

/**
 * Dark button with a gold outline that inverts on hover. `extra` styles go
 * between the base styles and the hover rule.
 */
export const goldButtonStyle = extra => ({
  ...goldButtonBase,
  ...extra,
  ...goldButtonHover
});
