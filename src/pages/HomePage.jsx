import Counter from '../features/counter/Counter';

function HomePage() {
  return (
    <main className="page">
      <header className="page-header">
        <h1>FitBuddy</h1>
        <p>Your fitness companion — project scaffold ready.</p>
      </header>
      <Counter />
    </main>
  );
}

export default HomePage;
