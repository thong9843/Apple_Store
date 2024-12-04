import React, { useState, useEffect } from 'react';
import { Card, Button, Collapse, Badge, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/orders/user/${user.id}`);
      const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDeliveryConfirmation = async (orderId) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=DELIVERED`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleReview = (productVariantId) => {
    navigate('/reviews', {
      state: {
        productVariantId,
        userId: user.id
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'PENDING': 'warning',
      'SHIPPED': 'info',
      'DELIVERED': 'success',
      'CANCELLED': 'danger'
    };
    return variants[status] || 'secondary';
  };

  const renderShippingInfo = (order) => {
    if (!order.shippingAddress) return null;
    const address = order.shippingAddress;

    return (
      <Card className="mb-3 border-0 bg-light">
        <Card.Body>
          <h6 className="mb-3">
            <i className="bi bi-geo-alt me-2"></i>
            Shipping Information
          </h6>
          <div className="ms-4">
            <p className="mb-1">{address.address}</p>
            <p className="mb-1">{`${address.city}, ${address.state} ${address.postalCode}`}</p>
            <p className="mb-1">{address.country}</p>
            <p className="mb-0">
              <i className="bi bi-telephone me-2"></i>
              {address.phone}
            </p>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderOrderItems = (order) => {
    return order.orderItems.map((item, index) => (
      <Card className="mb-2" key={index}>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <h6 className="mb-1">{item.productVariant.product.name}</h6>
              <p className="mb-1 text-muted">Variant: {item.productVariant.variantName}</p>
              <p className="mb-0 text-muted">Quantity: {item.quantity}</p>
            </Col>
            <Col md={3}>
              <p className="mb-0 fw-bold">${item.price.toFixed(2)}</p>
            </Col>
            <Col md={3} className="text-end">
              {order.orderStatus === 'DELIVERED' && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleReview(item.productVariant.id)}
                >
                  Write Review
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <Container className="py-4" style={{ minHeight: '100vh' }}>
      <h2 className="mb-4">Order History</h2>
      {orders.map((order) => (
        <Card key={order.id} className="mb-3">
          <Card.Header 
            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            style={{ cursor: 'pointer' }}
            className="bg-white"
          >
            <Row className="align-items-center">
              <Col md={7}>
                <div className="d-flex align-items-center mb-2">
                  <h5 className="mb-0">
                    <i className="bi bi-box me-2"></i>
                    Order #{order.id}
                  </h5>
                </div>
                <p className="mb-1 text-muted">
                  <i className="bi bi-calendar me-2"></i>
                  {formatDate(order.createdAt)}
                </p>
                <p className="mb-1">Items: {order.orderItems?.length || 0}</p>
                <p className="mb-1 fw-bold">Total: ${order.total.toFixed(2)}</p>
                {order.discountTotal > 0 && (
                  <p className="mb-0 text-success">
                    Discount: ${order.discountTotal.toFixed(2)}
                  </p>
                )}
              </Col>
              <Col md={5} className="text-end">
                <div className="mb-2">
                  <Badge 
                    bg={getStatusBadgeVariant(order.orderStatus)} 
                    className="me-2 p-2"
                  >
                    <i className="bi bi-truck me-1"></i>
                    {order.orderStatus}
                  </Badge>
                  <Badge 
                    bg={order.paymentConfirm === 'PAID' ? 'success' : 'danger'} 
                    className="me-2 p-2"
                  >
                    <i className="bi bi-credit-card me-1"></i>
                    {order.paymentConfirm}
                  </Badge>
                </div>
                {order.orderStatus === 'SHIPPED' && (
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeliveryConfirmation(order.id);
                    }}
                  >
                    Confirm Delivery
                  </Button>
                )}
                <div className="mt-2">
                  <i className={`bi bi-chevron-${expandedOrder === order.id ? 'up' : 'down'}`}></i>
                </div>
              </Col>
            </Row>
          </Card.Header>
          <Collapse in={expandedOrder === order.id}>
            <div>
              <Card.Body>
                {renderShippingInfo(order)}
                <h6 className="mb-3">
                  <i className="bi bi-basket me-2"></i>
                  Order Items
                </h6>
                {order.orderItems && order.orderItems.length > 0 ? (
                  renderOrderItems(order)
                ) : (
                  <p className="text-muted">No items in this order</p>
                )}
              </Card.Body>
            </div>
          </Collapse>
        </Card>
      ))}
    </Container>
  );
};

export default OrderHistory;