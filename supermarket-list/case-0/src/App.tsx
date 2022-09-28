import type { Item } from "./types";

import { useEffect, useRef, useState } from "react";

import styles from "./App.module.scss";
import api from "./api";

function App() {
  const [items, setItems] = useState<Item[] | null>(null);
  const ref = useRef(null);

  useEffect(() => {
    api.list().then(setItems);
    ref?.current?.focus();
  }, []);

  const handleRemove = (e: Item["id"]) => {
    setItems((items) => items?.filter((item) => item.id !== e.id) ?? items);
  };

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form>
        <input ref={ref} name="text" type="text" />
        <button>Add</button>
      </form>
      <ul>
        {items?.map((item) => (
          <li key={item.id} className={item.completed ? styles.completed : ""}>
            {item.text}{" "}
            <button onClick={() => handleRemove(item.id)}>[X]</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
