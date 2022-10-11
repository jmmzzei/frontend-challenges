import { useEffect, useState } from "react";
import type { VFC } from "react";
import api from "./api";
import { Pokemon } from "./types";

type Status = "loading" | "resolved" | "rejected";

type Data = {
  data: Pokemon | null;
  status: Status;
};

const usePoke = () => {
  const [pokemon, setPokemon] = useState<Data>({
    data: null,
    status: "loading",
  });

  const fetchPoke = () => {
    api
      .random()
      .then((data) => {
        setPokemon({ data, status: "resolved" });
      })
      .catch((_err) => setPokemon({ data: null, status: "resolved" }));
  };

  useEffect(() => {
    fetchPoke();
  }, []);

  return { pokemon, refetch: fetchPoke };
};

function App() {
  const {
    pokemon: { data, status },
    refetch,
  } = usePoke();
  const [guess, setGuess] = useState("");

  if (status === "rejected") return null;
  if (status === "loading") return <div>Cargando...</div>;

  const handleReplay = () => {
    refetch();
    setGuess("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGuess(e.target["guess"].value.toLowerCase());
    e.target["guess"].value = "";
  };

  return (
    <main>
      Let&apos;s get this party started
      <form onSubmit={(e) => handleSubmit(e)}>
        <input name="guess" type="text" />
        <button type="submit">Submit Guess</button>
      </form>
      <button onClick={handleReplay}>Replay</button>
      <Card guess={guess} pokemon={data} />
    </main>
  );
}

type CardProps = {
  pokemon: Pokemon;
  guess: string;
};

export const Card: VFC<CardProps> = ({ pokemon, guess }) => {
  if (!pokemon) return null;

  if (guess === "")
    return (
      <div>
        <div className="shallowImg"></div>
        <div className="shallowName"></div>
      </div>
    );

  const match = guess === pokemon.name;

  return (
    <>
      <div>
        <img
          alt={pokemon.name}
          height={60}
          loading="lazy"
          src={pokemon.image}
        />
        <p>{pokemon.name}</p>
      </div>
      {match && <h1>YES, SUCCESS!</h1>}
    </>
  );
};

export default App;
