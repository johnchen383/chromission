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
      resolve(tab[0].url);
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

          allwebsites.map((website) => window.open(website));
        });
        break;
      /**
       * Adds all tabs of active window to a particular workspace
       */
      case "addAll": //for now to make them different - could change them later if wanted
        TODO: break;
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
        break;
      /**
       * Close all tabs which match a particular workspace
       */
      case "close":
        break;
      /**
       * Closes all tabs and resets with a new tab
       */
      case "reset":
        break;
      /**
       * Deletes a particular workspace
       */
      case "delete":
        break;

      default:
        "INVALID KEY";
    }
  });
}
