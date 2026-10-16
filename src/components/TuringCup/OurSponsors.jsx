import TouchAppTwoToneIcon from "@mui/icons-material/TouchAppTwoTone";
import Image from "../Image";

/** Sponsor card that flips on hover to show the description (see SponsorsCard.css). */
function OurSponsors({ name, img, desc, link }) {
  return (
    <div>
      <div className="SponsorBox">
        <div className="SponsorFlipBox">
          <div className="SponsorFront">
            <div className="SponsorDiv">
              <p>
                <TouchAppTwoToneIcon />
              </p>
            </div>
            {img && (
              <Image
                className="Sponsorimg"
                alt={name}
                image={img}
                imgStyle={{
                  objectFit: "contain",
                  objectPosition: "center"
                }}
                style={{
                  padding: "0px",
                  maxWidth: "100%",
                  height: "100%",
                  borderRadius: "30px",
                  border: "2px solid #F2AA4CFF"
                }}
              />
            )}
          </div>
          <div className="SponsorBack">
            <div>
              <h3>{name}</h3>
              <p>{desc}</p>
              <a href={link} target="_blank" rel="noopener noreferrer">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurSponsors;
