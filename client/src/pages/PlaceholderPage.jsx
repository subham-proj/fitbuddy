import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import styles from './PlaceholderPage.module.css';

/**
 * Stand-in for routes whose screens aren't built yet, so sidebar navigation
 * never leads to a broken link.
 *
 * @param {object} props
 * @param {string} props.title
 */
function PlaceholderPage({ title }) {
  return (
    <>
      <PageHeader title={title} />
      <Card className={styles.card}>
        <p className={styles.text}>
          The {title} screen is coming soon.
        </p>
      </Card>
    </>
  );
}

export default PlaceholderPage;
