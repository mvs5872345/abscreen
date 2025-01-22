import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TargetProps {
  donationAmount: number; // Prop for the donation amount
}

const Target: React.FC<TargetProps> = ({ donationAmount }) => {
  const [color, setColor] = useState("text-blue-600");
  const [currentDigits, setCurrentDigits] = useState<string[]>([]);

  // Effect to split the donation amount into digits and animate them
  useEffect(() => {
    const newDigits = donationAmount.toString().split("");
    setCurrentDigits((prevDigits) => {
      if (prevDigits.join("") !== newDigits.join("")) {
        return newDigits;
      }
      return prevDigits;
    });
  }, [donationAmount]);

  // Effect to change color periodically
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

  // Framer Motion animation variants
  const digitAnimation = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
  };

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
              <div
                className="flex justify-center space-x-4"
                style={{
                  fontSize: "clamp(2rem, 5vw, 6rem)", // Increased size
                  fontWeight: "bold", // Added bold styling
                }}
              >
                {/* Adding the dollar sign before the digits */}
                <div
                  className="inline-block"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 6rem)",
                    lineHeight: 1, // Ensures dollar sign stays level with digits
                    fontFamily: "'Roboto', sans-serif", // Matches the font style
                  }}
                >
                  $
                </div>
                {currentDigits.map((digit, index) => (
                  <AnimatePresence key={index}>
                    <motion.div
                      key={`${digit}-${index}`}
                      variants={digitAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        duration: 0.6, // Slows down the animation
                        delay: index * 0.2, // Stagger animation for each digit
                      }}
                      className="inline-block"
                      style={{
                        lineHeight: 1, // Ensures numbers stay visually centered
                        fontFamily: "'Roboto', sans-serif", // Clean, modern font
                      }}
                    >
                      {digit}
                    </motion.div>
                  </AnimatePresence>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Target;
