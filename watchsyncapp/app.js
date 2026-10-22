import './shared/device-polyfill'
import { MessageBuilder } from './shared/message'

/**
 * Root app. Owns the single BLE MessageBuilder used to talk to the phone-side
 * service. Pages read it from `getApp()._options.globalData`.
 */
App({
  globalData: {
    messageBuilder: null,
  },
  onCreate() {
    if (!hmApp.packageInfo) {
      throw new Error(
        'appId missing: set it in app.json (app.appId) before building.',
      )
    }
    const appId = hmApp.packageInfo().appId
    this.globalData.messageBuilder = new MessageBuilder({ appId })
    this.globalData.messageBuilder.connect()
  },
  onDestroy() {
    if (this.globalData.messageBuilder) {
      this.globalData.messageBuilder.disConnect()
    }
  },
})
