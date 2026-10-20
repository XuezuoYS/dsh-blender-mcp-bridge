/**
 * Preflight probe.
 *
 * Prints environment facts and tries a read-only handshake against the live
 * Blender session. When nothing is listening it reports SKIP and exits 0:
 * a missing environment is not a capability failure.
 *
 * Usage:
 *   node diagnostics/probePreflight.js            # uses 127.0.0.1:9876
 *   set DSH_BLENDER_PORT=9877 && node diagnostics/probePreflight.js
 */

import { HandshakeError, handshake } from '../lib/handshake.js'

const host = process.env.DSH_BLENDER_HOST ?? '127.0.0.1'
const port = Number(process.env.DSH_BLENDER_PORT ?? 9876)
const connectTimeoutMs = Number(process.env.DSH_BLENDER_CONNECT_TIMEOUT ?? 5000)
const responseTimeoutMs = Number(process.env.DSH_BLENDER_RESPONSE_TIMEOUT ?? 10000)

console.log(`node ${process.version}`)
console.log(`target ${host}:${port}`)

try {
  const info = await handshake({ host, port, connectTimeoutMs, responseTimeoutMs, maxResponseChars: 200000 })
  console.log('PASS connected')
  console.log(`  Blender        ${info.blenderVersion} (manual ${info.versionMajorMinor})`)
  console.log(`  file           ${info.filePath || '(unsaved)'}`)
  console.log(`  dirty          ${info.isDirty}`)
  console.log(`  objects        ${info.objectCount}`)
  console.log(`  scene / mode   ${info.activeScene} / ${info.mode}`)
  console.log(`  undo limit     ${info.undoStepLimit} (preference, not history depth)`)
  console.log(`  python         ${info.pythonVersion}`)
  console.log(
    `  render         ${info.renderSettings.engine} ${info.renderSettings.width}x${info.renderSettings.height} ` +
      `@ ${info.renderSettings.resolutionPercentage}% / ${info.renderSettings.samples} samples`,
  )
  console.log(`  docs           ${info.docs.manualEn}`)
  if (info.background) console.log('  warning        Blender runs in background mode; screenshots and undo will not work')
  process.exit(0)
} catch (error) {
  if (error instanceof HandshakeError) {
    console.log(`SKIP ${error.kind}: ${error.message}`)
    for (const action of error.actions) console.log(`  -> ${action}`)
    process.exit(0)
  }
  console.error('FAIL unexpected error:', error)
  process.exit(1)
}
