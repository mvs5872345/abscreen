import React, { } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Container, Row, Col } from "react-bootstrap";

interface ProgressProps {
  target: number;
  current: number;
}

const Progres: React.FC<ProgressProps> = ({ target, current }) => {
  const now = Math.min((current / target) * 100, 100); // Ensure progress doesn't exceed 100%

  // Calculate progress distribution for each color (red, yellow, green)
  const redProgress = Math.min(now, 25); // Red takes the first 50%
  const yellowProgress = Math.min(Math.max(now - 50, 0), 50); // Yellow takes the next 25%
  const greenProgress = Math.min(Math.max(now - 75, 0), 25); // Green takes the last 25%

  return (
    <Container className="p-2 h-100">
      <Row className="h-100">
        <Col className="d-flex align-items-center justify-content-center">
          <div
            className="bg-white shadow-lg rounded-lg w-full p-4"
            style={{
              height: "80%",
              maxWidth: "1000px", // Increased max width for better appearance
              marginTop: "20px",
            }}
          >
            <div className="text-center">
              <h1
                className="font-extrabold text-gray-700 mb-4"
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
              <ProgressBar>
                {/* Red section (50%) */}
                <ProgressBar
                  striped
                  variant="danger"
                  animated
                  now={redProgress}
                  key={1}
                />
                {/* Yellow section (50% - 75%) */}
                <ProgressBar
                  striped
                  variant="warning"
                  animated
                  now={yellowProgress}
                  key={2}
                />
                {/* Green section (75% and above) */}
                <ProgressBar
                  striped
                  variant="success"
                  animated
                  now={greenProgress}
                  key={3}
                />
              </ProgressBar>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Progres;
