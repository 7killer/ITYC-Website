import type { Plugin } from 'vite'

const toolEntries = [
  'pena.html', 'penaEn.html',
  'energy.html', 'energyEn.html',
  'polar.html', 'polarEn.html',
  'autoSail.html', 'autoSailEn.html',
  'penaDash.html', 'energyDash.html', 'polarDash.html', 'autoSailDash.html',
] as const

export function toolEntriesPlugin(): Plugin {
  return {
    name: 'ityc-tool-entries',
    apply: 'build',
    enforce: 'post',
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const index = bundle['index.html']
        if (!index || index.type !== 'asset') {
          this.error('Les entrées des outils nécessitent le fichier index.html compilé.')
        }
        // Emitting assets uses Vite's resolved output directory, including a
        // custom outDir. Reuse the final HTML and its existing hashed assets.
        for (const fileName of toolEntries) {
          this.emitFile({ type: 'asset', fileName, source: index.source })
        }
      },
    },
  }
}
