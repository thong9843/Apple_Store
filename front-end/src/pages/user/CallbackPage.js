import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import successAnimation from './successAnimation.json';
import failureAnimation from './failureAnimation.json';
import axios from 'axios';
import { Container, Card, Button } from 'react-bootstrap';

const CallbackPage = () => {
  const location = useLocation();
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [statusIcon, setStatusIcon] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const data = {
      vnp_Amount: queryParams.get('vnp_Amount'),
      vnp_BankCode: queryParams.get('vnp_BankCode'),
      vnp_BankTranNo: queryParams.get('vnp_BankTranNo'),
      vnp_CardType: queryParams.get('vnp_CardType'),
      vnp_OrderInfo: queryParams.get('vnp_OrderInfo'),
      vnp_PayDate: queryParams.get('vnp_PayDate'),
      vnp_ResponseCode: queryParams.get('vnp_ResponseCode'),
      vnp_TmnCode: queryParams.get('vnp_TmnCode'),
      vnp_TransactionNo: queryParams.get('vnp_TransactionNo'),
      vnp_TransactionStatus: queryParams.get('vnp_TransactionStatus'),
      vnp_TxnRef: queryParams.get('vnp_TxnRef'),
      vnp_SecureHash: queryParams.get('vnp_SecureHash')
    };

    // Call the API
    axios.get(`http://tabbyneko.com:8080/api/orders/vnpay-callback`, { params: data })
      .then(response => {
        setTransactionStatus(response.data.paymentStatus);
        setPaymentStatus(response.data.paymentStatus);
        if (response.data.responseCode === '00') {
            setTransactionStatus(response.data.paymentStatus); // Should be "Transaction Successful"
            setStatusIcon(successAnimation);
        } else {
            setTransactionStatus("Transaction Failed");
            setStatusIcon(failureAnimation);
        }
        
      })
      .catch(error => {
        setTransactionStatus("Transaction Failed");
        setStatusIcon(failureAnimation);
        console.error("Error fetching transaction status", error);
      });
  }, [location.search]);

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: statusIcon,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="text-center p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ maxWidth: '150px', margin: '0 auto' }}>
          {statusIcon && <Lottie options={defaultOptions} height={150} width={150} />}
        </div>
        <Card.Body>
          <Card.Title>{transactionStatus}</Card.Title>
          <Card.Text>{paymentStatus}</Card.Text>
          <Button className="mb-2" variant="primary" as={Link} to="/">Go back to main page</Button>
          <Button 
              variant="outline-primary" 
              as={Link} 
              to="/order-history"
              
            >
              View Orders
            </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CallbackPage;
