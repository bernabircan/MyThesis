import React, {Component} from "react";

class SubscribeButtonComponent extends Component {

    state = {
        isSubscriber : this.props.isSubscriber
    }

    toggleIsSubscriber = () => {
        this.setState({
            isSubscriber: !this.state.isSubscriber
        })
    }

    render() {

        return (
            <span className={`${this.state.isSubscriber ? "btn-white-blue" : "btn-blue"}`} onClick={this.toggleIsSubscriber}>
                {this.state.isSubscriber ? "Takip Ediliyor" : "Takip Et"}
            </span>
        );
    }
}

export default SubscribeButtonComponent;