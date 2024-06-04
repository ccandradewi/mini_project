import {
  FaRunning,
  FaGlobe,
  FaMicrophone,
  FaTheaterMasks,
} from "react-icons/fa";
import { CiMusicNote1, CiFootball, CiMicrophoneOn } from "react-icons/ci";
import { SlGlobeAlt } from "react-icons/sl";
import { PiMaskHappyLight } from "react-icons/pi";

export const categories = [
  { name: "MUSIC", displayName: "Music", icon: CiMusicNote1 },
  { name: "SPORTS", displayName: "Sports", icon: CiFootball },
  { name: "EXHIBITION", displayName: "Exhibition", icon: SlGlobeAlt },
  { name: "CONFERENCE", displayName: "Conference", icon: CiMicrophoneOn },
  { name: "THEATRE", displayName: "Theatre", icon: PiMaskHappyLight },
];
