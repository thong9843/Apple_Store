import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getFullUrl } from "../../App";
import "../../styles/Product.css";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [description, setDescription] = useState("");
  const [specifications, setSpecifications] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
    fetchVariants();
    fetchImages();
    fetchReviews();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(getFullUrl(`/api/products/${id}`));
      setProduct(response.data);

      const descResponse = await axios.get(
        getFullUrl(response.data.description)
      );
      setDescription(descResponse.data);

      const specResponse = await axios.get(
        getFullUrl(response.data.specification)
      );
      const parsedSpecs = parseSpecifications(specResponse.data);
      setSpecifications(parsedSpecs);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchVariants = async () => {
    try {
      const response = await axios.get(
        getFullUrl(`/api/product-variants/product/${id}`)
      );
      setVariants(response.data);
      setSelectedVariant(response.data[0]);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        getFullUrl(`/api/product-images/product/${id}`)
      );
      const processedImages = response.data.map((image) => ({
        ...image,
        imageUrl: getFullUrl(image.imageUrl),
      }));
      setImages(processedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        getFullUrl(`/api/reviews/product/${id}`)
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const parseSpecifications = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const extractData = (node) => {
      const result = {};
      for (let child of node.children) {
        if (child.children.length === 0) {
          result[child.tagName] = child.textContent;
        } else if (child.tagName === "StorageOptions") {
          result[child.tagName] = Array.from(child.children).map(
            (option) => option.textContent
          );
        } else {
          result[child.tagName] = extractData(child);
        }
      }
      return result;
    };

    return extractData(xmlDoc.documentElement);
  };

  const SpecificationsTable = ({ specs }) => {
    const renderValue = (value) => {
      if (Array.isArray(value)) {
        return value.join(", ");
      } else if (typeof value === "object") {
        return (
          <table className="nested-table">
            <tbody>
              {Object.entries(value).map(([key, val]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{renderValue(val)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      return value;
    };

    return (
      <div className="specifications-table">
        {Object.entries(specs).map(([section, details]) => (
          <div key={section} className="spec-section">
            <h3>{section}</h3>
            <table className="table table-striped">
              <tbody>
                {typeof details === "object" &&
                  Object.entries(details).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-name">{key}</td>
                      <td className="spec-value">{renderValue(value)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user) {
        alert("Please login first");
        return;
      }

      const params = new URLSearchParams({
        userId: user.id,
        productVariantId: selectedVariant.id,
        quantity: 1,
      });

      await axios.post(getFullUrl(`/api/cart/add?${params.toString()}`));
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  const handleBuyNow = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      alert("Please login first");
      return;
    }

    navigate(
      `/checkout?userId=${user.id}&productVariantId=${selectedVariant.id}`
    );
  };

  if (!product)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  
  
  return (
    <div className="container mt-5" style={{ minHeight: '100vh'}}>
      <div className="row">
        <div className="col-md-6">
          <img
            src={
              images.find((img) => img.variant.id === selectedVariant?.id)
                ?.imageUrl || "placeholder-image-url"
            }
            className="img-fluid"
            alt={product.name}
          />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <h2 className="price">${selectedVariant?.price || product.price}</h2>

          <div className="variants mt-4">
            <h3>Variants</h3>
            {variants.map((variant) => (
              <button
                key={variant.id}
                className={`btn m-1 ${
                  selectedVariant?.id === variant.id
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.variantName}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <button className="btn btn-danger btn-lg m-1" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button
              className="btn btn-outline-primary btn-lg m-1"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "specifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </li>
        </ul>

        <div className="tab-content mt-3">
          {activeTab === "description" && (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          )}
          {activeTab === "specifications" && (
            <div className="specifications-container">
              {specifications ? (
                <SpecificationsTable specs={specifications} />
              ) : (
                <div>Loading specifications...</div>
              )}
            </div>
          )}
          {activeTab === "reviews" && (
            <div>
              {reviews.map((review) => (
                <div key={review.id} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">User ID: {review.userId}</h5>
                    <div
                      className="Stars"
                      style={{ "--rating": review.rating }}
                    >
                      {"★".repeat(review.rating)}
                    </div>
                    <p className="card-text">{review.review}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
