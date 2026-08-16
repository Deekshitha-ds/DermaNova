import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import GlassCard from "../components/GlassCard";
import SmartCamera from "../components/SmartCamera";
export default function FaceScan() {

  const [result, setResult] = useState(null);
  const [searchParams] = useSearchParams();

  const uploadMode = searchParams.get("upload") === "true";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {!uploadMode && (
        <>
          <p className="eyebrow text-center mb-2">
            AI Skin Analysis
          </p>

          <h1 className="text-4xl font-semibold text-center mb-6">
            DermaNova AI
          </h1>
        </>
      )}

      <GlassCard>

        <SmartCamera
          onResult={setResult}
          autoUpload={uploadMode}
          uploadOnly={uploadMode}
        />

      </GlassCard>

    </div>
  );
}