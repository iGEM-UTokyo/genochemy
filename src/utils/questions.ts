import { JsonFormat } from "./importer";

interface Question {
  name: string;
  imgs: string[];
  answer?: JsonFormat;
  hint?: JsonFormat;
  assert?: {
    inputs: string[];
    outputs: string[];
    assertions: Assertion[];
  };
}

type Assertion =
  | {
      type: "keep";
      description: string;
      eval: (outputs: Record<string, number>) => boolean;
      ms: number;
    }
  | {
      type: "once";
      description: string;
      eval: (outputs: Record<string, number>) => boolean;
    }
  | {
      type: "wait";
      ms: number;
    }
  | {
      type: "set";
      name: string;
      value: number;
    };
const questions: Question[] = [
  {
    name: "Green Creature",
    imgs: ["Question1.png"],
    answer: [
      {
        blocks: ["prom-const-1", "visi-GFP", "term-1"],
      },
    ],
    assert: {
      inputs: [],
      outputs: ["protein-GFP"],
      assertions: [
        {
          type: "keep",
          eval: (outputs) => outputs["protein-GFP"] >= 0.8,
          ms: 3000,
          description: "keeps green fluorescence",
        },
      ],
    },
  },
  {
    name: "Blue makes green",
    imgs: ["Question2.png"],
    answer: [
      {
        blocks: ["prom-const-1", "ctrl-EL222", "term-1"],
      },
      {
        blocks: ["prom-activ-EL222dim", "visi-GFP", "term-1"],
      },
    ],
  },
  {
    name: "Killer Light",
    imgs: ["Question2.5.png"],
    answer: [
      {
        blocks: ["prom-const-1", "ctrl-PhyB", "ctrl-PIF3", "term-1"],
      },
      {
        blocks: ["prom-activ-PhyBPIF3", "meta-kill", "term-1"],
      },
    ],
  },
  {
    name: "Drug Addict",
    imgs: ["Question3.png"],
    answer: [
      {
        blocks: ["prom-const-1", "ctrl-RepressorA", "term-1"],
      },
      {
        blocks: ["prom-repr-RepressorADrugA", "visi-mCherry", "term-1"],
      },
    ],
  },
  {
    name: "NAND Gate",
    imgs: ["Question4-1.png", "Question4-2.png"],
  },
  {
    name: "Short Temper",
    imgs: ["Question5.png"],
    answer: [
      {
        blocks: [
          "prom-const-1",
          "meta-recomb1",
          "seq-recog-recomb1",
          "visi-GFP",
          "seq-recog-recomb1",
          "term-1",
        ],
      },
    ],
  },
  {
    name: "Blue makes infinitely green",
    imgs: ["Question6.png"],
  },
  {
    name: "Green to Red",
    imgs: ["Question6.5.png"],
  },
  {
    name: "Optopass",
    imgs: ["Question7.png"],
    answer: [
      {
        blocks: [
          "prom-const-1",
          "ctrl-EL222",
          "ctrl-PhyB",
          "ctrl-PIF3",
          "term-1",
        ],
      },
      {
        blocks: [
          "prom-activ-EL222dim",
          "seq-recog-recomb2",
          "meta-recomb1",
          "term-1",
          "seq-recog-recomb2",
          "visi-GFP",
          "term-1",
        ],
      },
      {
        blocks: [
          "prom-activ-PhyBPIF3",
          "seq-recog-recomb1",
          "meta-kill",
          "term-1",
          "seq-recog-recomb1",
          "meta-recomb2",
          "term-1",
        ],
      },
    ],
  },
];

export default questions;
