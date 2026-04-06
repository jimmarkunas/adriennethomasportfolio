#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

const APP_ROOT = "src/app"
const ROUTE_FILE_PATTERN = /(page|layout|loading|error|route|template)\.(t|j)sx?$/

const boundaryRules = [
  {
    message: "Route files must not import case-study content modules directly. Use loadCaseStudyBySlug/loadAllCaseStudies.",
    test: (source) => /^@\/content\/case-studies\/(?!case-study-map$).+/.test(source),
  },
  {
    message: "Route files must not import heavy case-study diagram components directly. Load through section-level deferred components.",
    test: (source) =>
      /^@\/components\/case-study\/(bi-commerce-ecosystem-diagram|MuradArchitectureDiagram|SCJCommerceArchitecture|BoehringerDataSilosDiagram|template\/visuals\/)/.test(
        source
      ),
  },
]

function walkFiles(dir, collector) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(fullPath, collector)
      continue
    }
    if (entry.isFile() && ROUTE_FILE_PATTERN.test(entry.name)) {
      collector.push(fullPath.replaceAll(path.sep, "/"))
    }
  }
}

if (!fs.existsSync(APP_ROOT)) {
  console.error(`Route boundary check failed: missing ${APP_ROOT}`)
  process.exit(1)
}

const routeFiles = []
walkFiles(APP_ROOT, routeFiles)

const violations = []
const importPattern = /(?:import\s+[\s\S]*?\s+from\s+|import\s*\()\s*["']([^"']+)["']/g

for (const file of routeFiles) {
  const contents = fs.readFileSync(file, "utf8")
  let match

  while ((match = importPattern.exec(contents)) !== null) {
    const source = match[1]
    for (const rule of boundaryRules) {
      if (rule.test(source)) {
        violations.push({ file, source, message: rule.message })
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Route boundary violations:")
  for (const violation of violations) {
    console.error(`- ${violation.file}`)
    console.error(`  import: ${violation.source}`)
    console.error(`  rule: ${violation.message}`)
  }
  process.exit(1)
}

console.log(`Route boundary check passed (${routeFiles.length} route files scanned).`)
