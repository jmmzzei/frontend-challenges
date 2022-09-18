import type { Pokemon } from "./types";
import { memo } from "react";

type PokemonCardProps = {
  pokemon: Pokemon;
  pokemonInCart: Pokemon;
  onAdd: (pokemon: Pokemon) => void;
  onIncrement: (pokemon: Pokemon) => void;
  onDecrement: (pokemon: Pokemon) => void;
};

function PokemonCard({
  pokemon,
  onAdd,
  pokemonInCart,
  onDecrement,
  onIncrement,
}: PokemonCardProps) {
  return (
    <article key={pokemon.id}>
      <img className="nes-container" src={pokemon.image} />
      <div>
        <p>
          {pokemon.name}
          <span> ${pokemon.price}</span>
        </p>
        <p>{pokemon.description}</p>
      </div>
      {pokemonInCart ? (
        <div>
          <button onClick={() => onDecrement(pokemon)}>-</button>
          <p>{pokemonInCart.quantity}</p>
          <button onClick={() => onIncrement(pokemon)}>+</button>
        </div>
      ) : (
        <button className="nes-btn" onClick={() => onAdd(pokemon)}>
          Agregar
        </button>
      )}
    </article>
  );
}


export default memo(PokemonCard);
