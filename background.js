console.log("background script running");

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
      case "open-palette":
          openPalette();
          break;
      default:
          break;
  }
});

function openPalette() {
    console.log("palette should open")
}
