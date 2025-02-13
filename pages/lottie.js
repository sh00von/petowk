import { useState } from "react";
import Lottie from "lottie-react";
import animationOne from "@/public/lottie/3.json";  // Converted .lottie file to .json

export default function LottiePage() {
  const [selected, setSelected] = useState(0);
  const animations = [animationOne];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Lottie Animations</h1>
      <div className="w-80 h-80 bg-white shadow-md rounded-lg flex items-center justify-center p-4">
        <Lottie animationData={animations[selected]} loop={true} />
      </div>
      <div className="mt-6 flex space-x-4">
        {animations.map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg ${
              selected === index ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setSelected(index)}
          >
            Animation {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
