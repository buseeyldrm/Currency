import React, { useState } from 'react'
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import axios from 'axios';
import '../css/currency.css';


let BASE_URL = "https://api.freecurrencyapi.com/v1/latest";
let API_KEY = "fca_live_CnEO0uZaPs3TUOxLHMw6k72SCNZnz3mawBMDOso3";


function Currency() {

    const [amount, setAmount] = useState();
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("TRY");
    const [result, setResult] = useState(0);
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('dark');
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
    const [error, setError] = useState("");

    // Popüler para birimleri
    const popularCurrencies = ["USD", "EUR", "GBP", "JPY", "TRY", "AUD"];

    // Döviz kurları tablosu için veri çekme
    React.useEffect(() => {
        const fetchRates = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&base_currency=USD`);
                setRates(response.data.data);
                setLoading(false);
            } catch (error) {
                setRates({});
                setLoading(false);
            }
        };
        fetchRates();
    }, []);

    const exchange = async () => {
        setError("");
        if (amount === undefined || amount === null || amount === "") {
            setError("Lütfen bir değer giriniz!");
            setResult(0);
            return;
        }
        if (Number(amount) <= 0) {
            setError("Lütfen pozitif bir değer giriniz!");
            setResult(0);
            return;
        }
        const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&base_currency=${fromCurrency}`);
        const result = (response.data.data[toCurrency] * amount).toFixed(3);
        setResult(result);
    }

    // Tema renklerini belirle
    const themeStyles = theme === 'dark'
        ? { background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', color: '#fff' }
        : { background: 'linear-gradient(135deg, #f8fafc 0%, #e2e6ea 100%)', color: '#232526' };

    return (
        <div className={`currency-div ${theme}-theme`} style={themeStyles}>
            <button onClick={toggleTheme} style={{ position: 'absolute', right: 32, top: 20, zIndex: 2, border: 'none', background: 'none', color: theme === 'dark' ? '#fff' : '#222', fontSize: 24, cursor: 'pointer' }}>
                {theme === 'dark' ? '🌙 ' : '🌞'}
            </button>
            <div className='currency-title'>
                <h2>Döviz Kuru Uygulaması</h2>
            </div>

            <div style={{ marginTop: '25px' }}>
                <input value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number" min="0" className='amount'
                    placeholder='Örn:2' />

                <select onChange={(e) => setFromCurrency(e.target.value)} className='from-currency-option'>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>TRY</option>
                </select>

                <FaRegArrowAltCircleRight style={{ fontSize: '25px', marginRight: "10px", color: theme === 'dark' ? '#fff' : 'grey', verticalAlign: 'middle', position: 'relative', top: '-1.5px' }} />


                <select onChange={(e) => setToCurrency(e.target.value)} className='to-currency-option'>
                    <option>TRY</option>
                    <option>USD</option>
                    <option>EUR</option>
                </select>

                <input value={result} readOnly type="number" className='result' />
            </div>
            {error && <div style={{ color: 'grey', marginTop: 8, fontWeight: 'bold' }}>{error}</div>}
            <div>
                <button onClick={exchange}
                    className='exchange-button'>Çevir</button>
            </div>
            {/* Döviz Kurları Tablosu */}
            <div style={{ width: '100%', marginTop: 32 }}>
                <h4 style={{ color: '#fff', marginBottom: 8 }}>Popüler Döviz Kurları (USD Bazlı)</h4>
                {loading ? (
                    <div className="spinner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                        <div style={{ border: '4px solid #eee', borderTop: '4px solid #6a82fb', borderRadius: '50%', width: 32, height: 32, animation: 'spin 1s linear infinite' }}></div>
                    </div>
                ) : (
                    <table style={{ width: '100%', background: 'rgba(255,255,255,0.07)', borderRadius: 10, color: '#fff', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: 8, borderBottom: '1px solid #fff2' }}>Para Birimi</th>
                                <th style={{ padding: 8, borderBottom: '1px solid #fff2' }}>Kur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {popularCurrencies.map((cur) => (
                                <tr key={cur}>
                                    <td style={{ padding: 8, textAlign: 'center' }}>{cur}</td>
                                    <td style={{ padding: 8, textAlign: 'center' }}>{rates[cur] ? rates[cur].toFixed(4) : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
export default Currency
