import { useState, useEffect } from "react";
import Donationbox from "./components/Donationbox";
import Progres from "./components/Progres";
import Target from "./components/Target";
import Confetti from "react-confetti";
import { Fireworks } from "@fireworks-js/react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./assets/Untitled_design_(17).png";

function App() {
  const [current, setCurrent] = useState(0);
  const [target, setTarget] = useState(2000);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [totaldonation, settotal] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("wss://absocket-gm2g.onrender.com/ws");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

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
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", event.data, error);
      }
    };

    // Send a "ping" message every 3 minutes
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send("ping");
        console.log("Sent ping");
      }
    }, 180000); // 3 minutes in milliseconds

    // Cleanup the WebSocket connection and ping interval
    return () => {
      clearInterval(pingInterval);
      ws.close();
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen w-full flex flex-col justify-between px-4 bg-gradient-to-b from-[#ADBBDA] to-[#EDE8F5]">
      {/* Header Section with Logos and Components */}
      <div className="flex-0 bg-transparent flex justify-center items-center space-x-6 ">
        {/* Left Logo */}
        <img
          src={logo}
          alt="Logo"
          className="h-40 w-auto object-contain"
          style={{ marginRight: "1rem" }}
        />

        {/* Main Content */}
        <div className="flex-grow flex justify-center">
          {showProgress ? (
            <Progres target={target} current={current} />
          ) : (
            <Target donationAmount={totaldonation} />
          )}
        </div>

        {/* Right Logo */}
        <img
          src={logo}
          alt="Logo"
          className="h-40 w-auto object-contain"
          style={{ marginLeft: "1rem" }}
        />
      </div>

      {/* Donation Section */}
      <div className="flex-[3] flex flex-col justify-center items-center space-y-4 bg-transparent border-transparent">
        <Donationbox />
      </div>

      {/* Confetti and Fireworks */}
      {showConfetti && <Confetti numberOfPieces={2000} />}
      {showFireworks && (
        <Fireworks
          options={{ rocketsPoint: { min: 0, max: 100 }, particles: 800 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
}

export default App;
