import React from "react";
import {Link} from "react-router-dom";
import {ABOUT_US_PAGE, CONTACT_US_PAGE, LANDING_PAGE, PROFILE_PAGE} from "../../constants/routePaths";


export default function  FooterComponent() {

        return (
            <footer className="footer-root content-container">
                <div className="footer-container">
                    <div className="link-block">
                        <Link to={ABOUT_US_PAGE} className="link-item">
                            hakkımızda
                        </Link>
                        <Link to={CONTACT_US_PAGE} className="link-item">
                            bize ulaşın
                        </Link>
                    </div>

                    <p className="created-by">
                        <Link to={ PROFILE_PAGE + "dogukan"}> @dogukan </Link>
                        &
                        <Link to={ PROFILE_PAGE + "berna"}> @berna </Link>
                        tarafından geliştirilmiştir.
                    </p>
                </div>
            </footer>
        );
    
}


