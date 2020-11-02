import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ImageGallery } from './components/ImageGallery';
import { DefaultToastContainer, Options, ToastProvider } from 'react-toast-notifications'

export const SERVER_URL = "http://localhost:8081"
export const POST_PATH: string = "/api/v1/file/upload"
export const GET_FILE_INFO_PATH: string = "/api/v1/file/getAllFileInfo"
export const UPDATE_FILE_IS_FAVORITE_PATH: string = "/api/v1/file/updateIsFavorite"

export const ERROR_TOAST_OPTIONS: Options = { appearance: 'error', autoDismiss: true }
export const SUCCESS_TOAST_OPTIONS: Options = { appearance: 'success', autoDismiss: true }

const ToastContainer = (props: any) => (
    <DefaultToastContainer
      className="toast-container"
      style={{ zIndex: 2000 }}
      {...props}
    />
  );
  

function App() {
    return (
        <ToastProvider
            placement="top-center"
            components={{ ToastContainer }}
        >
            <div>
                <div className="header">Image Application</div>
                <ImageGallery />
            </div>
        </ToastProvider>
    );
}

export default App;
