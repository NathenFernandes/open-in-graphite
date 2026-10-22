const controls = document.getElementById("controls");
const stage = document.getElementById("preview-stage");
const preview = document.getElementById("open-in-graphite-btn");
preview.innerHTML = `${OIG_MARK_SVG}<span>Open in Graphite</span>`;

let settings = { ...OIG_DEFAULTS };

function render() {
  document.getElementById("enabled").checked = settings.enabled;
  document.getElementById("showLabel").checked = settings.showLabel;
  document.getElementById("newTab").checked = settings.newTab;
  controls.classList.toggle("disabled", !settings.enabled);

  for (const group of ["theme", "position"]) {
    for (const button of document.querySelectorAll(`#${group} button`)) {
      button.classList.toggle("active", button.dataset.value === settings[group]);
    }
  }

  preview.dataset.theme = settings.theme;
  preview.dataset.label = settings.showLabel ? "on" : "off";
  stage.dataset.position = settings.position;
}

function save(patch) {
  Object.assign(settings, patch);
  chrome.storage.sync.set(patch);
  render();
}

for (const key of ["enabled", "showLabel", "newTab"]) {
  document.getElementById(key).addEventListener("change", (e) => save({ [key]: e.target.checked }));
}

for (const group of ["theme", "position"]) {
  document.getElementById(group).addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (button) save({ [group]: button.dataset.value });
  });
}

oigLoadSettings().then((stored) => {
  settings = stored;
  render();
});
