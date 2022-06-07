export type Term = {
  type: 'const',
  value: number
} | {
  type: 'variable',
  name: string
} | {
  type: 'multiply',
  values: [Term, Term]
}
export type DE = { target: string, terms: Term[] };
