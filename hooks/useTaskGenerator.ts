"use client";

import { shuffle } from "@/utils/shuffle";

/**
 * Generates a test task for a given author
 */
export function useTaskGenerator(author) {
  if (!author || !author.works) {
    return { taskType: null, taskData: [] };
  }

  const taskTypes = ["ordering", "select", "matching"];

  const taskType =
    taskTypes[Math.floor(Math.random() * taskTypes.length)];

  let taskData: any = [];

  // -------------------------
  // ORDERING (chronology feel)
  // -------------------------
  if (taskType === "ordering") {
    taskData = shuffle(author.works).slice(0, 6);
  }

  // -------------------------
  // SELECT (author → works)
  // -------------------------
  if (taskType === "select") {
    const distractors = [
      "Hamlet",
      "Paradise Lost",
      "The Waste Land",
      "Gitanjali",
      "Waiting for Godot",
    ];

    taskData = shuffle([
      ...author.works.slice(0, 5),
      ...distractors,
    ]);
  }

  // -------------------------
  // MATCHING (work pairing)
  // (simple pairing set)
  // -------------------------
  if (taskType === "matching") {
    const works = author.works.slice(0, 4);

    taskData = shuffle(
      works.map((w, i) => ({
        left: w,
        right: `Match ${i + 1}`, // placeholder mapping
      }))
    );
  }

  return {
    taskType,
    taskData,
  };
}