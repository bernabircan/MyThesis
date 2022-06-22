import 'react-toastify/dist/ReactToastify.css';
import {LOCAL_ASSETS} from "../constants/Paths";
import {Link} from "react-router-dom";
import FooterComponent from "../components/landing/footerComponent";
import React from "react";

export default function ContactUsPage() {

    return (
        <div className="main-wrapper">
            <div className="main-container safe-area">
                <div className="left-block">
                    <div className="text-page-root content-container">
                        <div className="title-item">
                            <h1>bize ulaşın</h1>
                        </div>
                        <div className="text-container">
                            <p>
                                bütün istek, öneri, bildiri ve şikayetleriniz için <span>egediyoinfo@gmail.com</span> adresinden bize ulaşabilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="right-block">
                    <FooterComponent />
                </div>
            </div>
        </div>
    );

}

