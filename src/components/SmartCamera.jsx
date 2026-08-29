import { useEffect, useRef, useState, useCallback } from "react";

import useFaceDetection from "../hooks/useFaceDetection";
import { submitSkinAnalysis } from "../api/skinAnalysis";

import {
  GUIDANCE,
  STATUS_COLOR
} from "../utils/faceGuidance";

import {
  HiOutlineCamera,
  HiOutlinePhotograph
} from "react-icons/hi";
import DermaLoader from "../components/dermaloader";
import ScanResult from "./ScanResult";
const HOLD_DURATION_MS = 1200;

export default function SmartCamera({ onResult,autoUpload = false, uploadOnly = false }) {

  /* ---------------- REFS ---------------- */

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [result, setResult] = useState(null);
  const holdStartRef = useRef(null);
  const animationRef = useRef(null);
  const isUploading = useRef(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  
  /* ---------------- STATE ---------------- */

  const [videoAspect, setVideoAspect] = useState(4 / 3);

  const [phase, setPhase] = useState("scanning");

  const [holdProgress, setHoldProgress] = useState(0);

  const [cameraError, setCameraError] = useState("");

  const [submitError, setSubmitError] = useState("");

  /* ---------------- FACE DETECTION ---------------- */

  const {

    modelsLoaded,

    modelError,

    detection

  } = useFaceDetection(videoRef);

  /* ---------------- START CAMERA ---------------- */

  useEffect(() => {

  if (uploadOnly) return;

  let stream;
 
  async function openCamera() {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play().catch(() => {});
      }

    } catch (error) {

      console.error("CAMERA ERROR:", error);

      setCameraError("Unable to access camera.");

    }

  }

  openCamera();

  return () => {

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach(track => track.stop());

      streamRef.current = null;

    }

  };

}, [uploadOnly]);
useEffect(() => {

  if (!autoUpload) return;

  const timer = setTimeout(() => {
    fileInputRef.current?.click();
  }, 300);

  return () => clearTimeout(timer);

}, [autoUpload]);

  /* ---------------- VIDEO SIZE ---------------- */

  const handleLoadedMetadata = () => {

    if (!videoRef.current) return;

    setVideoAspect(

      videoRef.current.videoWidth /

      videoRef.current.videoHeight

    );

  };

  /* ---------------- CAPTURE FRAME ---------------- */

  const captureFrame = useCallback(async () => {
  const video = videoRef.current;
  const canvas = captureCanvasRef.current;

  if (!video || !canvas) {
    throw new Error("Camera or canvas is not available.");
  }

  if (!video.videoWidth || !video.videoHeight) {
    throw new Error("Camera video is not ready.");
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context.");
  }

  ctx.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

  if (!dataUrl || dataUrl === "data:,") {
    throw new Error("Could not create image from camera.");
  }

  const response = await fetch(dataUrl);
  const blob = await response.blob();

  if (!blob || blob.size === 0) {
    throw new Error("Captured image is empty.");
  }

  return blob;
}, []);
  /* ---------------- SEND TO BACKEND ---------------- */

  const handleCapture = useCallback(async () => {

    if (isUploading.current) return;

    if (!detection.isReady) return;

    isUploading.current = true;

    setSubmitError("");

    setPhase("uploading");

    try {

      const blob = await captureFrame();

      setCapturedImage(URL.createObjectURL(blob));
      const faceMeta = {

        confidence: detection.confidence,

        box: detection.box,

        captured_at: new Date().toISOString()

      };

      const { data } = await submitSkinAnalysis(
    blob,
    faceMeta
);

// Save backend response
setResult(data);

// Save processed image path
if (data.processed_image) {

    setProcessedImage(
        `http://127.0.0.1:8000${data.processed_image}?t=${Date.now()}`
    );

}

// Send result to parent
if (onResult) {

    onResult(data);

}

setPhase("result");
    }

    catch (err) {
  console.error("SKIN ANALYSIS ERROR:", err);

  const backendError = err.response?.data?.detail;

  let errorMessage = "Analysis failed.";

  if (Array.isArray(backendError)) {
    errorMessage = backendError
      .map((item) => item.msg || JSON.stringify(item))
      .join(", ");
  } else if (typeof backendError === "string") {
    errorMessage = backendError;
  } else if (err.response?.data?.message) {
    errorMessage = err.response.data.message;
  } else if (err.message) {
    errorMessage = err.message;
  }

  setSubmitError(errorMessage);
  setPhase("scanning");
}

    finally {

      isUploading.current = false;

    }

  }, [

    captureFrame,

    detection,

    onResult

  ]);
  /* ---------------- AUTO CAPTURE ---------------- */

useEffect(() => {

  if (phase !== "scanning") return;

  const animate = () => {

    if (detection.isReady) {

      if (!holdStartRef.current) {
        holdStartRef.current = Date.now();
      }

      const elapsed =
        Date.now() - holdStartRef.current;

      const progress = Math.min(
        elapsed / HOLD_DURATION_MS,
        1
      );

      setHoldProgress(progress);

      if (progress >= 1) {

        holdStartRef.current = null;

        setHoldProgress(0);

        handleCapture();

        return;

      }

    } else {

      holdStartRef.current = null;

      setHoldProgress(0);

    }

    animationRef.current =
      requestAnimationFrame(animate);

  };

  animationRef.current =
    requestAnimationFrame(animate);

  return () =>
    cancelAnimationFrame(animationRef.current);

}, [

  detection.isReady,

  phase,

  handleCapture

]);

/* ---------------- DRAW LIVE FACE BOX ---------------- */

/* ---------------- DRAW OVERLAY ---------------- */
/*
useEffect(() => {

    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");

    let animationId;

    const draw = () => {

        if (!video.videoWidth) {
            animationId = requestAnimationFrame(draw);
            return;
        }

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        // Live face box
        

         



        const videoRatio =
            video.videoWidth / video.videoHeight;

        const displayRatio =
            width / height;

        let drawWidth;
        let drawHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (videoRatio > displayRatio) {

            drawHeight = height;
            drawWidth = drawHeight * videoRatio;
            offsetX = (drawWidth - width) / 2;

        } else {

            drawWidth = width;
            drawHeight = drawWidth / videoRatio;
            offsetY = (drawHeight - height) / 2;

        }

        const scaleX = drawWidth / video.videoWidth;
        const scaleY = drawHeight / video.videoHeight;

        ctx.save();

        ctx.translate(width, 0);
        ctx.scale(-1, 1);

        // ---------- Live Face Box ----------
        // ---------- LIVE FACE BOX ----------

if (phase === "scanning" && detection.box) {

    let x =
        detection.box.x * scaleX - offsetX;

    const y =
        detection.box.y * scaleY - offsetY;

    const w =
        detection.box.width * scaleX;

    const h =
        detection.box.height * scaleY;

    ctx.strokeStyle =
        detection.isReady
            ? "#00ff88"
            : "#ffaa00";

    ctx.lineWidth = 3;

    ctx.strokeRect(x, y, w, h);

}
       

        // ---------- YOLO Results ----------

        if (
            phase === "result" &&
            result?.detections
        ) {

            result.detections.forEach(det => {

                let x =
                    det.bbox.x * scaleX - offsetX;

                const y =
                    det.bbox.y * scaleY - offsetY;

                const w =
                    det.bbox.width * scaleX;

                const h =
                    det.bbox.height * scaleY;
                
                x = width - x - w;

                // Glow
ctx.shadowColor = "#ff3b3b";
ctx.shadowBlur = 15;

// Rounded rectangle
let color = "#00ff88";

switch(det.issue){

case "Acne":
color="#ff3b3b";
break;

case "Dark Spots":
color="#ffaa00";
break;

case "Pigmentation":
color="#ff00ff";
break;

case "Wrinkles":
color="#00bfff";
break;

case "Redness":
color="#ff5555";
break;

default:
color="#00ff88";

}

ctx.strokeStyle=color;
ctx.shadowColor=color;
ctx.fillStyle=color;
ctx.lineWidth = 3;

ctx.beginPath();

ctx.roundRect(
    x,
    y,
    w,
    h,
    10
);

ctx.stroke();

ctx.shadowBlur = 0;

// Label background
ctx.fillStyle = "#ff3b3b";

ctx.fillRect(
    x,
    y - 30,
    180,
    24
);

// Label text
ctx.fillStyle = "#ffffff";
ctx.font = "bold 15px Arial";

ctx.fillText(
    `${det.issue} (${det.confidence}%)`,
    x + 8,
    y - 13
);
            });

        }

        ctx.restore();

        animationId =
            requestAnimationFrame(draw);

    };

    draw();

    return () =>
        cancelAnimationFrame(animationId);

}, [

    detection,

    result,

    phase

]);
*/
/* ---------------- UPLOAD IMAGE ---------------- */

const handleImageUpload = async (event) => {

  const file = event.target.files[0];

  if (!file) return;

  if (!(file instanceof Blob)) {
    setSubmitError("Invalid image file.");
    return;
  }

  setCapturedImage(URL.createObjectURL(file));
  try {

    setPhase("uploading");

    const faceMeta = {
      captured_at: new Date().toISOString()
    };

    const { data } = await submitSkinAnalysis(file, faceMeta);
    setResult(data);


    if (data.processed_image) {

       setProcessedImage(
        `http://127.0.0.1:8000${data.processed_image}?t=${Date.now()}`
      );

}
    if (onResult) {
      onResult(data);
}

  setPhase("result");

}catch (err) {
  console.error("IMAGE ANALYSIS ERROR:", err);

  const backendError = err.response?.data?.detail;

  let errorMessage = "Unable to analyze image.";

  if (Array.isArray(backendError)) {
    errorMessage = backendError
      .map((item) => item.msg || JSON.stringify(item))
      .join(", ");
  } else if (typeof backendError === "string") {
    errorMessage = backendError;
  } else if (err.response?.data?.message) {
    errorMessage = err.response.data.message;
  } else if (err.message) {
    errorMessage = err.message;
  }

  setSubmitError(errorMessage);
  setPhase("scanning");
}

};
return (
  <div className="w-full">
  {uploadOnly && phase === "scanning" ? (
  <div className="min-h-[300px] flex flex-col items-center justify-center text-center">

    <div className="w-16 h-16 rounded-full bg-lavender-100 flex items-center justify-center mb-5">
      <HiOutlinePhotograph
        size={30}
        className="text-lavender-600"
      />
    </div>

    <p className="text-lg font-semibold">
      Select an image
    </p>

    <p className="text-sm text-ink/50 mt-1">
      Choose a clear, front-facing photo of your face.
    </p>

  </div>
) : (

    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden bg-black"
      style={{ aspectRatio: videoAspect }}
    >

      {/* Camera */}

      {phase === "result" ? (

  <>

   <div className="absolute inset-0">

    {processedImage ? (

<img
    src={processedImage}
    className="absolute inset-0 w-full h-full object-cover"
/>

) : (

<img
  src={capturedImage}
  alt="Uploaded face"
  className="absolute inset-0 w-full h-full object-cover"
/>
)}

</div>

    <button
      className="absolute top-5 right-5 bg-white rounded-lg px-4 py-2 shadow-lg hover:bg-gray-100 transition"
      onClick={() => {

  setCapturedImage(null);
  setProcessedImage(null);
  setResult(null);

  setHoldProgress(0);
  holdStartRef.current = null;

  setSubmitError("");

  setPhase("scanning");

  // Reconnect camera stream to the newly created video element
  setTimeout(() => {

    if (
      videoRef.current &&
      streamRef.current
    ) {

      videoRef.current.srcObject =
        streamRef.current;

      videoRef.current.play().catch(() => {});

    }

  }, 100);

  if (onResult) {
    onResult(null);
  }

}}
    >
      Scan Again
    </button>

  </>

) : (

  <video
    ref={videoRef}
    autoPlay
    playsInline
    muted
    onLoadedMetadata={handleLoadedMetadata}
    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
  />

)}
      {/* Overlay */}

      {phase === "scanning" && detection.isReady && (
    
    <div className="lavender-scan-line">
    <div className="lavender-scan-glow" />
    <div className="lavender-scan-core" />
  </div>
)}


      {/* Loading */}

      {phase === "uploading" && (
  <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white">

    <DermaLoader />

    <p className="mt-6 text-lg font-semibold tracking-[0.15em] uppercase animate-pulse">
      Analyzing Skin...
    </p>

    <p className="mt-2 text-sm text-white/60">
      DermaNova AI is examining your skin
    </p>

  </div>
)}

      {/* Camera Error */}

      {cameraError && (

        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">

          {cameraError}

        </div>

      )}

      {/* Model Error */}

      {modelError && (

        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">

          {modelError}

        </div>

      )}

      {/* Guidance */}

      {phase === "scanning" && (

<div className="absolute top-5 left-1/2 -translate-x-1/2">

    <div className="px-5 py-2 rounded-full bg-black/60 text-white backdrop-blur">

        {GUIDANCE[detection.reason]}

    </div>

</div>

)}
      {/* Hold Progress */}

      {phase === "scanning" && detection.isReady && (

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">

          <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center bg-black/40">

            <div

              className="rounded-full bg-green-400 transition-all duration-75"

              style={{

                width: `${holdProgress * 100}%`,

                height: `${holdProgress * 100}%`

              }}

            />

          </div>

        </div>

      )}

      

    

      
    </div>
)}

    {/* Hidden upload */}

    <input

      type="file"

      accept="image/*"

      ref={fileInputRef}

      onChange={handleImageUpload}

      hidden

    />

    {/* Hidden capture canvas */}

    <canvas

      ref={captureCanvasRef}

      style={{ display: "none" }}

    />
 {/* Scan Result */}

{phase === "result" && result && (
  <ScanResult result={result} />
)}

{/* Error */}

{submitError && (
  <p className="text-red-500 text-center mt-4">
    {submitError}
  </p>
)} 

  </div>

);
}