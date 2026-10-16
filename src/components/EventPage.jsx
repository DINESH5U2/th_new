import { Container, Typography, Button, Box } from "@mui/material";
import HeroImage from "./HeroImage";
import PostBody from "./PostBody";

const dateOptions = { year: "numeric", month: "long", day: "numeric" };

const isLinkAvailable = link => {
  return link && link !== "NA" && link.trim() !== "";
};

export default function EventPage({ post }) {
  const event_details = post;
  const formattedDate = new Date(event_details.date).toLocaleDateString(
    "en-US",
    dateOptions
  );

  const details = [
    { label: "Date:", value: formattedDate },
    { label: "Time:", value: event_details.time },
    { label: "Type:", value: event_details.type }
  ];

  const links = [
    {
      label: "Registration Form",
      href: event_details.registration,
      color: "info"
    },
    { label: "Contest Link", href: event_details.contestlink, color: "info" },
    { label: "Recording", href: event_details.recording, color: "error" }
  ].filter(link => isLinkAvailable(link.href));

  return (
    <Container sx={{ boxShadow: 2, p: 2 }}>
      {post.heroImage && (
        <HeroImage image={post.heroImage} alt={event_details.title} />
      )}
      <Box sx={{ py: 2 }}>
        <Typography
          variant="h4"
          color="black"
          fontWeight={"bold"}
          marginBottom={"10px"}>
          {event_details.title}
        </Typography>
        {details.map(({ label, value }) => (
          <div style={{ marginBottom: "10px" }} key={label}>
            <Typography
              variant="body1"
              color="black"
              fontWeight={"bold"}
              sx={{ display: "inline" }}>
              {label}&nbsp;
            </Typography>
            <Typography
              variant="body1"
              sx={{
                display: "inline-block",
                verticalAlign: "top",
                whiteSpace: "pre-line"
              }}>
              {value}
            </Typography>
          </div>
        ))}
        <Box sx={{ mt: 3, mb: 2 }}>
          <PostBody body={post.body} images={post.images} />
        </Box>
        {links.length > 0 && (
          <Typography
            variant="body1"
            color="black"
            fontWeight={"bold"}
            marginBottom={"10px"}>
            Important Links
          </Typography>
        )}
        {links.map(({ label, href, color }) => (
          <Button
            key={label}
            variant="contained"
            color={color}
            size="small"
            style={{ textTransform: "none", marginRight: "10px" }}
            href={href}
            target="_blank">
            {label}
          </Button>
        ))}
      </Box>
    </Container>
  );
}
