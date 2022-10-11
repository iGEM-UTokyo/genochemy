import {
  Actor,
  Degrader,
  Edge,
  EL222,
  EL222dim,
  MatterEquations,
  OperonMessengerRNA,
  PhyB,
  PhyBPIF3,
  PIF3,
  PromoterActor,
  Protein,
  RepressorA,
  RepressorABound,
} from "./matter";

export function createEdges(
  actors: Readonly<Actor[]>,
  edges: Readonly<Edge[]>
): Edge[] {
  const newEdges: Edge[] = [...edges];
  for (let i = 0; i < actors.length; i++) {
    const actor1 = actors[i];
    for (let j = 0; j < actors.length; j++) {
      const actor2 = actors[j];
      if (i === j) {
        if (
          actor1 instanceof RepressorA &&
          !newEdges.some(
            (edge) =>
              edge.type === "diarectic" &&
              edge.aufheben instanceof RepressorABound &&
              edge.points[0] === actor1 &&
              edge.points[1] === actor1
          )
        ) {
          newEdges.push({
            type: "diarectic",
            aufheben: new RepressorABound(),
            points: [actor1, actor1],
          });
        } else if (
          actor1 instanceof EL222 &&
          !newEdges.some(
            (edge) =>
              edge.type === "diarectic" &&
              edge.aufheben instanceof EL222dim &&
              edge.points[0] === actor1 &&
              edge.points[1] === actor1
          )
        ) {
          newEdges.push({
            type: "diarectic",
            aufheben: new EL222dim(),
            points: [actor1, actor1],
          });
        }
      } else if (i < j) {
        if (
          (actor1 instanceof PhyB && actor2 instanceof PIF3) ||
          (actor2 instanceof PhyB && actor1 instanceof PIF3)
        ) {
          if (
            !newEdges.some(
              (edge) =>
                edge.type === "diarectic" &&
                edge.aufheben instanceof PhyBPIF3 &&
                edge.points.includes(actor1) &&
                edge.points.includes(actor2)
            )
          ) {
            newEdges.push({
              type: "diarectic",
              aufheben: new PhyBPIF3(),
              points: [actor1, actor2],
            });
          }
        }
      }
      if (
        actor1 instanceof Degrader &&
        (actor2 instanceof OperonMessengerRNA || actor2 instanceof Protein)
      ) {
        if (
          !newEdges.some(
            (edge) =>
              edge.type === "degrate" &&
              edge.from === actor1 &&
              edge.to === actor2
          )
        ) {
          newEdges.push({ type: "degrate", from: actor1, to: actor2 });
        }
      }
    }
  }
  return newEdges;
}
export function createActorsByDiarectic(
  actors: Readonly<Actor[]>,
  edges: Readonly<Edge[]>
): Actor[] {
  const newActors = [...actors];
  for (const edge of edges) {
    if (
      edge.type === "diarectic" &&
      !newActors.includes(edge.aufheben) &&
      !actors.some((a) => a.name === edge.aufheben.name)
    ) {
      newActors.push(edge.aufheben);
    }
  }
  return newActors;
}

export type ActorNetwork = { actors: Actor[]; edges: Edge[] };
export default function createActorNetwork(
  operonMessengerRNAs: OperonMessengerRNA[],
  proteins: Protein[],
  previousActorNetwork?: ActorNetwork | null
): ActorNetwork {
  let actors: Actor[] = [];
  let edges: Edge[] = [];
  for (const mRNA of operonMessengerRNAs) {
    for (const promoter of mRNA.promoters) {
      actors.push(new PromoterActor(promoter, mRNA));
    }
    actors.push(mRNA);
  }
  actors.push(...proteins);
  if (previousActorNetwork) {
    for (const actor of previousActorNetwork.actors) {
      if (actor instanceof OperonMessengerRNA) {
        if (
          !actors.some(
            (a) => a instanceof OperonMessengerRNA && actor.name === a.name
          )
        ) {
          actor.promoters = [];
          actors.push(actor);
        }
      } else if (actor instanceof Protein) {
        if (
          !actors.some((a) => a instanceof Protein && actor.name === a.name)
        ) {
          actors.push(actor);
        }
      }
    }
  }
  actors.push(new Degrader());
  let previousActorsLength = actors.length;
  edges = createEdges(actors, edges);
  actors = createActorsByDiarectic(actors, edges);
  while (previousActorsLength < actors.length) {
    previousActorsLength = actors.length;
    edges = createEdges(actors, edges);
    actors = createActorsByDiarectic(actors, edges);
  }
  return { actors, edges };
}
export function buildDE(actorNetwork: ActorNetwork) {
  console.log(actorNetwork);
  const { actors, edges } = actorNetwork;
  const matterEquations: MatterEquations = {};
  for (const actor of actors) {
    actor.buildDE(matterEquations);
  }
  for (const edge of edges) {
    if (edge.type === "degrate" && edge.from instanceof Degrader) {
      edge.from.buildDETo(matterEquations, edge.to);
    } else if (edge.type === "diarectic" && edge.aufheben instanceof PhyBPIF3) {
      if (!matterEquations["protein-PhyB"]) {
        matterEquations["protein-PhyB"] = [];
      }
      if (!matterEquations["protein-PIF3"]) {
        matterEquations["protein-PIF3"] = [];
      }
      if (!matterEquations["protein-PhyBPIF3"]) {
        matterEquations["protein-PhyBPIF3"] = [];
      }
      matterEquations["protein-PhyB"].push({
        type: "multiply",
        values: [
          { type: "const", value: -1 },
          {
            type: "multiply",
            values: [
              { type: "variable", name: "red-light" },
              {
                type: "multiply",
                values: [
                  { type: "variable", name: "protein-PhyB" },
                  { type: "variable", name: "protein-PIF3" },
                ],
              },
            ],
          },
        ],
      });
      matterEquations["protein-PIF3"].push({
        type: "multiply",
        values: [
          { type: "const", value: -1 },
          {
            type: "multiply",
            values: [
              { type: "variable", name: "red-light" },
              {
                type: "multiply",
                values: [
                  { type: "variable", name: "protein-PhyB" },
                  { type: "variable", name: "protein-PIF3" },
                ],
              },
            ],
          },
        ],
      });
      matterEquations["protein-PhyBPIF3"].push({
        type: "multiply",
        values: [
          { type: "const", value: 1 },
          {
            type: "multiply",
            values: [
              { type: "variable", name: "red-light" },
              {
                type: "multiply",
                values: [
                  { type: "variable", name: "protein-PhyB" },
                  { type: "variable", name: "protein-PIF3" },
                ],
              },
            ],
          },
        ],
      });
    }
  }
  return matterEquations;
}
