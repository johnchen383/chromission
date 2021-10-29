/**
 * Event Listeners
 */
chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case "open-palette":
      openPalette();
      break;
    default:
      break;
  }
});

/**
 * Callback functions
 */

async function openPalette() {
  console.log("palette should open");
  var tab = await getCurrentTab();
  console.log(tab);

  if (tab === undefined || tab.url.match(/chrome:*/) != null) {
    console.log("Invalid tab. Unable to open palette on this tab");
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: textbox,
  });
}

/**
 * Helper functions
 */
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function textbox() {
  console.log("Palette to be displayed");
  document.body.innerHTML +=
    '<dialog style="border: none; border-radius: 24px; width: 20vw;">\
<h2> Deal with workspace</h2><br>\
<form>\
  <label for="commandName">command: </label><br>\
  <input type="text" id="commandName" name="commandName"><br>\
</form>\
 <img src="https://media1.tenor.com/images/0bf0e81a71059873bf8185b16c2b349c/tenor.gif?itemid=13657700" style="display: block; margin-left: auto; margin-right: auto; width: 50%;" alt="noodle" />\
</dialog>\
<canvas id="confetti-holder" style="position: fixed; top:0; left: 0; z-index: 3000"></canvas>\
';

  var dialog = document.querySelector("dialog");
  dialog.addEventListener("submit", (e) => {
    let toBeInserted = document.getElementById("commandName").value;
    e.preventDefault();
    dialog.innerHTML += `<p> ${toBeInserted} </p>`;
  });
  dialog.showModal();
}
