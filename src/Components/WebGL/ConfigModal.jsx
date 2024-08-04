import React, { Component } from 'react';

class ConfigModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input1: ''
        };
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleConfirm = async () => {
        const { input1 } = this.state;
        const server_url = 'https://anigenflaspwcylf79y4-db0acd9313e7f31c.tec-s1.onthetaedgecloud.com';

        // Define the requests in sequence
        const requests = [
            fetch(`${server_url}/config/reset`, { method: 'POST' }),
            fetch(`${server_url}/config/frames`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ total_frames: Number(input1) }) // input1 denote number of frames
            }),
            fetch(`${server_url}/config/import`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ import_path: "/home/mizookie/Motions/Motions/Motions" })
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
            <div className="modal bg-black glow bg-opacity-70 modal-open">
                <div className="modal-box">
                    <h2 className="text-2xl font-orbitron text-accent font-bold mb-4">Configuration</h2>
                    <div className="space-y-4 font-thin text-xs font-orbitron text-gray-700">
                        <input
                            type="text"
                            name="input1"
                            value={this.state.input1}
                            onChange={this.handleInputChange}
                            placeholder="Number of Frames"
                            className="input mb-1 font-orbitron font-thin text-xs text-yellow-200 input-bordered w-full"
                        />
                        30 frames equals 1 second. Please choose atleast 100 frames for a sizeable render
                    </div>
                    <div className="modal-action">
                        <button 
                            onClick={this.handleConfirm} 
                            className="btn bg-accent font-orbitron font-thin text-black">
                            CONFIRM
                        </button>
                        <button 
                            onClick={() => this.props.onClose()} // Assuming there's a prop to close the modal
                            className="btn bg-neutral font-orbitron font-thin text-xs text-red-800">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfigModal;