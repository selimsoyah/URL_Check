import { checkUrlExists } from "./mockServer";
import { throttle } from "./throttle";
import { isValidUrl } from "./urlValidator";

const input = document.getElementById("url-input") as HTMLInputElement;
const formatStatus = document.getElementById("format-status")!;
const existenceStatus = document.getElementById("existence-status")!;

const throttledExistenceCheck = throttle((url: string) => {
  existenceStatus.textContent = "Checking if URL exists...";
  existenceStatus.className = "status checking";

  checkUrlExists(url)
    .then((result) => {
      // Bug fix: compare against the live input value when the response arrives.
      // A requestId counter was not enough — changing one valid URL to another did
      // not invalidate the previous request, so an old result could flash briefly.
      if (input.value.trim() !== url) return;

      if (result.exists) {
        existenceStatus.textContent = `URL exists (${result.type})`;
        existenceStatus.className = "status valid";
      } else {
        existenceStatus.textContent = "URL does not exist";
        existenceStatus.className = "status invalid";
      }
    })
    .catch(() => {
      if (input.value.trim() !== url) return;
      existenceStatus.textContent = "Could not check URL";
      existenceStatus.className = "status invalid";
    });
}, 500);

function onInput() {
  const value = input.value;

  if (!value.trim()) {
    formatStatus.textContent = "";
    existenceStatus.textContent = "";
    return;
  }

  if (isValidUrl(value)) {
    formatStatus.textContent = "Valid URL format";
    formatStatus.className = "status valid";
    // Bug fix: clear any result from a previous URL as soon as the input changes,
    // so we never show an existence message that belongs to an older value.
    existenceStatus.textContent = "";
    existenceStatus.className = "status";
    throttledExistenceCheck(value.trim());
  } else {
    formatStatus.textContent = "Invalid URL format";
    formatStatus.className = "status invalid";
    existenceStatus.textContent = "";
  }
}

input.addEventListener("input", onInput);
