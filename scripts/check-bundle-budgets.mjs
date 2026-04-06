#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import zlib from "node:zlib"

const NEXT_DIR = ".next"
const appManifestPath = path.join(NEXT_DIR, "app-build-manifest.json")

if (!fs.existsSync(appManifestPath)) {
  console.error("Bundle budget check failed: .next/app-build-manifest.json not found.")
  console.error("Run `npm run build` before `npm run check:bundle-budgets`.")
  process.exit(1)
}

const appManifest = JSON.parse(fs.readFileSync(appManifestPath, "utf8"))
const pageFiles = appManifest?.pages ?? {}

const budgets = [
  { route: "/work/[slug]/page", maxGzipKiB: 240 },
  { route: "/work/[slug]/press/[filename]/page", maxGzipKiB: 105 },
  { route: "/page", maxGzipKiB: 90 },
]

const chunkBudgets = [
  {
    name: "/work/[slug]/page app chunk",
    route: "/work/[slug]/page",
    match: (file) => file.startsWith("static/chunks/app/work/[slug]/page-"),
    maxGzipKiB: 45,
  },
  {
    name: "/work/[slug]/page largest shared chunk",
    route: "/work/[slug]/page",
    match: (file) =>
      file.endsWith(".js") &&
      !file.startsWith("static/chunks/app/work/[slug]/page-") &&
      !file.includes("main-app-"),
    maxGzipKiB: 55,
    mode: "max-of-matches",
  },
]

let hasFailure = false
console.log("Bundle budget report (gzip, JS only):")

for (const budget of budgets) {
  const files = (pageFiles[budget.route] ?? []).filter((file) => file.endsWith(".js"))
  if (files.length === 0) {
    hasFailure = true
    console.error(`- ${budget.route}: missing route chunks in app-build-manifest.json`)
    continue
  }

  let gzipBytes = 0
  for (const file of files) {
    const absPath = path.join(NEXT_DIR, file)
    if (!fs.existsSync(absPath)) {
      hasFailure = true
      console.error(`- ${budget.route}: missing chunk file ${absPath}`)
      continue
    }
    gzipBytes += zlib.gzipSync(fs.readFileSync(absPath)).length
  }

  const gzipKiB = gzipBytes / 1024
  const status = gzipKiB <= budget.maxGzipKiB ? "PASS" : "FAIL"
  const line = `- ${budget.route}: ${gzipKiB.toFixed(1)} KiB (budget ${budget.maxGzipKiB} KiB) [${status}]`
  if (status === "PASS") {
    console.log(line)
  } else {
    hasFailure = true
    console.error(line)
  }
}

if (hasFailure) {
  process.exit(1)
}

console.log("")
console.log("Chunk budget report (gzip, JS only):")

for (const budget of chunkBudgets) {
  const routeFiles = [...new Set((pageFiles[budget.route] ?? []).filter((file) => file.endsWith(".js")))]
  const matchedFiles = routeFiles.filter((file) => budget.match(file))

  if (matchedFiles.length === 0) {
    hasFailure = true
    console.error(`- ${budget.name}: no matching chunks for route ${budget.route}`)
    continue
  }

  const chunkSizes = matchedFiles.map((file) => {
    const absPath = path.join(NEXT_DIR, file)
    if (!fs.existsSync(absPath)) {
      hasFailure = true
      console.error(`- ${budget.name}: missing chunk file ${absPath}`)
      return { file, gzipKiB: 0 }
    }
    const gzipBytes = zlib.gzipSync(fs.readFileSync(absPath)).length
    return { file, gzipKiB: gzipBytes / 1024 }
  })

  const measured =
    budget.mode === "max-of-matches"
      ? Math.max(...chunkSizes.map((chunk) => chunk.gzipKiB))
      : chunkSizes.reduce((total, chunk) => total + chunk.gzipKiB, 0)

  const status = measured <= budget.maxGzipKiB ? "PASS" : "FAIL"
  const details =
    budget.mode === "max-of-matches"
      ? `max ${measured.toFixed(1)} KiB`
      : `${measured.toFixed(1)} KiB`
  const line = `- ${budget.name}: ${details} (budget ${budget.maxGzipKiB} KiB) [${status}]`

  if (status === "PASS") {
    console.log(line)
  } else {
    hasFailure = true
    console.error(line)
    chunkSizes
      .sort((a, b) => b.gzipKiB - a.gzipKiB)
      .forEach((chunk) => {
        console.error(`  • ${chunk.file}: ${chunk.gzipKiB.toFixed(1)} KiB`)
      })
  }
}

if (hasFailure) {
  process.exit(1)
}
