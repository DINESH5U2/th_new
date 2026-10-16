import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { keyframes } from "@emotion/react";
import { darkColor, goldButtonStyle, goldColor, gruppoFont } from "./styles";

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(242, 170, 76, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(242, 170, 76, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(242, 170, 76, 0);
  }
`;

const noticePoints = [
  "Verify your team leader's email  and proceed to the payment",
  "Don't fill the form multiple times",
  "Please provide the details of the Team Leader that match the information provided in Round-1 Registration",
  "The registration fee for each team is Rs 300 , Make sure to pay within a single transaction.",
  "We will not issue any kind of refund.",
  "You can pay using PhonePay, Google Pay, PayTM (Net Banking is not available)",
  "If you have any queries, reach out to Koushik : 7396910 024 , DivyaSri : 9704606266",
  "Make sure the transaction ID you give is valid."
];

const RegisterForm = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: darkColor,
        borderRadius: "5px",
        margin: "auto",
        width: "100%",
        paddingBottom: "100px"
      }}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%"
        }}>
        <div style={{ marginBottom: "20px", marginTop: "15px" }}>
          {noticePoints.map((point, index) => (
            <Typography
              key={index}
              variant="h4"
              sx={{
                fontFamily: gruppoFont,
                color: goldColor,
                fontSize: "1.5rem"
              }}>
              <li style={{ textAlign: "justify", marginTop: "5px" }}>
                {point}
              </li>
            </Typography>
          ))}
        </div>

        <Button
          sx={{
            ...goldButtonStyle({
              fontSize: "2rem",
              fontWeight: "bold",
              width: "300px",
              height: "50px",
              animation: `${pulse} 2s infinite`
            }),
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          variant="contained"
          href="https://forms.gle/Fijco5SKDjgC7TE6A"
          target="_blank"
          startIcon={<OpenInNewIcon sx={{ fontSize: "2.5rem" }} />}>
          &nbsp;Redirect
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
