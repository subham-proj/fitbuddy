import { MessageBuilder } from '../shared/message'
import { API_BASE, SYNC_PATH, API_KEY } from './config'

const messageBuilder = new MessageBuilder()

/** Read a settings value (entered in the Zepp app), falling back to config.js. */
function setting(key, fallback) {
  try {
    const v = settings.settingsStorage.getItem(key)
    if (v !== undefined && v !== null && v !== '') return v
  } catch (e) {
    // settings unavailable (e.g. simulator) — use fallback
  }
  return fallback
}

/** Forward the watch payload to the FitBuddy backend and report ok back to the watch. */
async function syncToBackend(ctx, payload) {
  // Strip trailing slashes so joining with SYNC_PATH can't produce `//`.
  const apiBase = setting('apiBase', API_BASE).replace(/\/+$/, '')
  const apiKey = setting('apiKey', API_KEY)

  if (!apiBase || !apiKey) {
    // Not configured yet — tell the watch so it can show a clear message.
    ctx.response({ data: { ok: false, error: 'not_configured' } })
    return
  }

  try {
    const res = await fetch({
      url: `${apiBase}${SYNC_PATH}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    })

    // res.body is a string on some models, an object on others — normalize.
    const body =
      typeof res.body === 'string' ? JSON.parse(res.body) : res.body

    ctx.response({ data: { ok: !!(body && body.ok) } })
  } catch (e) {
    ctx.response({ data: { ok: false, error: 'network' } })
  }
}

AppSideService({
  onInit() {
    messageBuilder.listen(() => {})

    messageBuilder.on('request', (ctx) => {
      const req = messageBuilder.buf2Json(ctx.request.payload)
      if (req.method === 'SYNC') {
        return syncToBackend(ctx, req.data)
      }
    })
  },
  onRun() {},
  onDestroy() {},
})
