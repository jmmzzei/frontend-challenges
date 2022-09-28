import type { Item } from "./types";

import { useEffect, useState } from "react";

import styles from "./App.module.scss";
import api from "./api";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

enum Status {
  Loading,
  Resolved,
  Rejected,
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState(Status.Loading);

  function handleToggle(id: Item["id"]) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function handleAdd(event: React.ChangeEvent<Form>) {
    event.preventDefault();

    let obj = {
      id: +Date.now(),
      text: event.target["text"].value,
      completed: false,
    };

    setItems((items) => items.concat(obj));
    event.target["text"].value = "";
  }

  function handleRemove(id: Item["id"]) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  useEffect(() => {
    api
      .list()
      .then(() => {
        setItems(items);
        setStatus(Status.Resolved);
      })
      .catch((_err) => {
        setStatus(Status.Rejected);
      });
  }, []);

  if (status == Status.Rejected) return null;
  if (status == Status.Loading) return <div>Cargando...</div>;

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form onSubmit={handleAdd}>
        <input name="text" type="text" id="text" />
        <button>Add</button>
      </form>
      <ul>
        {items?.map((item) => (
          <li
            key={item.id}
            className={item.completed ? styles.completed : ""}
            onClick={() => handleToggle(item.id)}
          >
            {item.text}{" "}
            <button onClick={() => handleRemove(item.id)}>[X]</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
