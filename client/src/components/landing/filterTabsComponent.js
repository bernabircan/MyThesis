import React from "react";

export default function FilterTabsComponent({activeTab, setActiveTab}) {

    return (
        <div className="content-container filter-tabs-container">
            <a href="#" className={`tab-item ${activeTab === "user" ? "selected" : ""}`} onClick={() => {
                setActiveTab("user")
            }}>
                <i className="icon">
                    <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path
                            d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z"/>
                    </svg>
                </i>
                <span>Bana Özel</span>
            </a>
            <a href="#" className={`tab-item ${activeTab === "popular" ? "selected" : ""}`} onClick={() => {
                setActiveTab("popular")
            }}>
                <i className="icon">
                    <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path
                            d="M384 319.1C384 425.9 297.9 512 192 512s-192-86.13-192-192c0-58.67 27.82-106.8 54.57-134.1C69.54 169.3 96 179.8 96 201.5v85.5c0 35.17 27.97 64.5 63.16 64.94C194.9 352.5 224 323.6 224 288c0-88-175.1-96.12-52.15-277.2c13.5-19.72 44.15-10.77 44.15 13.03C215.1 127 384 149.7 384 319.1z"/>
                    </svg>
                </i>
                <span>Popüler</span>
            </a>
            <a href="#" className={`tab-item ${activeTab === "new" ? "selected" : ""}`} onClick={() => {
                setActiveTab("new")
            }}>
                <i className="icon">
                    <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path
                            d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"/>
                    </svg>
                </i>
                <span>Yeni</span>
            </a>
        </div>
    );

}


