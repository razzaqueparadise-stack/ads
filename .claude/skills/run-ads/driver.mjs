#!/usr/bin/env node
// driver.mjs — validate + "launch" the ads skill pack.
//
// This repo has no server/GUI. The "app" is a pack of Claude Code skills in
// .agents/skills/. There is nothing to start with `npm start`; a skill is
// "run" when Claude Code loads its SKILL.md and follows it. So the runnable,
// reproducible thing a fresh agent CAN do on a clean machine is: prove every
// skill is well-formed and that its cross-references resolve. That is what
// this driver does. The *live* data path (Ads Library MCP) is driven
// separately — see SKILL.md "Run (live data path)".
//
// Usage:
//   node .claude/skills/run-ads/driver.mjs            # validate all skills
//   node .claude/skills/run-ads/driver.mjs --list     # just list commands
//   node .claude/skills/run-ads/driver.mjs --json     # machine-readable
//
// Exit code 0 = all skills valid, 1 = at least one structural problem.

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..", "..", "..");          // <repo>/.claude/skills/run-ads -> <repo>
const SKILLS_DIR = join(REPO, ".agents", "skills");

const argv = process.argv.slice(2);
const wantJson = argv.includes("--json");
const listOnly = argv.includes("--list");

// --- tiny frontmatter parser (no deps) ----------------------------------
// Skills use simple `key: value` YAML frontmatter between --- fences.
function parseFrontmatter(text) {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const block = text.slice(3, end).trim();
  const out = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let [, k, v] = m;
    v = v.trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

function listSkillDirs() {
  return readdirSync(SKILLS_DIR)
    .filter((d) => statSync(join(SKILLS_DIR, d)).isDirectory())
    .filter((d) => existsSync(join(SKILLS_DIR, d, "SKILL.md")))
    .sort();
}

// --- validate -------------------------------------------------------------
const skills = [];
const problems = [];

for (const dir of listSkillDirs()) {
  const skillPath = join(SKILLS_DIR, dir, "SKILL.md");
  const raw = readFileSync(skillPath, "utf8");
  const fm = parseFrontmatter(raw);
  const rec = {
    dir,
    name: fm?.name ?? null,
    description: fm?.description ?? null,
    argumentHint: fm?.["argument-hint"] ?? fm?.argument_hint ?? null,
    bytes: raw.length,
  };
  skills.push(rec);

  if (!fm) {
    problems.push(`${dir}: missing or malformed YAML frontmatter`);
    continue;
  }
  if (!rec.name) problems.push(`${dir}: frontmatter has no \`name:\``);
  else if (rec.name !== dir) {
    problems.push(`${dir}: name "${rec.name}" != directory "${dir}"`);
  }
  if (!rec.description) problems.push(`${dir}: frontmatter has no \`description:\``);
  else if (rec.description.length < 20) {
    problems.push(`${dir}: description suspiciously short (${rec.description.length} chars)`);
  }
}

// --- resolve cross-references (chained skills like /spy, /bulk-creative) ---
const known = new Set(skills.map((s) => s.dir));
// Slash-command-style references inside skill bodies, e.g. "`/bulk-creative`".
const refRe = /`\/([a-z][a-z0-9-]+)/g;
const chainRefs = {};
for (const dir of known) {
  const body = readFileSync(join(SKILLS_DIR, dir, "SKILL.md"), "utf8");
  for (const m of body.matchAll(refRe)) {
    const cmd = m[1];
    // "/ads google" etc. — the skill is "ads"; treat first token as the skill.
    const head = cmd.split(/\s/)[0];
    if (head === dir) continue;
    (chainRefs[dir] ??= new Set()).add(head);
  }
}
// Report unresolved chain targets that look like local skills but aren't present.
// (Sub-commands of `ads` such as "audit"/"google" are NOT separate skills, so
//  we only flag references that match the *standalone* skill naming pattern.)
const standalone = new Set(["spy", "bulk-creative", "competitive-ads-extractor", "ads-score"]);
const danglers = [];
for (const [from, targets] of Object.entries(chainRefs)) {
  for (const t of targets) {
    if (standalone.has(t) && !known.has(t)) danglers.push(`${from} -> /${t} (missing)`);
  }
}

// --- output ---------------------------------------------------------------
if (wantJson) {
  console.log(JSON.stringify({ skills, problems, danglers }, null, 2));
  process.exit(problems.length || danglers.length ? 1 : 0);
}

if (listOnly) {
  for (const s of skills) {
    console.log(`/${s.name ?? s.dir}${s.argumentHint ? "  — " + s.argumentHint : ""}`);
  }
  process.exit(0);
}

console.log(`ads skill pack @ ${SKILLS_DIR}`);
console.log(`scanned ${skills.length} skills\n`);
for (const s of skills) {
  const flag = s.name && s.description ? "ok " : "BAD";
  const desc = (s.description ?? "").slice(0, 64);
  console.log(`  [${flag}] /${(s.name ?? s.dir).padEnd(28)} ${desc}`);
}
console.log("");
if (danglers.length) {
  console.log("dangling chain references:");
  for (const d of danglers) console.log(`  - ${d}`);
  console.log("");
}
if (problems.length) {
  console.log(`FAIL — ${problems.length} structural problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log(`PASS — all ${skills.length} skills have valid frontmatter and resolve.`);
process.exit(danglers.length ? 1 : 0);
