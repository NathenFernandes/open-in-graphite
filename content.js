(() => {
  const BUTTON_ID = "open-in-graphite-btn";
  const PR_PATH = /^\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
  let settings = { ...OIG_DEFAULTS };

  function graphiteUrl() {
    const match = location.pathname.match(PR_PATH);
    if (!match) return null;
    const [, owner, repo, number] = match;
    return `https://graphite.com/${owner}/${repo}/pull/${number}`;
  }

  function createButton() {
    const link = document.createElement("a");
    link.id = BUTTON_ID;
    link.title = "Open this PR in Graphite";
    link.innerHTML = `${OIG_MARK_SVG}<span>Open in Graphite</span>`;
    document.body.appendChild(link);
    return link;
  }

  function update() {
    const url = settings.enabled && graphiteUrl();
    let button = document.getElementById(BUTTON_ID);
    if (!url) {
      button?.remove();
      return;
    }
    button ??= createButton();
    if (button.href !== url) button.href = url;
    button.dataset.theme = settings.theme;
    button.dataset.position = settings.position;
    button.dataset.label = settings.showLabel ? "on" : "off";
    if (settings.newTab) {
      button.target = "_blank";
      button.rel = "noopener noreferrer";
    } else {
      button.removeAttribute("target");
      button.removeAttribute("rel");
    }
  }

  oigLoadSettings().then((stored) => {
    settings = stored;
    update();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    for (const [key, { newValue }] of Object.entries(changes)) settings[key] = newValue;
    update();
  });

  // GitHub navigates without full page loads (and can swap out <body>),
  // so re-check periodically. update() is cheap: a regex and an ID lookup.
  document.addEventListener("turbo:load", update);
  window.addEventListener("popstate", update);
  setInterval(update, 500);
})();
