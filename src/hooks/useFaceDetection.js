import { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";

// Model weight files must be downloaded once into /public/models — see
// frontend/public/models/README.md for the exact files and source.
const MODEL_URL = "/models";

const DETECTOR_OPTIONS = new faceapi.TinyFaceDetectorOptions({
  inputSize: 320,   // 320 keeps detection fast enough for a live loop on modest laptops
  scoreThreshold: 0.5
});

// A face frame only counts as "scan-ready" once it clears all of these —
// this is what the ML backend relies on instead of receiving garbage
// (no face, side profile, face too small/far, face partly out of frame).
const MIN_CONFIDENCE = 0.75;
const MIN_FACE_WIDTH_RATIO = 0.28;  // face bounding box must fill >=28% of frame width
const MAX_FACE_WIDTH_RATIO = 0.85;  // ...but not be pressed against the lens
const CENTER_TOLERANCE_RATIO = 0.18;

export default function useFaceDetection(videoRef) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [detection, setDetection] = useState({
    faceDetected: false,
    isReady: false,
    confidence: 0,
    box: null,
    reason: "no_face"
  });
  const rafRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        if (!cancelled) setModelsLoaded(true);
      } catch (err) {
        if (!cancelled) setModelError("Could not load face-detection models. Check /public/models.");
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const evaluateFrame = useCallback((box, videoEl, score) => {
    const frameW = videoEl.videoWidth;
    const frameH = videoEl.videoHeight;
    const faceWidthRatio = box.width / frameW;

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const offsetX = Math.abs(centerX - frameW / 2) / frameW;
    const offsetY = Math.abs(centerY - frameH / 2) / frameH;

    if (score < MIN_CONFIDENCE) return { isReady: false, reason: "low_confidence" };
    if (faceWidthRatio < MIN_FACE_WIDTH_RATIO) return { isReady: false, reason: "too_far" };
    if (faceWidthRatio > MAX_FACE_WIDTH_RATIO) return { isReady: false, reason: "too_close" };
    if (offsetX > CENTER_TOLERANCE_RATIO || offsetY > CENTER_TOLERANCE_RATIO) {
      return { isReady: false, reason: "off_center" };
    }
    return { isReady: true, reason: "ready" };
  }, []);

  useEffect(() => {
    if (!modelsLoaded || !videoRef.current) return undefined;

    const loop = async () => {
      const videoEl = videoRef.current;
      if (videoEl && videoEl.readyState === 4) {
        const result = await faceapi
          .detectSingleFace(videoEl, DETECTOR_OPTIONS)
          .withFaceLandmarks();

        if (result) {
          const { box } = result.detection;
          const score = result.detection.score;
          const { isReady, reason } = evaluateFrame(box, videoEl, score);
          setDetection({
            faceDetected: true,
            isReady,
            confidence: score,
            box,
            reason,
            landmarks: result.landmarks
          });
        } else {
          setDetection({ faceDetected: false, isReady: false, confidence: 0, box: null, reason: "no_face" });
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [modelsLoaded, videoRef, evaluateFrame]);

  return { modelsLoaded, modelError, detection };
}
