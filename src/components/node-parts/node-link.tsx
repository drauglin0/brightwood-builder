import { type Link } from "../../entities/story-node";
import NodeRef from "./node-ref";
import Button from "../core/button";
import { useEffect, useRef, useState } from "react";
import { autoHeight, focus } from "../../lib/ref-operations";
import { weights } from "../../lib/constants";
import HandleOut from "./handle-out";
import { WeightDices } from "./weight-dices";
import { Delete, Edit } from "../core/icons";
import Tooltip from "../core/tooltip";
import { TextInputLabel } from "../core/text-input-label";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { popupButtonVariants } from "@/lib/motion";

type Props = {
  link: Link;
  index: number;
  totalWeight: number;
  deletable: boolean;
  nodeEditing?: boolean;
  updateLink: (updatedLink: Link) => void;
  deleteLink: () => void;
  onEditStarted: () => void;
  onEditFinished: () => void;
}

export default function NodeLink({ link, index, totalWeight, deletable, updateLink, deleteLink, nodeEditing, onEditStarted, onEditFinished }: Props) {
  const { t } = useTranslation();

  const initialWeight = link.weight || weights.default;
  const noWeight = !link.weight;

  const [weight, setWeight] = useState(initialWeight);
  const [editing, setEditing] = useState(noWeight);

  const inputRef = useRef<HTMLInputElement>(null);

  const weightPercent = Math.round(link.weight / totalWeight * 100);

  const MotionButton = motion(Button);

  function startEdit() {
    setWeight(initialWeight);

    setEditing(true);
    onEditStarted();

    focus(inputRef);
  }

  function cancelEdit() {
    setEditing(false);
    onEditFinished();

    if (link.weight > 0) {
      setWeight(link.weight);
    } else {
      deleteLink();
    }
  }

  function commitEdit() {
    setEditing(false);
    onEditFinished();

    updateLink?.({
      ...link,
      weight
    });
  }

  function updateWeight(event: React.ChangeEvent<HTMLInputElement>) {
    setWeight(
      Number(event.currentTarget.value)
    );
  }

  useEffect(() => {
    if (noWeight) {
      startEdit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => autoHeight(inputRef), [weight]);

  const isValidWeight = (weight: number) => weight <= weights.min || weight > weights.max;

  return (
    <motion.div
      className="relative text-sm bg-gradient-to-r from-transparent to-yellow-300 py-1 -mr-2"
      key={index}
      initial="hidden"
      animate="hidden"
      whileHover="visible"
    >
      <div>
        {/* edit */}
        {editing &&
          <div className="border border-black border-opacity-20 rounded-lg border-dashed bg-white p-1 mr-2 my-1">
            <TextInputLabel>
              {t("Link weight")}
            </TextInputLabel>
            <input
              type="number"
              defaultValue={weight}
              onChange={updateWeight}
              className="w-full py-1 px-1.5 border border-slate-400 rounded-md"
              ref={inputRef}
              min={weights.min}
              max={weights.max}
            />
            {!!weight && (
              <div className="mt-1">
                <WeightDices weight={weight} />
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <Button
                onClick={commitEdit}
                disabled={isValidWeight(weight)}
              >
                {t("Save")}
              </Button>
              <Button onClick={cancelEdit}>
                {t("Cancel")}
              </Button>
            </div>
          </div>
        }
        {/* view */}
        {!editing &&
          <div className="flex gap-1 max-h-5">
            <Tooltip
              tooltip={
                <div className="flex flex-col">
                  <span>{t("Link weight")}: {link.weight}</span>
                  <span>{t("Probability")}: {weightPercent}%</span>
                </div>
              }
              side="top"
            >
              <WeightDices weight={link.weight} />
            </Tooltip>
            {link.condition && (
              <span>
                <span className="italic">{t("if")}:</span> {link.condition}
              </span>
            )}
            <NodeRef id={link.id} />
          </div>
        }
        {!noWeight &&
          <HandleOut
            id={String(index)}
            connected={!!link.id}
          />
        }
      </div>
      {/* view */}
      {!editing && !nodeEditing &&
        <div className="absolute right-3 top-1 flex gap-1">
          <MotionButton
            size="small"
            onClick={startEdit}
            variants={popupButtonVariants}
            custom={deletable ? 2 : 1}
          >
            <Edit />
          </MotionButton>
          {deletable &&
            <MotionButton
              size="small"
              onClick={deleteLink}
              variants={popupButtonVariants}
              custom={1}
            >
              <Delete />
            </MotionButton>
          }
        </div>
      }
    </motion.div>
  );
}
