
import { ASSETS } from "../../constants/Paths";
import FooterComponent from "../landing/footerComponent";



export default function RightBarComponent({ user}) {




    return (
        <div className="right-block">
        <div className="about-me-container content-container">
            <div className="head-title-block">
                <h2>Hakkımda</h2>
            </div>
            <div className="about-me-block">
                <div className="text-item">
                    <p>{user?.desc}</p>
                </div>
                <div className="subs-item">
                    <span className="sub-num">
                        {user?.followingfriends?.length}
                    </span>
                    <span className="text">
                        Arkadaş
                    </span>
                </div>
            </div>
        </div>
        <div className="users-container content-container">
            <div className="head-title-block">
                <h2>Arkadaşlar</h2>
            </div>
            <div className="users-block">

                {
                    friendList.map((user) => (
                        <div className="user-item" key={user._id}>
                            <div className="user">
                                <div className="user-img">
                                    <source media="(min-width: 431px)"
                                        srcSet={user?.profilePicture
                                            ? ASSETS + user.profilePicture
                                            : ASSETS + "person/noAvatar.png"}/>
                                    <source media="(max-width: 431px)"
                                        srcSet={user?.profilePicture
                                            ? ASSETS + user.profilePicture
                                            : ASSETS + "person/noAvatar.png"}/>
                                    <img src={user?.profilePicture
                                        ? ASSETS + user.profilePicture
                                        : ASSETS + "person/noAvatar.png"}
                                        alt="pp" />
                                </div>
                                <a href="#" className="user-name">{user.username}</a>
                                {/*<ProfileHoverComponent user={user} /> */}
                            </div>
                        </div>
                    ))
                }


            </div>
        </div>
        <FooterComponent />
    </div>
    );

}

