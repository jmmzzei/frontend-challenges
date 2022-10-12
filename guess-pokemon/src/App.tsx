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

type Counter = {
  aciertos: number;
  errores: number;
};

const getCounterObj = (counter: Counter, match: boolean) => {
  let key = match ? "aciertos" : "errores";

  return { ...counter, [key]: counter[key] + 1 };
};

function App() {
  const {
    pokemon: { data, status },
    refetch,
  } = usePoke();
  const [guess, setGuess] = useState("");
  const [counter, setCounter] = useState<Counter>(
    () =>
      JSON.parse(localStorage.getItem("counter")) || { aciertos: 0, errores: 0 }
  );

  useEffect(() => {
    localStorage.setItem("counter", JSON.stringify(counter));
  }, [counter]);

  if (status === "rejected") return null;
  if (status === "loading") return <div>Cargando...</div>;

  const handleReplay = () => {
    refetch();
    setGuess("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const guessValue = e.target["guess"].value.toLowerCase();

    setGuess(guessValue);
    setCounter((counter) => getCounterObj(counter, guessValue == data?.name));

    e.target["guess"].value = "";
  };

  return (
    <main>
      <section>
        <div>aciertos: {counter.aciertos}</div>
        <div>errores: {counter.errores}</div>
      </section>
      Let&apos;s get this party started
      <form onSubmit={handleSubmit}>
        <input
          name="guess"
          type="text"
          onFocus={() => guess && handleReplay()}
        />
        <button type="submit">Submit Guess</button>
      </form>
      <button onClick={handleReplay}>Replay</button>
      <Card guess={guess} pokemon={data} />
    </main>
  );
}

type CardProps = {
  pokemon: Pokemon | null;
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
