import { Messages } from ".";

const ja: Messages = {
  matter: {
    promT7: {
      name: "常時発現",
      description: "常に一定の割合で下流を転写します。",
    },
    promReprRepressorADrugA: {
      name: "リプレッサーA結合性プロモーター",
      description:
        "活性化されたリプレッサーAが結合すると下流の転写が抑制されます。",
    },
    promActivEL222dim: {
      name: "EL222結合性プロモーター",
      description:
        "EL222の二量体が結合し、それにより下流の転写が促進されます。",
    },
    promActivPhyBPIF3: {
      name: "PhyB-PIF3結合性プロモーター",
      description:
        "PhyB-PIF3のヘテロ二量体が結合し、それにより下流の転写が促進されます。",
    },
    visiGFP: {
      name: "GFP",
      description: "緑色の蛍光を発します。",
    },
    visiMCherry: {
      name: "mCherry",
      description:
        "薬剤Aと結合すると活性化し、リプレッサーA結合プロモーター下流の転写を阻害します。",
    },
    ctrlRepressorA: {
      name: "リプレッサーA",
      description:
        "薬剤Aと結合すると活性化し、リプレッサーA結合プロモーター下流の転写を阻害します。",
    },
    ctrlEL222: {
      name: "EL222",
      description: "青色光によって二量体を形成します。",
    },
    ctrlPhyB: {
      name: "PhyB",
      description: "赤色光によってPIF3とヘテロ二量体を形成します。",
    },
    ctrlPIF3: {
      name: "PIF3",
      description: "赤色光によってPhyBとヘテロ二量体を形成します。",
    },
    metaRecombA: {
      name: "リコンビナーゼI",
      description: "認識配列Iに挟まれた配列を切り出します。",
    },
    metaRecombB: {
      name: "リコンビナーゼII",
      description: "認識配列IIに挟まれた配列を切り出します。",
    },
    metaKill: {
      name: "キルスイッチ",
      description: "標的生物を死滅させます。",
    },
  },
  block: {
    promConst1: {
      displayName: "常時発現",
      description: "常に一定の割合で下流を転写します。",
    },
    promReprRepressorADrugA: {
      displayName: "リプレッサーA結合",
      description:
        "活性化されたリプレッサーAが結合すると下流の転写が抑制されます。",
    },
    promActivEL222dim: {
      displayName: "EL222二量体結合",
      description:
        "EL222の二量体が結合し、それにより下流の転写が促進されます。",
    },
    promActivPhyBPIF3: {
      displayName: "PhyB-PIF3結合",
      description:
        "PhyB-PIF3のヘテロ二量体が結合し、それにより下流の転写が促進されます。",
    },
    visiMCherry: {
      displayName: "mCherry",
      description: "赤色の蛍光を発します。",
    },
    visiGFP: {
      displayName: "GFP",
      description: "緑色の蛍光を発します。",
    },
    ctrlRepressorA: {
      displayName: "リプレッサーA",
      description:
        "薬剤Aと結合すると活性化し、リプレッサーA結合プロモーター下流の転写を阻害します。",
    },
    ctrlEL222: {
      displayName: "EL222",
      description: "青色光によって二量体を形成します。",
    },
    ctrlPhyB: {
      displayName: "PhyB",
      description: "赤色光によってPIF3とヘテロ二量体を形成します。",
    },
    ctrlPIF3: {
      displayName: "PIF3",
      description: "赤色光によってPhyBとヘテロ二量体を形成します。",
    },
    term1: {
      displayName: "ターミネーター",
      description: "転写を終了します。これ以降のブロックは転写されません。",
    },
    metaRecomb1: {
      displayName: "リコンビナーゼⅠ",
      description: "認識配列Iに挟まれた配列を切り出します。",
    },
    metaRecomb2: {
      displayName: "リコンビナーゼⅡ",
      description: "認識配列IIに挟まれた配列を切り出します。",
    },
    seqRecogRecomb1: {
      displayName: "認識配列Ⅰ",
      description: "リコンビナーゼIに認識される配列です。",
    },
    seqRecogRecomb2: {
      displayName: "認識配列Ⅱ",
      description: "リコンビナーゼIIに認識される配列です。",
    },
    metaKill: {
      displayName: "キルスイッチ",
      description: "標的生物を死滅させます。",
    },
  },
};

export default ja;
