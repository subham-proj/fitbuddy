/**
 * Zepp phone-app settings screen for FitBuddy Sync.
 *
 * Lets the user enter their backend URL and API key here instead of hard-coding
 * secrets in source. Values are read by app-side/index.js via
 * `settings.settingsStorage.getItem(...)`.
 *
 * Keys: `apiBase` (HTTPS origin), `apiKey` (must match server WATCH_KEY).
 */
AppSettingsPage({
  state: { props: {} },

  setState(props) {
    this.state.props = props;
  },

  getItem(key) {
    return this.state.props.settingsStorage.getItem(key) || '';
  },

  setItem(key, value) {
    this.state.props.settingsStorage.setItem(key, value);
  },

  build(props) {
    this.setState(props);

    return View(
      { style: { padding: '16px 20px' } },
      [
        View(
          { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' } },
          ['FitBuddy Sync'],
        ),
        View(
          { style: { fontSize: '13px', color: '#666', marginBottom: '16px' } },
          ['Where to send your watch health data.'],
        ),

        View(
          { style: { fontSize: '13px', color: '#333', marginBottom: '4px' } },
          ['Backend URL (must be https://)'],
        ),
        TextInput({
          label: 'https://api.yourdomain.com',
          value: this.getItem('apiBase'),
          maxLength: 200,
          onChange: (val) => this.setItem('apiBase', (val || '').trim()),
        }),

        View(
          {
            style: {
              fontSize: '13px',
              color: '#333',
              margin: '16px 0 4px 0',
            },
          },
          ['API key (matches server WATCH_KEY)'],
        ),
        TextInput({
          label: 'paste your key',
          value: this.getItem('apiKey'),
          maxLength: 200,
          onChange: (val) => this.setItem('apiKey', (val || '').trim()),
        }),
      ],
    );
  },
});
