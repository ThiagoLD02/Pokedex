import { Link } from "react-router-dom";

interface PokemonCardProps {
  icon: string;
  number: string;
  name: string;
}

export function PokemonCard({ number, icon, name }: PokemonCardProps) {
  return (
    <Link to="/pokemon" state={name} className="w-fit h-fit">
      <div className="border w-[104px] min-h-[108px] text-center grid justify-center py-2 px-1 h-fit ">
        <p className="text-end text-caption">#{number}</p>
        <img src={icon} alt="Pokemon Picture" />
        <h3 className="text-body3">{name}</h3>
      </div>
    </Link>
  );
}
