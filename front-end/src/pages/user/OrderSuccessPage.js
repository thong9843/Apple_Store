import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import successAnimation from './successAnimation.json';
import { Container, Card, Button } from 'react-bootstrap';

const OrderSuccessPage = () => {
  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh'}}>
      <Card className="text-center p-4 shadow" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
        <div style={{ maxWidth: '150px', margin: '0 auto' }}>
          <Lottie options={defaultOptions} height={150} width={150} />
        </div>
        
        <Card.Body>
          <Card.Title className="mb-3">
            <h2 className="text-success">Order Successful!</h2>
          </Card.Title>
          <Card.Text className="text-muted mb-4">
            Thank you for your order. We will process your order immediately.
          </Card.Text>
          
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              as={Link} 
              to="/"
              className="mb-2"
              style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
            >
              Go back to Homepage
            </Button>
            
            <Button 
              variant="outline-primary" 
              as={Link} 
              to="/order-history"
              
            >
              View Orders
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderSuccessPage;
