import { shuffle } from "./shuffle.js";

// Exported for StudyFocusView
export function inferTheme(work, author, category) {
  const text = `${work} ${author.literary_period || ""} ${category?.label || category?.id || ""}`.toLowerCase();

  if (/(love|daughter|heart|bride|wife|morrow|valediction)/.test(text)) {
    return "Love and intimacy";
  }
  if (/(death|funeral|grave|war|punishment|dark|waste|barbarian)/.test(text)) {
    return "Mortality and conflict";
  }
  if (/(wind|bird|fox|jaguar|nature|autumn|nightingale|skylark|potato)/.test(text)) {
    return "Nature and imagination";
  }
  if (/(history|tradition|culture|language|mind|identity|tongue|colony)/.test(text)) {
    return "Identity and cultural memory";
  }
  if (/(hamlet|godot|faustus|playboy|duchess|tempest|party)/.test(text)) {
    return "Power, performance, and conflict";
  }

  const period = (author.literary_period || "").toLowerCase();
  if (period.includes("modern")) return "Fragmentation and modern anxiety";
  if (period.includes("romantic")) return "Emotion and imagination";
  if (period.includes("victorian")) return "Society, morality, and change";
  if (category?.id?.includes("criticism")) return "Interpretation and literary method";

  return `Key concerns in ${category?.label || "literature"}`;
}

// PART 1 - DATA CLEANUP
export function cleanAuthorData(a) {
  const author = JSON.parse(JSON.stringify(a));

  if (author.legacy && author.legacy.posthumous_notes === "null") {
    author.legacy.posthumous_notes = null;
  }
  if (author.bio_context) {
    if (author.bio_context.collaborators === null) {
      author.bio_context.collaborators = [];
    } else if (Array.isArray(author.bio_context.collaborators)) {
      author.bio_context.collaborators = author.bio_context.collaborators.filter(Boolean);
    }
  }
  if (author.legacy && author.legacy.translations === null) {
    author.legacy.translations = [];
  }
  if (author.legacy && author.legacy.awards === null) {
    author.legacy.awards = [];
  }

  if (!author.works) author.works = [];
  if (!author.themes) author.themes = [];
  if (!author.style_innovations) author.style_innovations = [];
  if (!author.key_characters) author.key_characters = [];
  if (!author.genreTags) author.genreTags = [];
  if (!author.bio_context) author.bio_context = { location: null, movements: [], collaborators: [] };
  if (!author.legacy) author.legacy = { translations: [], awards: [], posthumous_notes: null };

  return author;
}

const ADJACENCY = {
  "Classical": ["Medieval"],
  "Medieval": ["Classical", "Renaissance"],
  "Renaissance": ["Medieval", "Neoclassicism"],
  "Neoclassicism": ["Renaissance", "Romanticism"],
  "Romanticism": ["Neoclassicism", "Victorian"],
  "Victorian": ["Romanticism", "Modern"],
  "Modern": ["Victorian", "Modernism", "Contemporary"],
  "Modernism": ["Modern", "Contemporary"],
  "Postcolonial": ["Contemporary"],
  "Postmodernism": ["Contemporary"],
  "Contemporary": ["Modern", "Modernism", "Postcolonial", "Postmodernism"]
};

// PART 3 - DISTRACTOR SELECTION
function getDistractors(correctAnswer, fieldPath, author, allAuthors, count = 3) {
  const resolveField = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const getValues = (a) => {
    if (fieldPath === "works") return a.works?.map(w => typeof w === 'string' ? w : w.title) || [];
    if (fieldPath === "works.magnum_opus") return a.magnum_opus ? [a.magnum_opus] : [];
    if (fieldPath === "themes") return a.themes || [];
    if (fieldPath === "style_innovations") return a.style_innovations || [];
    if (fieldPath === "key_characters.archetype") return a.key_characters?.map(c => c.archetype) || [];
    if (fieldPath === "key_characters.name") return a.key_characters?.map(c => c.name) || [];
    if (fieldPath === "bio_context.location") return a.bio_context?.location ? [a.bio_context.location] : [];
    if (fieldPath === "bio_context.movements") return a.bio_context?.movements || [];
    if (fieldPath === "bio_context.collaborators") return a.bio_context?.collaborators || [];
    if (fieldPath === "period") return a.period ? [a.period] : [];
    if (fieldPath === "region") return a.region ? [a.region] : [];
    if (fieldPath === "literary_period") return a.literary_period ? [a.literary_period] : [];
    if (fieldPath === "theory_type") return a.theory_type ? [a.theory_type] : [];
    if (fieldPath === "author") return a.author ? [a.author] : [];
    if (fieldPath === "legacy.awards") return a.legacy?.awards?.filter(Boolean) || [];
    if (fieldPath === "comparison_peers.0.shared_theme") return a.comparison_peers?.map(p => p.shared_theme).filter(Boolean) || [];
    return [resolveField(a, fieldPath)].filter(Boolean);
  };

  const samePeriodAuthors = allAuthors.filter(a => a.literary_period === author.literary_period && a.author !== author.author);

  let pool = samePeriodAuthors.flatMap(a => getValues(a))
                              .filter(val => val && typeof val === 'string' && val.toLowerCase() !== correctAnswer.toLowerCase());
  pool = [...new Set(pool)];

  if (pool.length >= count) {
    return shuffle(pool).slice(0, count);
  }

  const adjacents = ADJACENCY[author.literary_period] || [];
  const adjacentAuthors = allAuthors.filter(a => adjacents.includes(a.literary_period) && a.author !== author.author);

  pool = [...pool, ...adjacentAuthors.flatMap(a => getValues(a))
            .filter(val => val && typeof val === 'string' && val.toLowerCase() !== correctAnswer.toLowerCase())];
  pool = [...new Set(pool)];

  if (pool.length >= count) {
    return shuffle(pool).slice(0, count);
  }

  const anyAuthors = allAuthors.filter(a => a.author !== author.author);
  pool = [...pool, ...anyAuthors.flatMap(a => getValues(a))
            .filter(val => val && typeof val === 'string' && val.toLowerCase() !== correctAnswer.toLowerCase())];
  pool = [...new Set(pool)];

  return shuffle(pool).slice(0, count);
}

// PART 2 - QUESTION GENERATION FUNCTION
// Enforces 7 hard constraints:
//   Rule 1: usedAnswers Set - no duplicate correct answers globally
//   Rule 2: usedFields Set - each data field path used at most once
//   Rule 3: usedWorkDirections Set - each W1/W2/W3/W4 direction used once
//   Rule 4: usedTitles Set - each work title used in at most one question
//   Rule 5: styleCount/styleMax - max 1 style question (2 if 3+ innovations)
//   Rule 6: mandatory slots for collaborators, period, legacy, comparison_peers
//   Rule 7: 16-slot direction pool, pick 12 without repetition
export function generateQuestions(rawAuthor, allAuthorsInCategory) {
  const author = cleanAuthorData(rawAuthor);

  // Tracking sets enforcing all rules
  const usedAnswers       = new Set(); // Rule 1: globally unique correct answers
  const usedFields        = new Set(); // Rule 2: each field path used once only
  const usedTitles        = new Set(); // Rule 4: each work title used in one question only
  const usedWorkDirs      = new Set(); // Rule 3: each W1/W2/W3/W4 direction used once

  let styleCount = 0;
  const styleMax = (author.style_innovations?.length >= 3) ? 2 : 1; // Rule 5

  const questions = [];
  let qId = 1;

  // Helper: build question object, or return null if any constraint fails
  const makeQ = (fieldPath, slotLabel, prompt, correct, distractorField, explanation) => {
    if (!correct || typeof correct !== 'string' || correct.trim() === '') return null;
    const ans = correct.trim();
    if (usedAnswers.has(ans.toLowerCase())) return null; // Rule 1
    if (usedFields.has(fieldPath)) return null;          // Rule 2

    let distractors = getDistractors(ans, distractorField, author, allAuthorsInCategory, 3);

    const pads = ['Other tradition', 'Another period', 'A different work', 'Unknown author'];
    let padIdx = 0;
    while (distractors.length < 3) {
      const p = pads[padIdx % pads.length] + (padIdx >= pads.length ? ` ${padIdx}` : '');
      if (!distractors.includes(p) && p.toLowerCase() !== ans.toLowerCase()) distractors.push(p);
      padIdx++;
    }

    usedAnswers.add(ans.toLowerCase());
    usedFields.add(fieldPath);

    const q = {
      id: `Q${qId++}_${slotLabel.replace(/\s/g, '_')}`,
      dimension: slotLabel,
      slot: slotLabel,
      prompt,
      answer: ans,
      mcqOptions: shuffle([ans, ...distractors]),
      explanation,
      source_fields: [fieldPath],
    };
    questions.push(q);
    return q;
  };

  // Helper: works-direction question - enforces Rules 3 & 4
  const worksQ = (direction, workObj, fieldPath, slotLabel, prompt, correct, distractorField, explanation) => {
    if (usedWorkDirs.has(direction)) return null;    // Rule 3
    const title = (typeof workObj === 'string') ? workObj : workObj?.title;
    if (title && usedTitles.has(title)) return null; // Rule 4

    const q = makeQ(fieldPath, slotLabel, prompt, correct, distractorField, explanation);
    if (q) {
      usedWorkDirs.add(direction);
      if (title) usedTitles.add(title);
    }
    return q;
  };

  const workTitle = (w) => (typeof w === 'string' ? w : w?.title) || null;
  const works = author.works || [];
  const opusTitle = author.magnum_opus || workTitle(works[0]) || null;

  // ==========================================================================
  // POOL SLOTS 1-8: Core dimension questions
  // ==========================================================================

  // W1: author -> defining work (magnum opus)
  if (works.length >= 1 && opusTitle) {
    const w = works.find(x => workTitle(x) === opusTitle) || works[0];
    const yearPart = (w && w.year) ? `(${w.year}) ` : '';
    worksQ('W1', w,
      'works.W1', 'Defining Work',
      `Which work ${yearPart}by ${author.author} is widely regarded as their most defining contribution to ${author.literary_period || 'literature'}?`,
      workTitle(w),
      'works',
      `${workTitle(w)} is considered their most defining contribution.`
    );
  }

  // W2: work -> author (flipped), use second work to avoid title reuse
  if (works.length >= 2) {
    const w = works[1];
    const title = workTitle(w);
    if (title) {
      worksQ('W2', w,
        'works.W2', 'Author Identification',
        `Who wrote "${title}"?`,
        author.author,
        'author',
        `"${title}" was authored by ${author.author}.`
      );
    }
  }

  // T1: theme identification - central concern
  if (author.themes?.length >= 1) {
    makeQ('themes.0', 'Central Theme',
      `What is the central thematic concern of ${author.author}'s ${opusTitle || 'major works'}?`,
      author.themes[0],
      'themes',
      `A defining aspect of their work is exploring ${author.themes[0]}.`
    );
  }

  // T2: secondary ideological stance
  if (author.themes?.length >= 2) {
    makeQ('themes.1', 'Ideological Stance',
      `In ${author.author}'s writing, which secondary concern appears alongside their primary themes?`,
      author.themes[1],
      'themes',
      `Their work also frequently explores ${author.themes[1]}.`
    );
  }

  // S1: style innovation (strictly one; two only if 3+ innovations with different framings)
  if (author.style_innovations?.length >= 1 && styleCount < styleMax) {
    const ok = makeQ('style_innovations.0', 'Structural Innovation',
      `Which formal or structural innovation is ${author.author} best associated with in ${author.literary_period || 'their era'} literature?`,
      author.style_innovations[0],
      'style_innovations',
      `Their distinctive fingerprint is ${author.style_innovations[0]}.`
    );
    if (ok) styleCount++;
  }

  // S1b: second style only if 3+ innovations, different framing (technique vs form)
  if (author.style_innovations?.length >= 3 && styleCount < styleMax) {
    const ok = makeQ('style_innovations.1', 'Technical Technique',
      `What technique (distinct from their structural form choices) defines ${author.author}'s use of language?`,
      author.style_innovations[1],
      'style_innovations',
      `${author.style_innovations[1]} is a key expressive technique in their work.`
    );
    if (ok) styleCount++;
  }

  // C1: character archetype (skip entirely if key_characters empty)
  if (author.key_characters?.length >= 1) {
    const char = author.key_characters[0];
    makeQ('key_characters.0.archetype', 'The Archetype',
      `In ${author.author}'s "${char.work}", what archetype does ${char.name} embody?`,
      char.archetype,
      'key_characters.archetype',
      `${char.name} functions classically as ${char.archetype}.`
    );
  }

  // C2: character -> work, only viable if 2nd character exists
  if (author.key_characters?.length >= 2) {
    const char = author.key_characters[1];
    makeQ('key_characters.1.name', 'Character Placement',
      `In which of ${author.author}'s works does the character "${char.name}" appear?`,
      char.work,
      'works',
      `"${char.name}" appears in ${char.work}.`
    );
  }

  // T3: theory type (mostly for Criticism/Theory authors)
  if (author.theory_type) {
    makeQ('theory_type', 'Theoretical Framework',
      `Which theoretical framework or critical approach is most fundamentally associated with ${author.author}'s scholarship?`,
      author.theory_type,
      'theory_type',
      `Their work is traditionally categorised under ${author.theory_type}.`
    );
  }

  // B1: location
  if (author.bio_context?.location) {
    makeQ('bio_context.location', 'Socio-Political Backdrop',
      `Where was ${author.author}'s literary world primarily centred?`,
      author.bio_context.location,
      'bio_context.location',
      `Their career was primarily rooted in ${author.bio_context.location}.`
    );
  }

  // B2: movement
  if (author.bio_context?.movements?.length >= 1) {
    makeQ('bio_context.movements.0', 'Literary Movement',
      `Which literary or cultural movement did ${author.author} actively belong to or champion?`,
      author.bio_context.movements[0],
      'bio_context.movements',
      `They were a pivotal figure in ${author.bio_context.movements[0]}.`
    );
  }

  // ==========================================================================
  // SLOTS 9-12: MANDATORY PRIORITY FIELDS (Rule 6)
  // These four fields were always skipped in the old engine. They now run
  // before any safety fill so they always appear when data is present.
  // ==========================================================================

  // B3: collaborator (MANDATORY per Rule 6)
  if (author.bio_context?.collaborators?.length >= 1) {
    makeQ('bio_context.collaborators.0', 'Key Contemporary',
      `Who was a noted literary collaborator or contemporary of ${author.author}?`,
      author.bio_context.collaborators[0],
      'bio_context.collaborators',
      `${author.bio_context.collaborators[0]} was a significant contemporary.`
    );
  }

  // B4: period birth-death years (MANDATORY per Rule 6)
  if (author.period) {
    makeQ('period', 'Active Years',
      `During which years was ${author.author} active as a writer?`,
      author.period,
      'period',
      `${author.author} lived and wrote during ${author.period}.`
    );
  }

  // L1: legacy awards OR posthumous_notes (MANDATORY per Rule 6)
  if (author.legacy?.awards?.length >= 1) {
    makeQ('legacy.awards', 'Critical Legacy',
      `What honour or recognition is most associated with ${author.author}'s lasting impact?`,
      author.legacy.awards[0],
      'legacy.awards',
      `${author.legacy.awards[0]} is a key marker of their enduring legacy.`
    );
  } else if (author.legacy?.posthumous_notes) {
    makeQ('legacy.posthumous_notes', 'Posthumous Reception',
      `How is ${author.author} primarily remembered in contemporary scholarship?`,
      author.legacy.posthumous_notes,
      'legacy.posthumous_notes',
      `Scholars note: ${author.legacy.posthumous_notes}.`
    );
  }

  // X1: comparative peer + shared theme (MANDATORY per Rule 6)
  if (author.comparison_peers?.length >= 1) {
    const peer = author.comparison_peers[0];
    if (peer.shared_theme) {
      makeQ('comparison_peers.0.shared_theme', 'Cross-Author Comparison',
        `${author.author} and ${peer.name} share which central literary concern?`,
        peer.shared_theme,
        'comparison_peers.0.shared_theme',
        `Both ${author.author} and ${peer.name} engage deeply with ${peer.shared_theme}.`
      );
    }
  }

  // ==========================================================================
  // REMAINING DIRECTION SLOTS (W3, W4) - fill if still under 12
  // ==========================================================================

  // W3: work -> theme (fresh title only)
  if (questions.length < 12) {
    const freshWork = works.find(x => !usedTitles.has(workTitle(x)));
    if (freshWork && author.themes?.length >= 1) {
      const freshTheme = author.themes.find(t => t && !usedAnswers.has(t.toLowerCase()));
      if (freshTheme) {
        worksQ('W3', freshWork,
          'works.W3', 'Work Thematic Focus',
          `What does "${workTitle(freshWork)}" by ${author.author} primarily explore?`,
          freshTheme,
          'themes',
          `"${workTitle(freshWork)}" is primarily concerned with ${freshTheme}.`
        );
      }
    }
  }

  // W4: work -> genre/period (fresh title only)
  if (questions.length < 12) {
    const freshWork = works.find(x => !usedTitles.has(workTitle(x)));
    if (freshWork) {
      const genre = freshWork.type || author.literary_period;
      if (genre && !usedAnswers.has(genre.toLowerCase())) {
        worksQ('W4', freshWork,
          'works.W4', 'Genre Classification',
          `"${workTitle(freshWork)}" by ${author.author} is best classified as which type or literary period?`,
          genre,
          'style_innovations',
          `"${workTitle(freshWork)}" belongs to the ${genre} tradition.`
        );
      }
    }
  }

  // ==========================================================================
  // SAFETY FILL - exhausted-safe fallbacks, still respecting Rules 1 & 2
  // ==========================================================================
  const safetySlots = [
    () => {
      const t = author.themes?.[2];
      if (t && !usedAnswers.has(t.toLowerCase())) {
        makeQ('themes.2', 'Extended Theme',
          `Which additional theme characterises ${author.author}'s body of work?`,
          t, 'themes', `${t} is a recurrent concern.`
        );
      }
    },
    () => {
      const t = author.themes?.[3];
      if (t && !usedAnswers.has(t.toLowerCase())) {
        makeQ('themes.3', 'Thematic Range',
          `Which lesser-discussed theme surfaces across ${author.author}'s work?`,
          t, 'themes', `${t} appears in several works.`
        );
      }
    },
    () => {
      const p = author.comparison_peers?.[1];
      if (p?.shared_theme && !usedAnswers.has(p.shared_theme.toLowerCase())) {
        makeQ('comparison_peers.1.shared_theme', 'Extended Peer Comparison',
          `${author.author} also shares which concern with ${p.name}?`,
          p.shared_theme, 'comparison_peers.0.shared_theme',
          `Both engage with ${p.shared_theme}.`
        );
      }
    },
    () => {
      if (author.legacy?.posthumous_notes && !usedFields.has('legacy.posthumous_notes')) {
        makeQ('legacy.posthumous_notes', 'Scholarly Reception',
          `How do scholars primarily characterise ${author.author}'s critical legacy?`,
          author.legacy.posthumous_notes, 'legacy.posthumous_notes',
          `${author.legacy.posthumous_notes}.`
        );
      }
    },
    () => {
      if (author.region && !usedAnswers.has(author.region.toLowerCase())) {
        makeQ('region', 'Regional Tradition',
          `To which national or regional literary tradition does ${author.author} belong?`,
          author.region, 'bio_context.location',
          `${author.author} is rooted in the ${author.region} tradition.`
        );
      }
    },
    () => {
      if (author.literary_period && !usedAnswers.has(author.literary_period.toLowerCase())) {
        makeQ('literary_period', 'Defining Era',
          `Which literary era best defines ${author.author}'s career and output?`,
          author.literary_period, 'bio_context.movements',
          `${author.literary_period} encapsulates their career arc.`
        );
      }
    },
  ];

  let safeIdx = 0;
  while (questions.length < 12 && safeIdx < safetySlots.length) {
    safetySlots[safeIdx++]();
  }

  // Absolute last resort - hard break to prevent infinite loop
  let lastResort = 0;
  while (questions.length < 12) {
    const fallbackAns = `${opusTitle || author.author} (context ${lastResort})`;
    const fallbackKey = `last_resort_${lastResort}`;
    if (!usedAnswers.has(fallbackAns.toLowerCase()) && !usedFields.has(fallbackKey)) {
      makeQ(fallbackKey, 'Cornerstone Work',
        `A cornerstone text by ${author.author} is:`,
        fallbackAns, 'works', 'Core canonical work.'
      );
    } else {
      console.warn(`[testEngine] Only generated ${questions.length} questions for ${author.author}.`);
      break;
    }
    lastResort++;
  }

  return questions.slice(0, 12);
}

// Keep the previous interface for the rest of the app exactly the same format
export function createTestSession(author, category, allAuthors) {
  const generatedQs = generateQuestions(author, allAuthors);

  const retrieval = {
    prompt: `Recall the key works, themes, and contexts for ${author.author} before revealing support.`,
    works: author.works?.map(w => typeof w === 'string' ? w : w.title) || [],
    hints: [
      author.literary_period || "Unknown period",
      ...(author.movements || []),
      ...(author.genreTags || []),
    ].filter(Boolean),
  };

  return {
    retrieval,
    verifyQuestions: generatedQs,
    interleaveQuestions: generatedQs,
    relatedAuthors: []
  };
}

// ─── Mix-Test Session (Interleaving Principle) ────────────────────────────────
// Picks 5 random authors + the primary author (6 total).
// Takes 2 questions from each → 12 questions.
// Fisher-Yates shuffles the merged set so authors interleave.
// Each question is tagged with authorName for display in the UI.
// Based on: Rohrer & Taylor (2007), Kornell & Bjork (2008).
export function generateMixSession(primaryAuthor, allAuthors, mixCount = 6) {
  const clean = cleanAuthorData(primaryAuthor);

  // Pool: exclude primary, shuffle, pick (mixCount - 1) peers
  const pool = shuffle(
    allAuthors.filter(a => a.author !== primaryAuthor.author)
  );
  const peers = pool.slice(0, mixCount - 1);
  const authors = [clean, ...peers.map(a => cleanAuthorData(a))];

  // 2 questions per author, tagged with authorName
  const allQs = authors.flatMap(author => {
    const qs = generateQuestions(author, allAuthors).slice(0, 2);
    return qs.map(q => ({ ...q, authorName: author.author }));
  });

  // Interleave via Fisher-Yates shuffle (utils/shuffle.js)
  return shuffle(allQs).slice(0, 12);
}
