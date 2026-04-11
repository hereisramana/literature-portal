import { shuffle } from "./shuffle.js";

// PART 1 — DATA CLEANUP
export function cleanAuthorData(a) {
  const author = JSON.parse(JSON.stringify(a));

  if (author.legacy && author.legacy.posthumous_notes === "null") {
    author.legacy.posthumous_notes = null;
  }
  if (author.bio_context && (author.bio_context.collaborators === null || (Array.isArray(author.bio_context.collaborators) && author.bio_context.collaborators[0] === null))) {
    author.bio_context.collaborators = [];
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

// PART 3 — DISTRACTOR SELECTION
function getDistractors(correctAnswer, fieldPath, author, allAuthors, count = 3) {
  // Helper to resolve nested fields like "bio_context.location"
  const resolveField = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };
  
  // Extract values from an author based on fieldPath
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
    return [resolveField(a, fieldPath)].filter(Boolean);
  };

  const samePeriodAuthors = allAuthors.filter(a => a.literary_period === author.literary_period && a.author !== author.author);
  
  let pool = samePeriodAuthors.flatMap(a => getValues(a))
                              .filter(val => val && val.toLowerCase() !== correctAnswer.toLowerCase());
  pool = [...new Set(pool)];
  
  if (pool.length >= count) {
      return shuffle(pool).slice(0, count);
  }

  // Expand to adjacent literary periods
  const adjacents = ADJACENCY[author.literary_period] || [];
  const adjacentAuthors = allAuthors.filter(a => adjacents.includes(a.literary_period) && a.author !== author.author);
  
  pool = [...pool, ...adjacentAuthors.flatMap(a => getValues(a))
            .filter(val => val && val.toLowerCase() !== correctAnswer.toLowerCase())];
  pool = [...new Set(pool)];

  if (pool.length >= count) {
      return shuffle(pool).slice(0, count);
  }

  // Draw from same category, any period
  const anyAuthors = allAuthors.filter(a => a.author !== author.author);
  pool = [...pool, ...anyAuthors.flatMap(a => getValues(a))
            .filter(val => val && val.toLowerCase() !== correctAnswer.toLowerCase())];
  pool = [...new Set(pool)];

  return shuffle(pool).slice(0, count);
}

// PART 2 — QUESTION GENERATION FUNCTION
export function generateQuestions(rawAuthor, allAuthorsInCategory) {
  const author = cleanAuthorData(rawAuthor);
  const questions = [];
  
  let qId = 1;

  const pushQ = (dim, slot, qText, correct, distractorsField, exp) => {
    let distractors = getDistractors(correct, distractorsField, author, allAuthorsInCategory, 3);
    
    // Fallback if not enough distractors
    while(distractors.length < 3) {
      if (!distractors.includes("Other")) distractors.push("Other " + distractors.length);
      else distractors.push("Unknown " + distractors.length);
    }

    questions.push({
      id: `Q${qId++}_${slot.replace(/\s/g, '_')}`,
      dimension: dim,
      slot: slot,
      prompt: qText,
      answer: correct,
      mcqOptions: shuffle([correct, ...distractors]),
      explanation: exp,
      source_fields: [distractorsField]
    });
  };

  // ---------------------------------------------------------
  // DIMENSION 1
  // ---------------------------------------------------------
  
  // D1a
  const workWithYear = author.works?.find(w => typeof w === 'object' && w.year);
  let d1bUsedTwice = false;
  if (workWithYear && author.literary_period && author.region) {
    pushQ(1, "Paradigm Shift", 
      `Which ${workWithYear.year || ""} ${workWithYear.type || "work"} by ${author.author} marks a pivotal shift in ${author.literary_period} literature in the ${author.region} tradition?`, 
      workWithYear.title, 
      "works", 
      `${workWithYear.title} is a landmark ${workWithYear.type || "work"} published in ${workWithYear.year || "this era"}.`);
  } else {
    d1bUsedTwice = true;
  }

  // D1b
  const opusTitle = author.magnum_opus || (author.works && author.works[0] ? (author.works[0].title || author.works[0]) : "their definitive work");
  if (opusTitle !== "their definitive work") {
    pushQ(1, "The First/Last",
      `Which work by ${author.author} is widely regarded as their most defining contribution to ${author.literary_period || "literature"}?`,
      opusTitle,
      "works.magnum_opus",
      `${opusTitle} cemented their critical legacy in this period.`
    );
  }
  
  // D1b extra if D1a skipped
  if (d1bUsedTwice && opusTitle !== "their definitive work") {
    pushQ(1, "Essential Reading",
      `Which work stands as the definitive pillar of ${author.author}'s output?`,
      opusTitle,
      "works",
      `${opusTitle} is the most canonical representation of their vision.`
    );
  } else if (d1bUsedTwice) {
     pushQ(1, "Author Identity", 
      `Who wrote these works?`, 
      author.author, 
      "author", 
      `This is basic author identification.`);
  }

  // D1c
  const isCross = (author.region && author.region.includes("-")) || (author.works && author.works.length > 2);
  if (isCross && author.works?.[1]) {
    const cw = author.works[1].title || author.works[1];
    pushQ(1, "Cross-Cultural Mastery",
      `Which work by ${author.author} best reflects their engagement with complex cultural traditions?`,
      cw,
      "works",
      `${cw} demonstrates their cultural navigation.`
    );
  } else if (opusTitle !== "their definitive work") {
    pushQ(1, "Legacy", 
      `By which major work does ${author.author} endure in popular memory?`, 
      opusTitle, 
      "works", 
      `${opusTitle} remains their most enduring contribution.`);
  }

  // D1d
  if (author.works?.length >= 3 && author.themes?.[0]) {
    const minor = author.works[2].title || author.works[2];
    pushQ(1, "Minor/Unfinished Work",
      `Beyond their celebrated major works, which lesser-known work by ${author.author} explores ${author.themes[0]}?`,
      minor,
      "works",
      `${minor} explores ${author.themes[0]} in a deeper context.`
    );
  }

  // ---------------------------------------------------------
  // DIMENSION 2
  // ---------------------------------------------------------
  
  // D2a
  if (author.themes?.length >= 1) {
    pushQ(2, "Magnum Opus Theme",
      `What is the central thematic concern of ${author.author}'s ${opusTitle}?`,
      author.themes[0],
      "themes",
      `A defining aspect of their work is exploring ${author.themes[0]}.`
    );
  }

  // D2b
  if (author.themes?.length >= 2) {
    pushQ(2, "Ideological Stance",
      `In ${author.author}'s writing, which of the following best captures their ideological position alongside ${author.themes[0]}?`,
      author.themes[1],
      "themes",
      `Their ideological stance frequently orbits ${author.themes[1]}.`
    );
  }

  // ---------------------------------------------------------
  // DIMENSION 3
  // ---------------------------------------------------------

  // D3a
  if (author.style_innovations?.length >= 1) {
    pushQ(3, "Structural Innovation",
      `Which formal or structural innovation is ${author.author} best associated with in ${author.literary_period || "their era"} literature?`,
      author.style_innovations[0],
      "style_innovations",
      `Their distinctive fingerprint is ${author.style_innovations[0]}.`
    );
  }

  // D3b
  if (author.style_innovations?.length >= 1) {
    const tech = author.style_innovations[1] || author.style_innovations[0];
    pushQ(3, "Technical Framework",
      `What technical approach defines ${author.author}'s treatment of language and form in their works?`,
      tech,
      "style_innovations",
      `Language and form are treated via ${tech}.`
    );
  }

  // D3c
  if (author.style_innovations?.length >= 2 && opusTitle !== "their definitive work") {
    pushQ(3, "Narrative Approach",
      `How would you best characterise ${author.author}'s narrative method in ${opusTitle}?`,
      author.style_innovations[1],
      "style_innovations",
      `The narrative method leans heavily on ${author.style_innovations[1]}.`
    );
  }

  // ---------------------------------------------------------
  // DIMENSION 4
  // ---------------------------------------------------------

  // D4a
  let d4Skipped = false;
  if (author.key_characters?.length >= 1) {
    const char = author.key_characters[0];
    pushQ(4, "The Archetype",
      `In ${author.author}'s ${char.work}, what archetype does ${char.name} embody?`,
      char.archetype,
      "key_characters.archetype",
      `${char.name} classically functions as ${char.archetype}.`
    );
  } else {
    d4Skipped = true;
  }

  // D4b
  if (author.key_characters?.length >= 1) {
    const char = author.key_characters.length >= 2 ? author.key_characters[1] : author.key_characters[0];
    pushQ(4, "The Subverter",
      `Which character in ${author.author}'s work challenges conventional expectations within ${char.work}?`,
      char.name,
      "key_characters.name",
      `${char.name} acts as a key subversive element.`
    );
  }

  // ---------------------------------------------------------
  // DIMENSION 5
  // ---------------------------------------------------------

  // D5a
  const loc = author.bio_context?.location || author.region;
  let locFall = loc; 
  if (typeof locFall !== 'string' || !locFall) locFall = author.region || "their home region";
  pushQ(5, "Socio-Political Backdrop",
    `Which location or cultural milieu most shaped ${author.author}'s literary career and output?`,
    locFall,
    "bio_context.location",
    `The backdrop of ${locFall} undeniably forged their worldview.`
  );

  // D5b
  if (author.bio_context?.movements?.length >= 1) {
    pushQ(5, "Activism & Leadership (Movements)",
      `Which literary or political movement did ${author.author} actively engage with or lead?`,
      author.bio_context.movements[0],
      "bio_context.movements",
      `They were a pivotal figure in ${author.bio_context.movements[0]}.`
    );
  } else if (author.bio_context?.collaborators?.length >= 1) {
    pushQ(5, "Activism & Leadership (Collaborators)",
      `Which contemporary did ${author.author} collaborate with, shaping their literary vision?`,
      author.bio_context.collaborators[0],
      "bio_context.collaborators",
      `Collaboration with ${author.bio_context.collaborators[0]} was historically significant.`
    );
  }

  // ---------------------------------------------------------
  // BONUS FILL (Ensure 12 Questions)
  // ---------------------------------------------------------
  
  // Fill routine using Priority list:
  const fillRoutines = [
    () => { 
      if (author.themes?.[0] && author.works?.[1]) {
        const title = author.works[1].title || author.works[1];
        pushQ(2, "Bonus Theme", `What thematic strain runs through ${title}?`, author.themes[0], "themes", `Exploration of ${author.themes[0]}.`) 
        return true;
      }
      return false;
    },
    () => {
      if (author.style_innovations?.[1]) {
        pushQ(3, "Bonus Style", `A hallmark of ${author.author}'s mature poetry/prose is:`, author.style_innovations[1], "style_innovations", `${author.style_innovations[1]} is a signature trick.`);
        return true;
      }
      return false;
    },
    () => {
      pushQ(5, "Defining Era", `Which era defined ${author.author}'s output?`, author.literary_period || "Unknown", "literary_period", `This period encapsulates their career.`);
      return true;
    },
    () => {
      pushQ(1, "Legacy Cemented", `Which work cemented ${author.author}'s legacy?`, opusTitle, "works", `${opusTitle} is indisputably their monumental achievement.`);
      return true;
    },
    () => {
      pushQ(2, "Universal Idea", `A universally acclaimed idea represented by the author is:`, author.themes[1] || author.themes[0] || "Human Condition", "themes", `This speaks to human condition.`);
      return true;
    }
  ];

  let fillIndex = 0;
  while(questions.length < 12) {
    if (fillIndex < fillRoutines.length) {
       fillRoutines[fillIndex]();
       fillIndex++;
    } else {
       pushQ(1, "Fallback Form", `A cornerstone text by ${author.author} is:`, opusTitle, "works", `The cornerstone.`);
    }
  }

  if (questions.length < 12) {
    console.warn(`WARNING: Only generated ${questions.length} questions for ${author.author}. Data missing.`);
  }

  // Trim to exactly 12 if overfilled
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

  // The UI currently assumes session returns verifyQuestions[] and interleaveQuestions[]
  return {
    retrieval,
    verifyQuestions: generatedQs,
    interleaveQuestions: generatedQs, // You can split these if needed, returning all 12 for both for now
    relatedAuthors: []
  };
}
