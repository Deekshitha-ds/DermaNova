import { useState } from "react";
import GlassCard from "../components/GlassCard";
import SmartCamera from "../components/SmartCamera";
import ScanResult from "../components/ScanResult";
export default function FaceScan() {

  const [result, setResult] = useState(null);

  return (

    <div className="max-w-4xl mx-auto px-4 py-8">

      <p className="eyebrow text-center mb-2">
        AI Skin Analysis
      </p>

      <h1 className="text-4xl font-semibold text-center mb-6">
        DermaNova AI
      </h1>

      <GlassCard>

        <SmartCamera
          onResult={setResult}
        />

      </GlassCard>

    </div>

  );

}