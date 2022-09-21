import type { Product } from "./types";

import { useEffect, useState, memo } from "react";

import api from "./api";

function Recommended() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.search().then(setProducts);
  }, []);

  return (
    <main>
      <h1>Productos recomendados</h1>
      <ul>
        {[...products]
          .sort(() => (Math.random() > 0.5 ? 1 : -1))
          .slice(0, 2)
          .map((product) => (
            <li key={product.id}>
              <h4>{product.title}</h4>
              <p>{product.description}</p>
              <span>$ {product.price}</span>
            </li>
          ))}
      </ul>
    </main>
  );
}

const RecommendedMemoized = memo(Recommended);

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [favs, setFavs] = useState<Product[]>(() =>
    JSON.parse(localStorage.getItem("fav") ?? "[]")
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      api.search(query).then(setProducts);
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    localStorage.setItem("fav", JSON.stringify(favs));
  }, [favs]);

  const handleFav = (product: Product) => {
    const { id } = product;

    if (isFav(id)) setFavs((favs) => favs.filter((fav) => fav.id !== id));
    else setFavs((favs) => [...favs, product]);
  };

  const isFav = (id: Product["id"]) => favs.find((el) => el.id === id);

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input
        name="text"
        placeholder="tv"
        type="text"
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {products.map((product) => (
          <li
            key={product.id}
            className={isFav(product.id) ? "fav" : ""}
            onClick={() => handleFav(product)}
          >
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>$ {product.price}</span>
          </li>
        ))}
      </ul>
      <hr />
      <RecommendedMemoized />
    </main>
  );
}

export default App;
