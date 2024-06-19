import React, { useEffect, useMemo, useState } from "react";

import { io } from "socket.io-client";

const App = ({ roomId }) => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [joinRoom, setJoinRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [receivedMsg, setReceivedMsg] = useState("");

  const socket = useMemo(() => io("http://localhost:3000/"), []);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });
    socket.on("receive-message", (data) => {
      console.log(data);
      setReceivedMsg(data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit("message", { message, room });
  };

  const handleJoinSubmit = (event) => {
    event.preventDefault();
    socket.emit("join-room", joinRoom);
    setJoinRoom("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.roomIdTitle}>Room ID: {socketId}</h1>

      <form onSubmit={handleJoinSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="room">Join Room:</label>
          <input
            type="text"
            id="room"
            value={joinRoom}
            onChange={(e) => setJoinRoom(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="room">Room:</label>
          <input
            type="text"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="message">Message:</label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>

      <div style={styles.messageDisplay}>
        <h2>Recieved Message:</h2>
        <p>{receivedMsg}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    width: "100vw",
  },
  roomIdTitle: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "300px",
  },
  formGroup: {
    marginBottom: "15px",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
  messageDisplay: {
    marginTop: "20px",
    textAlign: "center",
  },
};

export default App;
