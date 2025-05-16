/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
  const res = await fetch('/api/bots');
  const bots = await res.json();
  return { bots };
}
