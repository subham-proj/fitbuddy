import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DeviceRow from '../../components/ui/DeviceRow';
import FormField from '../../components/ui/FormField';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { formatRelativeTime } from '../../utils/format';
import styles from './SettingsPage.module.css';
import {
  fetchSettings,
  fetchWatchStatus,
  saveSettings,
  selectSettings,
  selectSettingsError,
  selectSettingsSaveError,
  selectSettingsSaving,
  selectSettingsStatus,
  selectWatchStatus,
} from './settingsSlice';

const UNIT_OPTIONS = [
  { value: 'metric', label: 'Metric' },
  { value: 'imperial', label: 'Imperial' },
];

const ACTIVITY_LEVELS = ['Lightly active', 'Active', 'Very active'];

// Unit conversions (canonical storage is metric).
const round1 = (n) => Math.round(n * 10) / 10;
const cmToIn = (cm) => round1(cm / 2.54);
const inToCm = (inch) => round1(inch * 2.54);
const kgToLb = (kg) => round1(kg / 0.453592);
const lbToKg = (lb) => round1(lb * 0.453592);

const toStr = (n) => (n === null || n === undefined ? '' : String(n));
const toNum = (v) => (v === '' ? 0 : Number(v));

/** Display string for a canonical metric value, in the chosen unit. */
function toDisplay(canonical, unit, kind) {
  if (canonical === null || canonical === undefined) return '';
  if (unit === 'metric') return String(canonical);
  return String(kind === 'height' ? cmToIn(canonical) : kgToLb(canonical));
}

/** Canonical metric value from a display string in the chosen unit. */
function toCanonical(val, unit, kind) {
  if (val === '') return null;
  const n = Number(val);
  if (!Number.isFinite(n)) return null;
  if (unit === 'metric') return n;
  return kind === 'height' ? inToCm(n) : lbToKg(n);
}

/**
 * Editable settings form, seeded once from the loaded settings (parent remounts
 * via `key`). Body metrics are edited in the selected unit but saved in metric.
 */
function SettingsForm({ settings, watch }) {
  const dispatch = useAppDispatch();
  const saving = useAppSelector(selectSettingsSaving);
  const saveError = useAppSelector(selectSettingsSaveError);

  const [form, setForm] = useState(() => ({
    name: settings.profile.name,
    email: settings.profile.email,
    yearOfBirth: toStr(settings.profile.yearOfBirth),
    activityLevel: settings.profile.activityLevel,
    units: settings.units,
    height: toDisplay(settings.bodyMetrics.heightCm, settings.units, 'height'),
    weight: toDisplay(settings.bodyMetrics.weightKg, settings.units, 'weight'),
    steps: toStr(settings.targets.steps),
    moveKcal: toStr(settings.targets.moveKcal),
    exerciseMin: toStr(settings.targets.exerciseMin),
    calories: toStr(settings.targets.calories),
    protein: toStr(settings.targets.protein),
    carbs: toStr(settings.targets.carbs),
    fat: toStr(settings.targets.fat),
    fibre: toStr(settings.targets.fibre),
    waterGlasses: toStr(settings.targets.waterGlasses),
    glassMl: toStr(settings.targets.glassMl),
  }));

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // Toggling units re-expresses the current height/weight in the new unit.
  const changeUnits = (next) =>
    setForm((f) => {
      const hCm = toCanonical(f.height, f.units, 'height');
      const wKg = toCanonical(f.weight, f.units, 'weight');
      return {
        ...f,
        units: next,
        height: toDisplay(hCm, next, 'height'),
        weight: toDisplay(wKg, next, 'weight'),
      };
    });

  const handleSave = () => {
    dispatch(
      saveSettings({
        units: form.units,
        profile: {
          name: form.name.trim(),
          email: form.email.trim(),
          yearOfBirth: form.yearOfBirth === '' ? null : Number(form.yearOfBirth),
          activityLevel: form.activityLevel,
        },
        bodyMetrics: {
          heightCm: toCanonical(form.height, form.units, 'height'),
          weightKg: toCanonical(form.weight, form.units, 'weight'),
        },
        targets: {
          steps: toNum(form.steps),
          moveKcal: toNum(form.moveKcal),
          exerciseMin: toNum(form.exerciseMin),
          calories: toNum(form.calories),
          protein: toNum(form.protein),
          carbs: toNum(form.carbs),
          fat: toNum(form.fat),
          fibre: toNum(form.fibre),
          waterGlasses: toNum(form.waterGlasses),
          glassMl: toNum(form.glassMl),
        },
      }),
    );
  };

  const metric = form.units === 'metric';

  let watchMeta = 'Checking…';
  if (watch) {
    watchMeta = watch.connected
      ? `Last synced ${formatRelativeTime(watch.updatedAt)}${watch.lastDate ? ` · ${watch.lastDate}` : ''}`
      : 'No data synced yet';
  }

  return (
    <div className={styles.narrow}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Settings</h1>
          <span className={styles.subtitle}>Profile, targets and your watch.</span>
        </div>
        <Button variant="dark" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </header>

      {saveError && <p className={styles.state}>Couldn’t save: {saveError}</p>}

      {/* Profile */}
      <Card as="section" className={styles.section}>
        <div className={styles.profileHead}>
          <div className={styles.profileTitle}>
            <h2 className={styles.h2}>Profile</h2>
            <span className={styles.muted}>Used to calculate calories and targets.</span>
          </div>
        </div>
        <div className={styles.fieldGrid}>
          <FormField id="f-name" label="Full name" value={form.name} onChange={setField('name')} />
          <FormField id="f-email" label="Email" type="email" value={form.email} onChange={setField('email')} />
          <FormField
            id="f-height"
            label={metric ? 'Height (cm)' : 'Height (in)'}
            value={form.height}
            onChange={setField('height')}
            inputMode="decimal"
          />
          <FormField
            id="f-weight"
            label={metric ? 'Weight (kg)' : 'Weight (lb)'}
            value={form.weight}
            onChange={setField('weight')}
            inputMode="decimal"
          />
          <FormField id="f-born" label="Year of birth" value={form.yearOfBirth} onChange={setField('yearOfBirth')} inputMode="numeric" />
          <FormField
            id="f-level"
            label="Activity level"
            options={ACTIVITY_LEVELS}
            value={form.activityLevel}
            onChange={setField('activityLevel')}
          />
        </div>
      </Card>

      {/* Units & targets */}
      <Card as="section" className={styles.section}>
        <div className={styles.unitsHead}>
          <div className={styles.profileTitle}>
            <h2 className={styles.h2}>Units &amp; daily targets</h2>
            <span className={styles.muted}>Targets drive your rings, nutrition and goals.</span>
          </div>
          <SegmentedControl
            ariaLabel="Units"
            options={UNIT_OPTIONS}
            value={form.units}
            onChange={changeUnits}
          />
        </div>
        <div className={styles.targetGrid}>
          <FormField id="t-steps" label="Steps" value={form.steps} onChange={setField('steps')} inputMode="numeric" />
          <FormField id="t-move" label="Move (kcal)" value={form.moveKcal} onChange={setField('moveKcal')} inputMode="numeric" />
          <FormField id="t-ex" label="Exercise (min)" value={form.exerciseMin} onChange={setField('exerciseMin')} inputMode="numeric" />
          <FormField id="t-cal" label="Calories (kcal)" value={form.calories} onChange={setField('calories')} inputMode="numeric" />
          <FormField id="t-protein" label="Protein (g)" value={form.protein} onChange={setField('protein')} inputMode="numeric" />
          <FormField id="t-carbs" label="Carbs (g)" value={form.carbs} onChange={setField('carbs')} inputMode="numeric" />
          <FormField id="t-fat" label="Fat (g)" value={form.fat} onChange={setField('fat')} inputMode="numeric" />
          <FormField id="t-fibre" label="Fibre (g)" value={form.fibre} onChange={setField('fibre')} inputMode="numeric" />
          <FormField id="t-water" label="Water (glasses)" value={form.waterGlasses} onChange={setField('waterGlasses')} inputMode="numeric" />
          <FormField id="t-glass" label="Glass size (ml)" value={form.glassMl} onChange={setField('glassMl')} inputMode="numeric" />
        </div>
      </Card>

      {/* Watch */}
      <Card as="section" className={styles.listSection}>
        <h2 className={styles.h2}>Connected devices</h2>
        <DeviceRow initials="⌚" name="FitBuddy Watch (Zepp)" meta={watchMeta} />
      </Card>
    </div>
  );
}

/** Settings (route "/settings"). Profile, targets and watch status. */
function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const status = useAppSelector(selectSettingsStatus);
  const error = useAppSelector(selectSettingsError);
  const watch = useAppSelector(selectWatchStatus);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchSettings());
    dispatch(fetchWatchStatus());
  }, [status, dispatch]);

  if (status === 'failed') {
    return (
      <div className={styles.narrow}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.state}>Couldn’t load settings: {error}</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className={styles.narrow}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.state}>Loading…</p>
      </div>
    );
  }

  // Remount the form when a save returns fresh data so inputs re-seed cleanly.
  return <SettingsForm key={settings.updatedAt} settings={settings} watch={watch} />;
}

export default SettingsPage;
