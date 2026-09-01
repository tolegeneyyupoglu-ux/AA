import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RegionCode, ServiceItem } from './types';
import { REGION_CONFIGS } from './data/regions';
import { REGION_SERVICES } from './data/services';
import {
  getHydratedRegionalServices,
  getDynamicServicePrices,
  applyDynamicPricingToServices,
} from './services/pricingEngine';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ServiceCard } from './components/ServiceCard';
import { ServiceModal } from './components/ServiceModal';
import { ConciergeModal } from './components/ConciergeModal';
import { DisputeGenerator } from './components/DisputeGenerator';
import { SavingsTracker } from './components/SavingsTracker';
import { DarkPatternGuide } from './components/DarkPatternGuide';
import { ToastContainer, ToastMessage } from './components/Toast';
import { LegalModal, LegalPageType } from './components/LegalModal';
import {
  ShieldAlert,
  FileText,
  PiggyBank,
  Scale,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Lock,
  HeartHandshake,
  ShieldCheck,
  Info,
  ChevronDown,
  Check,
  Globe,
} from 'lucide-react';

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

export default function App() {
  // Region state
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>('TR');
  const currentRegionConfig = useMemo(() => REGION_CONFIGS[selectedRegion], [selectedRegion]);

  // Footer country dropdown state
  const [isFooterDropdownOpen, setIsFooterDropdownOpen] = useState(false);
  const footerDropdownRef = useRef<HTMLDivElement>(null);

  // Close footer dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (footerDropdownRef.current && !footerDropdownRef.current.contains(event.target as Node)) {
        setIsFooterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic regional services store (hydrated on boot and updated in background)
  const [regionalServices, setRegionalServices] = useState<Record<RegionCode, ServiceItem[]>>(() =>
    getHydratedRegionalServices()
  );

  // Background dynamic price check / sync with instant 2026 fallback
  useEffect(() => {
    let isMounted = true;
    async function loadDynamicPrices() {
      try {
        const prices = await getDynamicServicePrices(selectedRegion);
        if (isMounted) {
          setRegionalServices((prev) => {
            const baseList = REGION_SERVICES[selectedRegion] || [];
            const updatedList = applyDynamicPricingToServices(selectedRegion, baseList, prices);
            return {
              ...prev,
              [selectedRegion]: updatedList,
            };
          });
        }
      } catch (err) {
        console.warn('[EndSub] Fallback 2026 baseline maintained:', err);
      }
    }

    loadDynamicPrices();
    return () => {
      isMounted = false;
    };
  }, [selectedRegion]);

  const isTR = selectedRegion === 'TR';
  const isDE = selectedRegion === 'DE';
  const isFR = selectedRegion === 'FR';
  const isIT = selectedRegion === 'IT';
  const isUK = selectedRegion === 'UK';
  const isUS = selectedRegion === 'US';

  // Tab state
  const [activeTab, setActiveTab] = useState<'services' | 'dispute' | 'savings' | 'rights'>('services');

  // Search & Category state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Cancelled subscriptions list (per region storage key or unified)
  const [cancelledMap, setCancelledMap] = useState<Record<RegionCode, string[]>>({
    TR: [],
    US: [],
    UK: [],
    DE: [],
    FR: [],
    IT: [],
  });

  // Modal & Prefill state
  const [modalService, setModalService] = useState<ServiceItem | null>(null);
  const [conciergeService, setConciergeService] = useState<ServiceItem | null>(null);
  const [disputePrefillService, setDisputePrefillService] = useState<ServiceItem | null>(null);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalPage, setLegalModalPage] = useState<LegalPageType>('privacy');

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + Math.random(),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle Region Switching
  const handleRegionChange = (newRegion: RegionCode) => {
    setSelectedRegion(newRegion);
    setSearchQuery('');
    setSelectedCategory('all');
    setDisputePrefillService(null);
    const newConfig = REGION_CONFIGS[newRegion];
    addToast(
      newRegion === 'TR'
        ? `🇹🇷 Bölge Türkiye (${newConfig.brandName} - ${newConfig.domainBadge}) olarak güncellendi.`
        : newRegion === 'DE'
        ? `🇩🇪 Region auf Deutschland (${newConfig.brandName} - ${newConfig.domainBadge}) aktualisiert.`
        : newRegion === 'FR'
        ? `🇫🇷 Région mise à jour : France (${newConfig.brandName} - ${newConfig.domainBadge}).`
        : newRegion === 'IT'
        ? `🇮🇹 Regione impostata su Italia (${newConfig.brandName} - ${newConfig.domainBadge}).`
        : `${newConfig.flag} Switched to ${newConfig.name} (${newConfig.brandName} - ${newConfig.domainBadge}).`,
      'info'
    );
  };

  // Handle Toggle Cancelled
  const handleToggleCancelled = (serviceId: string) => {
    setCancelledMap((prev) => {
      const currentList = prev[selectedRegion] || [];
      const exists = currentList.includes(serviceId);
      const updatedList = exists
        ? currentList.filter((id) => id !== serviceId)
        : [...currentList, serviceId];

      const currentServiceList = regionalServices[selectedRegion] || REGION_SERVICES[selectedRegion] || [];
      const service = currentServiceList.find((s) => s.id === serviceId);
      if (service) {
        if (!exists) {
          addToast(
            selectedRegion === 'TR'
              ? `${service.name} iptal edildi olarak işaretlendi! Yıllık tasarrufunuza +${service.currencySymbol}${(
                  service.avgMonthlyCost * 12
                ).toFixed(0)} eklendi.`
              : selectedRegion === 'DE'
              ? `${service.name} als gekündigt markiert! Ersparnis: +${service.currencySymbol}${(
                  service.avgMonthlyCost * 12
                ).toFixed(0)}/Jahr.`
              : selectedRegion === 'FR'
              ? `${service.name} marqué comme résilié ! Économie : +${service.currencySymbol}${(
                  service.avgMonthlyCost * 12
                ).toFixed(0)}/an.`
              : selectedRegion === 'IT'
              ? `${service.name} segnato come disdetto! Risparmio: +${service.currencySymbol}${(
                  service.avgMonthlyCost * 12
                ).toFixed(0)}/anno.`
              : `${service.name} marked as cancelled! Saved +${service.currencySymbol}${(
                  service.avgMonthlyCost * 12
                ).toFixed(0)}/year.`,
            'success'
          );
        } else {
          addToast(
            selectedRegion === 'TR'
              ? `${service.name} aktif servisler arasına geri alındı.`
              : selectedRegion === 'DE'
              ? `${service.name} aus den Kündigungen entfernt.`
              : selectedRegion === 'FR'
              ? `${service.name} retiré des abonnements résiliés.`
              : selectedRegion === 'IT'
              ? `${service.name} rimosso dai disdetti.`
              : `${service.name} un-marked from cancelled list.`,
            'info'
          );
        }
      }

      return {
        ...prev,
        [selectedRegion]: updatedList,
      };
    });
  };

  // Handle direct Dispute Draft launch from Service Card
  const handleDraftDispute = (service: ServiceItem) => {
    setDisputePrefillService(service);
    setActiveTab('dispute');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast(
      selectedRegion === 'TR'
        ? `${service.name} için Hakem Heyeti dilekçe şablonu hazırlandı.`
        : selectedRegion === 'DE'
        ? `Kündigungsschreiben für ${service.name} vorbereitet.`
        : selectedRegion === 'FR'
        ? `Modèle de résiliation pour ${service.name} préparé.`
        : selectedRegion === 'IT'
        ? `Lettera di disdetta per ${service.name} preparata.`
        : `Dispute form pre-filled with ${service.name} details.`,
      'info'
    );
  };

  // Active region's raw services from hydrated dynamic store
  const rawServices = regionalServices[selectedRegion] || REGION_SERVICES[selectedRegion] || [];

  // Filtered services
  const filteredServices = useMemo(() => {
    return rawServices.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.steps.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' ||
        service.category === selectedCategory ||
        (selectedCategory === 'streaming' && (service.category === 'streaming' || service.category === 'music')) ||
        (selectedCategory === 'gym' && service.category === 'gym') ||
        (selectedCategory === 'software' && (service.category === 'software' || service.category === 'education')) ||
        (selectedCategory === 'utility' && (service.category === 'ecommerce' || service.category === 'utility')) ||
        (selectedCategory === 'telecom' && (service.category === 'telecom' || service.category === 'government')) ||
        (selectedCategory === 'media' && (service.category === 'media' || service.category === 'music'));

      return matchesSearch && matchesCategory;
    });
  }, [rawServices, searchQuery, selectedCategory]);

  // Current region cancelled list & total saved calculations
  const activeCancelledIds = cancelledMap[selectedRegion] || [];
  const currentTotalMonthlySaved = useMemo(() => {
    return rawServices
      .filter((s) => activeCancelledIds.includes(s.id))
      .reduce((sum, s) => sum + s.avgMonthlyCost, 0);
  }, [rawServices, activeCancelledIds]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Top Navbar */}
      <Navbar
        currentRegion={currentRegionConfig}
        onRegionChange={handleRegionChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cancelledCount={activeCancelledIds.length}
        totalSaved={currentTotalMonthlySaved}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {activeTab === 'services' && (
          <div>
            {/* Hero Banner with dynamic region taglines & filters */}
            <HeroBanner
              currentRegion={currentRegionConfig}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onDraftDisputeClick={() => setActiveTab('dispute')}
              totalServicesCount={rawServices.length}
            />

            {/* Services Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
              {/* Filter Summary & Quick Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>{isTR ? 'Abonelik Servisleri' : 'Supported Subscription Guides'}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200">
                      {filteredServices.length}
                    </span>
                  </h2>
                  {searchQuery && (
                    <span className="text-xs text-gray-500">
                      {isTR ? `"${searchQuery}" için sonuçlar` : `Results for "${searchQuery}"`}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{isTR ? 'Tüm adımlar güncel & test edilmiştir' : 'All steps verified & up-to-date'}</span>
                </div>
              </div>

              {/* Service Cards Grid */}
              {filteredServices.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                  <ShieldAlert className="w-10 h-10 text-gray-400 mx-auto" />
                  <p className="text-base font-bold text-gray-900">
                    {isTR ? 'Aramanızla eşleşen servis bulunamadı' : 'No matching subscriptions found'}
                  </p>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    {isTR
                      ? 'Farklı bir arama terimi deneyin veya dilediğiniz herhangi bir şirket için "Dilekçe Motoru" sekmesinden özel iade dilekçesi oluşturun.'
                      : 'Try a different search term or use our Legal Dispute Generator to create a custom statutory refund demand for any merchant.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-blue-600 rounded-xl transition-colors"
                  >
                    {isTR ? 'Filtreleri Temizle' : 'Clear Filters'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      currentRegion={currentRegionConfig}
                      onOpenModal={(s) => setModalService(s)}
                      onDraftDispute={handleDraftDispute}
                      onOpenConcierge={(s) => setConciergeService(s)}
                      isCancelled={activeCancelledIds.includes(service.id)}
                      onToggleCancelled={handleToggleCancelled}
                    />
                  ))}
                </div>
              )}

              {/* Banner at bottom of Services page prompting Dispute Generator */}
              <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Scale className="w-3.5 h-3.5" />
                    <span>{currentRegionConfig.legalAuthorityBadge}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                    {isTR
                      ? 'Şirket paranızı iade etmiyor veya iptali zorlaştırıyor mu?'
                      : 'Merchant refusing to refund or trapped in recurring billing?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-xl">
                    {isTR
                      ? '6502 sayılı Kanun uyarınca hazırlanan resmi Tüketici Hakem Heyeti dilekçesi ile banka itirazınızı ve yasal iade sürecinizi derhal başlatın.'
                      : 'Generate a legally binding refund demand letter citing the FTC Click-to-Cancel Rule or UK Consumer Contracts Regulations in under 60 seconds.'}
                  </p>
                </div>

                <button
                  id="bottom-banner-dispute-btn"
                  onClick={() => {
                    setActiveTab('dispute');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="shrink-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isTR ? 'İade Dilekçesi Hazırla' : 'Draft Dispute Letter'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dispute Generator */}
        {activeTab === 'dispute' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <DisputeGenerator
              currentRegion={currentRegionConfig}
              prefillService={disputePrefillService}
              onClearPrefill={() => setDisputePrefillService(null)}
              onShowToast={addToast}
            />
          </div>
        )}

        {/* Tab 3: Savings Vault & Tracker */}
        {activeTab === 'savings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <SavingsTracker
              currentRegion={currentRegionConfig}
              services={rawServices}
              cancelledIds={activeCancelledIds}
              onToggleCancelled={handleToggleCancelled}
              onOpenDisputeForService={handleDraftDispute}
              onShowToast={addToast}
            />
          </div>
        )}

        {/* Tab 4: Consumer Rights Guide */}
        {activeTab === 'rights' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <DarkPatternGuide
              currentRegion={currentRegionConfig}
              onOpenDispute={() => {
                setActiveTab('dispute');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <ServiceModal
        service={modalService}
        currentRegion={currentRegionConfig}
        onClose={() => setModalService(null)}
        onDraftDispute={handleDraftDispute}
        onOpenConcierge={(s) => setConciergeService(s)}
        isCancelled={modalService ? activeCancelledIds.includes(modalService.id) : false}
        onToggleCancelled={handleToggleCancelled}
      />

      {/* VIP Concierge Modal */}
      <ConciergeModal
        service={conciergeService}
        regionConfig={currentRegionConfig}
        isOpen={!!conciergeService}
        onClose={() => setConciergeService(null)}
        onSuccessToast={(msg) => addToast(msg, 'success')}
      />

      {/* Legal Pages & Transparency Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        initialPage={legalModalPage}
        currentRegion={currentRegionConfig}
        onClose={() => setLegalModalOpen(false)}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/60 shadow-inner flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="6.5" cy="17.5" r="3" stroke="#FFFFFF" strokeWidth="2" />
                    <path d="M9 15L19.5 4.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="17.5" cy="17.5" r="3" stroke="#FFFFFF" strokeWidth="2" />
                    <path d="M15 15L4.5 4.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="1.8" fill="#10B981" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 font-bold tracking-tight">
                  <span className="font-extrabold text-base text-gray-900">
                    EndSub
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">
                    .online
                  </span>
                </div>
                <span className="text-xs text-gray-400">({currentRegionConfig.flag} {currentRegionConfig.name})</span>
              </div>
              <p className="text-xs text-gray-500">{currentRegionConfig.tagline}</p>
            </div>

            {/* Compact Country & Region Dropdown in Footer */}
            <div className="relative inline-block text-left" ref={footerDropdownRef}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  {isTR
                    ? 'Bölge / Para Birimi:'
                    : isDE
                    ? 'Region / Währung:'
                    : isFR
                    ? 'Pays & Devise :'
                    : isIT
                    ? 'Regione & Valuta:'
                    : 'Region & Currency:'}
                </span>
                <button
                  id="footer-region-dropdown-toggle"
                  onClick={() => setIsFooterDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100/90 hover:bg-gray-200/90 border border-gray-300/80 text-gray-800 text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95 cursor-pointer shadow-2xs select-none"
                  aria-expanded={isFooterDropdownOpen}
                  aria-haspopup="listbox"
                  title={`${currentRegionConfig.name} (${currentRegionConfig.code})`}
                >
                  <span className="text-base leading-none">{currentRegionConfig.flag}</span>
                  <span className="font-bold text-gray-900 tracking-wide text-xs">{currentRegionConfig.code}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                      isFooterDropdownOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Upward Dropdown Menu Modal/Panel */}
              {isFooterDropdownOpen && (
                <div
                  className="absolute right-0 bottom-full mb-2 w-56 sm:w-60 bg-white rounded-2xl shadow-2xl border border-gray-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="listbox"
                >
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
                    <span>{isTR ? 'Ülke & Para Birimi' : 'Country & Currency'}</span>
                    <Globe className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {REGION_OPTIONS.map((item) => {
                      const isActive = selectedRegion === item.code;
                      return (
                        <button
                          key={item.code}
                          id={`footer-dropdown-region-${item.code.toLowerCase()}`}
                          onClick={() => {
                            handleRegionChange(item.code);
                            setIsFooterDropdownOpen(false);
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

          {/* Legal Navigation Links */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs text-gray-600">
            <button
              onClick={() => {
                setLegalModalPage('privacy');
                setLegalModalOpen(true);
              }}
              className="hover:text-blue-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {isTR
                  ? 'Gizlilik Politikası (KVKK / GDPR)'
                  : isDE
                  ? 'Datenschutzerklärung (DSGVO)'
                  : isFR
                  ? 'Politique de Confidentialité (RGPD)'
                  : isIT
                  ? 'Informativa Privacy (GDPR)'
                  : 'Privacy Policy (GDPR / CCPA)'}
              </span>
            </button>

            <button
              onClick={() => {
                setLegalModalPage('terms');
                setLegalModalOpen(true);
              }}
              className="hover:text-blue-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {isTR
                  ? 'Kullanım Koşulları & Yasal Dayanak'
                  : isDE
                  ? 'AGB & Verbraucherschutzrechte'
                  : isFR
                  ? 'Conditions Générales & Droit Conso'
                  : isIT
                  ? 'Termini di Servizio & Normativa'
                  : 'Terms of Service & Statutory Rights'}
              </span>
            </button>

            <button
              onClick={() => {
                setLegalModalPage('about');
                setLegalModalOpen(true);
              }}
              className="hover:text-blue-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {isTR
                  ? 'Hakkımızda & İletişim (Destek)'
                  : isDE
                  ? 'Über uns & Kontakt (Impressum)'
                  : isFR
                  ? 'À propos & Contact'
                  : isIT
                  ? 'Chi siamo & Assistenza'
                  : 'About Us & Support Desk'}
              </span>
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
            <p>
              {isTR
                ? '© 2026 EndSub.online. Tüketici bilgilendirme ve hak arama asistanı.'
                : `© 2026 EndSub.online (${currentRegionConfig.flag} ${currentRegionConfig.name}). Consumer subscription freedom & cancellation platform.`}
            </p>
            <p className="text-gray-400">
              {isTR
                ? 'Yasal Uyarı: Bu uygulama bir avukatlık hizmeti değildir; tüketici öz yardım ve resmi mevzuat şablonu aracıdır.'
                : isDE
                ? 'Hinweis: EndSub ist keine Rechtsanwaltskanzlei, sondern ein Verbraucher-Service zur rechtssicheren Kündigungsunterstützung.'
                : isFR
                ? 'Avertissement : EndSub n\'est pas un cabinet d\'avocats, mais un service d\'assistance aux démarches de résiliation.'
                : isIT
                ? 'Nota: EndSub è un servizio di assistenza al consumatore per la gestione guidata del recesso contrattuale.'
                : 'Legal Disclaimer: This platform provides consumer facilitation and templates; it does not provide legal representation.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
