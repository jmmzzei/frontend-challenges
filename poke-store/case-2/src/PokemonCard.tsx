import type { Pokemon, FC } from "./types";
import { memo } from "react";

type PokemonCardContainerProps = {
  pokemon: Pokemon;
};

export const PokemonCardContainer: FC<PokemonCardContainerProps> = ({
  children,
  pokemon,
}) => {
  return (
    <article>
      <img className="nes-container" src={pokemon.image} />
      <div>
        <p>
          {pokemon.name}
          <span> ${pokemon.price}</span>
        </p>
        <p>{pokemon.description}</p>
      </div>
      {children}
    </article>
  );
};

type PokemonCardProps = {
  pokemon: Pokemon;
  pokemonInCart: Pokemon;
  onAdd: (pokemon: Pokemon) => void;
  onIncrement: (id: Pokemon["id"]) => void;
  onDecrement: (id: Pokemon["id"]) => void;
};

function PokemonCard({
  pokemon,
  onAdd,
  pokemonInCart,
  onDecrement,
  onIncrement,
}: PokemonCardProps) {
  if (pokemonInCart)
    return (
      <PokemonCardContainer pokemon={pokemon}>
        <div>
          <button onClick={() => onDecrement(pokemon.id)}>-</button>
          <p>{pokemonInCart.quantity}</p>
          <button onClick={() => onIncrement(pokemon.id)}>+</button>
        </div>
      </PokemonCardContainer>
    );

  return (
    <PokemonCardContainer pokemon={pokemon}>
      <button className="nes-btn" onClick={() => onAdd(pokemon)}>
        Agregar
      </button>
    </PokemonCardContainer>
  );
}

export default memo(PokemonCard);
