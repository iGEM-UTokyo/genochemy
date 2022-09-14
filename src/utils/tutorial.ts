interface TutorialContent {
  img: string;
  text: string;
}

const tutorial: TutorialContent[] = [
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEWWNNFB7BfhpY7KiaXKoRvV5xKB05HUJ9qvP4xbq0EvO_pUvF63scfpsIRm2pRegitoMAYMr4mijwEdPcHJpNbHFSV-k1vYxtYHP9lrCBhm5w6eC7a2NgIWnSTJhSKNJ-4L3fmpwWD6PWFjjiiJhlcE3g=w1490-h655-no",
    text: `Genochemy は、オリジナル微生物「Genomy」をプログラミングすることによって、遺伝子設計や合成生物学を体験できるソフトウェアです。
ビジュアルプログラミングの直感的なUIを採用しつつ、遺伝子設計でのモデリングと同様の水準の微分方程式シミュレーションを備えています。`,
  },
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEWXwgOVljyLB2_PISl_QaFW816ZS-shFJwW9BT29RUk2_f6_z1TVWmQGtFTuJ3SpJsYPYlA0lRIkLrvSue1tbu98BwVJZJUSwvqG7aIU5aVNM7vwflElPJbHEWstum0AToJTW99Sv6qpfDx1_OGhFOjvQ=w1113-h623-no",
    text: `Genochemyアプリには4つの領域があります。
塩基配列トレイ（左下）、プログラム（左上）、Genochemy Lab（右上）、情報タブと実行ボタン（右下）の4つです。`,
  },
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEXNXhGj02gl9Y5qY-kQuS_5TfPXNJJueMDfGf2iwHgpoz6kSW5nfTK4j05m_qAzTzdSiRV4B2BHm9AiSpgCKUkjpSRpYWYIqWDA5PEDrZpLRS-Mr_8uJd4J16TAiRRU95jeSlRVY4lm5N0URKLaZMSqtg=w1377-h205-no",
    text: `トレイには塩基配列ブロックがあり、それぞれがプロモーター、タンパク質コーディング領域、ターミネーターなどという特定の役割を持つ配列を表しています。
プロモーターブロックは青色で、矢印型の付属物が付いています。
タンパク質コーディング領域は単純に細長い形をしています。
ターミネーターは赤色で、T字型の付属物があります。`,
  },
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEXOGLIdZFKV89jh9uheLzGgynPKrx__5MwTGjUuH9SnrMIcdlAEvteQJYOtWchfm9fW2i3U-CPPMsVlhRLmLKsv_ujlr1He6h7LOSz70bfx15xOjeFsaSBAv1RaIzqx2WbOqJlrYxbS8fo-O1Zy_8zMmw=w940-h501-no",
    text: `プログラムでは、塩基配列ブロックを組み合わせて、遺伝子モデルを作成することができます。`,
  },
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEUqZTMrWdsOmZQiuJMyYWPe2le8L8K9eASIKR3zWVzOGSZ5okVJBs1e1PUG0MB4OcFTdr9lTTdiUWiRk9Nny6Tgyi9_o5RYGw0doardifsCq7mX6WByC8bXnWwP25OZnq25scAF_73ZY2a8BAknVRDrQg=w780-h467-no",
    text: `Genochemy Lab では、シミュレーション前とシミュレーション中に環境パラメータを制御することができます。Genomy の蛍光強度もここで観察することができます。`,
  },
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEX9pv2TkF3l6mJDCtgIkg8687Q6qgbVuMCCFGZdxvj-bdTOZAnEOjKPhdJKLYr1uc6-xT3TgWz8MHKdiXJO4tB2JxKE54k3jI8w0RU836A5LCSPDFyTlBoIfZKkAsIWuP3XhEgiEbU4qEMveXTr9vd_ww=w776-h579-no",
    text: `情報タブは5つのタブで構成されています。Tutorial、Protein、RNA、Questions、Loadの5つのタブで構成されています。
ProteinタブとRNAタブは、Genomyで生成されたタンパク質とmRNAの情報を表示します。蛍光タンパク質の場合は、その生産量もグラフで見ることができます。
Questions タブでは、いくつかの遺伝子回路クイズが用意されています。
Loadタブから、iGEMプロジェクトを模した配列を読み込むことができます。現在、iGEM UTokyo 2022のプロジェクト「Optopass」が読み込みできます。`,
  },
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEW8s169g0tcOj-rv0MfybQ2wY6B5bFc6UnUy2I0zoV3kYLb3m8lRj0YutwBeZpb7h_Ofc03amd3y_vv-HzK-cUrWvydJLmgdKqiy9wq0JsgEATU_TqOR5azd9150pSBNMDueHpUqGbnIoJS0H5zbqhcOg=w1709-h962-no",
    text: `それでは、Genochemyの操作の流れを確認してみましょう。
上の図は基本的な流れを表しています。`,
  },
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEW0PTMZBB91fmmAskNpZ-Um_EyMVNSJ7WiZYOo3JK_bERR9enlaNa5NM4LrJjwqjUMqMK1je4AQtxoBbX0948qTUflf4OtdqUJbSa7D_hYdcgcQuPdhJMzhbK0oCzcjVV50bngB10HibnOfJuoDCJcZ3g=w1709-h962-no",
    text: `まず、ブロックをドラッグ&ドロップでトレイからプログラムに移動します。
移動中のブロックを既にプログラムにあるブロックに近づけることによって両者を結合させることができます。
もしプログラムの特定のブロックを他から切り離したい場合は、そのブロックをダブルクリックしてください。
要らなくなったブロックはドラッグ＆ドロップでトレイに戻せばよいです。`,
  },
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEWgqcihKXmhxPkY5yjm__odYLpzM6zIy_aXwMeLr76GrUdbxq-3gJtHSdFqSYU-Y1Hh531gyj5z2asVmspUYOue7zngjrA8z-0zD8kovE5x4nLEMmhSeouL3MriSGhk23-Tjz8ncNAXG9tgVrzSEIHYSg=w1111-h623-no",
    text: `トレイから取ったブロックを結合することによって、好きなように遺伝子回路を構築してみましょう！
標準的な遺伝子はプロモーター、タンパク質コーディング領域、ターミネーターがこの順に並んだ形になります。試しに、「常時発現」プロモーターと「GFP」「ターミネーター」をこの順で繋げてみましょう。
回路構築が終わったら、右端の「実行」ボタンを押しましょう。実験開始です。シミュレーションが始まります。`,
  },
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEWvSOoMyOMncxXLw-p88dPHjKGgxSqwdXDIzIDhT20v8_sv0HMQGC9tckfFCQlLO2zlVbp3Au-bL-GPJiQIiTNXz8gWclw_EkR5OAm5ZxwGTHE4QCB2FiGEA7rX-zX1Pc4PdrIZMPeXcb0mDQP8WorcUw=w1709-h962-no",
    text: `Labでは、3パラメーター: 薬剤Aの量と赤色光、青色光それぞれの照射の有無を調整することができます。`,
  },
  {
    img: "https://lh3.googleusercontent.com/pw/AL9nZEWa80C1xhE1c3dr6gdRR7CYV_T6BjGF1PBLO7CZgYUmc8thYNvrZYUgZrsVcFtolgfwRXwAuJqy7EeiJmJ4lG2NLLJiJSMQ2L87s-EqB5lCIeIyyX7DpuhOAZykeIkLdp7a2ZQt4TAys3p94rYxXeo0yw=w1709-h962-no",
    text: `実行ボタンを押し、環境調整も終わったら次は実験結果の観察と評価です。
LabにあるGenomyのイラストを見ると蛍光タンパク質の発現量と種類を大まかに目で確認することができます。
前述したとおり、ProteinタブとRNAタブでは生産中の物質の情報について知ることができ、特に蛍光タンパク質については発現量も見ることができます。`,
  },
];

export default tutorial;
