# Product Page To Ad Brief

Turn product page details into a video ad brief, UGC scripts, storyboard, and an AdsTurbo-ready generation prompt.

This is a free, local-first creative workflow for DTC teams, Shopify sellers, Amazon sellers, performance marketers, and agencies that need to turn product information into short-form video ad plans.

## What it generates

- Core product read
- 3 ad angles
- 3 UGC scripts
- 5-scene storyboard
- AdsTurbo video generation prompt
- Compliance notes for claims and creative references

## Quick start

```bash
npx github:AdsTurbo/product-page-to-ad-brief --input examples/sample-input.json
```

Or clone and run locally:

```bash
git clone https://github.com/AdsTurbo/product-page-to-ad-brief.git
cd product-page-to-ad-brief
npm run sample
```

No API key is required. No network request is made by the CLI.

## CLI usage

```bash
product-page-to-ad-brief \
  --product "GlowPatch Reusable LED Face Mask" \
  --audience "busy skincare buyers" \
  --category "beauty device" \
  --benefits "10 minute sessions, reusable silicone mask, red and blue light modes" \
  --pain-points "too many skincare steps, expensive appointments" \
  --proof "designed for daily at-home use, soft flexible fit" \
  --offer "15% off this week"
```

JSON output:

```bash
product-page-to-ad-brief --input examples/sample-input.json --format json
```

Write to a file:

```bash
product-page-to-ad-brief --input examples/sample-input.json --output brief.md
```

## Input format

```json
{
  "productName": "GlowPatch Reusable LED Face Mask",
  "productUrl": "https://example-store.com/products/glowpatch-led-face-mask",
  "category": "beauty device",
  "audience": "busy skincare buyers who want a simple at-home routine",
  "platform": "tiktok",
  "durationSeconds": 30,
  "price": "$89",
  "benefits": [
    "hands-free 10 minute sessions",
    "reusable silicone mask",
    "red and blue light modes"
  ],
  "painPoints": [
    "too many skincare steps",
    "expensive appointments"
  ],
  "proofPoints": [
    "designed for daily at-home use",
    "soft flexible fit"
  ],
  "offer": "15% off this week",
  "tone": "friendly UGC demo"
}
```

See [`examples/sample-input.json`](examples/sample-input.json) and [`examples/sample-output.md`](examples/sample-output.md).

## Use with AdsTurbo

Use this tool to plan the creative. Use AdsTurbo to turn the brief into production-ready video ads:

- URL to Video: https://adsturbo.ai/features/url-to-video
- Product Video: https://adsturbo.ai/features/product-video
- Video Analysis: https://adsturbo.ai/features/video-analysis

Companion landing page: https://adsturbo.ai/tools/product-page-to-ad-brief

## Output schema

The JSON output follows [`schema/ad-brief.schema.json`](schema/ad-brief.schema.json). The schema is intentionally portable so agents, internal tools, and creative teams can pass briefs between systems.

## Safety and compliance

- Use product claims that you can substantiate.
- Use reference ads for structure and pacing, not for copying protected assets.
- Review regulated categories, platform ad policies, and creator rights before launch.
- This project does not include hidden telemetry.

## Roadmap

- More platform-specific hook patterns
- Storyboard JSON export tuned for agent workflows
- Optional product page extraction helpers
- Website demo

## License

MIT
