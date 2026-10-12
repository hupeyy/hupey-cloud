// Rule-based parser for recipes written in Instagram and TikTok captions.
// No AI: it relies on the usual caption shapes (a title line, bullet or
// quantity-led ingredients, numbered steps, section headers like "For the sauce:").

const UNITS =
	'cups?|c\\.|tbsps?|tablespoons?|tbs|tsps?|teaspoons?|lbs?|pounds?|oz|ounces?|g|grams?|kg|ml|l|liters?|litres?|pints?|quarts?|gallons?|cloves?|cans?|pinch(?:es)?|dash(?:es)?|handfuls?|sticks?|slices?|bunch(?:es)?|heads?|pieces?|packages?|pkgs?|sprigs?|stalks?|large|medium|small|whole|half';

// 1, 1.5, 1/2, ½, 1 1/2, 1½, 3-4
const QTY =
	'(?:\\d+(?:[.,]\\d+)?(?:\\s*[-–]\\s*\\d+)?(?:\\s+\\d+\\/\\d+|\\s*[¼½¾⅓⅔⅛])?|\\d+\\/\\d+|[¼½¾⅓⅔⅛])';

const BULLET = /^\s*(?:[-*•⁃▪◦●·–—✅✔️☑️🔸🔹➡️👉]|\d+[.)]\s)\s*/u;
const STEP_NUMBER = /^\s*(?:step\s*)?(\d+)\s*[.):-]\s*/i;
const INGREDIENT_HEADER =
	/^(?:ingredients?|you(?:'|’)ll need|what you need|shopping list)\s*:?\s*$/i;
const STEP_HEADER =
	/^(?:instructions?|directions?|method|steps?|preparation|how to(?: make(?: it)?)?)\s*:?\s*$/i;
const FOR_THE = /^for (?:the )?(.{1,40}?)\s*:\s*(.*)$/i;
const CREDIT = /^(?:ib|inspired by|recipe by|recipe from|credit|adapted from)\b\s*:?\s*(.*)$/i;
const SERVE = /^(?:serve|enjoy)\b/i;
const HASHTAG = /(^|\s)#[\p{L}\p{N}_]+/gu;

/** True when the caption lost its line breaks (TikTok strips them). */
function isFlattened(text) {
	const lines = text.split('\n').filter((l) => l.trim());
	return lines.length <= 2 && text.length > 120;
}

/**
 * Put line breaks back into a caption that lost them, so each ingredient and
 * step sits on its own line. Captions that already have line breaks are left as is.
 */
export function restoreLineBreaks(caption) {
	let text = caption
		.replace(HASHTAG, '')
		.replace(/[ \t]+\n/g, '\n')
		.trim();
	if (!isFlattened(text)) return text;

	const brk = (re) => (text = text.replace(re, '\n$1'));

	// Section headers and credits
	brk(
		/\s+(ingredients?\s*:|instructions?\s*:|directions?\s*:|method\s*:|steps?\s*:|preparation\s*:)/gi
	);
	brk(/\s+(for (?:the )?[\p{L} -]{1,30}:)/giu);
	brk(/\s+((?:season|top|garnish) (?:with|it with)\s*:?)/gi);
	brk(/\s+((?:ib|inspired by|recipe by|credit)\s*:)/gi);
	brk(/\s+(serve (?:over|with|it)\b)/gi);
	// Numbered steps: "1." "2)" "Step 3"
	brk(/\s+((?:step\s*)?\d+[.)]\s+\p{Lu})/giu);

	// Quantities start a new ingredient, but only before the steps begin, and
	// not inside a range like "1/4 to 1/2 tsp" or "3-4 handfuls".
	const stepsAt = text.search(
		/\n(?:instructions?|directions?|method|steps?|preparation)\s*:|\n(?:step\s*)?1[.)]\s/i
	);
	const head = stepsAt === -1 ? text : text.slice(0, stepsAt);
	const tail = stepsAt === -1 ? '' : text.slice(stepsAt);
	const qtyBreak = new RegExp(
		`(?<!\\b(?:to|or|and|x|by|about|of)|[-–/×\\d])\\s+(${QTY}\\s*(?:${UNITS})?\\b)`,
		'giu'
	);
	const [title, ...items] = head.replace(qtyBreak, '\n$1').split('\n');
	// Unquantified ingredients ("Garlic powder Paprika") are told apart by their
	// capital letters; joining words like "or" and "add" keep a phrase together.
	const capitalBreak =
		/(?<=[\p{Ll})])(?<!\b(?:or|and|with|of|the|a|an|add|use|used|like|no|plus|to|in|on|for|from|some))\s+(?=\p{Lu}\p{Ll})/gu;
	text = [title, ...items.map((l) => l.replace(capitalBreak, '\n'))].join('\n') + tail;

	return text
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean)
		.join('\n');
}

const tidy = (line) =>
	line
		.replace(BULLET, '')
		.replace(/\s+/g, ' ')
		.replace(/\s+([,.;:])/g, '$1')
		.trim();

const isQuantityLed = (line) => new RegExp(`^${QTY}(?:\\s|$)`, 'u').test(line);

/**
 * Parse caption text (one item per line) into a recipe:
 * { name, description, ingredients: [{ title, note }], steps: [{ title, text }], notes: [{ title, text }] }
 */
export function parseCaption(text) {
	// Non-empty lines, remembering which ones follow a blank line
	const lines = [];
	const afterBlank = [];
	let blank = false;
	for (const l of text.replace(HASHTAG, '').split('\n')) {
		if (!l.trim()) {
			blank = true;
			continue;
		}
		lines.push(l.trim());
		afterBlank.push(blank);
		blank = false;
	}

	const recipe = { name: '', description: '', ingredients: [], steps: [], notes: [] };
	if (!lines.length) return recipe;

	const description = [];

	// Title: the first line up to its first sentence break or emoji; the rest of
	// that line opens the description
	afterBlank.shift();
	const first = tidy(lines.shift()).replace(/^[\p{Extended_Pictographic}‍️\s]+/u, '');
	const cut = first.match(
		/^(.+?)(?:[!?.]+|\s*\p{Extended_Pictographic}[\p{Extended_Pictographic}‍️\s]*)(?:\s+|$)(.*)$/u
	);
	recipe.name = (cut ? cut[1] : first).replace(/[\s:]+$/, '');
	const rest = cut?.[2]?.replace(/^[\p{Extended_Pictographic}‍️\s]+/u, '');
	if (rest) description.push(rest);

	let mode = 'intro'; // intro | ingredients | steps
	let section = '';
	let sectionUsed = true;

	const addIngredient = (note) => {
		recipe.ingredients.push({ title: sectionUsed ? '' : section, note });
		sectionUsed = true;
	};
	const addStep = (text) => {
		recipe.steps.push({ title: sectionUsed ? '' : section, text });
		sectionUsed = true;
	};

	const isItem = (raw) => BULLET.test(raw) || isQuantityLed(tidy(raw));
	// A short unbulleted line with no quantity or full stop, like "Cream Cheese Frosting"
	const isHeading = (raw, line) =>
		!isItem(raw) && line.length <= 50 && line.split(' ').length <= 6 && !/[.!?,;]$/.test(line);

	for (const [i, raw] of lines.entries()) {
		const line = tidy(raw);
		if (!line) continue;

		if (INGREDIENT_HEADER.test(line)) {
			mode = 'ingredients';
			continue;
		}
		if (STEP_HEADER.test(line)) {
			mode = 'steps';
			continue;
		}

		const credit = line.match(CREDIT);
		if (credit) {
			recipe.notes.push({ title: 'Credit', text: credit[1] || line });
			continue;
		}
		if (SERVE.test(line) && mode !== 'steps') {
			recipe.notes.push({ title: 'Serving', text: line });
			continue;
		}

		// "For the sauce:" opens a section; anything after the colon is its first item
		const forThe = line.match(FOR_THE);
		if (forThe) {
			section = forThe[1].replace(/^\p{Ll}/u, (c) => c.toUpperCase());
			sectionUsed = false;
			if (mode === 'intro') mode = 'ingredients';
			if (forThe[2]) (mode === 'steps' ? addStep : addIngredient)(forThe[2]);
			continue;
		}

		// Other section headings: "Frosting:" on its own line, or a short title line
		// set off by a blank line with ingredients listed under it
		if (
			isHeading(raw, line) &&
			(line.endsWith(':') ||
				(mode !== 'steps' && afterBlank[i] && i + 1 < lines.length && isItem(lines[i + 1])))
		) {
			section = line.replace(/\s*:$/, '');
			sectionUsed = false;
			if (mode === 'intro') mode = 'ingredients';
			continue;
		}

		// A numbered line is a step, wherever it appears
		const numbered = raw.match(STEP_NUMBER);
		if (numbered && !isQuantityLed(raw.slice(numbered[0].length))) {
			if (mode !== 'steps') {
				mode = 'steps';
				if (recipe.ingredients.length) sectionUsed = true;
			}
			addStep(tidy(raw.slice(numbered[0].length)));
			continue;
		}

		if (mode === 'intro') {
			// Bullets or a leading quantity mean the ingredient list has started
			if (BULLET.test(raw) || isQuantityLed(line)) mode = 'ingredients';
			else {
				description.push(line);
				continue;
			}
		}

		if (mode === 'ingredients') addIngredient(line);
		else addStep(line);
	}

	recipe.description = description.join(' ');
	return recipe;
}
