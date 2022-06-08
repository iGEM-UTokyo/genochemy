export type Term =
  | {
      type: "const";
      value: number;
    }
  | {
      type: "variable";
      name: string;
    }
  | {
      type: "multiply";
      values: [Term, Term];
    }
  | {
      type: "hill";
      const: Term;
      deg: Term;
      value: Term;
    }
  | {
      type: "hillrev";
      const: Term;
      deg: Term;
      value: Term;
    };
export type DE = { target: string; terms: Term[] };
