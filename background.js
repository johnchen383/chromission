// var paletteOpen = false;
// var currentTabId = getCurrentTab().id;
// var currentTabURL = getCurrentTab().url;
// console.log(currentTabId);

// chrome.storage.sync.set({ test1: "tabs" }, function () {
//   console.log("Value is set to " + "tabs");
// });

async function getCurrentTab() {
  //returns a promise
  let queryOptions = { active: true, currentWindow: true };
  return new Promise((resolve, reject) =>
    chrome.tabs.query(queryOptions, (tab) => {
      resolve(tab[0].url);
    })
  );
}

const form = document.getElementById("myForm");
const openTabs = document.getElementById("openTabs");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const toBeInserted = document.getElementById("commandName").value;
  let [command, workspace] = toBeInserted.split(" ");
  switch (command) {
    case "open":
      chrome.storage.sync.get([workspace], function (result) {
        let allwebsites = result[workspace];
        allwebsites.map((website) => window.open(website));

        //window.open(result[workspace]);
      });
      break;
    case "addAll": //for now to make them different - could change them later if wanted

    case "add":
      getCurrentTab().then((tab) => {
        chrome.storage.sync.get([workspace], function (result) {
          let arrayOfWebsites = [tab];
          arrayOfWebsites.push(...result[workspace]);
          chrome.storage.sync.set(
            { [workspace]: arrayOfWebsites },
            function () {
              console.log("Value is set to " + arrayOfWebsites);
            }
          );
        });
      });

    case "remove":

    case "close":

    case "reset":

    case "delete":

    default:
      "INVALID KEY";
  }
});
/**
 * Event Listeners
 */
// chrome.commands.onCommand.addListener((command) => {
//   switch (command) {
//     case "toggle-palette":
//       togglePalette();
//       break;
//     default:
//       console.log(`Invalid command ${command}`);
//       break;
//   }
// });
// chrome.commands.onCommand.addListener((command) => {
//   console.log(command);
// });

/**
 * Tab listener
 */
// chrome.tabs.onActivated.addListener(function (tab) {
//   if (currentTabId != tab.tabId) {
//     //switched tabs
//     if (paletteOpen) {
//       //if palette was open, close it before switching
//       chrome.scripting.executeScript({
//         target: { tabId: currentTabId },
//         function: closePalette,
//       });
//       paletteOpen = false;
//     }
//   }
//   currentTabId = tab.tabId;
//   console.log("Selected Tab: " + tab.tabId);
// });

// /**
//  * Callback functions
//  */

// async function togglePalette() {
//   //unable to open palette
//   if (typeof currentTabId == "undefined") {
//     console.log("Invalid tab. Unable to open palette on this tab");
//     return;
//   }

//   if (paletteOpen) {
//     //if open, close palette
//     paletteOpen = false;
//     console.log("palette should close");

//     chrome.scripting.executeScript({
//       target: { tabId: currentTabId },
//       function: closePalette,
//     });
//   } else {
//     //if closed, open palette
//     paletteOpen = true;
//     console.log("palette should open");

//     chrome.scripting.executeScript({
//       target: { tabId: currentTabId },
//       function: showPalette,
//     });
//   }
// }

// /**
//  * Helper functions
//  */
// //
// //
// //Need to do:  add to storage
// //             finish the 'add ___'
// //
// //
// /**
//  * Get current tab
//  * @returns currentTab
//  */
// async function getCurrentTab() {
//   let queryOptions = { active: true, currentWindow: true };
//   let [tab] = await chrome.tabs.query(queryOptions);
//   return tab;
// }
// function closePalette() {
//   console.log("Palette to be closed");
//   var dialog = document.querySelector("dialog");
//   dialog.remove();
// }
// function showPalette() {
//   var arrayOfWebsites = []; // this will be done through chrome.storage later on
//   console.log("Palette to be displayed");
//   function addHTML() {
//     document.body.innerHTML +=
//       '<dialog style="border: none; border-radius: 24px; width: 20vw;">\
//   <h2> Deal with workspace</h2><br>\
//   <form id="myForm">\
//   <label for="commandName">command: </label><br>\
//   <input type="text" id="commandName" name="commandName"><br>\
//   </form>\
//   <img src="https://media1.tenor.com/images/0bf0e81a71059873bf8185b16c2b349c/tenor.gif?itemid=13657700" style="display: block; margin-left: auto; margin-right: auto; width: 50%;" alt="noodle" />\
//   <button id="openTabs">Open Workspace!</button>\
//   <ul id="demo"> </ul>\
//   </dialog>\
//   <canvas id="confetti-holder" style="position: fixed; top:0; left: 0; z-index: 3000"></canvas>\
//   ';
//   }

//   // workspace

//   /**
//    * Remove Command Palette
//    */

//   /**
//    * Inject Command Palette
//    */

//   addHTML();
//   const form = document.getElementById("myForm");
//   const dialog = document.querySelector("dialog");
//   const openTabs = document.getElementById("openTabs");
//   form.addEventListener("submit", async (e) => {
//     //console.log(e.type);
//     e.preventDefault();
//     let toBeInserted = document.getElementById("commandName").value;
//     let [command, workspace] = toBeInserted.split(" ");
//     switch (command) {
//       case "open":
//         chrome.storage.sync.get([workspace], function (result) {
//           console.log("result", result);
//         });
//       case "addAll": //for now to make them different - could change them later if wanted

//       case "add":
//         // async function getCurrentTab() {
//         //   let queryOptions = { active: true, currentWindow: true };
//         //   let [tab] = await chrome.tabs.query(queryOptions);
//         //   return tab;
//         // }

//         chrome.storage.sync.set({ [workspace]: ["tabs"] }, function () {
//           console.log("Value is set to " + "tabs");
//         });

//       case "remove":

//       case "close":

//       case "reset":

//       case "delete":

//       default:
//         "INVALID KEY";
//     }
//   });
//   openTabs.addEventListener("click", () => {
//     console.log("array", arrayOfWebsites);
//     //window.open(currentTabURL);
//     arrayOfWebsites.map((websiteURL) => window.open(websiteURL));
//   });
//   dialog.showModal();
// }
