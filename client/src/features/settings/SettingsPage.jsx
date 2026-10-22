import { useState } from 'react';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DeviceRow from '../../components/ui/DeviceRow';
import FormField from '../../components/ui/FormField';
import SegmentedControl from '../../components/ui/SegmentedControl';
import Switch from '../../components/ui/Switch';
import {
  devices,
  fixedTargets,
  notifications,
  profile,
  unitValues,
} from '../../mock/settings';
import styles from './SettingsPage.module.css';

const unitOptions = [
  { value: 'metric', label: 'Metric' },
  { value: 'imperial', label: 'Imperial' },
];

/** Settings (route "/settings"). Profile, targets, devices, notifications. */
function SettingsPage() {
  const [unit, setUnit] = useState('metric');
  const [notifs, setNotifs] = useState(() =>
    Object.fromEntries(notifications.map((n) => [n.id, n.enabled])),
  );

  const u = unitValues[unit];

  const toggleNotif = (id) =>
    setNotifs((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className={styles.narrow}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Settings</h1>
          <span className={styles.subtitle}>
            Profile, targets, devices and notifications.
          </span>
        </div>
        <Button variant="dark">Save changes</Button>
      </header>

      {/* Profile */}
      <Card as="section" className={styles.section}>
        <div className={styles.profileHead}>
          <span className={styles.avatar} aria-hidden="true">
            {profile.initials}
          </span>
          <div className={styles.profileTitle}>
            <h2 className={styles.h2}>Profile</h2>
            <span className={styles.muted}>Used to calculate calories and targets.</span>
          </div>
          <Button variant="secondary">Change photo</Button>
        </div>
        <div className={styles.fieldGrid}>
          <FormField id="f-name" label="Full name" defaultValue={profile.name} />
          <FormField id="f-email" label="Email" type="email" defaultValue={profile.email} />
          {/* key forces the uncontrolled input to reset when units change */}
          <FormField key={`h-${unit}`} id="f-height" label={u.height.label} defaultValue={u.height.value} />
          <FormField key={`w-${unit}`} id="f-weight" label={u.weight.label} defaultValue={u.weight.value} />
          <FormField id="f-born" label="Year of birth" defaultValue={profile.yearOfBirth} />
          <FormField
            id="f-level"
            label="Activity level"
            options={profile.activityLevels}
            selected={profile.activityLevel}
          />
        </div>
      </Card>

      {/* Units & targets */}
      <Card as="section" className={styles.section}>
        <div className={styles.unitsHead}>
          <div className={styles.profileTitle}>
            <h2 className={styles.h2}>Units &amp; daily targets</h2>
            <span className={styles.muted}>Targets drive your rings and goal badges.</span>
          </div>
          <SegmentedControl
            ariaLabel="Units"
            options={unitOptions}
            value={unit}
            onChange={setUnit}
          />
        </div>
        <div className={styles.targetGrid}>
          {fixedTargets.map((t) => (
            <FormField key={t.id} id={t.id} label={t.label} defaultValue={t.value} />
          ))}
          <FormField key={`water-${unit}`} id="t-water" label={u.water.label} defaultValue={u.water.value} />
        </div>
      </Card>

      {/* Connected devices */}
      <Card as="section" className={styles.listSection}>
        <h2 className={styles.h2}>Connected devices</h2>
        {devices.map((d) => (
          <DeviceRow
            key={d.id}
            initials={d.initials}
            name={d.name}
            meta={d.meta}
            connected={d.connected}
          />
        ))}
      </Card>

      {/* Notifications */}
      <Card as="section" className={styles.listSection}>
        <h2 className={styles.h2}>Notifications</h2>
        {notifications.map((n) => (
          <div key={n.id} className={styles.notifRow}>
            <div className={styles.notifText}>
              <span className={styles.notifName}>{n.name}</span>
              <span className={styles.muted}>{n.meta}</span>
            </div>
            <Switch
              checked={notifs[n.id]}
              onChange={() => toggleNotif(n.id)}
              label={n.name}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}

export default SettingsPage;
