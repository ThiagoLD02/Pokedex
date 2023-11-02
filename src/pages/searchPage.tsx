import { PokeballIcon } from "../assets/icons/pokeball.tsx";
import { PokemonCard } from "../components/pokemonCard";
import { api } from "../axios.ts";
import { useEffect, useRef, useState } from "react";

interface Pokemon {
  id: string;
  name: string;
  picture: string;
}

interface PokemonList {
  name: string;
  url: string;
}

export function SearchPage() {
  const [pokemonsToDisplay, setPokemonsToDisplay] = useState<Pokemon[]>([]);

  let pokemonData = useRef<PokemonList[]>([]);
  let scroolCount = useRef(0);
  let pokemonListSection: Element | null;

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async function getPokemonIDAndPicture(pokemonName: string) {
    const response = await api.get(`/pokemon/${pokemonName}`);
    let id;
    if (response.data.id >= 100) id = response.data.id.toString();
    else if (response.data.id >= 10) id = "0" + response.data.id.toString();
    else id = "00" + response.data.id.toString();

    const picture = response.data.sprites.other["official-artwork"]
      .front_default
      ? response.data.sprites.other["official-artwork"].front_default
      : response.data.sprites.front_default;

    return {
      id: id,
      picture: picture,
    };
  }

  async function handlePokemonListingResponse(
    data: PokemonList[]
  ): Promise<Pokemon[]> {
    let promisses = data.map(async (result) => {
      const { id, picture } = await getPokemonIDAndPicture(result.name);
      const pokemon = {
        id: id,
        name: capitalizeFirstLetter(result.name),
        picture: picture,
      };
      return pokemon;
    });

    const pokemons = await Promise.all(promisses);

    return pokemons;
  }

  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input: string = e.target.value.toLowerCase();
    if (input !== "") {
      const filteredPokemons = pokemonData.current.filter((pokemon) =>
        pokemon.name.includes(input)
      );
      if (filteredPokemons) {
        const pokemonList =
          filteredPokemons.length > 12
            ? filteredPokemons.slice(0, 12)
            : filteredPokemons;
        const pokemons = await handlePokemonListingResponse(pokemonList);
        setPokemonsToDisplay(pokemons);
      }
    }
  }

  function getPokemons(url: string) {
    api
      .get(url)
      .then(async (response) => {
        const results: PokemonList[] = response.data.results;

        const pokemonsDataToDisplay = results.slice(0, 15);
        const pokemons = await handlePokemonListingResponse(
          pokemonsDataToDisplay
        );
        setPokemonsToDisplay(pokemons);
        pokemonData.current = results;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getPokemons("/pokemon/?limit=1200");
    pokemonListSection = document.querySelector("#pokemonList");
    if (pokemonListSection)
      pokemonListSection.addEventListener("scroll", handleScroll);

    return () => {
      if (pokemonListSection)
        pokemonListSection.removeEventListener("scroll", handleScroll);
    };
  }, []);

  async function handleScroll() {
    if (pokemonListSection)
      if (
        pokemonListSection?.clientHeight + pokemonListSection?.scrollTop !==
        pokemonListSection?.scrollHeight
      ) {
        return;
      }

    const currentVal = scroolCount.current + 15;
    scroolCount.current = currentVal;
    const pokemons = await handlePokemonListingResponse(
      pokemonData.current.slice(currentVal, currentVal + 15)
    );

    setPokemonsToDisplay((oldState) => [...oldState, ...pokemons]);
  }

  return (
    <section className="w-full h-full flex flex-col bg-Primary px-3 pt-3 pb-6">
      <header className="w-full grid p-4 gap-2 h-min">
        <div className="flex gap-5 items-center justify-center">
          <PokeballIcon width={24} height={24} styles={"fill-white"} />
          <h1 className="text-headline text-white font-bold">Pokédex</h1>
        </div>

        <div className="text-white flex justify-between items-center gap-4">
          <input
            type="text"
            name="search"
            id="pokemonSearch"
            placeholder="Search"
            className="rounded-2xl py-2 pl-3 pr-4 w-full h-8 text-black"
            onChange={handleInputChange}
          />
        </div>
      </header>

      <main
        id="pokemonList"
        className="bg-Background pt-6 pb-0 px-3 w-full  h-[75%] m-auto overflow-scroll  rounded-md"
      >
        <div className="grid grid-cols-3  content-start  gap-2 w-full  mx-auto ">
          {pokemonsToDisplay.length > 0
            ? pokemonsToDisplay.map((pokemon) => (
                <PokemonCard
                  icon={pokemon.picture}
                  number={pokemon.id}
                  key={pokemon.id}
                  name={pokemon.name}
                />
              ))
            : ""}
        </div>
      </main>
    </section>
  );
}
