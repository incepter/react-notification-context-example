import React from "react";
import "./styles.css";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";

const NotificationsContext = React.createContext();

function NotificationsContextProvider({ children }) {
  // helps uniquely identifying notifications
  const notificationsIndex = React.useRef(0);
  const [notifications, setNotifications] = React.useState([]);

  const registerNotification = React.useCallback(
    message => {
      const nextId = ++notificationsIndex.current;
      setNotifications(old => [...old, { id: nextId, message }]);
    },
    [setNotifications]
  );

  const removeNotification = React.useCallback(
    id => {
      setNotifications(old => old.filter(t => t.id !== id));
    },
    [setNotifications]
  );
  const currentNotification = notifications[0];

  return (
    <>
      <NotificationsContext.Provider value={registerNotification}>
        {children}
      </NotificationsContext.Provider>
      {currentNotification && (
        <Notification
          message={currentNotification.message}
          onClose={() => removeNotification(currentNotification.id)}
        />
      )}
    </>
  );
}

function Notification({ message, onClose }) {
  return (
    <Snackbar
      open
      autoHideDuration={2000}
      message={message}
      action={
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      }
    />
  );
}

function AddNotification({ text }) {
  const register = React.useContext(NotificationsContext);
  return <button onClick={() => register(text)}>{text}</button>;
}

export default function App() {
  return (
    <div className="App">
      <NotificationsContextProvider>
        <AddNotification text="Add a notification" />
        <AddNotification text="Add another" />
      </NotificationsContextProvider>
    </div>
  );
}
