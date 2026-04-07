"use client";

import { useState } from "react";
import { useTaskGenerator } from "@/hooks/useTaskGenerator";

import MicroRecall from "../test/MicroRecall";
import Ordering from "../test/Ordering";
import SelectWorks from "../test/SelectWorks";
import Matching from "../test/Matching";
import Confidence from "../test/Confidence";

export default function AuthorCardTest({ author }) {
  const { taskType, taskData } = useTaskGenerator(author);

  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <div className="card p-5 flex flex-col gap-4">

      {/* Author */}
      <h2 className="text-lg">{author.author}</h2>

      {/* STEP 1: Micro Recall */}
      {!revealed && (
        <>
          <MicroRecall author={author} />
          <button
            onClick={() => setRevealed(true)}
            className="text-sm text-[var(--color-accent)]"
          >
            Reveal
          </button>
        </>
      )}

      {/* STEP 2: Task */}
      {revealed && !completed && (
        <>
          {taskType === "ordering" && (
            <Ordering data={taskData} onDone={() => setCompleted(true)} />
          )}

          {taskType === "select" && (
            <SelectWorks data={taskData} onDone={() => setCompleted(true)} />
          )}

          {taskType === "matching" && (
            <Matching data={taskData} onDone={() => setCompleted(true)} />
          )}
        </>
      )}

      {/* STEP 3: Confidence */}
      {completed && <Confidence />}

    </div>
  );
}