export default function ScanResult({ result }) {

    if (!result) return null;

    return (

        <div className="mt-8 bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold mb-8">
                Skin Analysis Report
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                <div className="rounded-2xl bg-blue-50 p-5">
                    <p className="text-gray-500">Skin Type</p>
                    <h3 className="text-2xl font-bold">
                        {result.detected_type}
                    </h3>
                </div>

                <div className="rounded-2xl bg-green-50 p-5">
                    <p className="text-gray-500">Health</p>
                    <h3 className="text-2xl font-bold">
                        {Math.round(result.scores.health)}
                    </h3>
                </div>

                <div className="rounded-2xl bg-yellow-50 p-5">
                    <p className="text-gray-500">Oiliness</p>
                    <h3 className="text-2xl font-bold">
                        {Math.round(result.scores.oiliness)}%
                    </h3>
                </div>

                <div className="rounded-2xl bg-cyan-50 p-5">
                    <p className="text-gray-500">Hydration</p>
                    <h3 className="text-2xl font-bold">
                        {Math.round(result.scores.hydration)}%
                    </h3>
                </div>

            </div>

            <div className="mt-10">

                <h3 className="text-2xl font-bold mb-5">
                    Detected Issues
                </h3>

                <div className="space-y-4">

                    {result.detections?.map((item,index)=>{

                        let severity="Low";
                        let color="bg-green-500";

                        if(item.confidence>=80){
                            severity="High";
                            color="bg-red-500";
                        }

                        else if(item.confidence>=50){
                            severity="Medium";
                            color="bg-yellow-500";
                        }

                        return(

                            <div
                                key={index}
                                className="rounded-xl border p-5 flex justify-between items-center"
                            >

                                <div>

                                    <h3 className="text-xl font-semibold">
                                        {item.issue}
                                    </h3>

                                    <p className="text-gray-500">

                                        Confidence

                                        {" "}

                                        <b>

                                            {item.confidence.toFixed(1)}%

                                        </b>

                                    </p>

                                </div>

                                <span
                                    className={`${color} text-white px-4 py-2 rounded-full`}
                                >

                                    {severity}

                                </span>

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>

    );

}