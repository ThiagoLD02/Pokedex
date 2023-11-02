interface RulerIconParams {
  width: number;
  height: number;
}

export function Ruler({ width, height }: RulerIconParams) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 48 48"
    >
      <path
        fill="#1D1D1D"
        d="M7 36c-.8 0-1.5-.3-2.1-.9-.6-.6-.9-1.3-.9-2.1V15c0-.767.3-1.458.9-2.075C5.5 12.308 6.2 12 7 12h34c.8 0 1.5.308 2.1.925.6.617.9 1.308.9 2.075v18c0 .8-.3 1.5-.9 2.1-.6.6-1.3.9-2.1.9H7zm0-3h34V15h-6.5v9h-3v-9h-6v9h-3v-9h-6v9h-3v-9H7v18zm6.5-9h3-3zm9 0h3-3zm9 0h3-3z"
      ></path>
    </svg>
  );
}
