import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; 
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaWhatsapp, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    const iconStyle = { fontSize: '2rem' }; // Adjust the size as needed

    return (
        <>
        <footer className="footer  py-5 text-light">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h5 className="footer-title">Contact Information</h5>
                        <p><FaEnvelope /> Email: <a className="text-decoration-none text-light" href="mailto:abdessamad.abkhar22@gmail.com">abdessamad.abkhar22@gmail.com</a></p>
                        <p><FaPhone /> Phone: <a className="text-decoration-none text-light" href="tel:+212609645722">+212609645722</a></p>
                        <p><FaMapMarkerAlt /> Address: CASABLANCA, SIDIMOUMEN, LGROUNE</p>
                    </div>
                    <div className="col-md-6">
                        <h5 className="footer-title">Follow Us</h5>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/abdo.eagle.75">
                            <FaFacebook style={iconStyle} className="fa-lg text-light mx-1" />
                        </a>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/abdessamad_abakhar/">
                            <FaInstagram style={iconStyle} className="fa-lg text-light mx-1" />
                        </a>
                        <a href="tel:+212609645722">
                            <FaWhatsapp style={iconStyle} className="fa-lg text-light mx-1" />
                        </a>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/abakhar-abdessamad-735b18176/">
                            <FaLinkedin style={iconStyle} className="fa-lg text-light mx-1" />
                        </a>
                    </div>
                </div>
                <hr className="bg-light" />
                <div className="text-center">
                    <p className="mb-0">Created By: ABAKHAR ABDESSAMAD</p>
                    <p className="mb-0">&copy;2024 All rights reserved.</p>
                </div>
            </div>
        </footer>
        </>
    );
}

export default Footer;
