/**
 * Get form and tabs element from .html
 */
const form = document.getElementById("myForm");

const input = document.getElementById("commandName");

if (input != null) {
  input.focus();
  input.value = "> ";
}

/**
 * Get the url of the current tab
 * @returns tab url
 */
async function getCurrentTab() {
  //returns a promise
  let queryOptions = { active: true, currentWindow: true };
  return new Promise((resolve, reject) =>
    chrome.tabs.query(queryOptions, (tab) => {
      resolve(tab[0]);
    })
  );
}

/**
 * Gets tabs of the active window
 * @returns all tabs
 */
async function getWindowTabs() {
  //returns a promise
  let queryOptions = { currentWindow: true };
  return new Promise((resolve, reject) =>
    chrome.tabs.query(queryOptions, (tab) => {
      console.log(tab);
      resolve(tab);
    })
  );
}
/**
 * Add form handler
 */
if (form != null) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const toBeInserted = input.value.split("> ", 2)[1];
    let [command, workspace] = toBeInserted.split(" ");

    switch (command) {
      /**
       * Open all tabs from a particular workspace
       */
      case "open":
        chrome.storage.sync.get([workspace], function (result) {
          let allwebsites = result[workspace];

          if (allwebsites === undefined) {
            console.log("unable to open workspace: " + workspace);
            return;
          }

          allwebsites.map((website) => window.open(website.url));
        });
        break;
      /**
       * Adds all tabs of active window to a particular workspace
       */
      case "addAll": //for now to make them different - could change them later if wanted
        getWindowTabs().then((tabs) => {
          let arrayOfWebsites = [];

          for (let i = 0; i < tabs.length; i++) {
            console.log(tabs[i].url);
            arrayOfWebsites[i] = tabs[i];
          }

          chrome.storage.sync.get([workspace], function (result) {
            if (result[workspace] !== undefined) {
              arrayOfWebsites.push(...result[workspace]);
            }

            chrome.storage.sync.set(
              { [workspace]: arrayOfWebsites },
              function () {
                console.log("Value is set to " + arrayOfWebsites);
              }
            );
          });
        });

        input.value = "> ";
        break;

      /**
       * Adds active tab to a particular workspace
       */
      case "add":
        getCurrentTab().then((tab) => {
          chrome.storage.sync.get([workspace], function (result) {
            let arrayOfWebsites = [tab];

            if (result[workspace] !== undefined) {
              arrayOfWebsites.push(...result[workspace]);
            }

            chrome.storage.sync.set(
              { [workspace]: arrayOfWebsites },
              function () {
                console.log(arrayOfWebsites);
                console.log("Value is set to " + arrayOfWebsites);
              }
            );
          });
        });

        input.value = "> ";
        break;
      /**
       * Removes active tab from a particular workspace
       */
      case "remove":
        getCurrentTab().then((tab) => {
          chrome.storage.sync.get([workspace], function (result) {
            let arrayOfWebsites = [];
            let tabInWorkspace = result[workspace].find(
              (resultTab) => tab.url === resultTab.url
            );
            if (
              result[workspace] !== undefined &&
              tabInWorkspace !== undefined
            ) {
              arrayOfWebsites = result[workspace].filter(
                (resultTabs) => resultTabs.url !== tabInWorkspace.url
              );
            }

            chrome.storage.sync.set(
              { [workspace]: arrayOfWebsites },
              function () {
                console.log("Value is set to " + arrayOfWebsites);
              }
            );
          });
        });
        input.value = "> ";
        break;
      /**
       * Close all tabs which match a particular workspace
       */
      case "close":
        chrome.storage.sync.get([workspace], function (result) {
          let allwebsites = result[workspace];

          if (allwebsites === undefined) {
            console.log("unable to open workspace: " + workspace);
            return;
          }

          allwebsites.map((website) => chrome.tabs.remove(website.id));
        });

        break;
      /**
       * Closes all tabs and resets with a new tab
       */
      case "reset":
        getWindowTabs().then((tabs) => {
          let arrayOfTabIDs = [];

          tabs.map((tab) => {
            arrayOfTabIDs.push(tab.id);
          });
          window.open("https://www.google.com/");
          arrayOfTabIDs.map((tabID) => chrome.tabs.remove(tabID));
        });

        break;
      /**
       * Deletes a particular workspace
       */
      case "delete":
        chrome.storage.sync.remove([workspace], function (result) {
          console.log("result", result);
        });
        input.value = "> ";
        break;
      /**
       * Lists all the workspaces that can be used
       */
      case "list":
        chrome.storage.sync.get(null, function (items) {
          var allKeys = Object.entries(items);
          console.log(allKeys);
        });
        input.value = "> ";
        break;
      /**
       * Shows all the commands that can be used
       */
      case "help":
        break;

      default:
        "INVALID KEY";
    }
  });
}
