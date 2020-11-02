import React, { useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap/esm";
import "./styles/AddFileModal.css"
import { useToasts } from 'react-toast-notifications'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ERROR_TOAST_OPTIONS, POST_PATH, SERVER_URL, SUCCESS_TOAST_OPTIONS } from "../App";
import CryptoAES from "crypto-js";

export const MAX_FILE_BYTES: number = 20 * 1024 * 1024

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
    refreshImages: () => void
}

export interface State {
    password: string
}

export const AddFileModal: React.FC<Props> = (props: Props) => {
    const fileInput: any = useRef(null)
    const { addToast } = useToasts()

    const [password, setPassword] = useState('')

    const validFileType = (file: any) => {
        return validFileTypes.includes(file.type);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()

        if (!!!fileInput.current.files || fileInput.current.files.length === 0) {
            addToast("Please choose a file to upload.", ERROR_TOAST_OPTIONS)
            return false
        }

        if (fileInput.current.files.length > 1) {
            addToast("Only 1 file can be uploaded at a time.", ERROR_TOAST_OPTIONS)
            return false
        }

        const file: any = fileInput.current.files[0]
        if (!validFileType(file)) {
            addToast("Only the following file types are accepted: " + validFileTypes.join(', ') + ".", ERROR_TOAST_OPTIONS)
            return false
        }

        if (file.size > MAX_FILE_BYTES) {
            addToast("The max file size supported is " + (MAX_FILE_BYTES / 1024 / 1024).toFixed(1) + " MB.", ERROR_TOAST_OPTIONS)
            return false
        }

        let config: AxiosRequestConfig = {
            onUploadProgress: (progressEvent: any) => {
                // let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // TODO: add a progress bar
            },
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        const data = new FormData()
        data.append("files", file)
        axios.post(SERVER_URL + POST_PATH, data, config)
            .then((res: AxiosResponse) => {
                if (res.status === 200) {
                    addToast("Succesfully uploaded file.", SUCCESS_TOAST_OPTIONS)

                    // TODO: This can possibly be made more efficient by simply adding the new image to the 
                    // fileInfoList state variable in ImageGallery. This would also require the server 
                    // to provide the image file path in the response. Then the refreshImages function
                    // does not need to be called to refresh the entire fileInfoList.
                    props.refreshImages()
                    props.handleClose()
                } else {
                    console.error(res)
                    addToast("There was an error in uploading the file.", ERROR_TOAST_OPTIONS)
                }
            })
            .catch((err: any) => {
                let errorMessage = (!!err?.response?.data && typeof err?.response?.data === 'string') 
                ? err?.response?.data 
                : "There was an error in uploading the file."

                console.error(errorMessage)
                addToast(errorMessage, ERROR_TOAST_OPTIONS)
            })


        return true
    }

    const onPasswordChange = (event: any) => {
        if (!!event?.target?.value) {
            setPassword(event.target.value)
        }
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
                        <Form.Control 
                        onChange={(event: any) => {onPasswordChange(event)}} value={password} 
                        className="password" type="password" placeholder="Password" />
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