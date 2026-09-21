import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver
} from "@mediapipe/tasks-vision";

const MODEL_PATH = "/models/face_landmarker.task";

const MIN_CONFIDENCE = 0.50;

const MIN_FACE_WIDTH_RATIO = 0.28;
const MAX_FACE_WIDTH_RATIO = 0.85;

const CENTER_TOLERANCE_RATIO = 0.18;

export default function useFaceDetection(videoRef) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelError, setModelError] = useState(null);

  const [detection, setDetection] = useState({
    faceDetected: false,
    isReady: false,
    confidence: 0,
    box: null,
    reason: "no_face",
    landmarks: null
  });

  const faceLandmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  /*
   * ---------------------------------------------------------
   * LOAD MEDIAPIPE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    async function loadFaceLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
);

        const faceLandmarker =
          await FaceLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath: MODEL_PATH,
                delegate: "GPU"
              },

              runningMode: "VIDEO",

              numFaces: 1,

              minFaceDetectionConfidence: 0.5,
              minFacePresenceConfidence: 0.5,
              minTrackingConfidence: 0.5,

              outputFaceBlendshapes: false,
              outputFacialTransformationMatrixes: false
            }
          );

        if (cancelled) {
          faceLandmarker.close();
          return;
        }

        faceLandmarkerRef.current = faceLandmarker;

        setModelsLoaded(true);

        console.log(
          "MediaPipe Face Landmarker loaded successfully."
        );
      } catch (error) {
        console.error(
          "MEDIAPIPE FACE LANDMARKER ERROR:",
          error
        );

        if (!cancelled) {
          setModelError(
            "Could not load MediaPipe face-detection model."
          );
        }
      }
    }

    loadFaceLandmarker();

    return () => {
      cancelled = true;

      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
        faceLandmarkerRef.current = null;
      }
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * CALCULATE FACE BOX FROM LANDMARKS
   * ---------------------------------------------------------
   *
   * MediaPipe gives us facial landmarks instead of relying
   * only on a rectangular detector box.
   *
   * We calculate the smallest useful bounding box around
   * the visible facial landmarks.
   */

  const getFaceBox = useCallback(
    (landmarks, videoWidth, videoHeight) => {
      if (!landmarks || landmarks.length === 0) {
        return null;
      }

      let minX = 1;
      let minY = 1;
      let maxX = 0;
      let maxY = 0;

      for (const point of landmarks) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);

        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      }

      /*
       * Add a small margin around the actual facial landmarks.
       * This prevents the box from cutting off the face.
       */

      const marginX = (maxX - minX) * 0.08;
      const marginY = (maxY - minY) * 0.08;

      minX = Math.max(0, minX - marginX);
      minY = Math.max(0, minY - marginY);

      maxX = Math.min(1, maxX + marginX);
      maxY = Math.min(1, maxY + marginY);

      return {
        x: minX * videoWidth,
        y: minY * videoHeight,
        width: (maxX - minX) * videoWidth,
        height: (maxY - minY) * videoHeight
      };
    },
    []
  );

  /*
   * ---------------------------------------------------------
   * CHECK WHETHER FACE IS READY
   * ---------------------------------------------------------
   */

  const evaluateFrame = useCallback(
    (box, videoEl, confidence) => {
      const frameW = videoEl.videoWidth;
      const frameH = videoEl.videoHeight;

      if (!frameW || !frameH) {
        return {
          isReady: false,
          reason: "camera_not_ready"
        };
      }

      const faceWidthRatio =
        box.width / frameW;

      const centerX =
        box.x + box.width / 2;

      const centerY =
        box.y + box.height / 2;

      const offsetX =
        Math.abs(
          centerX - frameW / 2
        ) / frameW;

      const offsetY =
        Math.abs(
          centerY - frameH / 2
        ) / frameH;

      if (confidence < MIN_CONFIDENCE) {
        return {
          isReady: false,
          reason: "low_confidence"
        };
      }

      if (
        faceWidthRatio <
        MIN_FACE_WIDTH_RATIO
      ) {
        return {
          isReady: false,
          reason: "too_far"
        };
      }

      if (
        faceWidthRatio >
        MAX_FACE_WIDTH_RATIO
      ) {
        return {
          isReady: false,
          reason: "too_close"
        };
      }

      if (
        offsetX >
          CENTER_TOLERANCE_RATIO ||
        offsetY >
          CENTER_TOLERANCE_RATIO
      ) {
        return {
          isReady: false,
          reason: "off_center"
        };
      }

      return {
        isReady: true,
        reason: "ready"
      };
    },
    []
  );

  /*
   * ---------------------------------------------------------
   * REAL-TIME FACE DETECTION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (
      !modelsLoaded ||
      !faceLandmarkerRef.current ||
      !videoRef.current
    ) {
      return undefined;
    }

    let cancelled = false;

    const detectFrame = () => {
      if (cancelled) return;

      const videoEl = videoRef.current;
      const landmarker =
        faceLandmarkerRef.current;

      if (
        !videoEl ||
        !landmarker ||
        videoEl.readyState < 2
      ) {
        rafRef.current =
          requestAnimationFrame(detectFrame);

        return;
      }

      /*
       * MediaPipe only needs to process a new
       * video frame.
       */

      if (
        videoEl.currentTime !==
        lastVideoTimeRef.current
      ) {
        lastVideoTimeRef.current =
          videoEl.currentTime;

        try {
          const results =
            landmarker.detectForVideo(
              videoEl,
              performance.now()
            );

          if (
            results.faceLandmarks &&
            results.faceLandmarks.length > 0
          ) {
            const landmarks =
              results.faceLandmarks[0];

            const box = getFaceBox(
              landmarks,
              videoEl.videoWidth,
              videoEl.videoHeight
            );

            if (box) {
              /*
               * MediaPipe Face Landmarker does not provide
               * the same detector score as TinyFaceDetector.
               *
               * We therefore use a stable confidence value
               * once a valid face landmark set is detected.
               */

              const confidence = 1.0;

              const {
                isReady,
                reason
              } = evaluateFrame(
                box,
                videoEl,
                confidence
              );

              setDetection({
                faceDetected: true,
                isReady,
                confidence,
                box,
                reason,
                landmarks
              });
            }
          } else {
            setDetection({
              faceDetected: false,
              isReady: false,
              confidence: 0,
              box: null,
              reason: "no_face",
              landmarks: null
            });
          }
        } catch (error) {
          console.error(
            "MEDIAPIPE DETECTION ERROR:",
            error
          );
        }
      }

      rafRef.current =
        requestAnimationFrame(detectFrame);
    };

    rafRef.current =
      requestAnimationFrame(detectFrame);

    return () => {
      cancelled = true;

      if (rafRef.current) {
        cancelAnimationFrame(
          rafRef.current
        );
      }
    };
  }, [
    modelsLoaded,
    videoRef,
    getFaceBox,
    evaluateFrame
  ]);

  return {
    modelsLoaded,
    modelError,
    detection
  };
}