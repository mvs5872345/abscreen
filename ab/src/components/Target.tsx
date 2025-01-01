import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

interface TargetProps {
  donationAmount: number; // Prop for the donation amount
}

const Target: React.FC<TargetProps> = ({ donationAmount }) => {
  // State to hold the current color
  const [color, setColor] = useState("text-blue-600");

  // Effect to change color after some time
  useEffect(() => {
    const colors = ["text-blue-600", "text-red-600", "text-green-600", "text-purple-600"];
    let currentColorIndex = 0;

    const changeColor = () => {
      currentColorIndex = (currentColorIndex + 1) % colors.length;
      setColor(colors[currentColorIndex]);
    };

    const intervalId = setInterval(changeColor, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container className="p-2 h-100">
      <Row className="h-100">
        <Col className="d-flex align-items-center justify-content-center">
          <div
            className={`bg-white shadow-lg rounded-lg flex items-center justify-center w-100 ${color}`}
            style={{
              height: "80%",
              maxWidth: "1200px",
              marginTop: "20px",
            }}
          >
            <div className="text-center">
              <h1
                className={`font-extrabold ${color} mb-4`}
                style={{
                  fontSize: "clamp(2rem, 5vw, 6rem)",
                }}
              >
                Total Donations
              </h1>
              <p
                className="text-gray-700 font-bold"
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 4rem)",
                }}
              >
                ${donationAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Target;
