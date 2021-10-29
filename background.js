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
    function: displayPalette,
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
  console.log("Palette to be displayed");
  document.body.innerHTML +=
    '<dialog style="border: none; border-radius: 24px; width: 20vw;">\
<h2> Do you want to feed your cat?</h2><br>\
 <button style="margin-bottom: 10px; display: block; width: 100%; color: white; background-color: #ec759c; padding: 15px; border: none; outline: none; font-size: 24px; border-radius: 12px; height: 10%; font-family: Arial, Helvetica, sans-serif;" class="b1">Feed Meeee</button>\
 <button style="margin-bottom: 30px; display: block; width: 100%; color: black; background-color: pink; padding: 15px; border: none; outline: none; font-size: 24px; border-radius: 12px; height: 10%; font-family: Arial, Helvetica, sans-serif;" class="b2">Stay Productive :[</button>\
<img src="https://media1.tenor.com/images/0bf0e81a71059873bf8185b16c2b349c/tenor.gif?itemid=13657700" style="display: block; margin-left: auto; margin-right: auto; width: 50%;" alt="noodle" />\
</dialog>\
<canvas id="confetti-holder" style="position: fixed; top:0; left: 0; z-index: 3000"></canvas>\
';

  var dialog = document.querySelector("dialog");
  dialog.showModal();
}
