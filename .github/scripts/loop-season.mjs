import { readFileSync, writeFileSync } from 'node:fs';

const path = 'profile-3d-contrib/profile-season-animate.svg';
const svg = readFileSync(path, 'utf8');
const looped = svg.replace(/<animate(?:Transform)?\b[^>]*>/g, tag => {
  const values = tag.match(/\bvalues="([^"]+)"/)?.[1].split(';');
  if (!values || values.length < 2 || !tag.includes('dur="3s" repeatCount="1"')) {
    throw new Error('Unexpected seasonal animation timing');
  }

  // Keep the original keyframes in the first three seconds of a 30-second cycle.
  const times = values.map((_, i) => i / (values.length - 1) / 10);
  return tag.replace(/values="[^"]+"/, `values="${[...values, values.at(-1)].join(';')}"`)
    .replace('dur="3s" repeatCount="1"', `keyTimes="${[...times, 1].join(';')}" dur="30s" repeatCount="indefinite"`);
});
if (looped === svg) throw new Error('Seasonal SVG has no animations');
writeFileSync(path, looped);
