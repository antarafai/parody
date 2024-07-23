import React, { Component } from 'react';

class ConfigModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input1: '',
            input2: ''
        };
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleConfirm = async () => {
        const { input1, input2 } = this.state;
        const server_url = 'https://anigenflaseqdo5usv9m-132cbef2955621b9.tec-s1.onthetaedgecloud.com'; // Replace with your server URL

        // Define the requests in sequence
        const requests = [
            fetch(`${server_url}/config/reset`, { method: 'POST' }),
            // fetch(`${server_url}/config/motions`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ motions: input1 }) // Assuming input1 is paths
            // }),
            fetch(`${server_url}/config/character`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ character: input2 }) // Assuming input2 is character path
            }),
            fetch(`${server_url}/config/frames`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ total_frames: Number(input1) }) // Assuming input1 is number of frames
            }),
            fetch(`${server_url}/config/import`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ import_path: "/home/mizookie/Motions" })
            }),
            fetch(`${server_url}/config/render`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ render_path: "/home/mizookie/Renders" })
            })
        ];

        try {
            // Execute the requests sequentially
            for (const request of requests) {
                const response = await request;
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            }

            console.log('All configuration requests successful');

            // Pass the number of frames back to the parent component
            this.props.onClose(Number(input1));
        } catch (error) {
            console.error('Error during configuration requests', error);
        }
    }

    render() {
        return (
            <div className="modal modal-open">
                <div className="modal-box">
                    <h2 className="text-xl font-bold mb-4">Configuration</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="input1"
                            value={this.state.input1}
                            onChange={this.handleInputChange}
                            placeholder="Number of Frames"
                            className="input input-bordered w-full"
                        />
                        <input
                            type="text"
                            name="input2"
                            value={this.state.input2}
                            onChange={this.handleInputChange}
                            placeholder="Character Path"
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="modal-action">
                        <button 
                            onClick={this.handleConfirm} 
                            className="btn btn-primary">
                            Confirm
                        </button>
                        <button 
                            onClick={() => this.props.onClose()} // Assuming there's a prop to close the modal
                            className="btn">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfigModal;