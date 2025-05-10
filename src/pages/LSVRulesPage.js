import React from 'react';
import { Container, Card, ListGroup, Row, Col, Image } from 'react-bootstrap';
import { FaCar, FaParking, FaExclamationTriangle, FaCamera, FaBatteryThreeQuarters, FaRoad } from 'react-icons/fa';


import trafficImage from '././Images/lsvimage1.PNG'
import parkingImage from '././Images/lsvimage2.PNG'
import safetyImage from '././Images/lsvimage7.jpg'

import damageImage from '././Images/lsvimage4.PNG'
import chargingImage from '././Images/lsvimage5.PNG'
import dirtRoadImage from '././Images/lsvimage5.PNG'
const LSVRulesPage = () => {
  return (
    <Container className="my-5 px-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Walton County LSV Guidelines</h1>
        <p className="lead text-muted">
          Follow these best practices to ensure safety and maximize your experience
        </p>
      </div>

      {/* Section 1: Traffic & Parking */}
      <Card className="mb-5 border-0 shadow-lg">
        <Row className="g-0">
          <Col md={5}>
            <Image src={trafficImage} alt="Traffic rules" fluid className="h-100 rounded-start" />
          </Col>
          <Col md={7}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <FaCar className="fs-1 text-primary me-3" />
                <h2 className="mb-0">Traffic & Parking Rules</h2>
              </div>
              <div className="alert alert-warning mb-4">
                <h5 className="alert-heading d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" /> MOVE OVER FOR TRAFFIC
                </h5>
                <p className="mb-0">Try not to have a long line of cars behind you</p>
              </div>
              
              <Row className="align-items-center mb-4">
                <Col xs={4}>
                  <Image src={parkingImage} alt="Parking example" fluid rounded />
                </Col>
                <Col xs={8}>
                  <h5>Parking Guidelines</h5>
                  <p className="mb-0">
                    <strong>DOUBLE PARK WITH OTHER CARTS WITHIN THE LINES</strong> - 
                    Parking over the line may result in a ticket from Walton County Sheriff!
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Section 2: Safety & Operation */}
      <Card className="mb-5 border-0 shadow-lg">
        <Row className="g-0 flex-md-row-reverse">
          <Col md={5}>
            {/* <Image src={safetyImage} alt="Safety rules" fluid className="h-100 rounded-start" /> */}
            <Image 
  src={safetyImage}
  width={600}  // Add approximate dimensions
  height={400}
  alt="Safety rules"
  className="h-100 rounded-start"
/>
          </Col>
          <Col md={7}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <FaExclamationTriangle className="fs-1 text-danger me-3" />
                <h2 className="mb-0">Safety & Operation</h2>
              </div>
              
              <div className="alert alert-danger mb-4">
                <h5 className="alert-heading">MUST BE 21 OR OLDER TO DRIVE</h5>
              </div>
              
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="d-flex align-items-start py-3">
                  <FaBatteryThreeQuarters className="text-primary me-3 mt-1" />
                  <div>
                    <strong>After Dark:</strong> Bring charging equipment when taking the cart out after dark
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-start py-3">
                  <FaExclamationTriangle className="text-danger me-3 mt-1" />
                  <div>
                    <strong>Roof Safety:</strong> DO NOT STRAP ANYTHING ON THE ROOF
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-start py-3">
                  <FaExclamationTriangle className="text-danger me-3 mt-1" />
                  <div>
                    <strong>Tow Mode:</strong> DO NOT PUSH, PULL, OR TOW YOUR LSV WITHOUT IT BEING IN TOW MODE
                  </div>
                </ListGroup.Item>
              </ListGroup>
              
              <Row className="align-items-center mb-3">
                <Col xs={4}>
                  <Image src={chargingImage} alt="Charging the cart" fluid rounded />
                </Col>
                <Col xs={8}>
                  <h5>Battery Maintenance</h5>
                  <p>CHARGE ELECTRIC CARTS WHEN NOT IN USE, even if you feel you have plenty of charge.</p>
                </Col>
              </Row>
              
              <Row className="align-items-center">
                <Col xs={4}>
                  <Image src={dirtRoadImage} alt="Dirt road" fluid rounded />
                </Col>
                <Col xs={8}>
                  <h5>Dirt Road Precautions</h5>
                  <p>
                    GO SLOW ON DIRT ROADS (especially in "NO SEAGROVE" areas). 
                    Speeding damages the suspension and makes the cart excessively dirty.
                    <small className="d-block text-muted mt-1">East Grove Ave., Holly St, Azalea Ave, Gemelli St, etc.</small>
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Section 3: Damage Inspection */}
      <Card className="border-0 shadow-lg">
        <Row className="g-0">
          <Col md={5}>
            <Image src={damageImage} alt="Damage inspection" fluid className="h-100 rounded-start" />
          </Col>
          <Col md={7}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <FaCamera className="fs-1 text-success me-3" />
                <h2 className="mb-0">Damage Inspection</h2>
              </div>
              
              <div className="alert alert-info mb-4">
                <h5 className="alert-heading">CHECK FOR DAMAGE UPON RECEIVING THE CART</h5>
                <p className="mb-0">Take pictures of any existing damage before use</p>
              </div>
              
              <h5 className="mb-3">Common Damage Areas to Document:</h5>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">1</span>
                      All sides of cart
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">2</span>
                      Rim damage (chipping/scuffing)
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">3</span>
                      Scratched roof
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">4</span>
                      Cracked plastics
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">5</span>
                      Cracked windshield
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">6</span>
                      Any and all damages
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="d-flex align-items-center">
                  <FaExclamationTriangle className="text-danger me-2" />
                  Important Note
                </h6>
                <p className="mb-0">
                  Documenting existing damage protects you from being held responsible for pre-existing issues.
                </p>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default LSVRulesPage
