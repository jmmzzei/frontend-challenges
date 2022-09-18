import type { Pokemon } from "./types";

import { useMemo, useState, useEffect } from "react";

import { POKEMONS } from "./constants";

function App() {
  const [cart, setCart] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>(POKEMONS);
  const [favorites, setFavorites] = useState<Pokemon[]>(() =>
    JSON.parse(localStorage.getItem("fav") || "[]")
  );

  const cartTotal = useMemo(
    () => cart.reduce((acc, curr) => acc + curr.price, 0),
    [cart]
  );

  const handleAddToCart = (pokemon: Pokemon) => {
    if (cartTotal + pokemon.price > 10) return;
    setCart((cart) => cart.concat(pokemon));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: search },
    } = e;

    setFilteredPokemons(
      POKEMONS.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const isFavorite = (id: Pokemon["id"]) =>
    favorites.find((fav) => fav.id == id);

  const handleAddToFavorites = (pokemon: Pokemon) => {
    if (isFavorite(pokemon.id)) {
      setFavorites((favorites) =>
        favorites.filter((favorite) => favorite.id !== pokemon.id)
      );
      return;
    }

    setFavorites((favorites) => favorites.concat(pokemon));
  };

  useEffect(() => {
    localStorage.setItem("fav", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <>
      <nav>
        <input
          className="nes-input"
          id="name_field"
          placeholder="Charmander"
          type="text"
          onChange={handleSearch}
        />
      </nav>
      <section>
        {filteredPokemons.map((pokemon) => (
          <article key={pokemon.id}>
            <figure onClick={() => handleAddToFavorites(pokemon)}>
              <i
                className={
                  isFavorite(pokemon.id)
                    ? "nes-icon is-medium heart"
                    : "nes-icon is-medium is-transparent heart"
                }
              />
              <img className="nes-container" src={pokemon.image} />
            </figure>
            <div>
              <p>
                {pokemon.name} (${pokemon.price})
              </p>
              <p>{pokemon.description}</p>
            </div>
            <button
              className="nes-btn"
              onClick={() => handleAddToCart(pokemon)}
            >
              Agregar
            </button>
          </article>
        ))}
      </section>
      <aside>
        <button className="nes-btn is-primary">
          0 items (total ${cartTotal})
        </button>
      </aside>
    </>
  );
}

export default App;
