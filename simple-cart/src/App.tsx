import { useEffect, useState } from "react";

import api from "./api";
import { Product } from "./types";

import styles from "./index.module.scss";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.list().then(setProducts);
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>Estampitiency</header>
      <section className={styles.section}>
        {products.map((product) => (
          <article key={product.id} className={styles.article}>
            <img className={styles.img} src={product.image} />
            <div>
              <p>{product.title}</p>
              <p>{product.description}</p>
            </div>
            <button>Agregar</button>
          </article>
        ))}
      </section>
      <aside className={styles.aside}>
        <button className={styles.button}>3 productos (total: $12)</button>
      </aside>
      <footer className={styles.footer}>
        Encontrá la consigna de este ejercicio y otros más{" "}
        <a
          className={styles.a}
          href="https://github.com/goncy/interview-challenges/tree/main/simple-cart"
        >
          acá
        </a>
      </footer>
    </main>
  );
}

export default App;
