import React, {Component} from 'react';

class SortItemComponent extends Component {


    render() {
        let {index, name, setActiveSortItem, activeState} = this.props;

        return (
            <p className={`sort-item ${activeState === index ? "active" : ""}`} onClick={()=>{setActiveSortItem(index)}}>{name}</p>
        );
    }
}

export default SortItemComponent;