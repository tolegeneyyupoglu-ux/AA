import React, { useState, useRef, useEffect } from 'react';
import { RegionCode, RegionConfig } from '../types';
import { ShieldAlert, FileText, PiggyBank, Sparkles, ChevronDown, Check, Globe } from 'lucide-react';

interface NavbarProps {
  currentRegion: RegionConfig;
  onRegionChange: (region: RegionCode) => void;
  activeTab: 'services' | 'dispute' | 'savings' | 'rights';
  setActiveTab: (tab: 'services' | 'dispute' | 'savings' | 'rights') => void;
  cancelledCount: number;
  totalSaved: number;
}

const REGION_OPTIONS: {
  code: RegionCode;
  flag: string;
  label: string;
  sub: string;
  currencySymbol: string;
  currencyCode: string;
}[] = [
  { code: 'TR', flag: '🇹🇷', label: 'TR', sub: 'Türkiye', currencySymbol: '₺', currencyCode: 'TRY' },
  { code: 'US', flag: '🇺🇸', label: 'US', sub: 'United States', currencySymbol: '$', currencyCode: 'USD' },
  { code: 'UK', flag: '🇬🇧', label: 'UK', sub: 'United Kingdom', currencySymbol: '£', currencyCode: 'GBP' },
  { code: 'DE', flag: '🇩🇪', label: 'DE', sub: 'Deutschland', currencySymbol: '€', currencyCode: 'EUR' },
  { code: 'FR', flag: '🇫🇷', label: 'FR', sub: 'France', currencySymbol: '€', currencyCode: 'EUR' },
  { code: 'IT', flag: '🇮🇹', label: 'IT', sub: 'Italia', currencySymbol: '€', currencyCode: 'EUR' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRegion,
  onRegionChange,
  activeTab,
  setActiveTab,
  cancelledCount,
  totalSaved,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabLabel = (tab: 'services' | 'dispute' | 'savings' | 'rights') => {
    switch (currentRegion.code) {
      case 'TR':
        return tab === 'services' ? 'İptal Rehberleri' : tab === 'dispute' ? 'Dilekçe Motoru' : tab === 'savings' ? 'Tasarruf Kasası' : 'Yasal Haklar';
      case 'DE':
        return tab === 'services' ? 'Kündigungsanleitungen' : tab === 'dispute' ? 'Kündigungsschreiben' : tab === 'savings' ? 'Ersparnis-Tresor' : 'Verbraucherrechte';
      case 'FR':
        return tab === 'services' ? 'Guides de résiliation' : tab === 'dispute' ? 'Lettres & Litiges' : tab === 'savings' ? 'Coffre d\'économies' : 'Droits consommateurs';
      case 'IT':
        return tab === 'services' ? 'Guide di disdetta' : tab === 'dispute' ? 'Lettere & Recessi' : tab === 'savings' ? 'Cassaforte risparmi' : 'Diritti consumatori';
      default:
        return tab === 'services' ? 'Cancellation Guides' : tab === 'dispute' ? 'Dispute Generator' : tab === 'savings' ? 'Savings Vault' : 'Consumer Rights';
    }
  };

  const getMobileTabLabel = (tab: 'services' | 'dispute' | 'savings' | 'rights') => {
    switch (currentRegion.code) {
      case 'TR':
        return tab === 'services' ? 'Rehberler' : tab === 'dispute' ? 'Dilekçe' : tab === 'savings' ? 'Kasa' : 'Yasa';
      case 'DE':
        return tab === 'services' ? 'Guides' : tab === 'dispute' ? 'Briefe' : tab === 'savings' ? 'Ersparnis' : 'Rechte';
      case 'FR':
        return tab === 'services' ? 'Guides' : tab === 'dispute' ? 'Lettres' : tab === 'savings' ? 'Économies' : 'Droits';
      case 'IT':
        return tab === 'services' ? 'Guide' : tab === 'dispute' ? 'Lettere' : tab === 'savings' ? 'Risparmi' : 'Diritti';
      default:
        return tab === 'services' ? 'Guides' : tab === 'dispute' ? 'Dispute' : tab === 'savings' ? 'Savings' : 'Rights';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md overflow-visible">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand & Dynamic Domain Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="brand-home-button"
              onClick={() => setActiveTab('services')}
              className="inline-flex items-center gap-2 sm:gap-3 select-none text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl p-1 transition-transform active:scale-98"
            >
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-slate-900 border border-slate-700/60 shadow-inner shrink-0 group-hover:border-slate-600 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6">
                  <circle cx="6.5" cy="17.5" r="3" stroke="#FFFFFF" strokeWidth="2" />
                  <path d="M9 15L19.5 4.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="17.5" cy="17.5" r="3" stroke="#FFFFFF" strokeWidth="2" />
                  <path d="M15 15L4.5 4.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.8" fill="#10B981" />
                </svg>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 font-bold tracking-tight">
                <span className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors normal-case">
                  EndSub
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">
                  .online
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              id="nav-tab-services"
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'services'
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{getTabLabel('services')}</span>
            </button>

            <button
              id="nav-tab-dispute"
              onClick={() => setActiveTab('dispute')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dispute'
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{getTabLabel('dispute')}</span>
            </button>

            <button
              id="nav-tab-savings"
              onClick={() => setActiveTab('savings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'savings'
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
              <span>{getTabLabel('savings')}</span>
              {cancelledCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono font-bold">
                  {cancelledCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-rights"
              onClick={() => setActiveTab('rights')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'rights'
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{getTabLabel('rights')}</span>
            </button>
          </nav>

          {/* Right Header Area: Compact Dropdown & Savings */}
          <div className="flex items-center gap-2">
            {/* Quick Action Mini Savings (Desktop Large) */}
            {totalSaved > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono text-emerald-800 shadow-2xs">
                <span className="text-emerald-700 font-bold">Saved:</span>
                <span>{currentRegion.currencySymbol}{totalSaved.toFixed(0)}/mo</span>
              </div>
            )}

            {/* Compact Country Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="region-dropdown-toggle"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gray-100/90 hover:bg-gray-200/80 border border-gray-200 text-gray-800 text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95 cursor-pointer shadow-2xs select-none"
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
                title={`${currentRegion.name} (${currentRegion.code})`}
              >
                <span className="text-base sm:text-lg leading-none">{currentRegion.flag}</span>
                <span className="font-bold text-gray-900 tracking-wide text-xs sm:text-sm">{currentRegion.code}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu Modal/Panel */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 sm:w-60 bg-white rounded-2xl shadow-xl border border-gray-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="listbox"
                >
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
                    <span>{currentRegion.code === 'TR' ? 'Ülke & Para Birimi' : 'Country & Currency'}</span>
                    <Globe className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {REGION_OPTIONS.map((item) => {
                      const isActive = currentRegion.code === item.code;
                      return (
                        <button
                          key={item.code}
                          id={`dropdown-region-${item.code.toLowerCase()}`}
                          onClick={() => {
                            onRegionChange(item.code);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm transition-colors text-left cursor-pointer ${
                            isActive
                              ? 'bg-blue-50/90 text-blue-700 font-bold'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                          }`}
                          role="option"
                          aria-selected={isActive}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl leading-none">{item.flag}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900">{item.sub}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 font-mono font-medium">
                                  {item.code}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-500">
                                {item.currencyCode} ({item.currencySymbol})
                              </div>
                            </div>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-gray-200 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center transition-colors ${
              activeTab === 'services' ? 'bg-blue-50 text-blue-600 border border-blue-200 font-semibold' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {getMobileTabLabel('services')}
          </button>
          <button
            onClick={() => setActiveTab('dispute')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center transition-colors ${
              activeTab === 'dispute' ? 'bg-blue-50 text-blue-600 border border-blue-200 font-semibold' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {getMobileTabLabel('dispute')}
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center transition-colors ${
              activeTab === 'savings' ? 'bg-blue-50 text-blue-600 border border-blue-200 font-semibold' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {getMobileTabLabel('savings')} ({cancelledCount})
          </button>
          <button
            onClick={() => setActiveTab('rights')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center transition-colors ${
              activeTab === 'rights' ? 'bg-blue-50 text-blue-600 border border-blue-200 font-semibold' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {getMobileTabLabel('rights')}
          </button>
        </div>
      </div>
    </header>
  );
};

