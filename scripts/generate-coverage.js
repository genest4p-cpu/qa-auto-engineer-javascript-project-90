import process from 'node:process'
import { mkdir, readFile, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import coverage from 'istanbul-lib-coverage'
import report from 'istanbul-lib-report'
import reports from 'istanbul-reports'
import v8ToIstanbul from 'v8-to-istanbul'

const { createCoverageMap } = coverage
const { createContext } = report

const projectRoot = process.cwd()
const rawCoverageDir = path.join(projectRoot, 'coverage', 'raw')
const reportDir = path.join(projectRoot, 'coverage')
const testsDir = `${path.join(projectRoot, 'tests')}${path.sep}`

const toFilePath = (url) => {
  if (!url?.startsWith('file://')) {
    return null
  }

  const filePath = fileURLToPath(url)

  if (!filePath.startsWith(testsDir) || filePath.endsWith('.esm.preflight')) {
    return null
  }

  return filePath
}

const loadRawCoverageEntries = async () => {
  const files = await readdir(rawCoverageDir)
  const entries = []

  for (const fileName of files) {
    if (!fileName.endsWith('.json')) {
      continue
    }

    const filePath = path.join(rawCoverageDir, fileName)
    const fileContent = await readFile(filePath, 'utf8')
    const parsedContent = JSON.parse(fileContent)

    entries.push(...parsedContent.result)
  }

  return entries
}

const buildCoverageMap = async () => {
  const coverageMap = createCoverageMap({})
  const rawEntries = await loadRawCoverageEntries()
  const coverageByFile = new Map()

  for (const entry of rawEntries) {
    const filePath = toFilePath(entry.url)

    if (!filePath) {
      continue
    }

    const currentFunctions = coverageByFile.get(filePath) ?? []
    currentFunctions.push(...entry.functions)
    coverageByFile.set(filePath, currentFunctions)
  }

  for (const [filePath, functions] of coverageByFile.entries()) {
    const source = await readFile(filePath, 'utf8')
    const converter = v8ToIstanbul(filePath, 0, { source })

    await converter.load()
    converter.applyCoverage(functions)
    coverageMap.merge(converter.toIstanbul())
  }

  return coverageMap
}

const generateReports = async () => {
  const coverageMap = await buildCoverageMap()

  await rm(reportDir, { recursive: true, force: true })
  await mkdir(reportDir, { recursive: true })

  const context = createContext({
    coverageMap,
    dir: reportDir,
  })

  reports.create('text').execute(context)
  reports.create('lcovonly').execute(context)
}

await generateReports()