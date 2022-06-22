import React, {Component} from 'react';
import SortItemComponent from "./sortItemComponent";

class SortBlockComponent extends Component {

    state = {
        activeSortIndex:0,
        isSortMenuOpen: false
    }

    sortAction = React.createRef();

    setActiveSortItem = (index) => {
        this.setState({
            activeSortIndex:index
        })

        this.toggleSortMenu();
        this.props.tabChanged(index);
    }

    toggleSortMenu = () => {
        this.setState({
            isSortMenuOpen: !this.state.isSortMenuOpen
        })
    }

    componentDidMount() {
        window.addEventListener("click", this.windowClicked);
    }

    windowClicked = (e) => {
        if (this.sortAction.current && !this.sortAction.current.contains(e.target) && this.state.isSortMenuOpen) {
            this.setState({
                isSortMenuOpen: false
            })
        }
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.windowClicked);
    }

    render() {

        let {items, tabChanged} = this.props;

        return (
            <div className="sort-block" ref={this.sortAction}>
                <div className="sort-btn-item" onClick={this.toggleSortMenu}>
                    <span>Sıralama</span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                        <path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71z"/>
                    </svg>
                </div>
                <div className={`open-sort-root ${this.state.isSortMenuOpen ? "opened" : ""}`}>
                    <div className="open-sort-container">
                        {items.map((value, index) => (
                            <SortItemComponent key={index} index={index} name={value}
                                               setActiveSortItem={this.setActiveSortItem}
                                               activeState={this.state.activeSortIndex}/>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default SortBlockComponent;