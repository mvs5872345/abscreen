import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Container, Row, Col } from "react-bootstrap";

interface ProgressProps {
  target: number;
  current: number;
}

const Progres: React.FC<ProgressProps> = ({ target, current }) => {
  const now = Math.min((current / target) * 100, 100); // Ensure progress doesn't exceed 100%
  const [color, setColor] = useState("text-blue-600");

  // Effect to change color after some time
  useEffect(() => {
    const colors = ["text-blue-600", "text-red-600", "text-green-600", "text-purple-600"]; // You can add as many colors as needed
    let currentColorIndex = 0;

    const changeColor = () => {
      currentColorIndex = (currentColorIndex + 1) % colors.length;
      setColor(colors[currentColorIndex]);
    };

    const intervalId = setInterval(changeColor, 5000); // Change color every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Define progress bar color and text color based on percentage
  const getVariant = (): { barVariant: string; textColor: string } => {
    if (now < 50) return { barVariant: "danger", textColor: "text-red-600" }; // Red for less than 50%
    if (now < 75) return { barVariant: "warning", textColor: "text-yellow-600" }; // Yellow for 50% - 75%
    return { barVariant: "success", textColor: "text-green-600" }; // Green for 75% and above
  };

  const { barVariant, textColor } = getVariant();

  return (
    <Container className="p-2 h-100">
      <Row className="h-100">
        <Col className="d-flex align-items-center justify-content-center">
          <div
            className={`bg-white shadow-lg rounded-lg w-full p-4 ${color}`} // Adjusted width here for better readability and responsiveness
            style={{
              height: "80%",
              maxWidth: "1000px", // Increased max width for better appearance
              marginTop: "20px",
            }}
          >
            <div className="text-center">
              <h1
                className={`font-extrabold ${textColor} mb-4`} // Use dynamic text color based on progress
                style={{
                  fontSize: "clamp(2rem, 5vw, 6rem)", // Scales with screen size
                }}
              >
                TARGET
              </h1>
              <p
                className="text-gray-700 font-bold"
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 4rem)", // Scales with screen size
                }}
              >
                {current} / {target}
              </p>
              <ProgressBar now={now} label={`${now.toFixed(1)}%`} variant={barVariant} /> {/* Added px-1 to increase padding and slightly widen the progress bar */}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Progres;
