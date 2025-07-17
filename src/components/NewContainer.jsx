import React, { useEffect, useState } from 'react';
import '../css/NewContainer.css';
import axios from 'axios';

const API_KEY = 'pub_7633c1f624d24d7dac4bb594939bb436';
const BASE_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=tr&category=business&q=kur%20OR%20döviz%20OR%20dolar%20OR%20euro%20OR%20sterlin%20OR%20altın%20OR%20exchange%20OR%20currency`;

function NewContainer() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(BASE_URL);
                setNews(res.data.results || []);
            } catch (err) {
                setError("Haberler alınamadı.");
            }
            setLoading(false);
        };
        fetchNews();
    }, []);

    return (
        <div className="news-container-box full-width-news">
            <div className="news-container-title">Güncel Döviz & Ekonomi Haberleri</div>
            <div className="news-container-list">
                {loading ? (
                    <div className="news-container-loading">Yükleniyor...</div>
                ) : error ? (
                    <div className="news-container-error">{error}</div>
                ) : news.length === 0 ? (
                    <div className="news-container-empty">Haber bulunamadı.</div>
                ) : (
                    news.slice(0, 10).map((item, i) => (
                        <a
                            className="news-container-item"
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.image_url && <img src={item.image_url} alt="haber görseli" className="news-container-img" />}
                            <div className="news-container-headline">{item.title}</div>
                            {item.description && <div className="news-container-desc">{item.description.slice(0, 80)}...</div>}
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}

export default NewContainer; 