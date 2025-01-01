import { useState, useEffect } from "react";
import Donationbox from "./components/Donationbox";
import Progres from "./components/Progres";
import Target from "./components/Target";
import Confetti from "react-confetti";
import { Fireworks } from "@fireworks-js/react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [current, setCurrent] = useState(0);
  const [target, setTarget] = useState(2000);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [totaldonation, settotal] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("wss://absocket.onrender.com/ws");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);

        switch (data.action) {
          case "update_progress":
            setCurrent(data.current_amount);
            setTarget(data.target_amount);
            break;

          case "totaldonation":
            settotal(data.total);
            break;         

          case "update_p":
            if (data.cur && typeof data.cur.show_progress === "string") {
              const newShowProgress = data.cur.show_progress === "TRUE";
              setShowProgress(newShowProgress);
              console.log("Setting showProgress to:", newShowProgress);
            } else {
              console.error("Invalid data format for update_p:", data.cur);
            }
            break;

          case "update_target":
            setTarget(data.target_amount);
            break;

          case "confetti":
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 10000);
            break;

          case "fireworks":
            setShowFireworks(true);
            setTimeout(() => setShowFireworks(false), 10000);
            break;

          default:
            console.warn("Unhandled action type:", data.action);
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", event.data, error);
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    console.log("showProgress state updated:", showProgress);
  }, [showProgress]);
  

  return (
    <div className="min-h-screen w-full flex flex-col justify-between px-4">
      <div className="flex-0 bg-gray-100 flex justify-center items-center">
        {showProgress ? (
          <Progres target={target} current={current} />
        ) : (
          <Target donationAmount={totaldonation}/>
        )}
      </div>
      <div className="flex-[3] bg-gray-200 flex flex-col justify-center items-center space-y-4">
        <Donationbox />
      </div>
      {showConfetti && <Confetti numberOfPieces={1000} />}
      {showFireworks && (
        <Fireworks
          options={{ rocketsPoint: { min: 0, max: 100 }, particles: 500 }}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}

export default App;
