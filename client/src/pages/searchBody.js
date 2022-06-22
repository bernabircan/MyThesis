
import {Categories, Posts, Users} from "../dummyData";
import {ASSETS} from "../constants/Paths";
import SubscribeButtonComponent from "../components/common/subscribeButtonComponent";
import PostItemComponent from "../components/post/postItemComponent";
import ProfileHoverComponent from "../components/common/profileHoverComponent";
import HeaderComponent from "../components/layout/header/headerComponent";


export default function SearchBody({ users,posts,categories,query }) {


        return (
            <div>
            <HeaderComponent/>
            <div className="main-wrapper">
                <div className="main-container safe-area">
                    <div className="search-page-root">
                        <div className="search-page-wrapper">
                            <div className="head-container content-container">
                                <h1>
                                    "{query}" için arama sonuçları:
                                </h1>
                            </div>
                            <div className="search-container content-container user">
                                <div className="head-title-block">
                                    <h2>Kullanıcılar</h2>
                                </div>
                                <div className="users-container">
                                    <div className="users-block">
                                        {
                                            users.map((user, index)=>(
                                                <div className="user-item">
                                                    <div className="user">
                                                        <div className="user-img">
                                                            <picture>
                                                                <img src={`${ASSETS}/img/bil-muh.jpg`}
                                                                     alt="bil-muh" />
                                                            </picture>
                                                        </div>
                                                        <a href="#" className="user-name">{user.username}</a>
                                                        {/*<ProfileHoverComponent user={user}/>*/}
                                                    </div>
                                                    <div className="btn-item">
                                                        <SubscribeButtonComponent isSubscriber={false}/>
                                                    </div>
                                                </div>
                                            ))
                                        }  
                                    </div>
                                </div>

                            </div>
                            <div className="search-container content-container categories">
                                <div className="head-title-block">
                                    <h2>Kategoriler</h2>
                                </div>
                                <div className="categories-block">
                                    {
                                        categories.map((category)=>(
                                            <div className="category-item">
                                                <div className="category">
                                                    <div className="category-img">
                                                        <picture>
                                                            <img src={`${ASSETS}/img/bil-muh.jpg`}
                                                                 alt="bil-muh" />
                                                        </picture>
                                                    </div>
                                                    <a href="#" className="category-name">
                                                        {category.name}
                                                    </a>
                                                </div>
                                                <div className="btn-item">
                                                    <SubscribeButtonComponent isSubscriber={false}/>
                                                </div>
                                            </div>
                                        ))
                                         }
                                </div>
                            </div>
                            <div className="search-container posts">
                                <div className="head-title-block">
                                    <h2>Postlar</h2>
                                </div>
                                <div className="posts-container">
                                    {posts.map(p => (
                                        <PostItemComponent key={p.id} post={p}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    
}

