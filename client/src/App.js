import React, { Fragment } from "react";
import HeaderComponent from "./components/layout/header/headerComponent";
import LoginPage from "./pages/loginPage";
import LandingPage from "./pages/landingPage";
import CategoriesPage from "./pages/categoriesPage";
import CategoryPage from "./pages/categoryPage";
import SearchPage from "./pages/searchPage";
import ProfilePage from "./pages/profilePage";
import PostPage from "./pages/postPage";
import Activated from "./components/login/Activated";
import ResetPassPage from "./pages/resetPassPage";
import RegisterConfirmationPage from "./pages/registerConfirmationPage";
import AboutUsPage from "./pages/aboutUsPage";

import {CONTACT_US_PAGE, LANDING_PAGE} from "./constants/routePaths";
import {SEARCH_PAGE} from "./constants/routePaths";
import {PROFILE_PAGE} from "./constants/routePaths";
import {CATEGORIES_PAGE} from "./constants/routePaths";
import {CATEGORY_PAGE} from "./constants/routePaths";
import {POST_PAGE} from "./constants/routePaths";
import {RESET_PASSWORD_PAGE}  from "./constants/routePaths";
import {REGISTER_CONFIRM_PAGE} from "./constants/routePaths";
import {ABOUT_US_PAGE} from "./constants/routePaths";

import { AuthContext } from "./context/AuthContext";
import { SearchContext } from "./context/SearchContext";
import { SocketContext } from "./context/SocketContext";
import { useContext, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,//routes diger adı
    Route,
} from "react-router-dom";
import ContactUsPage from "./pages/contactUsPage";

function App() {
    const { user } = useContext(AuthContext);
    const { query } = useContext(SearchContext);

    const { socket, dispatch, users } = useContext(SocketContext);
    //console.log("cur",user);
    useEffect(() => {
        if (socket) {
            socket.emit("addUser", user?._id);

        }
        socket.on("getUsers", usersIdList => {
            dispatch({ type: "GET_ONLINE_USERS", payload: usersIdList });
        });


    }, [user, socket]);


    return (
        <div>
            <Router>
                {
                    user &&
                    <HeaderComponent />
                }

                <div className="main-root">

                    <Switch>
                        <Route exact path={LANDING_PAGE}>
                            {
                                user ? <LandingPage /> : <LoginPage />
                            }
                        </Route>
                        {/*<Route path="/register">
                            <Register />
                        </Route> */}

                        <Route exact path={SEARCH_PAGE}>
                            {
                                user && <SearchPage query={query} />
                            }
                        </Route>

                        <Route path={PROFILE_PAGE + ":username"}>
                            {
                                user && <ProfilePage />
                            }
                        </Route>

                        <Route path={CATEGORIES_PAGE}>
                            {
                                user && <CategoriesPage />
                            }
                        </Route>

                        <Route path={CATEGORY_PAGE + ":categoryname"}>
                            {
                                user && <CategoryPage />
                            }
                        </Route>

                        <Route path={POST_PAGE + ":postId"}>
                            {
                                user && <PostPage />
                            }
                        </Route>

                        <Route path={RESET_PASSWORD_PAGE + ":resetToken"}>
                            <ResetPassPage />
                        </Route>

                        <Route path={REGISTER_CONFIRM_PAGE + ":confirmToken"}>
                            <RegisterConfirmationPage />
                        </Route>

                        <Route path={ABOUT_US_PAGE}>
                            <AboutUsPage />
                        </Route>

                        <Route path={CONTACT_US_PAGE}>
                            <ContactUsPage/>
                        </Route>

                        <Route path="/activate/:token">
                            <Activated />
                        </Route>

                        <div>
                            <h1>404</h1>
                            <h2>Sayfa Bulunamadı</h2>
                        </div>

                
                    </Switch>
                </div>

            </Router>

        </div>
    );
}

export default App;
