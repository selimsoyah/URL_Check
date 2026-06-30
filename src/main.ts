import { checkUrlExists } from "./mockServer";
import { throttle } from "./throttle";
import { isValidUrl } from "./urlValidator";

const input = document.getElementById("url-input") as HTMLInputElement;
const formatStatus = document.getElementById("format-status")!;
const existenceStatus = document.getElementById("existence-status")!;

let requestId = 0;

const throttledExistenceCheck = throttle((url: string) => {
  const currentRequest = ++requestId;
  existenceStatus.textContent = "Checking if URL exists...";
  existenceStatus.className = "status checking";

  checkUrlExists(url)
    .then((result) => {
      if (currentRequest !== requestId) return;

      if (result.exists) {
        existenceStatus.textContent = `URL exists (${result.type})`;
        existenceStatus.className = "status valid";
      } else {
        existenceStatus.textContent = "URL does not exist";
        existenceStatus.className = "status invalid";
      }
    })
    .catch(() => {
      if (currentRequest !== requestId) return;
      existenceStatus.textContent = "Could not check URL";
      existenceStatus.className = "status invalid";
    });
}, 500);

function onInput() {
  const value = input.value;

  if (!value.trim()) {
    formatStatus.textContent = "";
    existenceStatus.textContent = "";
    requestId++;
    return;
  }

  if (isValidUrl(value)) {
    formatStatus.textContent = "Valid URL format";
    formatStatus.className = "status valid";
    throttledExistenceCheck(value.trim());
  } else {
    formatStatus.textContent = "Invalid URL format";
    formatStatus.className = "status invalid";
    existenceStatus.textContent = "";
    requestId++;
  }
}

input.addEventListener("input", onInput);
