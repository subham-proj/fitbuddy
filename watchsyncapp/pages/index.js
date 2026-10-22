const { messageBuilder } = getApp()._options.globalData

/** Run a sensor read, swallowing any error so one missing field can't abort the whole sync. */
const safe = (fn, fallback = null) => {
  try {
    return fn()
  } catch (e) {
    return fallback
  }
}

/** Local calendar date as YYYY-MM-DD, used as the per-day document key. */
function todayISO() {
  const t = hmSensor.createSensor(hmSensor.id.TIME)
  const p = (n) => String(n).padStart(2, '0')
  return `${t.year}-${p(t.month)}-${p(t.day)}`
}

/**
 * Read every in-scope metric. Field names are the Zepp OS 1.0 ones confirmed
 * from docs.zepp.com/docs/1.0 sensor pages:
 *  - STEP/CALORIE: current, target
 *  - HEART: last, current, today (today is a PROPERTY array, not getToday())
 *  - SLEEP: updateInfo() then getBasicInfo/getTotalTime/getSleepStageModel/
 *           getSleepStageData/getSleepHrData
 *  - STRESS: current, time (sensor may be unavailable on this model → guarded)
 *  - SPO2: current, time, hourAvgofDay (length-24 hourly averages)
 */
function collect() {
  const step = hmSensor.createSensor(hmSensor.id.STEP)
  const calorie = hmSensor.createSensor(hmSensor.id.CALORIE)
  const heart = hmSensor.createSensor(hmSensor.id.HEART)
  const sleep = hmSensor.createSensor(hmSensor.id.SLEEP)
  const stress = hmSensor.createSensor(hmSensor.id.STRESS)
  const spo2 = hmSensor.createSensor(hmSensor.id.SPO2)

  // Sleep data is stale until explicitly refreshed.
  safe(() => sleep.updateInfo())

  return {
    date: todayISO(),
    syncedAt: Date.now(),
    steps: {
      current: safe(() => step.current),
      target: safe(() => step.target),
    },
    calories: {
      current: safe(() => calorie.current),
      target: safe(() => calorie.target),
    },
    heartRate: {
      last: safe(() => heart.last),
      current: safe(() => heart.current),
      today: safe(() => heart.today, []), // per-minute bpm, index = minute of day
    },
    sleep: {
      basic: safe(() => sleep.getBasicInfo()), // { score, deepMin, startTime, endTime }
      totalMin: safe(() => sleep.getTotalTime()),
      stageModel: safe(() => sleep.getSleepStageModel()),
      stages: safe(() => sleep.getSleepStageData(), []), // [{ model, start, stop }]
      hr: safe(() => sleep.getSleepHrData(), []),
    },
    stress: {
      current: safe(() => stress.current),
      time: safe(() => stress.time),
    },
    spo2: {
      current: safe(() => spo2.current),
      time: safe(() => spo2.time),
      hourAvgofDay: safe(() => spo2.hourAvgofDay, []), // length 24, hourly averages
    },
  }
}

Page({
  build() {
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 110,
      w: 336,
      h: 46,
      text: 'FitBuddy Sync',
      color: 0xffffff,
      text_size: 32,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
    })

    const status = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 170,
      w: 336,
      h: 80,
      text: 'Syncing…',
      color: 0xcccccc,
      text_size: 26,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
    })

    const setStatus = (text, color) =>
      status.setProperty(hmUI.prop.MORE, { text, color })

    messageBuilder
      .request({ method: 'SYNC', data: collect() })
      .then((res) => {
        if (res && res.ok) setStatus('Synced ✓', 0x33cc66)
        else if (res && res.error === 'not_configured')
          setStatus('Set up in Zepp app', 0xffaa33)
        else if (res && res.error === 'network')
          setStatus('No internet', 0xffaa33)
        else setStatus('Server error', 0xff6666)
      })
      .catch(() => setStatus('Phone not connected', 0xffaa33))
  },
})
