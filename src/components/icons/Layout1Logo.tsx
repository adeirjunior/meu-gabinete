type Prop = {
  className: string;
};

export default function Layout1Logo({ className }: Prop) {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="80"
      viewBox="0 0 500.000000 500.000000"
      preserveAspectRatio="xMidYMid meet"
      className={`${className}`}
    >
      <g
        transform="translate(-250.000000,720.000000) scale(0.200000,-0.200000)"
        fill="#ffffff"
        stroke="none"
      >
        <path
          d="M2995 3010 l-160 -160 93 0 92 0 0 -27 c0 -37 -23 -120 -43 -159 -23
-45 -118 -128 -181 -159 -77 -38 -221 -65 -346 -65 -218 0 -437 -33 -572 -87
l-68 -26 0 -73 0 -74 53 21 c174 70 260 87 497 99 312 16 462 51 588 137 77
52 144 141 182 239 21 52 24 81 28 254 2 107 3 205 1 218 -3 19 -27 0 -164
-138z"
        />
        <path
          d="M3060 2395 c-50 -51 -158 -122 -235 -154 -100 -41 -166 -52 -395 -61
-276 -12 -385 -30 -542 -92 l-78 -31 0 -73 c0 -41 2 -74 5 -74 3 0 27 11 54
24 54 28 195 70 286 86 33 5 150 14 260 19 110 5 236 17 280 26 177 35 309
132 379 278 21 42 36 82 34 87 -2 6 -23 -10 -48 -35z"
        />
        <path
          d="M2454 1838 c-18 -40 -22 -43 -62 -46 l-43 -3 31 -35 c22 -25 29 -42
25 -59 -3 -14 -7 -36 -10 -50 l-6 -26 42 28 42 27 47 -26 47 -26 -10 50 c-10
51 -10 51 26 85 l37 33 -49 0 c-49 0 -49 0 -67 45 -9 25 -20 45 -24 45 -3 0
-15 -19 -26 -42z"
        />
        <path
          d="M2154 1765 c-11 -29 5 -65 29 -65 41 0 62 30 45 63 -11 21 -66 23
-74 2z"
        />
        <path
          d="M2730 1761 c-17 -34 4 -63 43 -59 29 3 32 6 32 38 0 32 -3 35 -32 38
-24 2 -34 -2 -43 -17z"
        />
      </g>
    </svg>
  );
}