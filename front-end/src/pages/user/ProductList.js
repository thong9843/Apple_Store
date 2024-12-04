import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { getFullUrl } from '../../App';

const ProductList = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || null);

  useEffect(() => {
    fetchCategories();
    if (categoryId) {
      fetchProductsByCategory(categoryId);
    } else {
      fetchProducts();
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(getFullUrl('/api/categories'));
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(getFullUrl('/api/products'));
      const productsWithImages = await Promise.all(
        response.data.map(async (product) => {
          const imagesResponse = await axios.get(getFullUrl(`/api/product-images/product/${product.id}`));
          return {
            ...product,
            firstImage: imagesResponse.data[0]?.imageUrl ? getFullUrl(imagesResponse.data[0].imageUrl) : null
          };
        })
      );
      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(getFullUrl(`/api/products/category/${categoryId}`));
      const productsWithImages = await Promise.all(
        response.data.map(async (product) => {
          const imagesResponse = await axios.get(getFullUrl(`/api/product-images/product/${product.id}`));
          return {
            ...product,
            firstImage: imagesResponse.data[0]?.imageUrl ? getFullUrl(imagesResponse.data[0].imageUrl) : null
          };
        })
      );
      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

  return (
    <div className="container mt-4 vh" style={{ minHeight: '100vh'}}>
      <div className="row mb-4">
        <div className="col">
          <div className="btn-group">
            <button
              className={`btn ${!selectedCategory ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory(null)}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        {products.map(product => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={product.firstImage || 'placeholder-image-url'}
                className="card-img-top"
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">${product.price}</p>
                <Link to={`/product/${product.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
