import React, { Component } from 'react';

class ConfigModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input1: '',
            input2: '',
            input3: ''
        };
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleConfirm = () => {
        // Handle confirm logic here
        // You can access the input values using this.state.input1, this.state.input2, etc.
    }

    render() {
        return (
            <div className="modal">
                <input
                    type="text"
                    name="input1"
                    value={this.state.input1}
                    onChange={this.handleInputChange}
                />
                <input
                    type="text"
                    name="input2"
                    value={this.state.input2}
                    onChange={this.handleInputChange}
                />
                <input
                    type="text"
                    name="input3"
                    value={this.state.input3}
                    onChange={this.handleInputChange}
                />
                <button onClick={this.handleConfirm}>Confirm</button>
            </div>
        );
    }
}

export default ConfigModal;