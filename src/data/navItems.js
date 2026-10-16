import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import InfoIcon from "@mui/icons-material/Info";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const navItems = [
  {
    text: "Home",
    Icon: HomeIcon,
    path: "/"
  },
  {
    text: "Events",
    Icon: CalendarMonthIcon,
    path: "/events"
  },
  {
    text: "Team",
    Icon: GroupsIcon,
    path: "/team"
  },
  {
    text: "Turing Cup",
    Icon: EmojiEventsIcon,
    path: "/turingcup"
  },
  {
    text: "ICPC",
    Icon: EmojiEventsIcon,
    path: "/icpc"
  },
  {
    text: "Newsletters",
    Icon: EmailOutlinedIcon,
    path: "/newsletters"
  },
  {
    text: "About",
    Icon: InfoIcon,
    path: "/about"
  }
];

export default navItems;
