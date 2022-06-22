import 'react-toastify/dist/ReactToastify.css';
import {LOCAL_ASSETS} from "../constants/Paths";
import {Link} from "react-router-dom";
import FooterComponent from "../components/landing/footerComponent";
import React from "react";
import {PROFILE_PAGE} from "../constants/routePaths";

export default function AboutUsPage() {

    return (
        <div className="main-wrapper">
            <div className="main-container safe-area">
                <div className="left-block">
                    <div className="text-page-root content-container">
                        <div className="title-item">
                            <h1>hakkımızda</h1>
                        </div>
                        <div className="text-container">
                            <p>
                                Egediyo ile Ege üniversitesi öğrencilerinin üniversite toplulukları, kampüs yaşamı,
                                sosyal ve akademik etkinlikler, ev-yurt ilanları ve diğer bir çok kategorideki konuda
                                paylaşım yapabilecekleri ve bilgi sahibi olabilecekleri bir platform oluşturmayı hedefledik.
                            </p>
                            <p>
                                Temel amacımız, üniversitemizdeki öğrenci iletişiminin ortak bir platformda toplanabilmesini,
                                bilgiyi paylaşmak ve bilgiye ulaşmanın kolaylaşmasını sağlamaktır.
                            </p>

                            <p className="created-by">
                                egediyo,
                                <Link to={ PROFILE_PAGE + "dogukan"}> @dogukan </Link>
                                 &
                                <Link to={ PROFILE_PAGE + "berna"}> @berna </Link>
                                tarafından geliştirilmiştir.
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

