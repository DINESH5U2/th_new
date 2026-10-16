import { Typography } from "@mui/material";

/** Section heading used across the Turing Cup page. Accepts Typography props. */
export default function TuringCupHeading({ children, sx, ...props }) {
  return (
    <Typography
      variant="h3"
      {...props}
      sx={{
        textAlign: "center",
        fontFamily: "'Gruppo', cursive",
        fontWeight: "bold",
        letterSpacing: "1px",
        textShadow: "0 0 15px rgba(242, 170, 76, 0.8)",
        ...sx
      }}>
      {children}
    </Typography>
  );
}
