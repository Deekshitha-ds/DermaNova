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

const HOLD_DURATION_MS = 1200;

export default function SmartCamera({ onResult }) {

  /* ---------------- REFS ---------------- */

  const videoRef = useRef(null);
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

    let stream;

    async function openCamera() {

      try {

        stream = await navigator.mediaDevices.getUserMedia({

          video: {

            facingMode: "user",

            width: { ideal: 1280 },

            height: { ideal: 720 }

          },

          audio: false

        });

        videoRef.current.srcObject = stream;

      }

      catch {

        setCameraError("Unable to access camera.");

      }

    }

    openCamera();

    return () => {

      stream?.getTracks().forEach(track => track.stop());

    };

  }, []);

  /* ---------------- VIDEO SIZE ---------------- */

  const handleLoadedMetadata = () => {

    if (!videoRef.current) return;

    setVideoAspect(

      videoRef.current.videoWidth /

      videoRef.current.videoHeight

    );

  };

  /* ---------------- CAPTURE FRAME ---------------- */

  const captureFrame = useCallback(() => {

    const video = videoRef.current;

    const canvas = captureCanvasRef.current;

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(

      video,

      0,

      0,

      canvas.width,

      canvas.height

    );

    return new Promise(resolve => {

      canvas.toBlob(

        blob => resolve(blob),

        "image/jpeg",

        0.95

      );

    });

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

      setSubmitError(

        err.response?.data?.message ||

        "Analysis failed."

      );

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

}catch {

    setSubmitError(
      "Unable to analyze image."
    );

    setPhase("scanning");

  }

};
return (
  <div className="w-full">

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
    src={processedImage || capturedImage}
    alt="Analysis Result"
    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
/>

)}

</div>

    <button
      className="absolute top-5 right-5 bg-white rounded-lg px-4 py-2 shadow-lg hover:bg-gray-100 transition"
      onClick={() => {

        setCapturedImage(null);

        setHoldProgress(0);

        holdStartRef.current = null;

        setSubmitError("");

        setPhase("scanning");

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

    <div
        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-80 animate-scanLaser"
    />

)}

      {/* Loading */}

      {phase === "uploading" && (

        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">

          <div className="w-14 h-14 rounded-full border-4 border-white/30 border-t-green-400 animate-spin mb-4" />

          <p className="text-lg font-semibold">
            Analyzing Skin...
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

      {/* Capture */}

      <button

        onClick={handleCapture}

        disabled={!detection.isReady || phase === "uploading"}

        className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-105 transition"

      >

        <HiOutlineCamera size={28} />

      </button>

      {/* Upload */}

      <button

        onClick={() => fileInputRef.current.click()}

        className="absolute bottom-6 left-6 w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-105 transition"

      >

        <HiOutlinePhotograph size={28} />

      </button>

    </div>

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

    {/* Error */}
    {phase === "result" && result && (

<div className="mt-8 bg-white rounded-2xl shadow-lg p-6">

    <h2 className="text-2xl font-bold mb-4">
        Skin Analysis Result
    </h2>

    <div className="grid grid-cols-2 gap-4">

        <div>
            <p className="text-gray-500">
                Skin Type
            </p>

            <h3 className="text-xl font-semibold">
                {result.detected_type}
            </h3>
        </div>

        <div>
            <p className="text-gray-500">
                Confidence
            </p>

            <h3 className="text-xl font-semibold">
                {result.scores.confidence}%
            </h3>
        </div>

        <div>
            <p className="text-gray-500">
                Health Score
            </p>

            <h3 className="text-xl font-semibold">
                {Math.round(result.scores.health)}
            </h3>
        </div>

        <div>
            <p className="text-gray-500">
                Hydration
            </p>

            <h3 className="text-xl font-semibold">
                {Math.round(result.scores.hydration)}%
            </h3>
        </div>

        <div>
            <p className="text-gray-500">
                Oiliness
            </p>

            <h3 className="text-xl font-semibold">
                {Math.round(result.scores.oiliness)}%
            </h3>
        </div>

    </div>

   <div className="space-y-4">

{result.detections?.map((item,index)=>{

let severity="Low";
let color="bg-green-500";

if(item.confidence>=80){
    severity="High";
    color="bg-red-500";
}
else if(item.confidence>=60){
    severity="Medium";
    color="bg-yellow-500";
}

return(

<div
key={index}
className="rounded-xl border p-5 shadow-sm bg-white hover:shadow-lg transition"
>

<div className="flex justify-between items-center">

<h3 className="text-lg font-bold">

{item.issue}

</h3>

<span
className={`${color} text-white px-3 py-1 rounded-full text-sm`}
>

{severity}

</span>

</div>

<p className="text-gray-500 mt-2">

Confidence :
<b> {item.confidence}%</b>

</p>

</div>

);

})}

</div>
<div className="mt-8">

<h2 className="text-xl font-bold mb-4">

AI Recommendation

</h2>

<div className="bg-blue-50 rounded-xl p-5">

<ul className="space-y-2 list-disc ml-5">

{result.detections?.map((item,index)=>(

<li key={index}>

{item.issue==="Acne" &&
"Use a Salicylic Acid cleanser twice daily."}

{item.issue==="Dark Circles" &&
"Improve sleep and use Vitamin C based eye cream."}

{item.issue==="Pigmentation" &&
"Use SPF 50 sunscreen and Niacinamide serum."}

{item.issue==="Wrinkles" &&
"Use Retinol serum during night."}

{item.issue==="Redness" &&
"Use soothing moisturizer containing Ceramides."}

</li>

))}

</ul>

</div>

</div>

</div>

)}

    {submitError && (

      <p className="text-red-500 text-center mt-4">

        {submitError}

      </p>

    )}

  </div>

);
}