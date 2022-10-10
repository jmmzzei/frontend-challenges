import { useEffect, useMemo, useState } from "react";

import api from "./api";
import { Product, CartItem } from "./types";

import styles from "./index.module.scss";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    api.list().then(setProducts);
  }, []);

  const handleAdd = (product: Product) => {
    const productFinded = cart.find((item) => item.id === product.id);

    if (productFinded) return;

    const cartItem = { ...product, quantity: 1 };

    setCart((products) => products.concat(cartItem));
  };

  const cartTotal = useMemo(() => {
    const cartSum = cart.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0
    );

    console.log(cart);
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(cartSum);
  }, [cart]);

  const isInCart = (id: Product["id"]) =>
    Boolean(cart.find((item) => item.id === id));

  const handleIncrement = (id: CartItem["id"]) => {
    setCart((products) =>
      products.map((item) =>
        item.id == id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const handleDecrement = (id: CartItem["id"]) => {
    setCart((products) =>
      products
        .map((item) =>
          item.id == id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity)
    );
  };

  const getItemQtty = (id: Product["id"]) =>
    cart.find((item) => item.id === id)?.quantity;

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
            {isInCart(product.id) ? (
              <div>
                <button
                  className={styles.button}
                  onClick={() => handleDecrement(product.id as CartItem["id"])}
                >
                  -
                </button>
                <p className={styles.quantity}>{getItemQtty(product.id)}</p>
                <button
                  className={styles.button}
                  onClick={() => handleIncrement(product.id as CartItem["id"])}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className={styles.button}
                onClick={() => handleAdd(product)}
              >
                Agregar
              </button>
            )}
          </article>
        ))}
      </section>
      <aside className={styles.aside}>
        <button className={styles.button}>
          {cart.length} productos (total: {cartTotal})
        </button>
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
