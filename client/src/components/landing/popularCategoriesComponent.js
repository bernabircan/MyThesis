import {ASSETS, LOCAL_ASSETS} from "../../constants/Paths";
import CategoryHoverComponent from "../common/categoryHoverComponent";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {CATEGORY_PAGE} from "../../constants/routePaths";
import {CATEGORIES_PAGE} from "../../constants/routePaths";
export default function PopularCategoriesComponent() {

    const [cats, setCats] = useState(null);

    /*useEffect(() => {
        const getCats = async () => {
            const res = await axios.get("/categories/popularcat");
            setCats(res.data);
        }
        getCats();
    }, []);*/

    useEffect(() => {
        const fetchcategories = async () => {
            const res = await axios.get("categories/all");
            setCats(res.data);
        };
        fetchcategories();
    }, []);


    return (
        <div className="content-container popular-categories-container">
            <div className="head-title-block">
                <h2>Popüler Kategoriler</h2>
            </div>
            <div className="categories-block">
                {cats && cats.sort((a,b) => b.followers.length - a.followers.length).slice(0, 5).map((cat) => {
                    return (
                        <div className="category-item" key={cat.name}  >
                            <div className="category"  >
                                <div className="category-img">
                                    <picture>
                                        {
                                            cat?.categoryPath &&
                                            <img src={`${LOCAL_ASSETS}/img/category/${cat?.categoryPath}.jpg`}
                                                 alt={cat?.name} />
                                        }
                                    </picture> 
                                </div>
                                <Link to={CATEGORY_PAGE  + cat.name} className="category-name" >{cat?.name}</Link>
                                {/*{<CategoryHoverComponent category={cat} />}*/}
                            </div>
                        </div>)
                })}
            </div>

            <div className="btn-block">
                <div className="btn-item">
                    <Link to={CATEGORIES_PAGE} className="btn-blue">
                        tüm kategoriler
                    </Link >
                </div>
            </div>
        </div>
    );

}


