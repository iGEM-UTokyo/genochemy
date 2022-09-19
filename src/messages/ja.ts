import { Messages } from ".";

const ja: Messages = {
  matter: {
    promT7: {
      name: "常に発現",
      description: "常に一定の割合で下流を転写します。",
    },
    promReprRepressorADrugA: {
      name: "リプレッサーA結合性プロモーター",
      description:
        "活性化されたリプレッサーAが結合すると下流の転写が抑制されます。",
    },
    promActivEL222dim: {
      name: "青センサー促進プロモーター",
      description:
        "青センサーの二量体が結合し、それにより下流の転写が促進されます。",
    },
    promActivPhyBPIF3: {
      name: "赤センサーab促進プロモーター",
      description:
        "赤センサーa,bのヘテロ二量体が結合し、それにより下流の転写が促進されます。",
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
      name: "青センサー",
      description: "青色光によって二量体を形成します。",
    },
    ctrlPhyB: {
      name: "赤センサーa",
      description: "赤色光によって赤センサーbとヘテロ二量体を形成します。",
    },
    ctrlPIF3: {
      name: "赤センサーb",
      description: "赤色光によって赤センサーaとヘテロ二量体を形成します。",
    },
    ctrlPhyBPIF3: {
      name: "赤センサーab",
      description: "赤センサーaと赤センサーbのヘテロ二量体です。",
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
      displayName: "常に発現",
      description: "常に一定の割合で下流を転写します。",
    },
    promReprRepressorADrugA: {
      displayName: "<repressor,リプレッサー>抑制",
      description:
        "活性化されたリプレッサーAが結合すると下流の転写が抑制されます。",
    },
    promActivEL222dim: {
      displayName: "<activator,アクチベーター>促進",
      description:
        "青センサーの二量体が結合し、それにより下流の転写が促進されます。",
    },
    promActivPhyBPIF3: {
      displayName: "赤センサーab促進",
      description:
        "赤センサーa,bのヘテロ二量体が結合し、それにより下流の転写が促進されます。",
    },
    visiMCherry: {
      displayName: "<protein,蛍光タンパク質>",
      description: "赤色の蛍光を発します。",
    },
    visiGFP: {
      displayName: "GFP",
      description: "緑色の蛍光を発します。",
    },
    ctrlRepressorA: {
      displayName: "<repressor,リプレッサー>",
      description:
        "薬剤Aと結合すると活性化し、リプレッサーA結合プロモーター下流の転写を阻害します。",
    },
    ctrlEL222: {
      displayName: "<activator,アクチベーター>",
      description: "青色光によって二量体を形成します。",
    },
    ctrlPhyB: {
      displayName: "赤センサーa",
      description: "赤色光によって赤センサーbとヘテロ二量体を形成します。",
    },
    ctrlPIF3: {
      displayName: "赤センサーb",
      description: "赤色光によって赤センサーaとヘテロ二量体を形成します。",
    },
    term1: {
      displayName: "ターミネーター",
      description: "転写を終了します。これ以降のブロックは転写されません。",
    },
    metaRecomb1: {
      displayName: "<recombinase,リコンビナーゼ>",
      description: "認識配列Iに挟まれた配列を切り出します。",
    },
    metaRecomb2: {
      displayName: "リコンビナーゼⅡ",
      description: "認識配列IIに挟まれた配列を切り出します。",
    },
    seqRecogRecomb1: {
      displayName: "<recombinase,リコンビナーゼ>認識配列",
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
  tutorial: {
    tutorial: "チュートリアル",
    "1": `Genochemy は、オリジナル微生物「Genomy」をプログラミングすることによって、遺伝子設計や合成生物学を体験できるソフトウェアです。
ビジュアルプログラミングの直感的なUIを採用しつつ、遺伝子設計でのモデリングと同様の水準の微分方程式シミュレーションを備えています。`,
    "2": `Genochemyアプリには4つの領域があります。
塩基配列トレイ（左下）、プログラム（左上）、Genochemy Lab（右上）、情報タブと実行ボタン（右下）の4つです。`,
    "3": `トレイには塩基配列ブロックがあり、それぞれがプロモーター、タンパク質コーディング領域、ターミネーターなどという特定の役割を持つ配列を表しています。
プロモーターブロックは青色で、矢印型の付属物が付いています。
タンパク質コーディング領域は単純に細長い形をしています。
ターミネーターは赤色で、T字型の付属物があります。`,
    "4": `プログラムでは、塩基配列ブロックを組み合わせて、遺伝子モデルを作成することができます。`,
    "5": `Genochemy Lab では、シミュレーション前とシミュレーション中に環境パラメータを制御することができます。Genomy の蛍光強度もここで観察することができます。`,
    "6": `情報タブは5つのタブで構成されています。Tutorial、Protein、RNA、Questions、Loadの5つのタブで構成されています。
ProteinタブとRNAタブは、Genomyで生成されたタンパク質とmRNAの情報を表示します。蛍光タンパク質の場合は、その生産量もグラフで見ることができます。
Questions タブでは、いくつかの遺伝子回路クイズが用意されています。
Loadタブから、iGEMプロジェクトを模した配列を読み込むことができます。現在、iGEM UTokyo 2022のプロジェクト「Optopass」が読み込みできます。`,
    "7": `それでは、Genochemyの操作の流れを確認してみましょう。
上の図は基本的な流れを表しています。`,
    "8": `まず、ブロックをドラッグ&ドロップでトレイからプログラムに移動します。
移動中のブロックを既にプログラムにあるブロックに近づけることによって両者を結合させることができます。
もしプログラムの特定のブロックを他から切り離したい場合は、そのブロックをダブルクリックしてください。
要らなくなったブロックはドラッグ＆ドロップでトレイに戻せばよいです。`,
    "9": `トレイから取ったブロックを結合することによって、好きなように遺伝子回路を構築してみましょう！
標準的な遺伝子はプロモーター、タンパク質コーディング領域、ターミネーターがこの順に並んだ形になります。試しに、「常時発現」プロモーターと「GFP」「ターミネーター」をこの順で繋げてみましょう。
回路構築が終わったら、右端の「実行」ボタンを押しましょう。実験開始です。シミュレーションが始まります。`,
    "10": `Labでは、3パラメーター: 薬剤Aの量と赤色光、青色光それぞれの照射の有無を調整することができます。
前ページで繋げた回路は薬剤や光には依存しないためここでの調整は変化をもたらしませんが、もっと複雑な回路になってくると効いてくる要素です。`,
    "11": `実行ボタンを押し、環境調整も終わったら次は実験結果の観察と評価です。
LabにあるGenomyのイラストを見ると蛍光タンパク質の発現量と種類を大まかに目で確認することができます。
前述したとおり、ProteinタブとRNAタブでは生産中の物質の情報について知ることができ、特に蛍光タンパク質については発現量も見ることができます。`,
    "12": `それでは、Questionsタブにある問題に取り組んで、遺伝子回路設計を練習しましょう！
問題は簡単なイラストで表示されています。
一部の問題は、Show Answerボタンで模範解答を見ることができます。別解を作ってみるのも良いでしょう。`,
  },
  tabs: {
    tutorial: "チュートリアル",
    protein: "タンパク質",
    rna: "RNA",
    questions: "問題",
    load: "読み込み",
  },
  runner: {
    drugA: "薬剤A",
    redLight: "赤色光",
    blueLight: "青色光",
  },
  view: {
    show: "表示する",
    hide: "隠す",
  },
  questions: {
    question: "問題",
    showAnswer: "答えを見る",
    image: "画像",
    "1": "緑の生物",
    "2": "青色光が緑にする",
    "3": "キラーライト",
    "4": "薬剤中毒者の生物",
    "5": "NAND ゲート",
    "6": "短気な生物",
    "7": "青色光が無限に緑にする",
    "8": "緑から赤になる",
    "9": "Optopass Mini",
  },
  load: {
    loadUTokyo2022Project: "UTokyo 2022のプロジェクトを読み込む",
  },
  twitterShare: "Genochemy で遺伝子回路を作りました！",
};

export default ja;
