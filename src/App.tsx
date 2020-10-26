import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ImageGallery } from './components/ImageGallery';
import { DefaultToastContainer, ToastProvider } from 'react-toast-notifications'

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
