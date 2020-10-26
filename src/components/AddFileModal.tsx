import React, { useRef } from "react";
import { Button, Modal } from "react-bootstrap/esm";
import "./styles/AddFileModal.css"
import { Options, useToasts } from 'react-toast-notifications'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

export const MAX_FILE_BYTES: number = 20 * 1024 * 1024
export const POST_URL: string = "http://localhost:8081/upload"

const validFileTypes = [
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml"
];

export interface Props {
    show: boolean
    handleClose: () => void
}

export const AddFileModal: React.FC<Props> = (props: Props) => {
    const fileInput: any = useRef(null)
    const { addToast } = useToasts()
    const validFileType = (file: any) => {
        return validFileTypes.includes(file.type);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        const errorToastOptions: Options = { appearance: 'error', autoDismiss: true }
        const successToastOptions: Options = { appearance: 'success', autoDismiss: true }


        if (!!!fileInput.current.files || fileInput.current.files.length === 0) {
            addToast("Please choose a file to upload.", errorToastOptions)
            return false
        }

        if (fileInput.current.files.length > 1) {
            addToast("Only 1 file can be uploaded at a time.", errorToastOptions)
            return false
        }

        const file: any = fileInput.current.files[0]
        if (!validFileType(file)) {
            addToast("Only the following file types are accepted: " + validFileTypes.join(', ') + ".", errorToastOptions)
            return false
        }

        if (file.size > MAX_FILE_BYTES) {
            addToast("The max file size supported is " + (MAX_FILE_BYTES / 1024 / 1024).toFixed(1) + " MB.", errorToastOptions)
            return false
        }

        let config: AxiosRequestConfig = {
            onUploadProgress: (progressEvent: any) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            },
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        const data = new FormData()
        data.append("files", file)
        axios.post(POST_URL, data, config)
            .then((res: AxiosResponse) => {
                if (res.status === 200) {
                    addToast("Succesfully uploaded file.", successToastOptions)
                    props.handleClose()
                } else {
                    console.error(res)
                    addToast("There was an error in uploading the file.", errorToastOptions)
                }
            })
            .catch((err: any) => {
                let errorMessage = (!!err?.response?.data && typeof err?.response?.data === 'string') 
                ? err?.response?.data 
                : "There was an error in uploading the file."

                console.error(errorMessage)
                addToast(errorMessage, errorToastOptions)
            })


        return true
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.handleClose}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Image</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="modal-body-text">
                            Please choose an image file to upload.
                        </div>
                        <input type="file"
                            id="image-file" name="image-file"
                            accept="image/gif, image/jpeg, image/pjpeg, image/png, image/svg+xml"
                            ref={fileInput}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={props.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}