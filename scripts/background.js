// scripts/background.js

// Listen for when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("ATL/AUS Automated Flight Scout Service Worker Initialized.");
});

// A background listener that can handle complex multi-tab automation in the future
// (For example: swapping origins between ATL and AUS automatically)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "logSearch") {
    console.log(`Automation running on tab ${sender.tab.id} for origin: ${message.origin}`);
  }
});