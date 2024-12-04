import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Star, StarFill } from 'react-bootstrap-icons';
import axios from 'axios';

const ProductReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productVariantId, userId } = location.state || {};
  
  const [productData, setProductData] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productVariantId) {
      fetchProductData();
    }
  }, [productVariantId]);

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/product-variants/${productVariantId}`);
      setProductData(response.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError('Failed to load product information');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!review.trim()) {
      setError('Please write a review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await axios.post(`http://localhost:8080/api/reviews/${productData.product.id}`, {
        userId: userId,
        rating: rating,
        review: review
      });
      
      // Navigate back to order history after successful submission
      navigate('/order-history', { 
        state: { message: 'Review submitted successfully!' }
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!productVariantId || !userId) {
    return (
      <Container className="py-4">
        <Card>
          <Card.Body>
            <h5>Error: Missing required information</h5>
            <p>Please access this page through the Order History.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4>Write a Review</h4>
        </Card.Header>
        <Card.Body>
          {productData && (
            <div className="mb-4">
              <h5>{productData.product.name}</h5>
              <p className="text-muted">
                Variant: {productData.variantName}
              </p>
            </div>
          )}

          <Form onSubmit={handleSubmitReview}>
            <Form.Group className="mb-4">
              <Form.Label>Rating</Form.Label>
              <div className="d-flex align-items-center">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="me-2"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoverRating(index)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(index)}
                  >
                    {index <= (hoverRating || rating) ? (
                      <StarFill className="text-warning" size={30} />
                    ) : (
                      <Star className="text-warning" size={30} />
                    )}
                  </div>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here..."
              />
            </Form.Group>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <Row className="mt-4">
              <Col>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/order-history')}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductReview;