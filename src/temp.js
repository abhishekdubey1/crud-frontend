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
const Loader = () => (
  <div className="loader">
    <div className="loader-wheel"></div>
    <div className="loader-text"></div>
  </div>
);

export default function App() {
  const [state, setState] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [loader, setLoader] = useState(false);
  const dev = true;
  const url = dev
    ? "http://localhost:5000/note"
    : "https://mini-note-it.herokuapp.com/note";
  async function apiCall(url = "", method, headerObj, data = {}) {
    try {
      setLoader(true);
      const response = await fetch(url, {
        method, // *GET, POST, PUT, DELETE, etc.
        ...defaultHeaderObj,
        ...headerObj,
      });
      let { message, note } = await response.json(); // parses JSON response into native JavaScript objects
      setState(note);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(`Error: ${error}`);
    }
  }
  const getNotes = () => apiCall(`${url}`, "GET", {});
  const postNote = () => {
    if (inputVal.trim()) {
      return (
        apiCall(`${url}`, "POST", {
          body: JSON.stringify({ note: inputVal }),
        }) && setInputVal("")
      );
    }
    alert("Hey, enter a nice note");
  };
  const deleteNote = (id) => {
    apiCall(`${url}/${id}`, "DELETE", {});
    setState([]);
    getNotes();
  };

  return (
    <div className="App">
      {state && state[0] && (
        <>
          {/* {!state[0] && <h3>Hey, looks like no notes here!</h3>} */}
          {!loader && (
            <button className="btn" onClick={getNotes}>
              Load Notes
            </button>
          )}
          <input
            type="text"
            onChange={(e) => setInputVal(e.target.value)}
            value={inputVal}
          />
          {!loader && <button onClick={postNote}>send</button>}
          {loader && <Loader />}
          {state.length > 0 && (
            <ul>
              {state.map((note) => (
                <li key={note._id}>
                  <span>{note.note}</span>
                  <span>
                    <span className="edit">
                      <ion-icon name="create-outline" />
                    </span>
                    <span
                      className="delete"
                      onClick={() => deleteNote(note._id)}
                    >
                      <ion-icon name="close-outline" />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
