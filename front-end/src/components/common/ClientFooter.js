import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white">
            <div className="container">
                <div className="footer-content row">
                    <div className="footer-section col-md-6">
                        <h5>About Apple Shop</h5>
                        <p>3T-Shop is an authorized dealer of Apple products.</p>
                        <img src="http://localhost:8080/contents/image/others/logo.png" alt="3T-Shop Logo" style={{ maxWidth: '150px', marginTop: '10px' }} />
                    </div>
                    <div className="footer-section col-md-6">
                        <h5>Contact Us</h5>
                        <ul className="list-unstyled">
                            <li><i className="bi bi-geo-alt"></i> 123 ABC Street, XYZ District, Ho Chi Minh City</li>
                            <li><i className="bi bi-telephone"></i> 0766-933-787</li>
                            <li><i className="bi bi-envelope"></i> tam.ha.cm.ag@gmail.com</li>
                        </ul>
                        <div className="social-icons">
                            <a href="#" className="text-white me-2"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="text-white me-2"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="text-white me-2"><i className="bi bi-youtube"></i></a>
                            <a href="#" className="text-white"><i className="bi bi-tiktok"></i></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom text-center mt-3">
                    <p>&copy; 2024 3T-Shop. All rights reserved.</p>
                    <p>Nguyễn Chí Tâm - Nguyễn Văn Thành - Lê Duy Thông</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
