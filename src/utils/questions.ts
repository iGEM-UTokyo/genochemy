import { MessagesAddresses } from "@/messages";
import { JsonFormatV1 } from "./importer";

interface Question {
  name: MessagesAddresses;
  imgs: string[];
  answer?: JsonFormatV1;
  hint?: JsonFormatV1;
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
    name: "questions.1",
    imgs: ["question1.png"],
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
    name: "questions.2",
    imgs: ["question2.png"],
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
    name: "questions.3",
    imgs: ["question2-5.png"],
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
    name: "questions.4",
    imgs: ["question3.png"],
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
    name: "questions.5",
    imgs: ["question4-1.png", "question4-2.png"],
    answer: [
      {
        blocks: ["prom-const-1", "ctrl-EL222", "term-1"],
      },
      {
        blocks: ["prom-activ-EL222dim", "ctrl-RepressorA", "term-1"],
      },
      {
        blocks: ["prom-repr-RepressorADrugA", "visi-mCherry", "term-1"],
      },
    ],
  },
  {
    name: "questions.6",
    imgs: ["question5.png"],
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
    name: "questions.7",
    imgs: ["question6.png"],
    answer: [
      {
        blocks: [
          "prom-const-1",
          "ctrl-EL222",
          "seq-recog-recomb1",
          "term-1",
          "seq-recog-recomb1",
          "visi-GFP",
          "term-1",
        ],
      },
      {
        blocks: ["prom-activ-EL222dim", "meta-recomb1", "term-1"],
      },
    ],
  },
  {
    name: "questions.8",
    imgs: ["question6-5.png"],
    answer: [
      {
        blocks: [
          "prom-const-1",
          "ctrl-PhyB",
          "ctrl-PIF3",
          "seq-recog-recomb1",
          "visi-GFP",
          "term-1",
          "seq-recog-recomb1",
          "visi-mCherry",
          "term-1",
        ],
      },
      {
        blocks: ["prom-activ-PhyBPIF3", "meta-recomb1", "term-1"],
      },
    ],
  },
  {
    name: "questions.9",
    imgs: ["question7.png"],
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
        blocks: ["prom-activ-EL222dim", "meta-recomb1", "term-1"],
      },
      {
        blocks: [
          "prom-activ-PhyBPIF3",
          "seq-recog-recomb1",
          "meta-kill",
          "term-1",
          "seq-recog-recomb1",
          "visi-GFP",
          "term-1",
        ],
      },
    ],
  },
];

export default questions;
