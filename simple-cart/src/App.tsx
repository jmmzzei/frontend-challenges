import { useEffect, useMemo, useState } from "react";

import api from "./api";
import { Product, CartItem } from "./types";

import styles from "./index.module.scss";

// * Si tenemos algún elemento del producto en el carrito debemos cambiar el botón de "Agregar" por uno que tenga un botón de "-", la cantidad de productos que tenemos en el carrito y un botón de "+", clickear los botones correspondientes va a sumar o restar elementos del carrito. Si tenía un producto en el carrito y clickeo en "-" debe eliminar el producto del carrito.

// Done:
// * Cada producto debe agregarse al carrito al clickear "Agregar"
// * El botón inferior nos marca cuantos productos tenemos en el carrito y su total, mostrar los valores reales del carrito en todo momento.

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

  const handleIncrement = (id: Product["id"]) => {
    const productFinded = cart.find((item) => item.id === id);

    if (productFinded) {
      const cartItem = {
        ...productFinded,
        quantity: productFinded.quantity + 1,
      };

      setCart((products) =>
        products.map((item) => (item.id == id ? cartItem : item))
      );
    }
  };

  const handleDecrement = (id: Product["id"]) => {
    const productFinded = cart.find((item) => item.id === id);

    if (productFinded && productFinded.quantity == 1) {
      setCart((cart) => cart.filter((item) => item.id !== id));

      return;
    }

    if (productFinded) {
      const cartItem = {
        ...productFinded,
        quantity: productFinded.quantity - 1,
      };

      setCart((products) =>
        products.map((item) => (item.id == id ? cartItem : item))
      );
    }
  };

  const getItemQtty = (id: Product["id"]) => {
    const cartFinded = cart.find((item) => item.id === id);

    return cartFinded?.quantity;
  };

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
                <button onClick={() => handleDecrement(product.id)}>-</button>
                <p>{getItemQtty(product.id)}</p>
                <button onClick={() => handleIncrement(product.id)}>+</button>
              </div>
            ) : (
              <button
                onClick={() => handleAdd(product)}
                className={styles.button}
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
