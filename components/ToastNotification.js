// components/ToastNotification.js
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => {
    return <ToastContainer />;
};

export const notify = (message) => {
    toast(message);
};

export default ToastNotification;
