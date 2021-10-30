var paletteOpen = false;

/**
 * Event Listeners
 */
chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case "toggle-palette":
      togglePalette();
      break;
    default:
      console.log(`Invalid command ${command}`);
      break;
  }
});

/**
 * Callback functions
 */

async function togglePalette() {
  //procure current tab
  var tab = await getCurrentTab();
  console.log("Tab");
  console.log(tab);

  //unable to open palette
  if (typeof tab == "undefined" || tab.url.match(/chrome:*/) != null) {
    console.log("Invalid tab. Unable to open palette on this tab");
    return;
  }

  if (paletteOpen) {
    //if open, close palette
    paletteOpen = false;
    console.log("palette should close");

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: closePalette,
    });

  } else {
    //if closed, open palette
    paletteOpen = true;
    console.log("palette should open");

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showPalette,
    });
  }
}

/**
 * Helper functions
 */

/**
 * Get current tab
 * @returns currentTab
 */
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/**
 * Remove Command Palette
 */
function closePalette(){
  console.log("Palette to be closed");
  var dialog = document.querySelector("dialog");
  dialog.remove();
}

/**
 * Inject Command Palette
 */
function showPalette() {
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
