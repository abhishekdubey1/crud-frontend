import { useEffect, useState } from "react";
import "./styles.css";
import "./loader.css";

const defaultHeaderObj = {
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json",
  },
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};

export default function App() {
  const [state, setState] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const dev = true;
  const url = dev
    ? "http://localhost:5000/note"
    : "https://mini-note-it.herokuapp.com/note";
  async function apiCall(url = "", method, headerObj, data = {}) {
    try {
      const response = await fetch(url, {
        method, // *GET, POST, PUT, DELETE, etc.
        ...defaultHeaderObj,
        ...headerObj,
      });
      let { message, note } = await response.json(); // parses JSON response into native JavaScript objects
      if (method === "GET") {
        setState(note);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
  const getNotes = () => apiCall(`${url}`, "GET", {});
  const postNote = () => {
    if (inputVal.trim()) {
      apiCall(`${url}`, "POST", {
        body: JSON.stringify({ note: inputVal }),
      });
      setInputVal("");
      getNotes();
      return;
    }
    alert("Hey, enter a nice note");
  };
  const deleteNote = (id) => {
    apiCall(`${url}/${id}`, "DELETE", {});
    getNotes();
  };

  return (
    <div className="App">
      <button className="btn" onClick={getNotes}>
        Load Notes
      </button>
      <input
        type="text"
        onChange={(e) => setInputVal(e.target.value)}
        value={inputVal}
      />
      <button onClick={postNote}>send</button>
      <ul>
        {state &&
          state.map((note) => (
            <li key={note._id}>
              <span>{note.note}</span>
              <span>
                <span className="delete" onClick={() => deleteNote(note._id)}>
                  <ion-icon name="close-outline" />
                </span>
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
//                 <span className="edit">
// <ion-icon name="create-outline" />
// </span>
