import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [tempProductDiscounts, setTempProductDiscounts] = useState([]);
  const [productsToDelete, setProductsToDelete] = useState([]);

  const [formData, setFormData] = useState({
    discountCode: '',
    description: '',
    discountType: 'FIXED',
    discountValue: 0,
    startDate: '',
    endDate: '',
    minOrderValue: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    discountScope: 'ORDER',
  });

  useEffect(() => {
    fetchDiscounts();
    fetchProducts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/discounts');
      setDiscounts(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchDiscountProducts = async (discountId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/discounts/${discountId}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching discount products:', error);
      return [];
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedDiscount(null);
    setTempProductDiscounts([]);
    setProductsToDelete([]);
    setFormData({
      discountCode: '',
      description: '',
      discountType: 'FIXED',
      discountValue: 0,
      startDate: '',
      endDate: '',
      minOrderValue: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      discountScope: 'ORDER',
    });
  };

  const handleShow = async (discount = null) => {
    if (discount) {
      setSelectedDiscount(discount);
      if (discount.discountScope === 'PRODUCT') {
        const products = await fetchDiscountProducts(discount.id);
        setTempProductDiscounts(products);
      }
      setFormData({
        ...discount,
        startDate: discount.startDate.split('T')[0],
        endDate: discount.endDate.split('T')[0],
        minOrderValue: discount.minOrderValue || 0,
        maxDiscountAmount: discount.maxDiscountAmount || 0
      });
    } else {
      setTempProductDiscounts([]);
    }
    setShowModal(true);
  };

  const handleAddProduct = (product) => {
    const exists = tempProductDiscounts.some(p => p.productId === product.id);
    if (!exists) {
      setTempProductDiscounts([...tempProductDiscounts, {
        id: `temp-${Date.now()}`,
        product: product,
        productId: product.id
      }]);
    }
    setShowProductModal(false);
  };

  const handleRemoveProduct = (productToRemove) => {
    if (productToRemove.id.toString().startsWith('temp-')) {
      setTempProductDiscounts(tempProductDiscounts.filter(p => p.id !== productToRemove.id));
    } else {
      setProductsToDelete([...productsToDelete, productToRemove.id]);
      setTempProductDiscounts(tempProductDiscounts.filter(p => p.id !== productToRemove.id));
    }
  };

  const handleDelete = async (discountId) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await axios.delete(`http://localhost:8080/api/discounts/${discountId}`);
        fetchDiscounts();
      } catch (error) {
        console.error('Error deleting discount:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let discountId;
      const endpoint = formData.discountScope === 'ORDER' ? 'order' : 'product';
      
      if (selectedDiscount) {
        await axios.put(`http://localhost:8080/api/discounts/${endpoint}/${selectedDiscount.id}`, formData);
        discountId = selectedDiscount.id;
      } else {
        const response = await axios.post(`http://localhost:8080/api/discounts/${endpoint}`, formData);
        discountId = response.data.id;
      }

      if (formData.discountScope === 'PRODUCT') {
        // Handle product deletions
        for (const productDiscountId of productsToDelete) {
          await axios.delete(`http://localhost:8080/api/discounts/${discountId}/products/${productDiscountId}`);
        }

        // Handle adding new products
        const productsToAdd = tempProductDiscounts
          .filter(p => p.id.toString().startsWith('temp-'))
          .map(p => ({ productId: p.productId }));

        if (productsToAdd.length > 0) {
          await axios.post(`http://localhost:8080/api/discounts/${discountId}/products`, productsToAdd);
        }
      }

      fetchDiscounts();
      handleClose();
    } catch (error) {
      console.error('Error saving discount:', error);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-tag-fill me-2"></i>
            Discount Management
          </span>
        </div>
      </nav>
  
      <div className="container-fluid py-4">
        <div className="row g-4">
          {/* Discount Statistics Cards */}
          <div className="col-md-4">
            <div className="card border-0 bg-primary bg-gradient text-white shadow h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">
                      Total Discounts
                    </h6>
                    <h2 className="display-4 mb-0 fw-bold">{discounts.length}</h2>
                  </div>
                  <div className="p-3 bg-white bg-opacity-25 rounded-circle">
                    <i className="bi bi-tags fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="col-md-4">
            <div className="card border-0 bg-success bg-gradient text-white shadow h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">
                      Active Discounts
                    </h6>
                    <h2 className="display-4 mb-0 fw-bold">
                      {discounts.filter(d => new Date(d.endDate) >= new Date()).length}
                    </h2>
                  </div>
                  <div className="p-3 bg-white bg-opacity-25 rounded-circle">
                    <i className="bi bi-check-circle fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="col-md-4">
            <div className="card border-0 bg-info bg-gradient text-white shadow h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">
                      Product Discounts
                    </h6>
                    <h2 className="display-4 mb-0 fw-bold">
                      {discounts.filter(d => d.discountScope === 'PRODUCT').length}
                    </h2>
                  </div>
                  <div className="p-3 bg-white bg-opacity-25 rounded-circle">
                    <i className="bi bi-box fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Discounts Table Card */}
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-table me-2"></i>
                    Discounts List
                  </h5>
                  <button className="btn btn-primary" onClick={() => handleShow()}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Create New Discount
                  </button>
                </div>
  
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Scope</th>
                        <th>Period</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {discounts.map((discount) => (
                        <tr key={discount.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-ticket-perferated me-2 text-muted"></i>
                              {discount.discountCode}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${discount.discountType === 'FIXED' ? 'bg-success' : 'bg-primary'}`}>
                              {discount.discountType}
                            </span>
                          </td>
                          <td>{discount.discountValue}</td>
                          <td>
                            <span className={`badge ${discount.discountScope === 'ORDER' ? 'bg-info' : 'bg-warning'}`}>
                              {discount.discountScope}
                            </span>
                          </td>
                          <td>{`${discount.startDate.split('T')[0]} to ${discount.endDate.split('T')[0]}`}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleShow(discount)}>
                              <i className="bi bi-pencil-square me-1"></i>
                              Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(discount.id)}>
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Discount Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedDiscount ? 'Edit Discount' : 'Create Discount'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.discountCode}
                    onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Type</Form.Label>
                  <Form.Select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="FIXED">Fixed</option>
                    <option value="PERCENTAGE">Percentage</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Value</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Scope</Form.Label>
                  <Form.Select
                    value={formData.discountScope}
                    onChange={(e) => setFormData({ ...formData, discountScope: e.target.value })}
                    disabled={selectedDiscount}
                  >
                    <option value="ORDER">Order</option>
                    <option value="PRODUCT">Product</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Usage Limit</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Order Value</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: parseFloat(e.target.value) })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Discount Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: parseFloat(e.target.value) })}
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.discountScope === 'PRODUCT' && (
              <div className="mt-3">
                <h5>Products</h5>
                <Button variant="success" size="sm" onClick={() => setShowProductModal(true)}>
                  Add Product
                </Button>
                <Table className="mt-2" size="sm">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tempProductDiscounts
                      .filter(pd => !productsToDelete.includes(pd.id))
                      .map((pd) => (
                        <tr key={pd.id}>
                          <td>{pd.product.name}</td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRemoveProduct(pd)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            )}

            <div className="mt-3">
              <Button variant="primary" type="submit">
                Save Discount
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Product Selection Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddProduct(product)}
                    >
                      Add
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
};


export default DiscountManagement;