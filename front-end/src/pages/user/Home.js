import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/Home.css"
import axios from 'axios';

const Home = () => {
  const [topProducts, setTopProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:8080/api/orders');
        const orders = ordersResponse.data;

        // Get the current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Filter orders to only include those from the current month
        const currentMonthOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });

        // Fetch product variants
        const variantsResponse = await axios.get('http://localhost:8080/api/product-variants');
        const variants = variantsResponse.data;

        // Count purchases of each product variant in the current month
        const variantPurchaseCounts = {};
        currentMonthOrders.forEach(order => {
          order.orderItems?.forEach(item => {
            variantPurchaseCounts[item.productVariantId] = (variantPurchaseCounts[item.productVariantId] || 0) + item.quantity;
          });
        });

        // Get top 4 products based on purchase count
        const topVariants = variants
          .map(variant => ({
            ...variant,
            purchaseCount: variantPurchaseCounts[variant.id] || 0
          }))
          .sort((a, b) => b.purchaseCount - a.purchaseCount)
          .slice(0, 4);

        // Fetch images for the top variants
        const topVariantsWithImages = await Promise.all(
          topVariants.map(async variant => {
            const imageResponse = await axios.get(`http://localhost:8080/api/product-images/variant/${variant.id}`);
            return {
              ...variant,
              imageUrl: imageResponse.data[0]?.imageUrl
            };
          })
        );

        setTopProducts(topVariantsWithImages); // Set the top products state
      } catch (error) {
        console.error('Error fetching top products:', error);
        
        // Fallback in case of an error - show first 4 variants
        try {
          const variantsResponse = await axios.get('http://localhost:8080/api/product-variants');
          const variants = variantsResponse.data.slice(0, 4);
          
          const variantsWithImages = await Promise.all(
            variants.map(async variant => {
              const imageResponse = await axios.get(`http://localhost:8080/api/product-images/variant/${variant.id}`);
              return {
                ...variant,
                imageUrl: imageResponse.data[0]?.imageUrl
              };
            })
          );
          
          setTopProducts(variantsWithImages);
        } catch (error) {
          console.error('Error fetching fallback products:', error);
        }
      }
    };

    fetchTopProducts(); // Fetch data when component mounts
  }, []); // Empty dependency array means this runs only once

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to product detail page
  };

  return (
    <div style={{ minHeight: '100vh'}}>
      {/* Banner Carousel */}
      <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src='http://localhost:8080/contents/image/banner/banner1.webp' className="d-block w-100" alt="Banner 1" />
          </div>
          <div className="carousel-item">
            <img src='http://localhost:8080/contents/image/banner/banner2.webp' className="d-block w-100" alt="Banner 2" />
          </div>
          <div className="carousel-item">
            <img src='http://localhost:8080/contents/image/banner/banner3.webp' className="d-block w-100" alt="Banner 3" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      
      {/* Top Products Section */}
      <section className="container my-5">
        <h3 className="text-center mb-4">Top Products of the Month</h3>
        <div className="row">
          {topProducts.map((product) => (
            <div key={product.id} className="col-6 col-lg-3 col-sm-6 mb-4 d-flex">
              <div 
                className="card category-card w-100" 
                onClick={() => handleProductClick(product.product.id)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={`http://localhost:8080${product.imageUrl}`} 
                  className="card-img-top" 
                  alt={product.product.name} 
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{product.product.name}</h5>
                  <p className="card-text">{product.variantName}</p>
                  <p className="card-text text-danger fw-bold">${product.price.toFixed(2)}</p>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents click from triggering parent onClick
                      handleProductClick(product.product.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
