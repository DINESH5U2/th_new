import { createTheme } from "@mui/material/styles";

// Site-wide sans (loaded in main.jsx); system fonts cover the moment before it loads
export const fontFamily =
  '"Instrument Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const theme = createTheme({
  palette: {
    primary: {
      main: "#16654F"
    },
    secondary: {
      main: "#4C4D4F"
    }
  },
  typography: {
    fontFamily,
    h5: {
      fontSize: ["30px", "!important"]
    }
  }
});

export default theme;
