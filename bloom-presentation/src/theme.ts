import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/DMSans";

const serif = loadSerif("italic", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const serifNormal = loadSerif("normal", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
const sans = loadSans("normal", {
  weights: ["300", "400", "500"],
  subsets: ["latin"],
});

export const fonts = {
  serif: serif.fontFamily,
  serifNormal: serifNormal.fontFamily,
  sans: sans.fontFamily,
};

export const colors = {
  bg: "#0D1824",
  gold: "#E8B86D",
  goldDim: "rgba(232, 184, 109, 0.14)",
  goldBorder: "rgba(232, 184, 109, 0.28)",
  teal: "#7CB9A8",
  tealDim: "rgba(124, 185, 168, 0.18)",
  coral: "#E07A5F",
  coralDim: "rgba(224, 122, 95, 0.14)",
  coralBorder: "rgba(224, 122, 95, 0.30)",
  lavender: "#9B89C4",
  lavenderDim: "rgba(155, 137, 196, 0.18)",
  cream: "#F5EFE4",
  cream60: "rgba(245, 239, 228, 0.60)",
  cream40: "rgba(245, 239, 228, 0.40)",
  cream10: "rgba(245, 239, 228, 0.07)",
  border: "rgba(245, 239, 228, 0.10)",
};
