import DailyRates from './components/DailyRates';
import Currency from './components/Currency';
import NewsContainer from './components/NewContainer';
import './App.css';

function App() {
  return (
    <div className="app-main-container">
      <div className="app-panel left">
        <DailyRates />
      </div>
      <div className="app-panel center">
        <Currency />
      </div>
      <div className="app-panel right">
        <NewsContainer />
      </div>
    </div>
  );
}

export default App;
