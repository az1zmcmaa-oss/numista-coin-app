```react
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Filter, Plus, BookOpen, Layers, User, Award, 
  ChevronRight, X, Sparkles, Check, Edit3, Trash2, ArrowUpDown,
  TrendingUp, DollarSign, Calendar, Globe, Tag, Info, Shield, HardDrive,
  Download, Upload, Heart, Share2, RefreshCw, Camera, Scan, Sparkle, Eye,
  CheckCircle2, AlertCircle, Zap
} from 'lucide-react';

// Mock Initial Coin Database inspired by Numista
const INITIAL_COINS = [
  {
    id: 'num-[106]',
    title: '2 Euros - Beatrix',
    issuer: 'Netherlands',
    countryCode: 'NL',
    years: '1999-2013',
    startYear: 1999,
    endYear: 2013,
    denomination: '2 Euros',
    currency: 'Euro (1999-date)',
    composition: 'Bimetallic: Nickel-brass clad nickel center in Copper-nickel ring',
    weight: 8.5,
    diameter: 25.75,
    thickness: 2.2,
    edge: 'Lettered ("GOD * ZIJ * MET * ONS *")',
    alignment: 'Medal alignment ↑↑',
    shape: 'Round',
    rarity: 8,
    obverseImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    reverseImg: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?auto=format&fit=crop&q=80&w=400',
    description: 'First generation 2 Euro coin depicting Queen Beatrix of the Netherlands looking left.',
    mints: ['Utrecht']
  },
  {
    id: 'num-107',
    title: '50 Pence - Atlantic Salmon',
    issuer: 'United Kingdom',
    countryCode: 'GB',
    years: '2023-date',
    startYear: 2023,
    endYear: 2026,
    denomination: '50 Pence',
    currency: 'Pound sterling (1971-date)',
    composition: 'Cupro-nickel',
    weight: 8.0,
    diameter: 27.3,
    thickness: 1.78,
    edge: 'Plain',
    alignment: 'Medal alignment ↑↑',
    shape: 'Seven-sided (Heptagonal)',
    rarity: 15,
    obverseImg: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=400',
    reverseImg: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=400',
    description: 'New King Charles III definitive coinage series featuring the Atlantic salmon on the reverse to highlight UK wildlife conservation.',
    mints: ['Royal Mint (Llantrisant)']
  }
];

// Sample Presets for Instant Camera Scan Simulation
const SCAN_PRESETS = [
  {
    name: '1921 Morgan Silver Dollar (USA)',
    coinId: 'num-101',
    confidence: 97,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400',
    detectedYear: 1921,
    detectedMint: 'Philadelphia (no mark)'
  },
  {
    name: '50p Atlantic Salmon (UK 2023)',
    coinId: 'num-107',
    confidence: 94,
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=400',
    detectedYear: 2023,
    detectedMint: 'Llantrisant'
  },
  {
    name: '5 Francs Hercules 1875 (France)',
    coinId: 'num-102',
    confidence: 91,
    image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=400',
    detectedYear: 1875,
    detectedMint: 'Paris (A)'
  },
  {
    name: 'Gold Sovereign Victoria (UK 1889)',
    coinId: 'num-103',
    confidence: 98,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    detectedYear: 1889,
    detectedMint: 'London'
  }
];

// Standard Numismatic Grading Scale
const GRADES = [
  { code: 'G-4', label: 'Good', desc: 'Heavily worn' },
  { code: 'VG-8', label: 'Very Good', desc: 'Well worn design' },
  { code: 'F-12', label: 'Fine', desc: 'Moderate wear on high points' },
  { code: 'VF-20', label: 'Very Fine', desc: 'Light wear, major features crisp' },
  { code: 'XF-40', label: 'Extremely Fine', desc: 'Slight wear on highest points' },
  { code: 'AU-50', label: 'About Uncirculated', desc: 'Trace wear, partial mint luster' },
  { code: 'UNC', label: 'Uncirculated (MS-60)', desc: 'No wear, original luster' },
  { code: 'BU', label: 'Brilliant Uncirculated', desc: 'Full luster, prime strike' },
  { code: 'PROOF', label: 'Proof', desc: 'Specially struck mirror finish' }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'scan' | 'collection' | 'stats'
  
  // Coin Database & Collection State
  const [coins] = useState(INITIAL_COINS);
  const [userCollection, setUserCollection] = useState(() => {
    const saved = localStorage.getItem('numista_user_collection');
    return saved ? JSON.parse(saved) : [
      {
        id: 'col-1',
        coinId: 'num-101',
        year: 1881,
        mintMark: 'S',
        grade: 'UNC',
        quantity: 1,
        purchasePrice: 65,
        estimatedValue: 85,
        notes: 'Beautiful frost on Liberty profile. Acquired at coin show.',
        dateAdded: '2025-01-15'
      },
      {
        id: 'col-2',
        coinId: 'num-103',
        year: 1889,
        mintMark: 'London',
        grade: 'VF-20',
        quantity: 1,
        purchasePrice: 480,
        estimatedValue: 540,
        notes: 'Slight mark near crown. Good luster remains.',
        dateAdded: '2025-02-01'
      }
    ];
  });

  // Scanner State
  const [scanSide, setScanSide] = useState('obverse'); // 'obverse' | 'reverse'
  const [scannedObverseImg, setScannedObverseImg] = useState(null);
  const [scannedReverseImg, setScannedReverseImg] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('ALL');
  const [selectedComposition, setSelectedComposition] = useState('ALL');
  const [minYearFilter, setMinYearFilter] = useState('');
  const [maxYearFilter, setMaxYearFilter] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  
  // UI Display toggles
  const [selectedCoin, setSelectedCoin] = useState(null); // For Detail Modal
  const [showAddModal, setShowAddModal] = useState(false); // For Add to Collection Form
  const [coinToAdd, setCoinToAdd] = useState(null);
  
  // Image flip state for coin cards
  const [flippedCoins, setFlippedCoins] = useState({});

  // Persist collection to LocalStorage
  useEffect(() => {
    localStorage.setItem('numista_user_collection', JSON.stringify(userCollection));
  }, [userCollection]);

  // Unique filters options from dataset
  const issuersList = useMemo(() => {
    return ['ALL', ...new Set(coins.map(c => c.issuer))];
  }, [coins]);

  const compositionsList = useMemo(() => {
    const list = new Set();
    coins.forEach(c => {
      if (c.composition.includes('Silver')) list.add('Silver');
      else if (c.composition.includes('Gold')) list.add('Gold');
      else if (c.composition.includes('Bimetallic')) list.add('Bimetallic');
      else list.add('Base Metal');
    });
    return ['ALL', ...Array.from(list)];
  }, [coins]);

  // Filtered Catalog Logic
  const filteredCoins = useMemo(() => {
    return coins.filter(coin => {
      const matchesSearch = coin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            coin.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            coin.denomination.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIssuer = selectedIssuer === 'ALL' || coin.issuer === selectedIssuer;
      
      let matchesComp = true;
      if (selectedComposition !== 'ALL') {
        matchesComp = coin.composition.toLowerCase().includes(selectedComposition.toLowerCase());
      }

      let matchesMinYr = !minYearFilter || coin.endYear >= parseInt(minYearFilter);
      let matchesMaxYr = !maxYearFilter || coin.startYear <= parseInt(maxYearFilter);

      return matchesSearch && matchesIssuer && matchesComp && matchesMinYr && matchesMaxYr;
    });
  }, [coins, searchQuery, selectedIssuer, selectedComposition, minYearFilter, maxYearFilter]);

  // Flip coin obverse/reverse preview
  const toggleCoinFlip = (id, e) => {
    e.stopPropagation();
    setFlippedCoins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Turn on live camera stream simulation
  const startCamera = async () => {
    setCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (e) {
      console.log('Webcam not accessible, using interactive photo mode');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Trigger Scanner Animation & Identification AI
  const triggerScanAnalysis = (customImage = null, presetData = null) => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);

    const imgToUse = customImage || presetData?.image || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400';
    if (scanSide === 'obverse') setScannedObverseImg(imgToUse);
    else setScannedReverseImg(imgToUse);

    // Progress bar animation
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setScanProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        
        // Pick best match (Preset or random candidate from catalog)
        const matchCoin = presetData 
          ? coins.find(c => c.id === presetData.coinId) || coins[0]
          : coins[Math.floor(Math.random() * coins.length)];

        const confidenceScore = presetData ? presetData.confidence : Math.floor(Math.random() * 12) + 87;

        setScanResult({
          matchedCoin: matchCoin,
          confidence: confidenceScore,
          detectedYear: presetData?.detectedYear || matchCoin.startYear,
          detectedMint: presetData?.detectedMint || (matchCoin.mints ? matchCoin.mints[0] : 'Standard'),
          featuresDetected: ['Legends / Inscription', 'Die Diameter: ' + matchCoin.diameter + 'mm', 'Composition: ' + matchCoin.composition, 'Bust Profile']
        });

        showToast("Matched: " + matchCoin.title + " (" + confidenceScore + "% Confidence)");
      }
    }, 180);
  };

  // Handle File Upload for Camera Scanning
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        triggerScanAnalysis(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Item to Collection handler
  const handleAddToCollection = (formData) => {
    const newItem = {
      id: 'col-' + Date.now(),
      coinId: formData.coinId,
      year: parseInt(formData.year) || null,
      mintMark: formData.mintMark || '',
      grade: formData.grade || 'VF-20',
      quantity: parseInt(formData.quantity) || 1,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      estimatedValue: parseFloat(formData.estimatedValue) || 0,
      notes: formData.notes || '',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setUserCollection(prev => [newItem, ...prev]);
    setShowAddModal(false);
    setCoinToAdd(null);
    showToast('Coin added to your collection binder!');
  };

  // Remove Item from Collection
  const handleRemoveFromCollection = (collId) => {
    if (window.confirm("Remove this coin from your collection tracker?")) {
      setUserCollection(prev => prev.filter(item => item.id !== collId));
      showToast('Coin removed from binder');
    }
  };

  // Calculate Rarity Badge Color
  const getRarityBadge = (score) => {
    if (score < 20) return { label: 'Common', bg: 'bg-green-100 text-green-800 border-green-300' };
    if (score < 50) return { label: 'Scarce', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (score < 75) return { label: 'Rare', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
    return { label: 'Extremely Rare', bg: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' };
  };

  // Total portfolio values
  const collectionStats = useMemo(() => {
    const totalCount = userCollection.reduce((acc, item) => acc + item.quantity, 0);
    const totalSpent = userCollection.reduce((acc, item) => acc + (item.purchasePrice * item.quantity), 0);
    const totalValue = userCollection.reduce((acc, item) => acc + (item.estimatedValue * item.quantity), 0);
    
    // Group by composition count
    let silverCount = 0;
    let goldCount = 0;
    
    userCollection.forEach(item => {
      const match = coins.find(c => c.id === item.coinId);
      if (match) {
        if (match.composition.includes('Silver')) silverCount += item.quantity;
        if (match.composition.includes('Gold')) goldCount += item.quantity;
      }
    });

    return { totalCount, totalSpent, totalValue, silverCount, goldCount };
  }, [userCollection, coins]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-20 sm:pb-0">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-80 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-amber-500/40 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* APP TOP BAR */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-900 shadow-inner">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-wide text-amber-400">NumisMobile</h1>
              <span className="text-[10px] text-slate-400 font-medium">World Coin Catalog & Collector</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('scan')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold rounded-full shadow hover:brightness-110 transition"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Scan Coin</span>
            </button>

            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedIssuer('ALL');
                setSelectedComposition('ALL');
                setMinYearFilter('');
                setMaxYearFilter('');
              }}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="bg-slate-800 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-700 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{userCollection.length} Coins Collected</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto w-full flex-1 px-3 py-4 sm:px-6">

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search coins by title, issuer, denomination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button 
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition ${
                showFilterDrawer || selectedIssuer !== 'ALL' || selectedComposition !== 'ALL' || minYearFilter || maxYearFilter
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* EXTENDED FILTER DRAWER */}
          {showFilterDrawer && (
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Issuer / Country</label>
                <select 
                  value={selectedIssuer}
                  onChange={(e) => setSelectedIssuer(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {issuersList.map(iss => (
                    <option key={iss} value={iss}>{iss === 'ALL' ? 'All Issuers' : iss}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Metal Composition</label>
                <select 
                  value={selectedComposition}
                  onChange={(e) => setSelectedComposition(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {compositionsList.map(comp => (
                    <option key={comp} value={comp}>{comp === 'ALL' ? 'All Metals' : comp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date Range (Years)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="From"
                    value={minYearFilter}
                    onChange={(e) => setMinYearFilter(e.target.value)}
                    className="w-1/2 p-2 text-xs bg-slate-50 border border-slate-200 rounded-md"
                  />
         
