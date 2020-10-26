import React from "react";
import { Button } from "react-bootstrap";
import { AddFileModal } from "./AddFileModal";
import "./styles/ImageGallery.css"

export interface Props {

}

export interface State {
    showAddFileModal: boolean
}

export class ImageGallery extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.handleShowAddFileModal = this.handleShowAddFileModal.bind(this)
        this.handleCloseAddFileModal = this.handleCloseAddFileModal.bind(this)

        this.state = {
            showAddFileModal: false
        }
    }

    componentDidMount(): void {
        // Call the API to get all the images to display.
    }

    render() {
        return (
            <div>
                <div className="text-center">
                    <Button className="modal-button" variant="primary" onClick={this.handleShowAddFileModal}>
                        Add Image
                    </Button>
                </div>
                <AddFileModal
                    show={this.state.showAddFileModal}
                    handleClose={this.handleCloseAddFileModal}
                />
            </div>
        )
    }

    handleShowAddFileModal = () => {
        this.setState({ showAddFileModal: true })
    }

    handleCloseAddFileModal = () => {
        this.setState({ showAddFileModal: false })
    }
}