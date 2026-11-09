import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, SlidersHorizontal, Plus, Camera, Layers, Award, 
  Coins, Filter, ArrowUpDown, ShieldCheck, Check, Sparkles, 
  Trash2, Edit3, Eye, ArrowLeft, RefreshCw, Upload, Smartphone, 
  TrendingUp, Globe, Database, CheckCircle2, X, ChevronRight, Info
} from 'lucide-react';

const INITIAL_COINS = [
  {
    id: 1,
    title: "1 Dollar 'Morgan Dollar'",
    issuer: "United States",
    flag: "🇺🇸",
    years: "1878-1921",
    composition: "Silver (.900)",
    weight: "26.73 g",
    diameter: "38.1 mm",
    thickness: "2.4 mm",
    rarity: 18,
    mintage: "136,920,000",
    obverseImg: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400",
    reverseImg: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400",
    description: "Designed by George T. Morgan. Features Liberty profile on obverse and eagle holding arrows and olive branch on reverse."
  },
  {
    id: 2,
    title: "5 Francs 'Hercules'",
    issuer: "France",
    flag: "🇫🇷",
    years: "1964-1980",
    composition: "Silver (.900)",
    weight: "25.0 g",
    diameter: "37.0 mm",
    thickness: "2.3 mm",
    rarity: 24,
    mintage: "4,990,000",
    obverseImg: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=400",
    reverseImg: "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=400",
    description: "Designed by Augustin Dupré. Features Hercules unifying Liberty and Equality."
  },
  {
    id: 3,
    title: "1 Pound - Charles III (Bee)",
    issuer: "United Kingdom",
    flag: "🇬🇧",
    years: "2023-present",
    composition: "Bimetallic (Nickel-brass ring, Cupronickel center)",
    weight: "8.75 g",
    diameter: "23.4 mm",
    thickness: "2.8 mm",
    rarity: 42,
    mintage: "2,960,000",
    obverseImg: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400",
    reverseImg: "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?auto=format&fit=crop&q=80&w=400",
    description: "Features King Charles III uncrowned portrait on obverse and Bumblebee design celebrating British wildlife on reverse."
  },
  {
    id: 4,
    title: "50 Pence 'Atlantic Salmon'",
    issuer: "United Kingdom",
    flag: "🇬🇧",
    years: "2023-present",
    composition: "Cupronickel",
    weight: "8.00 g",
    diameter: "27.3 mm",
    thickness: "1.78 mm",
    rarity: 65,
    mintage: "500,000",
    obverseImg: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400",
    reverseImg: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400",
    description: "Part of the new UK wildlife defintive series featuring the Atlantic Salmon."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [coins] = useState(INITIAL_COINS);
  const [collection, setCollection] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  
  // Scanner state
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleScan = (presetCoin) => {
    setScanning(true);
    setScanProgress(0);
    setScanResult(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          const matchCoin = presetCoin || coins[Math.floor(Math.random() * coins.length)];
          const confidenceScore = presetCoin ? 98.4 : 94.2;
          setScanResult({ coin: matchCoin, confidence: confidenceScore });
          showToast("Matched: " + matchCoin.title + " (" + confidenceScore + "% Confidence)");
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  const addToCollection = (coin, grade = 'VF-20', price = '0.00', notes = '') => {
    const newItem = {
      instanceId: Date.now(),
      coinId: coin.id,
      title: coin.title,
      issuer: coin.issuer,
      flag: coin.flag,
      grade,
      price: parseFloat(price) || 0,
      notes,
      dateAdded: new Date().toLocaleDateString()
    };
    setCollection([...collection, newItem]);
    showToast("Added " + coin.title + " to collection");
  };

  const filteredCoins = coins.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Coins className="w-6 h-6 text-amber-500" />
          <h1 className="font-bold text-lg tracking-wide text-amber-400">NUMISTA MOBILE</h1>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <span className="bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700">
            Collection: <strong className="text-white">{collection.length}</strong>
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 max-w-2xl mx-auto w-full pb-24">
        {/* CATALOG TAB */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog by name, country, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 text-slate-100 placeholder-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredCoins.map((coin) => (
                <div key={coin.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition">
                  <div className="flex items-center space-x-3">
                    <img src={coin.obverseImg} alt={coin.title} className="w-12 h-12 rounded-full object-cover border border-amber-500/30" />
                    <div>
                      <h3 className="font-semibold text-slate-100 text-sm">{coin.title}</h3>
                      <p className="text-xs text-slate-400">{coin.flag} {coin.issuer} • {coin.years}</p>
                      <span className="inline-block mt-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Rarity: {coin.rarity}/100
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button onClick={() => setSelectedCoin(coin)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300">
                      Details
                    </button>
                    <button onClick={() => addToCollection(coin)} className="p-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs">
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCANNER TAB */}
        {activeTab === 'scan' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
              <h2 className="text-lg font-bold text-slate-100 mb-1">AI Coin Recognition</h2>
              <p className="text-xs text-slate-400 mb-4">Snap or select a preset coin to scan features against Numista DB</p>
              
              <div className="relative w-48 h-48 mx-auto border-2 border-dashed border-amber-500/50 rounded-full flex items-center justify-center bg-slate-950 overflow-hidden mb-4">
                {scanning ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                    <span className="text-xs font-semibold text-amber-400">Scanning {scanProgress}%</span>
                  </div>
                ) : scanResult ? (
                  <img src={scanResult.coin.obverseImg} alt="Scanned" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-12 h-12 text-slate-600" />
                )}
              </div>

              <div className="flex justify-center space-x-2 mb-4">
                <button onClick={() => handleScan()} disabled={scanning} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Scan Live Camera</span>
                </button>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <p className="text-xs text-slate-400 mb-2">Test scanner with presets:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {coins.map((c) => (
                    <button key={c.id} onClick={() => handleScan(c)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700">
                      {c.flag} {c.title.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {scanResult && (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    {scanResult.confidence}% Match
                  </span>
                  <h4 className="font-semibold text-slate-100 text-sm mt-1">{scanResult.coin.title}</h4>
                  <p className="text-xs text-slate-400">{scanResult.coin.issuer}</p>
                </div>
                <button onClick={() => addToCollection(scanResult.coin)} className="bg-emerald-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs">
                  Add to Binder
                </button>
              </div>
            )}
          </div>
        )}

        {/* COLLECTION TAB */}
        {activeTab === 'collection' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-100">My Collection Binder</h2>
            {collection.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                <Coins className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p>Your binder is empty. Add coins from the Catalog or Scanner!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {collection.map((item) => (
                  <div key={item.instanceId} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-100">{item.flag} {item.title}</h4>
                      <p className="text-xs text-slate-400">Grade: <span className="text-amber-400">{item.grade}</span> • Added {item.dateAdded}</p>
                    </div>
                    <button 
                      onClick={() => setCollection(collection.filter(i => i.instanceId !== item.instanceId))}
                      className="text-rose-400 hover:text-rose-300 p-2 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedCoin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-100">{selectedCoin.title}</h3>
              <button onClick={() => setSelectedCoin(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2 rounded-lg"><span className="text-slate-400">Issuer:</span> {selectedCoin.issuer}</div>
              <div className="bg-slate-950 p-2 rounded-lg"><span className="text-slate-400">Years:</span> {selectedCoin.years}</div>
              <div className="bg-slate-950 p-2 rounded-lg"><span className="text-slate-400">Weight:</span> {selectedCoin.weight}</div>
              <div className="bg-slate-950 p-2 rounded-lg"><span className="text-slate-400">Diameter:</span> {selectedCoin.diameter}</div>
            </div>
            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg leading-relaxed">{selectedCoin.description}</p>
            <button onClick={() => { addToCollection(selectedCoin); setSelectedCoin(null); }} className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm">
              Add to Collection
            </button>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-4 py-2 rounded-full font-bold text-xs shadow-lg z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-2 z-40">
        <div className="max-w-md mx-auto flex justify-around">
          <button onClick={() => setActiveTab('catalog')} className={`flex flex-col items-center p-2 rounded-xl text-xs font-medium ${activeTab === 'catalog' ? 'text-amber-400' : 'text-slate-400'}`}>
            <Search className="w-5 h-5 mb-1" />
            Catalog
          </button>
          <button onClick={() => setActiveTab('scan')} className={`flex flex-col items-center p-2 rounded-xl text-xs font-medium ${activeTab === 'scan' ? 'text-amber-400' : 'text-slate-400'}`}>
            <Camera className="w-5 h-5 mb-1" />
            Scan Coin
          </button>
          <button onClick={() => setActiveTab('collection')} className={`flex flex-col items-center p-2 rounded-xl text-xs font-medium ${activeTab === 'collection' ? 'text-amber-400' : 'text-slate-400'}`}>
            <Layers className="w-5 h-5 mb-1" />
            Binder
          </button>
        </div>
      </nav>
    </div>
  );
}
