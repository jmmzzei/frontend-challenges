import type { Pokemon } from "./types";

import { useMemo, useCallback, useState, useEffect } from "react";

import { POKEMONS } from "./constants";
import PokemonCard from "./PokemonCard";

function App() {
  const [cart, setCart] = useState<Pokemon[]>(() =>
    JSON.parse(localStorage.getItem("cart") ?? "[]")
  );

  const cartTotal = useMemo(
    () => cart.reduce((accum, curr) => accum + curr.price * curr.quantity, 0),
    [cart]
  );

  const handleAdd = useCallback((pokemon: Pokemon) => {
    pokemon.quantity = 1;
    setCart((cart) => [...cart, pokemon]);
  }, []);

  const handleIncrement = useCallback((id: Pokemon["id"]) => {
    setCart((cart) =>
      cart.map((poke) =>
        poke.id === id ? { ...poke, quantity: poke.quantity + 1 } : poke
      )
    );
  }, []);

  const handleDecrement = useCallback((id: Pokemon["id"]) => {
    setCart((cart) =>
      cart
        .map((poke) =>
          poke.id === id ? { ...poke, quantity: poke.quantity - 1 } : poke
        )
        .filter((poke) => poke.quantity)
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <nav>
        <input
          className="nes-input"
          id="name_field"
          placeholder="Charmander"
          type="text"
        />
      </nav>
      <section>
        {POKEMONS.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            pokemonInCart={cart.find((poke) => poke.id == pokemon.id)}
            onAdd={handleAdd}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        ))}
      </section>
      <aside>
        <button className="nes-btn is-primary">
          {cart.length} items (total ${cartTotal})
        </button>
      </aside>
    </>
  );
}

export default App;
