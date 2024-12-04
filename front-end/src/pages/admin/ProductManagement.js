import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variants, setVariants] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      setError("Access denied. Admins only.");
      navigate("/");
    } else {
      fetchProducts();
      fetchCategories();
    }
  }, [navigate]);

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    descriptionFile: null,
    specificationFile: null,
  });

  const [variantForm, setVariantForm] = useState({
    variantName: "",
    price: "",
    stockQuantity: "",
    isAvailable: true,
    imageFile: null,
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setProducts(response.data);
    } catch (err) {
      setError("Error fetching products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (err) {
      setError("Error fetching categories");
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/${productId}`
      );
      setSelectedProduct(response.data);
      setProductForm({
        name: response.data.name,
        price: response.data.price,
        categoryId: response.data.category.id,
        descriptionFile: null,
        specificationFile: null,
      });
    } catch (err) {
      setError("Error fetching product details");
    }
  };

  const fetchVariant = async (variantId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/product-variants/${variantId}`
      );
      setSelectedVariant(response.data);
      setVariantForm({
        variantName: response.data.variantName,
        price: response.data.price,
        stockQuantity: response.data.stockQuantity,
        isAvailable: response.data.isAvailable,
        imageFile: null,
      });
    } catch (err) {
      setError("Error fetching variant details");
    }
  };

  const fetchVariants = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/product-variants/product/${productId}`
      );
      setVariants(response.data);
    } catch (err) {
      setError("Error fetching variants");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/search?query=${searchQuery}`
      );
      setProducts(response.data);
    } catch (err) {
      setError("Error searching products");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(productForm).forEach((key) => {
      if (productForm[key] !== null) {
        formData.append(key, productForm[key]);
      }
    });

    try {
      if (selectedProduct) {
        await axios.put(
          `http://localhost:8080/api/products/${selectedProduct.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:8080/api/products", formData);
      }
      fetchProducts();
      setShowProductModal(false);
      setSelectedProduct(null);
      setProductForm({
        name: "",
        price: "",
        categoryId: "",
        descriptionFile: null,
        specificationFile: null,
      });
    } catch (err) {
      setError("Error saving product");
    }
  };

  const handleVariantSubmit = async (e) => {
    e.preventDefault();
    try {
      let variantId;

      const variantData = {
        variantName: variantForm.variantName,
        price: parseFloat(variantForm.price),
        stockQuantity: parseInt(variantForm.stockQuantity),
        isAvailable: variantForm.isAvailable,
      };

      if (selectedVariant) {
        await axios.put(
          `http://localhost:8080/api/product-variants/${selectedVariant.id}`,
          variantData
        );
        variantId = selectedVariant.id;
      } else {
        const response = await axios.post(
          `http://localhost:8080/api/product-variants/product/${selectedProduct.id}/variant`,
          variantData
        );
        variantId = response.data.id;
      }

      if (variantForm.imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("imageFile", variantForm.imageFile);
        await axios.post(
          `http://localhost:8080/api/product-variants/product/${selectedProduct.id}/variant/${variantId}/image`,
          imageFormData
        );
      }

      fetchVariants(selectedProduct.id);
      setShowVariantModal(false);
      setSelectedVariant(null);
      setVariantForm({
        variantName: "",
        price: "",
        stockQuantity: "",
        isAvailable: true,
        imageFile: null,
      });
    } catch (err) {
      setError("Error saving variant: " + err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${productId}`);
        fetchProducts();
      } catch (err) {
        setError("Error deleting product");
      }
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/product-variants/${variantId}`
        );
        fetchVariants(selectedProduct.id);
      } catch (err) {
        setError("Error deleting variant");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-box-seam me-2"></i>
            Product Management
          </span>
        </div>
      </nav>

      <div className="container-fluid py-4">
        {error && (
          <div className="alert alert-danger shadow-sm mx-4 mt-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <div className="row g-4">
          <div className="col-12 d-flex align-items-center mb-3">
            <input
              type="text"
              className="form-control flex-grow-1 me-2"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="btn btn-outline-primary mx-2"
              onClick={handleSearch}
            >
              <i className="bi bi-search"></i>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedProduct(null);
                setProductForm({
                  name: "",
                  price: "",
                  categoryId: "",
                  descriptionFile: null,
                  specificationFile: null,
                });
                setShowProductModal(true);
              }}
            >
              <i className="bi bi-plus-circle"></i>
            </button>
          </div>

          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title mb-4">
                  <i className="bi bi-box-seam me-2"></i>
                  Products List
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.name}</td>
                          <td>${product.price}</td>
                          <td>{product.category.name}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-info me-2"
                              onClick={() => {
                                fetchProduct(product.id);
                                fetchVariants(product.id);
                                setShowProductModal(true);
                              }}
                            >
                              <i className="bi bi-pencil-square me-1"></i>
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
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

      {/* Product Modal */}
      <div
        className={`modal fade ${showProductModal ? "show" : ""}`}
        style={{ display: showProductModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowProductModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleProductSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={productForm.categoryId}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        categoryId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description File</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        descriptionFile: e.target.files[0],
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Specification File</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        specificationFile: e.target.files[0],
                      })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check-circle me-2"></i>
                  Save Product
                </button>
              </form>

              {selectedProduct && (
                <div className="mt-4">
                  <h5>Product Variants</h5>
                  <button
                    className="btn btn-success mb-3"
                    onClick={() => {
                      setSelectedVariant(null);
                      setVariantForm({
                        variantName: "",
                        price: "",
                        stockQuantity: "",
                        isAvailable: true,
                        imageFile: null,
                      });
                      setShowVariantModal(true);
                    }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Add New Variant
                  </button>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Available</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((variant) => (
                          <tr key={variant.id}>
                            <td>{variant.variantName}</td>
                            <td>${variant.price}</td>
                            <td>{variant.stockQuantity}</td>
                            <td>{variant.isAvailable ? "Yes" : "No"}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-info me-2"
                                onClick={() => {
                                  fetchVariant(variant.id);
                                  setShowVariantModal(true);
                                }}
                              >
                                <i className="bi bi-pencil-square me-1"></i>
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteVariant(variant.id)}
                              >
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Variant Modal */}
      <div
        className={`modal fade ${showVariantModal ? "show" : ""}`}
        style={{ display: showVariantModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedVariant ? "Edit Variant" : "Add New Variant"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowVariantModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleVariantSubmit}>
                <div className="mb-3">
                  <label className="form-label">Variant Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={variantForm.variantName}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        variantName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={variantForm.price}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={variantForm.stockQuantity}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        stockQuantity: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={variantForm.isAvailable}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        isAvailable: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label">Available</label>
                </div>
                <div className="mb-3">
                  <label className="form-label">Variant Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        imageFile: e.target.files[0],
                      })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check-circle me-2"></i>
                  Save Variant
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
