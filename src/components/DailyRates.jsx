import React, { useEffect, useState } from 'react';
import '../css/dailyrates.css';

const API_KEY = 'fca_live_CnEO0uZaPs3TUOxLHMw6k72SCNZnz3mawBMDOso3';
const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';
const HISTORICAL_URL = 'https://api.freecurrencyapi.com/v1/historical';
const CURRENCIES = [
    { code: 'USD', name: 'Dolar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Sterlin' },
];

function getYesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

const DailyRates = () => {
    const [rates, setRates] = useState({});
    const [prevRates, setPrevRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRates = async () => {
        setLoading(true);
        setError(null);
        try {
            const yesterday = getYesterday();
            const todayUrl = `${BASE_URL}?apikey=${API_KEY}&base_currency=TRY&currencies=USD,EUR,GBP`;
            const prevUrl = `${HISTORICAL_URL}?apikey=${API_KEY}&base_currency=TRY&currencies=USD,EUR,GBP&date=${yesterday}`;

            const [resToday, resPrev] = await Promise.all([
                fetch(todayUrl),
                fetch(prevUrl)
            ]);

            if (!resToday.ok || !resPrev.ok) {
                throw new Error('API yanıtı alınamadı.');
            }

            const dataToday = await resToday.json();
            const dataPrev = await resPrev.json();

            if (!dataToday.data || !dataPrev.data || !dataPrev.data[yesterday]) {
                throw new Error('API yanıtı beklenmedik formatta.');
            }

            const newRates = Object.fromEntries(
                Object.entries(dataToday.data).map(([code, val]) => [code, 1 / val])
            );
            const prevDayRates = Object.fromEntries(
                Object.entries(dataPrev.data[yesterday]).map(([code, val]) => [code, 1 / val])
            );
            setRates(newRates);
            setPrevRates(prevDayRates);

        } catch (err) {
            setError('Döviz kurları alınamadı: ' + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    return (
        <div className="daily-rates-row-panel">
            {error && (
                <div className="daily-rates-error">{error}</div>
            )}
            <div className="daily-rates-row-list">
                {CURRENCIES.map(({ code, name }) => {
                    const rate = rates[code];
                    const buy = rate ? (rate * 0.998).toFixed(4) : '-';
                    const sell = rate ? (rate * 1.002).toFixed(4) : '-';
                    return (
                        <div className="custom-rate-card" key={code}>
                            <div className="custom-rate-header">
                                <span className="custom-rate-title">{name}</span>
                            </div>
                            <div className="custom-rate-box">
                                <div className="custom-rate-col">
                                    <div className="custom-rate-label">ALIŞ (TL)</div>
                                    <div className="custom-rate-value">{buy !== '-' ? buy.replace('.', ',') : '-'}</div>
                                </div>
                                <div className="custom-rate-divider" />
                                <div className="custom-rate-col">
                                    <div className="custom-rate-label">SATIŞ (TL)</div>
                                    <div className="custom-rate-value">{sell !== '-' ? sell.replace('.', ',') : '-'}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DailyRates; 