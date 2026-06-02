const startBtn = document.getElementById("js-start-button");
const previewVideo = document.getElementById("js-preview");
const videoContainer = document.getElementById("js-video-container");
const countdownEl = document.getElementById("js-countdown");
const countdownNumberEl = document.getElementById("js-countdown-number");
const imageContainer = document.getElementById("js-image-container");
const snapshotImg = document.getElementById("js-snapshot");
const errorsContainer = document.getElementById("js-errors");

startBtn.addEventListener("click", async () => {
  errorsContainer.textContent = "";
  errorsContainer.setAttribute("hidden", "");
  imageContainer.setAttribute("hidden", "");

  if (!window.isSecureContext) {
    showError("Secure context required (HTTPS or localhost).");
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showError("Media devices API is not supported in this browser.");
    return;
  }

  startBtn.disabled = true;

  try {
    stopCameraStream(previewVideo);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoContainer.removeAttribute("hidden");
    previewVideo.srcObject = stream;
    await previewVideo.play();

    startCountdown(5, countdownEl, countdownNumberEl, () => {
      try {
        const dataUrl = getSnapshotDataUrl(previewVideo);
        snapshotImg.src = dataUrl;
        imageContainer.removeAttribute("hidden");
      } catch (err) {
        showError(`Snapshot failed: ${err.message || "Unknown canvas error"}`);
      } finally {
        videoContainer.setAttribute("hidden", "");
        stopCameraStream(previewVideo);
        startBtn.disabled = false;
      }
    });
  } catch (error) {
    stopCameraStream(previewVideo);
    startBtn.disabled = false;
    videoContainer.setAttribute("hidden", "");
    imageContainer.setAttribute("hidden", "");

    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      showError(
        "Camera access denied. Please update your browser permissions.",
      );
    } else {
      showError(
        `Error: ${error.message || error.name || "Unknown media error"}`,
      );
    }
  }
});

function showError(message) {
  errorsContainer.textContent = message;
  errorsContainer.removeAttribute("hidden");
}

function getSnapshotDataUrl(videoElement) {
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;

  if (videoWidth === 0 || videoHeight === 0) {
    throw new Error("Video frame is not ready or camera was disconnected.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context is not available.");
  }
  ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

  return canvas.toDataURL("image/png");
}

function stopCameraStream(videoElement) {
  if (!videoElement) return;
  const stream = videoElement.srcObject;

  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoElement.srcObject = null;
  }
}

function startCountdown(duration, displayContainer, numberElement, onComplete) {
  let timeLeft = duration;

  numberElement.textContent = timeLeft;
  displayContainer.removeAttribute("hidden");

  const timer = setInterval(() => {
    timeLeft--;

    if (timeLeft > 0) {
      numberElement.textContent = timeLeft;
    } else {
      clearInterval(timer);
      displayContainer.setAttribute("hidden", "");
      onComplete();
    }
  }, 1000);
}
