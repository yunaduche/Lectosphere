import React from 'react';
import { useDispatch } from 'react-redux';
import { underControl } from '../../hooks-redux/userSlice';
import { underStudentControl } from '../../hooks-redux/studentSlice';

interface PopupProps {
  message: string;
  setShowPopup: (show: boolean) => void;
  showPopup: boolean;
}

const Popup: React.FC<PopupProps> = ({ message, setShowPopup, showPopup }) => {
  const dispatch = useDispatch();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowPopup(false);
    dispatch(underControl());
    dispatch(underStudentControl());
  };

  return (
    <>
      {showPopup && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`p-4 rounded-md shadow-lg ${
              message === "Done Successfully"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  className="w-6 h-6 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {message === "Done Successfully" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                </svg>
              </div>
              <div>
                <p className="font-bold">{message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;