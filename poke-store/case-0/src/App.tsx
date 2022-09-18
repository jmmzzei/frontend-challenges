import { useEffect, useState } from "react";

import api from "./api";
import { Pokemon } from "./types";

enum Status {
  Pending,
  Loading,
  Resolved,
  Rejected,
}

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [status, setStatus] = useState<Status>(Status.Pending);
  const [cart, setCart] = useState<Pokemon[]>([]);

  useEffect(() => {
    api
      .list()
      .then((data) => {
        setStatus(Status.Resolved);
        setPokemons(data);
      })
      .catch((err) => {
        setStatus(Status.Rejected);
      });
  }, []);

  const handleClick = (pokemon: Pokemon) => {
    if (cart.length >= 3) return;

    if (cart.includes(pokemon)) return;

    setCart((cart) => cart.concat(pokemon));
  };

  if (status === Status.Rejected) return null;
  if (status == Status.Loading || status == Status.Pending)
    return <p>Cargando...</p>;

  return (
    <>
      <section>
        {pokemons.map((pokemon) => (
          <article key={pokemon.id}>
            <img className="nes-container" src={pokemon.image} />
            <div>
              <p>
                {pokemon.name} <span>${pokemon.price}</span>
              </p>
              <p>{pokemon.description}</p>
            </div>
            <button className="nes-btn" onClick={() => handleClick(pokemon)}>
              Agregar
            </button>
          </article>
        ))}
      </section>
      <aside>
        <button className="nes-btn is-primary">{cart.length} items</button>
      </aside>
    </>
  );
}

export default App;
