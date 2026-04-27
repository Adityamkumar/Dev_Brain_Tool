chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToDevBrain",
    title: "Save to DevBrain",
    contexts: ["selection"],
  });

  console.log("Context menu created ✅");
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "saveToDevBrain") {
    console.log("✅ Correct menu clicked");
    const selectedText = info.selectionText.trim();

    console.log("Selected text:", selectedText);

    try {
      const response = await fetch("http://localhost:8000/api/note/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: selectedText,
          type: "snippet",
          sourceUrl: tab.url,
          tags: ["extension"],
        }),
      });

      const data = await response.json();
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon-48.png",
        title: "DevBrain",
        message: "Saved successfully ✅",
      });
    } catch (error) {
      console.error("Error saving:", error);
    }
  }
});
