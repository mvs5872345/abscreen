import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

interface TargetProps {
  donationAmount: number; // Prop for the donation amount
}

const Target: React.FC<TargetProps> = ({ donationAmount }) => {
  const [formattedAmount, setFormattedAmount] = useState<string>("");
  const [displayedAmount, setDisplayedAmount] = useState(0);

  // Effect to format the donation amount with commas
  useEffect(() => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    });
    setFormattedAmount(formatter.format(displayedAmount));
  }, [displayedAmount]);

  // Effect to increment the displayed amount to the target donation amount
  useEffect(() => {
    const incrementAmount = 119; // Increment value
    const interval = 10; // Interval in milliseconds

    if (displayedAmount < donationAmount) {
      const incrementInterval = setInterval(() => {
        setDisplayedAmount((prev) => {
          const newAmount = prev + incrementAmount;
          if (newAmount >= donationAmount) {
            clearInterval(incrementInterval);
            return donationAmount;
          }
          return newAmount;
        });
      }, interval);
      return () => clearInterval(incrementInterval);
    }
  }, [donationAmount, displayedAmount]);

  return (
    <Container className="p-2 h-100">
      <Row className="h-100">
        <Col className="d-flex align-items-center justify-content-center">
          <div
            className="bg-white shadow-lg rounded-lg flex items-center justify-center w-100 text-black"
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
                {/* Adding the dollar sign before the formatted amount */}
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
                {formattedAmount.split("").map((digit, index) => (
                  <div
                    key={`${digit}-${index}`}
                    className="inline-block"
                    style={{
                      lineHeight: 1, // Ensures numbers stay visually centered
                      fontFamily: "'Roboto', sans-serif", // Clean, modern font
                    }}
                  >
                    {digit}
                  </div>
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
