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

  if (tab == 'undefined' || tab.url.match(/chrome:*/) != null) {
      console.log("Invalid tab. Unable to open palette on this tab");
      return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: displayPalette
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

function displayPalette() {
  console.log("Palette to be displayed")
}
