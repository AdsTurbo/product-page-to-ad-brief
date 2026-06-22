#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const HELP = `
product-page-to-ad-brief

Turn product details into a video ad brief, UGC scripts, storyboard, and AdsTurbo-ready prompt.

Usage:
  product-page-to-ad-brief --input examples/sample-input.json
  product-page-to-ad-brief --product "LED Face Mask" --audience "busy skincare buyers" --benefits "10 minute sessions, reusable, USB-C"

Options:
  --input <file>             JSON input file
  --output <file>            Write output to file
  --format <markdown|json>   Output format, default markdown
  --product <name>           Product name
  --url <url>                Product page URL
  --category <text>          Product category
  --audience <text>          Target audience
  --platform <text>          tiktok, meta, reels, shorts, youtube, default tiktok
  --duration <seconds>       Video duration, default 30
  --price <text>             Product price
  --benefits <list>          Comma-separated benefits
  --pain-points <list>       Comma-separated buyer pain points
  --proof <list>             Comma-separated proof points
  --offer <text>             Offer or CTA context
  --tone <text>              Creative tone, default friendly UGC demo
  --help                     Show this message
`;

const DEFAULT_INPUT = {
  productName: 'Your Product',
  productUrl: '',
  category: 'product',
  audience: 'busy online shoppers',
  platform: 'tiktok',
  durationSeconds: 30,
  price: '',
  benefits: ['clear product benefit', 'fast setup', 'simple everyday use'],
  painPoints: ['too many options', 'unclear value', 'hard to compare'],
  proofPoints: ['easy to understand', 'built for repeat use'],
  offer: 'try it today',
  tone: 'friendly UGC demo',
};

const flagAliases = {
  product: 'productName',
  url: 'productUrl',
  duration: 'durationSeconds',
  'pain-points': 'painPoints',
  proof: 'proofPoints',
};

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    if (key === 'help') {
      args.help = true;
      continue;
    }

    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    i += 1;
  }

  return args;
}

function splitList(value, fallback = []) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value !== 'string') return fallback;

  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function readInput(args) {
  let fileInput = {};
  if (args.input) {
    const inputPath = path.resolve(String(args.input));
    fileInput = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  }

  const cliInput = {};
  for (const [rawKey, value] of Object.entries(args)) {
    if (['input', 'output', 'format', 'help'].includes(rawKey)) continue;
    const key = flagAliases[rawKey] || rawKey;
    cliInput[key] = value;
  }

  const input = {
    ...DEFAULT_INPUT,
    ...fileInput,
    ...cliInput,
  };

  return {
    ...input,
    durationSeconds: Number(input.durationSeconds || DEFAULT_INPUT.durationSeconds),
    benefits: splitList(input.benefits, DEFAULT_INPUT.benefits),
    painPoints: splitList(input.painPoints, DEFAULT_INPUT.painPoints),
    proofPoints: splitList(input.proofPoints, DEFAULT_INPUT.proofPoints),
    platform: String(input.platform || DEFAULT_INPUT.platform).toLowerCase(),
  };
}

function titleCase(value) {
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function first(items, fallback) {
  return items.find(Boolean) || fallback;
}

function buildAngles(input) {
  const benefit = first(input.benefits, 'clear product benefit');
  const pain = first(input.painPoints, 'the old way feels slow');
  const proof = first(input.proofPoints, 'simple proof');

  return [
    {
      title: 'Stop the routine drag',
      description: `Open on ${pain}, then show how ${input.productName} removes one annoying step.`,
    },
    {
      title: 'Show the product doing the work',
      description: `Make ${benefit} visible in the first 5 seconds with close product shots.`,
    },
    {
      title: 'Small habit, repeatable payoff',
      description: `Frame the product as an easy routine backed by ${proof}.`,
    },
  ];
}

function buildScripts(input) {
  const benefitOne = first(input.benefits, 'clear product benefit');
  const benefitTwo = input.benefits[1] || benefitOne;
  const painOne = first(input.painPoints, 'the old way feels slow');
  const painTwo = input.painPoints[1] || painOne;
  const proofOne = first(input.proofPoints, 'a simple proof point');
  const offer = input.offer || 'try it today';

  return [
    {
      hook: `If ${input.audience} keep dealing with ${painOne}, watch this.`,
      problem: `The old routine takes too much effort and makes ${input.category || 'the product'} hard to evaluate.`,
      demo: `Show ${input.productName} in use and call out ${benefitOne}.`,
      proof: `Add a close-up proof cue: ${proofOne}.`,
      cta: `Try ${input.productName} while ${offer} is available.`,
    },
    {
      hook: `I did not expect ${input.productName} to make this part easier.`,
      problem: `${titleCase(input.audience)} often get stuck because ${painTwo}.`,
      demo: `Walk through the product in one continuous shot and highlight ${benefitTwo}.`,
      proof: `Use on-screen text to reinforce ${proofOne}.`,
      cta: `Use ${offer} and turn the product into part of your next routine.`,
    },
    {
      hook: `Here is the product detail I would show first in an ad.`,
      problem: `Open with the buyer hesitation, then make the value clear without overclaiming.`,
      demo: `Show ${input.productName}, the main feature, and the real-use moment in under 10 seconds.`,
      proof: `Support the claim with ${input.proofPoints.join(', ') || proofOne}.`,
      cta: `End on a clean product shot and the offer: ${offer}.`,
    },
  ];
}

function buildStoryboard(input) {
  const duration = Math.max(15, input.durationSeconds || 30);
  const benefit = first(input.benefits, 'clear product benefit');
  const proof = first(input.proofPoints, 'simple proof');

  return [
    {
      start: 0,
      end: 3,
      visual: 'Fast close-up of the buyer problem',
      caption: input.painPoints[0] ? `${input.painPoints[0]}?` : 'Still doing it the slow way?',
      voiceover: `If ${input.audience} are tired of ${first(input.painPoints, 'the old way')}, watch this.`,
      purpose: 'hook',
    },
    {
      start: 3,
      end: 7,
      visual: 'Product enters frame in real use',
      caption: benefit,
      voiceover: `This is ${input.productName}.`,
      purpose: 'product',
    },
    {
      start: 7,
      end: Math.round(duration * 0.47),
      visual: 'Feature sequence with tight product shots',
      caption: input.benefits.slice(0, 3).join(' / '),
      voiceover: `It is built for ${input.audience}.`,
      purpose: 'demo',
    },
    {
      start: Math.round(duration * 0.47),
      end: Math.round(duration * 0.73),
      visual: 'Show product fitting into the buyer routine',
      caption: proof,
      voiceover: `The proof is simple: ${proof}.`,
      purpose: 'proof',
    },
    {
      start: Math.round(duration * 0.73),
      end: duration,
      visual: 'Product hero shot with clear offer',
      caption: input.offer || 'Try it today',
      voiceover: `Try ${input.productName} today.`,
      purpose: 'cta',
    },
  ];
}

function buildPrompt(input) {
  const benefits = input.benefits.join(', ');
  const proof = input.proofPoints.join(', ');
  const pain = input.painPoints.join(', ');
  const offer = input.offer || 'try it today';

  return `Create a ${input.durationSeconds}s ${titleCase(input.platform)} UGC-style product video ad for ${input.productName}, a ${input.category} for ${input.audience}. Start with the frustration of ${pain}, show ${benefits}, include proof cues around ${proof}, and end with ${offer}. Style: ${input.tone}, natural lighting, close product shots, clear captions, mobile-first 9:16.`;
}

function buildBrief(input) {
  const angles = buildAngles(input);
  const scripts = buildScripts(input);
  const storyboard = buildStoryboard(input);

  return {
    productName: input.productName,
    productUrl: input.productUrl || undefined,
    category: input.category,
    audience: input.audience,
    platform: input.platform,
    durationSeconds: input.durationSeconds,
    price: input.price || undefined,
    offer: input.offer || undefined,
    coreRead: `${input.productName} is a ${input.category} for ${input.audience}. The strongest angle is simple routine improvement: ${input.benefits.join(', ')}.`,
    angles,
    scripts,
    storyboard,
    adsturboPrompt: buildPrompt(input),
    complianceNotes: [
      'Keep claims specific to the product information you can substantiate.',
      'Use references for structure and pacing, not for copying protected creative assets.',
      'Confirm platform policy, rights clearance, and any regulated-category requirements before launch.',
    ],
  };
}

function toMarkdown(brief) {
  const productUrl = brief.productUrl ? `\n**Product URL:** ${brief.productUrl}` : '';
  const price = brief.price ? `\n**Price:** ${brief.price}` : '';
  const offer = brief.offer ? `\n**Offer:** ${brief.offer}` : '';

  const angles = brief.angles
    .map((angle, index) => `${index + 1}. **${angle.title}**\n   ${angle.description}`)
    .join('\n');

  const scripts = brief.scripts
    .map((script, index) => `## UGC Script ${index + 1}

**Hook:** ${script.hook}
**Problem:** ${script.problem}
**Demo:** ${script.demo}
**Proof:** ${script.proof}
**CTA:** ${script.cta}`)
    .join('\n\n');

  const storyboardRows = brief.storyboard
    .map((scene) => `| ${scene.start}-${scene.end}s | ${scene.visual} | ${scene.caption} | ${scene.purpose} |`)
    .join('\n');

  const notes = brief.complianceNotes.map((note) => `- ${note}`).join('\n');

  return `# ${brief.productName} Video Ad Brief

**Platform:** ${titleCase(brief.platform)}
**Duration:** ${brief.durationSeconds}s
**Audience:** ${brief.audience}${productUrl}${price}${offer}

## Core Product Read

${brief.coreRead}

## Angles

${angles}

${scripts}

## Storyboard

| Time | Visual | Caption | Purpose |
| --- | --- | --- | --- |
${storyboardRows}

## AdsTurbo Prompt

${brief.adsturboPrompt}

## Compliance Notes

${notes}
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(HELP);
    return;
  }

  const input = readInput(args);
  const brief = buildBrief(input);
  const format = String(args.format || 'markdown').toLowerCase();
  const output = format === 'json'
    ? `${JSON.stringify(brief, null, 2)}\n`
    : toMarkdown(brief);

  if (args.output) {
    fs.writeFileSync(path.resolve(String(args.output)), output);
    return;
  }

  process.stdout.write(output);
}

main();
