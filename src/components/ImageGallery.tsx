import axios, { AxiosResponse } from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import { ERROR_TOAST_OPTIONS, GET_FILE_INFO_PATH, SERVER_URL, SUCCESS_TOAST_OPTIONS, UPDATE_FILE_IS_FAVORITE_PATH } from "../App";
import { AddFileModal } from "./AddFileModal";
import "./styles/ImageGallery.css"
import { useToasts } from 'react-toast-notifications'

export interface Props {

}

export interface State {
    showAddFileModal: boolean
}

export interface FileInfo {
    name: string
	isFavorite: boolean
	filePath: string
}

export const ImageGallery: React.FC<Props> = (props: Props) => {

    const { addToast } = useToasts()

    const [showAddFileModal, setShowAddFileModal] = useState(false)
    const [fileInfoList, setFileInfoList] = useState<FileInfo[]>([])

    const getImagesToDisplay = useCallback(
        () => {
            // Call the API to get all the images to display.
            axios.get(SERVER_URL + GET_FILE_INFO_PATH)
                .then((res: AxiosResponse) => {
                    setFileInfoList(res.data)
                })
                .catch((err: any) => {
                    let errorMessage = (!!err?.response?.data && typeof err?.response?.data === 'string')
                        ? err?.response?.data
                        : "There was an error in getting the images from the server."
    
                    console.error(errorMessage)
                    addToast(errorMessage, ERROR_TOAST_OPTIONS)
                })
        }, [addToast]
    ) 

    useEffect(() => {
        getImagesToDisplay()
    }, [getImagesToDisplay])

    const handleShowAddFileModal = () => {
        setShowAddFileModal(true)
    }

    const handleCloseAddFileModal = () => {
        setShowAddFileModal(false)
    }

    const onImageClick = (event: any | undefined, fileInfoList: FileInfo[], index: number) => {
        event?.preventDefault()
        event?.stopPropagation()

        let { name, isFavorite } = fileInfoList[index]
        isFavorite = !isFavorite

        axios.put(SERVER_URL + UPDATE_FILE_IS_FAVORITE_PATH, { name, isFavorite })
            .then((res: AxiosResponse) => {
                fileInfoList = JSON.parse(JSON.stringify(fileInfoList))
                fileInfoList[index].isFavorite = isFavorite
                setFileInfoList(fileInfoList)

                const succesMessage = isFavorite ? name + " image favorited!" : name + " image is no longer a favorite."
                addToast(succesMessage, SUCCESS_TOAST_OPTIONS)
            })
            .catch((err: any) => {
                let errorMessage = (!!err?.response?.data && typeof err?.response?.data === 'string')
                    ? err?.response?.data
                    : "There was an error in favoriting the image."

                console.error(errorMessage)
                addToast(errorMessage, ERROR_TOAST_OPTIONS)
            })
    }

    return (
        <div>
            <div className="text-center">
                <Button className="modal-button" variant="primary" onClick={handleShowAddFileModal}>
                    Add Image
                </Button>
            </div>
            <AddFileModal
                show={showAddFileModal}
                handleClose={handleCloseAddFileModal}
                refreshImages={getImagesToDisplay}
            />

            <div className="container">
                <div className="row">
                    {!!fileInfoList && fileInfoList.map(
                        (fileInfo: FileInfo, index: number) => {

                            // For the alt value get the value of the fileName prior to the first "."
                            const alt = fileInfo?.name?.split(".")[0]

                            return(
                                <div key={index} onClick={(event: any) => { onImageClick(event, fileInfoList, index) }}
                                    className="container col-sm-4 column">
                                    <div className="card">
                                        <img className="image" src={fileInfo.filePath} alt={alt}/>

                                        <div className="image-checkbox-container">
                                            <label>
                                                <input className="image-checkbox " type="checkbox"
                                                    onClick={(event: any) => { onImageClick(event, fileInfoList, index) }}
                                                    checked={!!fileInfoList[index].isFavorite} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
            </div>
        </div>
    )
}