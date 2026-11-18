import assert from 'node:assert/strict'
import { createServer } from 'vite'

const saved = new Map()
globalThis.testInstalledApps = { platform: 'web', packages: [] }
globalThis.localStorage = {
  getItem: key => saved.get(key) ?? null,
  setItem: (key, value) => saved.set(key, value),
  removeItem: key => saved.delete(key),
}
const { createPinia, setActivePinia } = await import('pinia')
const server = await createServer({
  configFile: false,
  cacheDir: 'node_modules/.vite-store-tests',
  ssr: { noExternal: ['tmdb-ts', '@capacitor/core', '@capacitor/device', '@capacitor/app-launcher'] },
  plugins: [{
    name: 'mock-tmdb',
    enforce: 'pre',
    resolveId(id) {
      if (id === 'tmdb-ts') return '\0mock-tmdb'
      if (id === '@capacitor/core') return '\0mock-capacitor'
      if (id === '@capacitor/device') return '\0mock-device'
      if (id === '@capacitor/app-launcher') return '\0mock-app-launcher'
    },
    load(id) {
      if (id === '\0mock-capacitor') return `export const Capacitor = { getPlatform: () => globalThis.testInstalledApps.platform }`
      if (id === '\0mock-device') return `export const Device = { getInfo: async () => ({ platform: globalThis.testInstalledApps.platform }) }`
      if (id === '\0mock-app-launcher') return `export const AppLauncher = {
        canOpenUrl: async ({ url }) => ({ value: globalThis.testInstalledApps.packages.includes(url) }),
      }`
      if (id !== '\0mock-tmdb') return
      return `export class TMDB {
        constructor() {
          const request = (path, options = {}) => fetch(path + '?' + new URLSearchParams(options)).then(response => {
            if (!response.ok) throw new Error('API request failed')
            return response.json()
          })
          this.search = { multi: options => request('/search/multi', options) }
          this.movies = { popular: () => request('/movie/popular') }
          this.tvShows = { popular: () => request('/tv/popular') }
        }
      }`
    },
  }],
  resolve: { alias: { '@': new URL('../src', import.meta.url).pathname } },
  server: { middlewareMode: true, watch: null, ws: false },
  appType: 'custom',
  define: { 'import.meta.env.VITE_TMDB_API_KEY': JSON.stringify('test-key') },
})
const originalFetch = globalThis.fetch
const requests = []
globalThis.fetch = (url) => new Promise((resolve, reject) => requests.push({ url: String(url), resolve, reject }))
async function respond(index, results) {
  assert.ok(requests[index], `Expected API request ${index}`)
  requests[index].resolve(new Response(JSON.stringify({ results }), {
    headers: { 'Content-Type': 'application/json' },
  }))
}
try {
  setActivePinia(createPinia())
  const { useServicesStore } = await server.ssrLoadModule('/src/stores/services.ts')
  const services = useServicesStore()
  await services.initStore()
  services.preselectInstalledApps()
  assert.equal(saved.has('servicesState'), false)
  const first = services.addCustomInstance('seerr', { name: 'Primary', baseUrl: 'https://example.test', apiKey: 'fake' })
  const second = services.addCustomInstance('seerr', { name: 'Secondary', baseUrl: 'https://second.test' })
  const firstId = `seerr-${first.id}`
  services.toggleService(firstId)
  services.loadFromLocalStorage()
  assert.equal(services.isServiceSelected(firstId), false)
  assert.equal(services.isServiceSelected(`seerr-${second.id}`), true)
  services.installedApps.push('jellyfin')
  services.loadFromLocalStorage()
  assert.equal(services.isServiceSelected(firstId), false)
  assert.equal(services.isServiceInstalled(services.availableServices.find(service => service.id === 'jellyfin')), true)
  assert.deepEqual(Object.keys(JSON.parse(saved.get('servicesState')).customInstances), ['seerr'])
  services.updateCustomInstance('seerr', first.id, { name: 'Renamed', apiKey: 'updated', isDefault: true })
  const entry = services.availableServices.find(service => service.id === firstId)
  assert.equal(entry.name, 'Seerr (Renamed)')
  assert.equal(entry.instanceData.apiKey, 'updated')
  assert.equal(entry.customInstances, undefined)
  services.clearStoredCredentials()
  assert.equal(entry.instanceData.apiKey, undefined)
  services.removeCustomInstance('seerr', first.id)
  assert.equal(services.availableServices.some(service => service.id === firstId), false)
  assert.equal(services.getDefaultInstance('seerr').id, second.id)

  saved.delete('servicesState')
  globalThis.testInstalledApps = {
    platform: 'android',
    packages: ['com.netflix.mediaclient', 'com.disney.disneyplus', 'tv.trakt.trakt',
      'com.imdb.mobile', 'com.crunchyroll.crunchyroid', 'com.mb.android'],
  }
  setActivePinia(createPinia())
  const firstRun = useServicesStore()
  await firstRun.initStore()
  firstRun.preselectInstalledApps()
  assert.equal(firstRun.installedServices.length, 6)
  assert.deepEqual(firstRun.selectedServiceIds, firstRun.installedServices.map(service => service.id))
  assert.deepEqual(JSON.parse(saved.get('servicesState')).selectedServiceIds, firstRun.selectedServiceIds)
  for (const id of [...firstRun.selectedServiceIds]) firstRun.toggleService(id)

  setActivePinia(createPinia())
  const returningUser = useServicesStore()
  await returningUser.initStore()
  returningUser.preselectInstalledApps()
  assert.deepEqual(returningUser.selectedServiceIds, [])

  saved.delete('servicesState')
  setActivePinia(createPinia())
  const manualFirstRun = useServicesStore()
  manualFirstRun.toggleService('yamtrack')
  await manualFirstRun.checkInstalledApps()
  manualFirstRun.preselectInstalledApps()
  assert.deepEqual(manualFirstRun.selectedServiceIds, ['yamtrack'])

  const { useMoviesStore } = await server.ssrLoadModule('/src/stores/movies.ts')
  const movies = useMoviesStore()
  const older = movies.searchMulti('old')
  const newer = movies.searchMulti('new')
  await respond(1, [{ id: 2 }])
  await newer
  await respond(0, [{ id: 1 }])
  await older
  assert.equal(movies.searchResults[0].id, 2)
  const pending = movies.searchMulti('pending')
  movies.clearSearch()
  await respond(2, [{ id: 3 }])
  await pending
  assert.deepEqual(movies.searchResults, [])
  assert.equal(movies.loading, false)

  const popular = movies.fetchPopularMovies()
  const tv = movies.fetchPopularTVShows()
  const search = movies.searchMulti('parallel')
  movies.cancelPendingDetails()
  assert.equal(movies.loading, true)
  await respond(3, [])
  await popular
  assert.equal(movies.loading, true)
  await respond(5, [])
  await search
  assert.equal(movies.loading, true)
  await respond(4, [])
  await tv
  assert.equal(movies.loading, false)

  const { loadRecentSearches } = await server.ssrLoadModule('/src/utils/recentSearches.ts')
  for (const raw of ['{broken', 'null', '{}', '42', '"text"']) {
    saved.set('recentSearches', raw)
    assert.deepEqual(loadRecentSearches(), [])
  }
  saved.set('recentSearches', JSON.stringify(['Movie', null, 12, '', '   ', 'Show']))
  assert.deepEqual(loadRecentSearches(), ['Movie', 'Show'])
  saved.delete('recentSearches')
  assert.deepEqual(loadRecentSearches(), [])
  console.log('Service persistence, search concurrency, loading, and recent-search regressions passed')
} finally {
  globalThis.fetch = originalFetch
  await server.close()
  delete globalThis.localStorage
  delete globalThis.testInstalledApps
}
