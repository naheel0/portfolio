export const BRAND_COLORS: Record<string, string> = {
  react: "#61DAFB",
  vite: "#646CFF",
  tailwind: "#38BDF8",
  typescript: "#3178C6",
  "asp.net": "#512BD4",
  ".net": "#512BD4",
  dotnet: "#512BD4",
  "c#": "#68217A",
  csharp: "#68217A",
  "entity framework": "#512BD4",
  "ef core": "#512BD4",
  "sql server": "#CC2927",
  mssql: "#CC2927",
  sql: "#E38C00",
  postgres: "#336791",
  mongodb: "#47A248",
  mysql: "#4479A1",
  redis: "#FF4438",
  prisma: "#2D3748",
  javascript: "#F7DF1E",
  html: "#E34F26",
  css: "#1572B6",
  bootstrap: "#7952B3",
  node: "#339933",
  npm: "#CB3837",
  yarn: "#2C8EBB",
  git: "#F05032",
  github: "#E6EDF3",
  docker: "#2496ED",
  python: "#3776AB",
  java: "#007396",
  figma: "#F24E1E",
  aws: "#FF9900",
  google: "#4285F4",
  firebase: "#FFCA28",
  vercel: "#E6EDF3",
  netlify: "#00C7B7",
  razorpay: "#3395FF",
  jwt: "#E3B341",
  cloudinary: "#3448C5",
  swagger: "#85EA2D",
  stripe: "#635BFF",
  graphql: "#E10098",
  redux: "#764ABC",
  next: "#E6EDF3",
};

const BRAND_ICON_COLORS: Record<string, string> = {
  fareact: "#61DAFB",
  sireact: "#61DAFB",
  fireact: "#61DAFB",
  "tb brandreact": "#61DAFB",
  "tb brand react": "#61DAFB",
  sinextdotjs: "#E6EDF3",
  sitailwindcss: "#38BDF8",
  sitypescript: "#3178C6",
  sitdotnet: "#512BD4",
  "tb brandcsharp": "#68217A",
  "tb brand c sharp": "#68217A",
  didotnet: "#512BD4",
  dimsqlserver: "#CC2927",
  sidatabase: "#E38C00",
  didatabase: "#E38C00",
  sireazorpay: "#3395FF",
  facloud: "#3448C5",
  tblock: "#E3B341",
  tbserver: "#7C3AED",
  faustertie: "#58a6ff",
  falock: "#E3B341",
  "fajs": "#F7DF1E",
  "fahmtml5": "#E34F26",
  "facss3alt": "#1572B6",
  "fadocker": "#2496ED",
  "fapython": "#3776AB",
  "fajava": "#007396",
  "sipostgresql": "#336791",
  "simongodb": "#47A248",
  "siredis": "#FF4438",
  "sifirebase": "#FFCA28",
  "sivercel": "#E6EDF3",
  "sinetlify": "#00C7B7",
};

export function techBrandColor(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [term, color] of Object.entries(BRAND_COLORS)) {
    if (lower.includes(term)) return color;
  }
  return null;
}

export function iconKeyBrandColor(icon?: string | null): string | null {
  if (!icon) return null;
  const lower = icon.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const [key, color] of Object.entries(BRAND_ICON_COLORS)) {
    if (lower === key) return color;
  }
  return null;
}
