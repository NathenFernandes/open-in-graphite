// Shared by the content script and the popup.
const OIG_DEFAULTS = {
  enabled: true,
  theme: "graphite", // "graphite" | "cream" | "subtle"
  position: "bottom-right", // "bottom-right" | "bottom-left" | "top-right" | "top-left"
  showLabel: true,
  newTab: true,
};

const OIG_MARK_SVG = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <polygon fill="currentColor" points="21.39,14.00 14.97,21.13 5.58,19.13 2.61,10.00 9.03,2.87 18.42,4.87"/>
    <polygon fill="var(--oig-bg)" points="19.80,12.00 15.90,18.75 8.10,18.75 4.20,12.00 8.10,5.25 15.90,5.25"/>
    <polygon fill="currentColor" points="17.36,13.74 13.17,17.52 7.81,15.77 6.64,10.26 10.83,6.48 16.19,8.23"/>
  </svg>`;

function oigLoadSettings() {
  return chrome.storage.sync.get(OIG_DEFAULTS);
}
