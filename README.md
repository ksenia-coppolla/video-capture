# Video Capture

A small vanilla JavaScript application that requests camera access, displays a live preview, runs a countdown, and captures a snapshot from the video stream.

[Live Demo](https://video-capture-one.vercel.app/)

## Features

- Camera access using `navigator.mediaDevices.getUserMedia`
- Live video preview
- Countdown before capture
- Snapshot generation using the Canvas API
- Camera stream cleanup after capture or error
- Error handling for unsupported browsers, insecure contexts, and denied permissions
- Accessible error messages using `role="alert"`

## Running Locally

Camera access requires a secure context. Browsers allow camera access on `localhost`.

```bash
npx serve app
```

Then open the local URL in your browser.

## Browser APIs Used

- `navigator.mediaDevices.getUserMedia`
- `<video>`
- `<canvas>`

## Implementation Notes

- The application uses a fail-fast approach for required DOM elements. Since the HTML and JavaScript are part of the same codebase and shipped together, repetitive null checks for every DOM lookup were intentionally omitted.
- The camera stream is explicitly stopped after snapshot capture or when an error occurs, preventing the camera from remaining active unnecessarily.
- No external libraries or frameworks are used.

## Demo

A short demo recording is available in `demo.mov`.
