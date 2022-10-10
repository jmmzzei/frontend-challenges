import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import api from "./api";
import { Product, CartItem, Action } from "./types";
import styles from "./index.module.scss";

const initialState: CartItem[] = [];

const handleIncrement = (product: CartItem, cart: CartItem[]) => {
  return cart.map((item) =>
    item.id == product.id
      ? {
          ...item,
          quantity: item.quantity + 1,
        }
      : item
  );
};

const handleDecrement = (product: CartItem, cart: CartItem[]) => {
  return cart
    .map((item) =>
      item.id == product.id
        ? {
            ...item,
            quantity: item.quantity - 1,
          }
        : item
    )
    .filter((item) => item.quantity);
};

const handleAdd = (product: Product, cart: CartItem[]) => {
  const productFinded = cart.find((item) => item.id === product.id);

  if (productFinded) return cart;

  return cart.concat({ ...product, quantity: 1 });
};

const cartReducer = (state: CartItem[], action: Action): CartItem[] => {
  switch (action.type) {
    case "add": {
      return handleAdd(action.product as Product, state);
    }
    case "increment": {
      return handleIncrement(action.product as CartItem, state);
    }
    case "decrement": {
      return handleDecrement(action.product as CartItem, state);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    api.list().then(setProducts);
  }, []);

  const isInCart = useCallback(
    (id: Product["id"]) => Boolean(cart.find((item) => item.id === id)),
    [cart]
  );

  const getItemQtty = useCallback(
    (id: Product["id"]) => cart.find((item) => item.id === id)?.quantity,
    [cart]
  );

  const cartTotal = useMemo(() => {
    const cartSum = cart.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0
    );

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(cartSum);
  }, [cart]);

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
                  onClick={() =>
                    dispatch({
                      type: "decrement",
                      product,
                    })
                  }
                >
                  -
                </button>
                <p className={styles.quantity}>{getItemQtty(product.id)}</p>
                <button
                  className={styles.button}
                  onClick={() =>
                    dispatch({
                      type: "increment",
                      product,
                    })
                  }
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className={styles.button}
                onClick={() =>
                  dispatch({
                    type: "add",
                    product,
                  })
                }
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
