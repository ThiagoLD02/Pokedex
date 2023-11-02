import { Link } from "react-router-dom";
import { ArrowLeft } from "../assets/icons/arrowLeft.tsx";
import { PokeballIcon } from "../assets/icons/pokeball.tsx";
import { Ruler } from "../assets/icons/ruler.tsx";
import { Weight } from "../assets/icons/weight.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../axios.ts";

interface PokemonInfo {
  name: string;
  number: string;
  picture: string;
  types: {
    capName: string;
    name: string;
  }[];
  weight: number;
  height: number;
  moves: string[];
  description: string;
  stats: {
    hp: number;
    atk: number;
    def: number;
    satk: number;
    sdef: number;
    spd: number;
  };
}

export function Pokemon() {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo>({
    name: "",
    number: "",
    picture: "",
    types: [
      {
        capName: "",
        name: "primary",
      },
    ],
    weight: 0,
    height: 0,
    moves: [""],
    description: "",
    stats: {
      hp: 0,
      atk: 0,
      def: 0,
      satk: 0,
      sdef: 0,
      spd: 0,
    },
  });

  const location = useLocation();
  const name: string = location.state;
  const lowerCaseName = name.toLowerCase();
  const navigate = useNavigate();

  useEffect(() => {
    const pokemonPromise = api.get(`/pokemon/${lowerCaseName}`);
    const pokemonSpecies = api.get(`/pokemon-species/${lowerCaseName}`);

    Promise.all([pokemonPromise, pokemonSpecies])
      .then((response) => {
        const data = response[0].data;

        let id;
        if (data.id >= 100) id = data.id.toString();
        else if (data.id >= 10) id = "0" + data.id.toString();
        else id = "00" + data.id.toString();

        const picture = data.sprites.other["official-artwork"].front_default
          ? data.sprites.other["official-artwork"].front_default
          : data.sprites.front_default;

        const pokemonSpeciesData = response[1].data;
        let description = "";

        pokemonSpeciesData.flavor_text_entries.forEach(
          (element: { language: { name: string }; flavor_text: string }) => {
            if (element.language.name === "en")
              description = element.flavor_text;
          }
        );

        const pokeInfo = {
          name: name,
          number: id,
          height: data.height / 10,
          weight: data.weight / 10,
          picture: picture,
          moves: data.abilities.map((element: { ability: { name: string } }) =>
            capitalizeFirstLetter(element.ability.name)
          ),
          types: data.types.map((element: { type: { name: string } }) => {
            return {
              capName: capitalizeFirstLetter(element.type.name),
              name: element.type.name,
            };
          }),
          stats: {
            hp: data.stats[0].base_stat,
            atk: data.stats[1].base_stat,
            def: data.stats[2].base_stat,
            satk: data.stats[3].base_stat,
            sdef: data.stats[4].base_stat,
            spd: data.stats[5].base_stat,
          },
          description: description,
        };

        setPokemonInfo((oldState) => ({
          ...oldState,
          ...pokeInfo,
        }));
      })
      .catch((err) => {
        alert("Falha ao adquirir dados do Pokemon");
        console.log(err);

        navigate("/");
      });

    function capitalizeFirstLetter(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }, []);

  return (
    <main
      className="w-full h-full flex flex-col px-3 pt-3 pb-6"
      style={{ backgroundColor: `var(--color-${pokemonInfo.types[0].name})` }}
    >
      <header className="flex h-[208px]">
        <div className="flex w-full h-20 relative justify-between top-0 items-center text-white">
          <div className="flex items-center gap-2">
            <Link to="/">
              {" "}
              <ArrowLeft />{" "}
            </Link>
            <h1 className="text-headline">{pokemonInfo.name}</h1>
          </div>
          <p className="text-subtitle2">#{pokemonInfo.number}</p>
        </div>
        <div className="right-0 absolute">
          <PokeballIcon
            width={208}
            height={208}
            styles={"fill-white opacity-10"}
          />
        </div>
      </header>

      <section className="bg-Background mt-2 pt-6 pb-0 px-3 w-full h-[calc(80%-104px)] mx-auto rounded-md flex flex-col">
        {pokemonInfo.picture !== "" ? (
          <img
            width={200}
            height={200}
            src={pokemonInfo.picture}
            className={
              "relative -top-[128px] right-[calc(50%-104px)] left-[calc(50%-104px)] h-[200px] w-[200px]"
            }
          />
        ) : (
          ""
        )}
        <div className="relative -top-[128px]">
          <header className="flex flex-col w-full text-center gap-8 mt-4">
            <div className="flex gap-8 w-full justify-center">
              {pokemonInfo.types.map((type) => (
                <div
                  className={
                    "text-subtitle3 font-bold text-white rounded-xl px-2 py-1 w-fit"
                  }
                  style={{ backgroundColor: `var(--color-${type.name})` }}
                  key={type.capName}
                >
                  <p>{type.capName}</p>
                </div>
              ))}
            </div>
            <h3
              style={{
                color: `var(--color-${pokemonInfo.types[0].name})`,
                fontWeight: "bold",
              }}
            >
              {" "}
              About
            </h3>
          </header>

          <section className="grid grid-cols-3 mt-8">
            <div className="flex flex-col items-center justify-between">
              <div className="flex w-fit gap-2 ">
                <Weight width={16} height={16} />
                <h4 className="text-subtitle3">{pokemonInfo.weight} Kg</h4>
              </div>
              <p className="text-caption font-light">Weight</p>
            </div>

            <div className="flex flex-col items-center justify-between border-x-2">
              <div className="flex w-fit gap-2 ">
                <Ruler width={16} height={16} />
                <h4 className="text-subtitle3">{pokemonInfo.height} m</h4>
              </div>
              <p className="text-caption font-light">Height</p>
            </div>

            <div className="flex flex-col items-center justify-between">
              <div className="text-start">
                {pokemonInfo.moves.map((move) => (
                  <p key={move} className="text-subtitle3">
                    {move}
                  </p>
                ))}
              </div>
              <p className="text-caption font-light">Moves</p>
            </div>
          </section>

          <p className="mt-8 text-subtitle3">{pokemonInfo.description}</p>

          <h1
            className={"mt-8 text-body1 text-center"}
            style={{
              color: `var(--color-${pokemonInfo.types[0].name})`,
              fontWeight: "bold",
            }}
          >
            Base Stats
          </h1>

          <section className="flex">
            <div className="border-r-2 p-2">
              <p style={{ color: `var(--color-${pokemonInfo.types[0].name})` }}>
                HP
              </p>
              <p style={{ color: `var(--color-${pokemonInfo.types[0].name})` }}>
                ATK
              </p>
              <p style={{ color: `var(--color-${pokemonInfo.types[0].name})` }}>
                DEF
              </p>
              <p style={{ color: `var(--color-${pokemonInfo.types[0].name})` }}>
                SATK
              </p>
              <p style={{ color: `var(--color-${pokemonInfo.types[0].name})` }}>
                SDEF
              </p>
              <p style={{ color: `var(--color-${pokemonInfo.types[0].name})` }}>
                SPD
              </p>
            </div>

            <div className="flex grid-cols-[] w-full p-2">
              <div className="w-1/6 text-center">
                <p>{pokemonInfo.stats.hp}</p>
                <p>{pokemonInfo.stats.atk}</p>
                <p>{pokemonInfo.stats.def}</p>
                <p>{pokemonInfo.stats.satk}</p>
                <p>{pokemonInfo.stats.sdef}</p>
                <p>{pokemonInfo.stats.spd}</p>
              </div>
              <div className="grid items-center flex-[1]">
                <div
                  className="w-full h-1 rounded-xl"
                  style={{
                    backgroundColor: `var(--color-${pokemonInfo.types[0].name}-opacity-30)`,
                  }}
                >
                  <div
                    className={`h-1 rounded-xl`}
                    style={{
                      width: `${pokemonInfo.stats.hp / 2}%`,
                      backgroundColor: `var(--color-${pokemonInfo.types[0].name})`,
                    }}
                  />
                </div>
                <div
                  className="w-full h-1 rounded-xl "
                  style={{
                    backgroundColor: `var(--color-${pokemonInfo.types[0].name}-opacity-30)`,
                  }}
                >
                  <div
                    className={`h-1 rounded-xl `}
                    style={{
                      width: `${pokemonInfo.stats.atk / 2}%`,
                      backgroundColor: `var(--color-${pokemonInfo.types[0].name})`,
                    }}
                  />
                </div>
                <div
                  className="w-full h-1 rounded-xl "
                  style={{
                    backgroundColor: `var(--color-${pokemonInfo.types[0].name}-opacity-30)`,
                  }}
                >
                  <div
                    className={`h-1 rounded-xl `}
                    style={{
                      width: `${pokemonInfo.stats.def / 2}%`,
                      backgroundColor: `var(--color-${pokemonInfo.types[0].name})`,
                    }}
                  />
                </div>
                <div
                  className="w-full h-1 rounded-xl "
                  style={{
                    backgroundColor: `var(--color-${pokemonInfo.types[0].name}-opacity-30)`,
                  }}
                >
                  <div
                    className={`h-1 rounded-xl `}
                    style={{
                      width: `${pokemonInfo.stats.satk / 2}%`,
                      backgroundColor: `var(--color-${pokemonInfo.types[0].name})`,
                    }}
                  />
                </div>
                <div
                  className="w-full h-1 rounded-xl "
                  style={{
                    backgroundColor: `var(--color-${pokemonInfo.types[0].name}-opacity-30)`,
                  }}
                >
                  <div
                    className={`h-1 rounded-xl `}
                    style={{
                      width: `${pokemonInfo.stats.sdef / 2}%`,
                      backgroundColor: `var(--color-${pokemonInfo.types[0].name})`,
                    }}
                  />
                </div>
                <div
                  className="w-full h-1 rounded-xl "
                  style={{
                    backgroundColor: `var(--color-${pokemonInfo.types[0].name}-opacity-30)`,
                  }}
                >
                  <div
                    className={`h-1 rounded-xl `}
                    style={{
                      width: `${pokemonInfo.stats.spd / 2}%`,
                      backgroundColor: `var(--color-${pokemonInfo.types[0].name})`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
