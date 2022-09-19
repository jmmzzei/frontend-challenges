import type { Product } from "./types";

import { useRef, useEffect, useState } from "react";

import api from "./api";

enum Select {
  Empty = "",
  Price = "price",
  Abc = "abc",
}

const sortProducts = (
  value: string,
  products: Product[],
  initial: Product[] | null
) => {
  let productsSorted: Product[] = [];

  if (value === Select.Price) {
    productsSorted = [...products].sort((a, b) => {
      if (a.price > b.price) return 1;
      if (a.price < b.price) return -1;

      return 0;
    });
  }

  if (value === Select.Abc) {
    productsSorted = [...products].sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;

      return 0;
    });
  }

  if (value === Select.Empty && initial) {
    productsSorted = initial;
  }

  return productsSorted;
};

const formatPrice = (price: number) =>
  Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    price
  );

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const ref = useRef<Product[] | null>(null);
  const [query, setQuery] = useState<string>(
    () => localStorage.getItem("query") ?? ""
  );
  const [sort, setSort] = useState<Select>(
    () => (localStorage.getItem("sort") as Select) ?? Select.Empty
  );

  useEffect(() => {
    api.search(query).then(setProducts);
    localStorage.setItem("query", query);
  }, [query]);

  useEffect(() => {
    api.search(query).then((data) => {
      ref.current = data;
      setProducts(data);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("sort", sort);
  }, [sort]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;

    let productsSorted: Product[] = sortProducts(value, products, ref.current);

    if (value === Select.Empty) setQuery("");

    setSort(value as Select);
    setProducts(productsSorted);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSort(Select.Empty);
  };

  return (
    <main>
      <select value={sort} name="select" id="select" onChange={handleSort}>
        <option value={Select.Empty}>Seleccionar...</option>
        <option value={Select.Abc}>Por nombre</option>
        <option value={Select.Price}>Por precio</option>
      </select>

      <h1>Tienda digitaloncy</h1>
      <input
        value={query}
        name="text"
        placeholder="tv"
        type="text"
        onChange={handleInput}
      />
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>{formatPrice(product.price)}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
