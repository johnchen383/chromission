/**
 * Get .html elements
 */
const form = document.getElementById("myForm");
const input = document.getElementById("commandName");
const injectable = document.getElementById("injectable");
var command = "";

if (input !== null) {
  input.onkeydown = (e) => {
    addInjectableText("type 'help' for list of commands!");
    if (e.key === " ") {
      switch (command) {
        case "add":
          input.style.color = "LimeGreen";
          break;
        case "open":
          input.style.color = "gold";
          break;
        case "remove":
          input.style.color = "LimeGreen";
          break;
        case "add-all":
          input.style.color = "LimeGreen";
          break;
        case "delete":
          input.style.color = "red";
          break;
        case "list":
          input.style.color = "orange";
          break;
        case "help":
          input.style.color = "turquoise";
          break;
        case "reset":
          input.style.color = "red";
          break;
        case "close":
          input.style.color = "gold";
          break;
      }
    }
    if (e.key === "Backspace") {
      if (input.value.length >= 3) {
        command = command.substring(0, command.length - 1);
      } else {
        input.value = ">  ";
      }
    } else if (e.key === "Enter") {
      command = "";
    } else {
      command += e.key;
    }
  };
}

resetInputField();

if (injectable != null) {
  injectable.style.display = "none";
}

function addInjectableText(text) {
  injectable.innerText = text;
  injectable.style.display = "block";
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
 * Gets tabs of the active window
 * @returns all tabs
 */
async function getWindowTabs() {
  //returns a promise
  let queryOptions = { currentWindow: true };
  return new Promise((resolve, reject) =>
    chrome.tabs.query(queryOptions, (tab) => {
      resolve(tab);
    })
  );
}

/**
 * Reset the input field
 */

function resetInputField() {
  if (input != null) {
    input.focus();
    input.value = "> ";
    input.style.color = "white";
  }
}

/**
 * Add form handler
 */
if (form != null) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const toBeInserted = input.value.split("> ", 2)[1];
    let [command, workspace] = toBeInserted.split(" ");
    injectable.style.display = "none";

    switch (command) {
      /**
       * Open all tabs from a particular workspace
       */
      case "open":
        if (workspace === undefined || workspace === "") {
          addInjectableText("Please enter the name of workspace!");
        } else {
          chrome.storage.sync.get([workspace], function (result) {
            let allwebsites = result[workspace];

            if (allwebsites === undefined) {
              addInjectableText(
                "workspace '" + workspace + "' does not exist."
              );
              return;
            }

            allwebsites.map((website) => window.open(website));
          });
        }
        resetInputField();
        break;
      /**
       * Adds all tabs of active window to a particular workspace
       */
      case "add-all": //for now to make them different - could change them later if wanted
        if (workspace === undefined || workspace === "") {
          addInjectableText("Please enter the name of workspace!");
        } else {
          getWindowTabs().then((tabs) => {
            let arrayOfWebsites = [];

            for (let i = 0; i < tabs.length; i++) {
              arrayOfWebsites[i] = tabs[i];
            }

            chrome.storage.sync.get([workspace], function (result) {
              if (result[workspace] !== undefined) {
                arrayOfWebsites.push(...result[workspace]);
              }

              chrome.storage.sync.set({ [workspace]: arrayOfWebsites });
            });
          });
        }
        resetInputField();
        break;

      /**
       * Adds active tab to a particular workspace
       */
      case "add":
        if (workspace === undefined || workspace === "") {
          addInjectableText("Please enter the name of workspace!");
        } else {
          getCurrentTab().then((tab) => {
            chrome.storage.sync.get([workspace], function (result) {
              let arrayOfWebsites = [tab];
              if (result[workspace] !== undefined) {
                arrayOfWebsites.push(...result[workspace]);
              }

              chrome.storage.sync.set({ [workspace]: arrayOfWebsites });
            });
          });
        }

        resetInputField();
        break;
      /**
       * Removes active tab from a particular workspace
       */
      case "remove":
        if (workspace === undefined || workspace === "") {
          addInjectableText("Please enter the name of workspace!");
        } else {
          getCurrentTab().then((tab) => {
            chrome.storage.sync.get([workspace], function (result) {
              let arrayOfWebsites = [];
              let tabInWorkspace = result[workspace].find(
                (resultTab) => tab === resultTab
              );
              if (
                result[workspace] !== undefined &&
                tabInWorkspace !== undefined
              ) {
                arrayOfWebsites = result[workspace].filter(
                  (resultTabs) => resultTabs !== tabInWorkspace
                );
              }

              chrome.storage.sync.set({ [workspace]: arrayOfWebsites });
            });
          });
        }
        resetInputField();
        break;
      /**
       * Close all tabs which match a particular workspace
       */
      case "close":
        if (workspace === undefined || workspace === "") {
          addInjectableText("Please enter the name of workspace!");
        } else {
          chrome.storage.sync.get([workspace], function (result) {
            let allwebsites = result[workspace];

            if (allwebsites === undefined) {
              addInjectableText(
                "workspace '" + workspace + "' does not exist."
              );
              return;
            } else {
              getWindowTabs().then((tabs) => {
                let tabInfo = {};
                tabs.map((tab) => {
                  tabInfo[tab.url] = tab.id;
                });
                for (const [key, value] of Object.entries(tabInfo)) {
                  allwebsites.map((website) => {
                    if (website === key) {
                      chrome.tabs.remove(value);
                    }
                  });
                }
              });
            }
          });
        }

        resetInputField();
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
        if (workspace === undefined || workspace === "") {
          addInjectableText("Please enter the name of workspace!");
        } else {
          chrome.storage.sync.get([workspace], function (result) {
            let allwebsites = result[workspace];

            if (allwebsites === undefined) {
              addInjectableText(
                "workspace '" + workspace + "' does not exist."
              );
              return;
            }
            chrome.storage.sync.remove([workspace], function (result) {
              console.log("result", result);
            });
          });
        }

        resetInputField();
        break;
      /**
       * Lists all the workspaces that can be used
       */
      case "list":
        if (workspace === undefined || workspace === "") {
          chrome.storage.sync.get(null, function (items) {
            var allKeys = Object.entries(items);
            var str = "Workspaces:\n";
            allKeys.map((key) => {
              var s = "- " + key[0] + "\t (stored: " + key[1].length + ")\n";
              str += s;
            });
            addInjectableText(str);
          });
        } else {
          chrome.storage.sync.get([workspace], function (result) {
            let allwebsites = result[workspace];

            if (allwebsites === undefined) {
              addInjectableText(
                "workspace '" + workspace + "' does not exist."
              );
              return;
            }

            var str = "Sites in workspace: " + workspace + "\n";
            allwebsites.map((site) => {
              var s = "- " + site + "\n";
              str += s;
            });
            addInjectableText(str);
          });
        }

        resetInputField();
        break;
      /**
       * Shows all the commands that can be used
       */
      case "help":
        var str =
          "Commands:\n" +
          "- add <x> .. adds current tab to workspace x \n\n" +
          "- close <x> .. closes the workspace x \n\n" +
          "- open <x> .. opens the workspace x \n\n" +
          "- add-all <x> .. adds all tabs of active window to workspace x \n\n" +
          "- remove <x> .. remove current tab from workspace x \n\n" +
          "- delete <x> .. deletes the workspace x \n\n" +
          "- list .. list of workspaces  \n\n" +
          "- list <x> .. list the contents of a workspace x \n\n" +
          "- reset  .. resets the current window by deleting all tabs and creating a new tab \n";
        addInjectableText(str);
        resetInputField();
        break;

      default:
        addInjectableText(
          "Command '" +
            command +
            "' is not a registered command. \nType 'help' to see what commands are available."
        );
        resetInputField();
    }
  });
}
