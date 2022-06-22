import React from 'react';
import SortBlockComponent from "../components/common/sortBlockComponent";
import { ASSETS } from "../constants/Paths";
import CategoryHoverComponent from "../components/common/categoryHoverComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {CATEGORY_PAGE} from "../constants/routePaths";
import CategoriesPageItemComponent from "../components/category/categoriesPageItemComponent";


export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [sortedCategories, setSortedCategories] = useState(0);

    useEffect(() => {
        const fetchcategories = async () => {
            const res = await axios.get("categories/all");
            setCategories(res.data);
        };
        fetchcategories();
    }, []);

    const tabChanged = (value) => {
        setSortedCategories(value);
    }

    return (
        <div className="main-wrapper">
            <div className="main-container safe-area">
                <div className="categories-page-root">
                    <div className="categories-page-wrapper">
                        <div className="head-container">
                            <div className="title-item">
                                <h1>KATEGORİLER</h1>
                            </div>
                            <SortBlockComponent items={["Popüler", "Alfabetik"]} tabChanged={tabChanged}/>
                        </div>
                        <div className="categories-block">
                            {categories && sortedCategories === 1 && categories.sort((a,b) => a.name.localeCompare(b.name)).map((cat) => (
                                <CategoriesPageItemComponent
                                    key={cat._id}
                                    cat={cat}
                                />
                            ))}
                            {categories && sortedCategories === 0 && categories.sort((a,b) => b.followers.length - a.followers.length).map((cat) => (
                                <CategoriesPageItemComponent
                                    key={cat._id}
                                    cat={cat}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


