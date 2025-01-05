import { createContext, useState, useCallback, useContext, Fragment } from 'react';
import Alert from '@mui/material/Alert'; // Assuming you're using MUI for Alert component

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const getAlert = () => {
    const { text } = alert;

    if (typeof text !== 'object') {
      return text;
    }

    if (text?.status === 400 && text.errors) {
      const { errors } = text;
      const errorMessages = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('\n');

      return (
        <>
          {errorMessages.split('\n').map((msg, index) => (
            <Fragment key={index}>
              {msg}
              <br />
            </Fragment>
          ))}
        </>
      );
    }

    return text?.detail || 'Invalid error.';
  };

  const displayAlert = useCallback((text, options = {}) => {
    const { severity = 'error', timeout = 10_000 } = options;

    setAlert({ text, severity });

    if (timeout !== -1) {
      setTimeout(() => {
        setAlert(null);
      }, timeout);
    }
  }, []);

  return (
    <AlertContext.Provider value={{ displayAlert }}>
      {children}
      {alert && (
        <Alert
          severity={alert.severity}
          onClose={() => {
            setAlert(null);
          }}
          sx={{ position: 'fixed', bottom: 40, right: 40 }}>
          {getAlert()}
        </Alert>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};
