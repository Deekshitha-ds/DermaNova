# Face detection model weights

`useFaceDetection.js` loads two models from this folder at runtime:

- `tiny_face_detector_model-*`
- `face_landmark_68_model-*`

These binary weight files are **not committed to the repo** (they're
~1–2 MB each and are a build artifact, not source code). Download them
once from the `@vladmandic/face-api` model repo and place them directly
in this folder:

```bash
cd frontend/public/models
curl -LO https://vladmandic.github.io/face-api/model/tiny_face_detector_model-weights_manifest.json
curl -LO https://vladmandic.github.io/face-api/model/tiny_face_detector_model.bin
curl -LO https://vladmandic.github.io/face-api/model/face_landmark_68_model-weights_manifest.json
curl -LO https://vladmandic.github.io/face-api/model/face_landmark_68_model.bin
```

After this, the folder should contain exactly those 4 files. No further
configuration is needed — `MODEL_URL = "/models"` in the hook already
points here.
