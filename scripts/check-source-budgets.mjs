#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

const ROOT = "src/components/case-study"
const DEFAULT_MAX_LINES = 380

const overrideBudgets = new Map([
  ["src/components/case-study/SCJCommerceArchitecture.tsx", 500],
  ["src/components/case-study/diagram-shared/BiDiagramCards.tsx", 600],
  ["src/components/case-study/modere-simulation/ModereSimulation.tsx", 620],
])

function walkFiles(dir, collector) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(fullPath, collector)
      continue
    }
    if (entry.isFile() && fullPath.endsWith(".tsx")) {
      collector.push(fullPath.replaceAll(path.sep, "/"))
    }
  }
}

if (!fs.existsSync(ROOT)) {
  console.error(`Source budget check failed: directory not found: ${ROOT}`)
  process.exit(1)
}

const files = []
walkFiles(ROOT, files)

let hasFailure = false
console.log("Source budget report (TSX line counts):")

for (const file of files.sort()) {
  const contents = fs.readFileSync(file, "utf8")
  const lineCount = contents.split("\n").length
  const budget = overrideBudgets.get(file) ?? DEFAULT_MAX_LINES
  const pass = lineCount <= budget
  const status = pass ? "PASS" : "FAIL"
  const line = `- ${file}: ${lineCount} lines (budget ${budget}) [${status}]`
  if (pass) {
    console.log(line)
  } else {
    hasFailure = true
    console.error(line)
  }
}

if (hasFailure) {
  process.exit(1)
}
