const HomeOverview = () => {
  const bannerImages = [
    'https://images.unsplash.com/photo-1632543063497-449d763ce38b?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1608043152268-3689d74defdb?w=500&h=300&fit=crop'
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* BANNER SEMPLICE */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-xl">
        <img 
          src={bannerImages[currentBanner]} 
          className="w-full h-full object-cover"
          alt="Padel"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Marketplace Padel</h2>
          <button 
            onClick={() => setActiveSection('marketplace')}
            className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl"
          >
            Vai al Marketplace
          </button>
        </div>
      </div>

      {/* Stats ORIGINALI (tutto il resto rimane) */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {/* ... le 3 stat cards originali ... */}
      </div>
    </div>
  );
};
