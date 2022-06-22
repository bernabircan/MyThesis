import {ASSETS} from "../../constants/Paths";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import {Link} from "react-router-dom";


export default function CreatPostLbComponent({closeCreatePost, catName}) {
    const {user: currentUser, dispatch} = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [cats, setCats] = useState([]);
    const [selectedCat, setSelectedCat] = useState("genel");
    const [descr, setDescr] = useState("");
    const [extraTextInput, setExtraTextInput] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [isInputErrorActive, setIsInputErrorActive] = useState(false);
    const [isReqErrorActive, setIsReqErrorActive] = useState();
    const [isCategoryRequestActive, setIsCategoryRequestActive] = useState();
    const [isNewPost, setIsNewPost] = useState(false);

    useEffect(() => {
        const get = async () => {
            const res = await axios.get("/categories/all")
            setCats(res.data);
        }
        get();
        if (catName) {
            setSelectedCat(catName);
        }

    }, []);


    const submitShareHandler = async (e) => {
        e.preventDefault();

        if (controlInputs()) {

            let id = "";
            cats.map((c) => {
                if (c.name === selectedCat) {
                    id = c._id
                }
            });

            const newPost = {
                userId: currentUser._id,
                desc: descr,
                categoryId: id,
                extraText: extraTextInput
            };

            if (file) {
                const data = new FormData();
                const fileName = Date.now() + file.name;
                data.append("name", fileName);
                data.append("file", file);
                newPost.img = fileName;

                try {
                    await axios.post("/upload", data);
                } catch (err) {
                }
            }

            try {
                await axios.post("/posts", newPost);
            } catch (err) {
            }

            setSelectedCat("genel");

            setIsNewPost(true);
            setTimeout(() => {
                window.location.reload();
            }, 2100)


        } else {
            setIsInputErrorActive(true);
        }

    };

    const newCategoryCallFunc = async () => {
        if (newCategory === "") {
            setIsReqErrorActive(true);
        } else {
            //buraya yeni kategory talebi call'u gelecek.
            const cateReq = {
                name: newCategory,
                userId: currentUser._id,
            };
            try {
                await axios.post("/categories/req", cateReq);

            } catch (err) {
            }
            setIsReqErrorActive(false);
            setNewCategory("");
        }

    }

    const controlInputs = () => {

        if (descr !== "") {
            return true
        } else {
            return false
        }

    }

    const toggleCategoryRequest = () => {
        setIsCategoryRequestActive(!isCategoryRequestActive);
    }

    return (
        <div className="lb-root create-post-lb-container ">
            {
                !isNewPost &&
                <div className="lb-wrapper">
                    <div className="lb-container content-container">
                        <div className="close-block">
                            <div className="close-item" onClick={closeCreatePost}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                                     fill="#000000">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path
                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="create-post-lb-block">
                            <h2 className="title-item">Gönderi Oluştur</h2>
                            <form onSubmit={submitShareHandler}>
                                <div className={`create-post-lb-item`}>
                                    <span>kategori seç</span>
                                    {catName ?
                                        <select id="categories" name="categories"
                                                value={catName}>
                                            <option value={catName}>{catName}</option>
                                            )
                                        </select>
                                        :
                                        <select id="categories" name="categories"
                                                value={selectedCat}
                                                onChange={(e) => {
                                                    const selected = e.target.value;
                                                    setSelectedCat(selected);
                                                }}>

                                            {cats.map((c) => (
                                                <option key={c._id} value={c.name}>{c.name} </option>))}

                                        </select>
                                    }

                                </div>

                                <div className={`create-post-lb-item ${isCategoryRequestActive ? "active" : ""}`}>
                                <span onClick={toggleCategoryRequest}>
                                    istediğin kategori seçeneklerde yoksa, yeni kategori talebi oluştur
                                    <i>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24"
                                                 width="18px" fill="#000000">
                                                <path d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                                            </svg>
                                        </i>
                                </span>

                                    {(isCategoryRequestActive) &&
                                        <>
                                            <div className="new-category-request">
                                                <div className="login-input-item">
                                                    <input type="text"
                                                           value={newCategory}
                                                           autoFocus="autoFocus"
                                                           placeholder={"talep ettiğin yeni kategorinin adını gir."}
                                                           onChange={(e) => {
                                                               setNewCategory(e.target.value);
                                                           }}/>
                                                </div>
                                                <div className="btn-blue" onClick={newCategoryCallFunc}>talep et</div>
                                            </div>
                                            {((isReqErrorActive !== undefined) && (!isReqErrorActive)) &&
                                                <div className="approved-text">
                                                    <p>kategori isteği başarıyla oluşturuldu.</p>
                                                </div>}
                                            {(isReqErrorActive) &&
                                                <div className="error-text">
                                                    <p>kategori girilmedi, bi' tekrar bak kontrol et.</p>
                                                </div>}
                                        </>
                                    }


                                </div>
                                <div className={`create-post-lb-item`}>
                                    <span>başlık</span>
                                    <div className="login-input-item">
                                        <input type="text"
                                               value={descr}
                                               autoFocus="autoFocus"
                                               placeholder={"gönderi başlığı gir."}
                                               onChange={(e) => {
                                                   setDescr(e.target.value);
                                               }}/>
                                    </div>
                                </div>
                                <div className={`create-post-lb-item`}>
                                    <span>Açıklama</span>
                                    <div className="login-input-item textarea-input-item">
                                        <textarea
                                               value={extraTextInput}
                                               placeholder={"istiyorsan, gönderi açıklaması girebilirsin."}
                                               onChange={(e) => {
                                                   setExtraTextInput(e.target.value);
                                               }}/>
                                    </div>
                                </div>
                                <div className={`create-post-lb-item`}>
                                    <span>görsel ekle</span>
                                    <div className="create-post-lb-input-item">
                                        <input
                                            type="file"
                                            id="file"
                                            accept=".png,.jpeg,.jpg"
                                            onChange={(e) => setFile(e.target.files[0])}/>
                                    </div>
                                </div>
                                <button className="btn-grey" type="submit">gönder</button>
                                {
                                    isInputErrorActive &&
                                    <div className="error-text">
                                        <p>Başlık girilmedi, bi' tekrar bak kontrol et.</p>
                                    </div>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            }

            {
                isNewPost &&
                <div className="success-msj-item content-container">
                    <p>yeni gönderi başarıyla oluşturuldu!</p>
                </div>
            }

        </div>
    );
}



