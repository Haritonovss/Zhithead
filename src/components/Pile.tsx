import { useSelector } from "@xstate/react";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { getRank, Rank } from "../lib";
import Card from "./Card";
import Count from "./Count";
import { GlobalStateContext } from "./GlobalStateProvider";

export default function Pile() {
  const { zhitheadService } = useContext(GlobalStateContext);
  const pile = useSelector(zhitheadService, (state) => state.context.pile);
  const { send } = zhitheadService;
  const pileWithout8s = pile.filter((card) => getRank(card) !== Rank.Num8);

  return (
    <div className="relative box-content flex h-card-height w-card-width justify-center rounded-xl border-2 border-dashed border-zinc-600 p-0.5">
      {pileWithout8s.length >= 2 && (
        <div className="absolute">
          <Card card={pileWithout8s.at(-2)} />
        </div>
      )}
      {pileWithout8s.length >= 1 && (
        <div className="absolute" style={{ zIndex: 1 }}>
          <Card
            key={pileWithout8s.length}
            card={pileWithout8s.at(-1)}
            onClick={() => send({ type: "TAKE_PILE" })}
          />
        </div>
      )}
      <AnimatePresence>
        {pile.length >= 1 && getRank(pile.at(-1)!) === Rank.Num8 && (
          <motion.div
            key={pile.at(-1)!}
            className="absolute h-full w-full"
            initial={{ left: 0, top: 0, filter: "opacity(1)", opacity: 1 }}
            animate={{
              x: 25,
              y: 20,
              transition: {
                delay: 0.6,
                type: "tween",
              },
              filter: "opacity(0.9)",
            }}
            exit={{
              filter: "opacity(1)",
              x: 0,
              y: 0,
              zIndex: 0,
            }}
            style={{ zIndex: 2 }}
          >
            <Card card={pile.at(-1)} />
          </motion.div>
        )}
      </AnimatePresence>
      <Count count={pile.length} position="top-left" z={2} />
      <AnimatePresence>{!pile.length && <Text />}</AnimatePresence>
    </div>
  );
}

function Text() {
  return (
    <motion.div
      className="absolute flex h-full w-full items-center justify-center"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <span className="select-none text-4xl font-bold tracking-wider text-zinc-600">
        PILE
      </span>
    </motion.div>
  );
}
