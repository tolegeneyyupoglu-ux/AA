import React from 'react';
import { RegionCode, RegionConfig } from '../types';
import { Search, ShieldCheck, Scale, Zap } from 'lucide-react';
import { LiveImpactCounter } from './LiveImpactCounter';

interface HeroBannerProps {
  currentRegion: RegionConfig;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onDraftDisputeClick: () => void;
  totalServicesCount: number;
}

export interface HeroI18n {
  title: string;
  subtitle: string;
}

export const HERO_I18N: Record<RegionCode, HeroI18n> = {
  TR: {
    title: 'Aboneliklerinizi Zahmetsizce İptal Edin, Paranızı Geri Alın.',
    subtitle:
      'Spor salonu üyelikleri, dijital servisler ve gizli cayma bedelleri için resmi tüketici haklarına dayalı akıllı iptal ve dilekçe asistanı.',
  },
  US: {
    title: 'Cancel Any Subscription Effortlessly & Save Money.',
    subtitle:
      'Step-by-step cancellation guides, auto-generated legal notices, and statutory consumer protection tools.',
  },
  UK: {
    title: 'Cancel Any Subscription Effortlessly & Save Money.',
    subtitle:
      'Step-by-step cancellation guides, auto-generated legal notices, and statutory consumer protection tools.',
  },
  DE: {
    title: 'Abonnements mühelos kündigen & Geld sparen.',
    subtitle:
      'Schritt-für-Schritt-Anleitungen, rechtssichere Kündigungsschreiben und Verbraucherschutz-Assistent.',
  },
  FR: {
    title: 'Résiliez vos abonnements en toute simplicité et économisez.',
    subtitle:
      'Guides pas à pas, modèles officiels de résiliation et protection juridique des consommateurs.',
  },
  IT: {
    title: 'Disdici qualsiasi abbonamento facilmente e risparmia.',
    subtitle:
      'Guide dettagliate, modelli di disdetta formale e assistenza per la tutela del consumatore.',
  },
};

interface CategoryItem {
  id: string;
  labels: Record<string, string>;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    labels: {
      TR: 'Tüm Servisler',
      DE: 'Alle Dienste',
      FR: 'Tous les services',
      IT: 'Tutti i servizi',
      US: 'All Services',
      UK: 'All Services',
    },
  },
  {
    id: 'streaming',
    labels: {
      TR: 'Dizi & Müzik',
      DE: 'Streaming & Musik',
      FR: 'Streaming & Musique',
      IT: 'Streaming & Musica',
      US: 'Streaming & Media',
      UK: 'Streaming & Media',
    },
  },
  {
    id: 'gym',
    labels: {
      TR: 'Spor Salonları (Zor)',
      DE: 'Fitnessstudios (Schwer)',
      FR: 'Salles de sport (Difficile)',
      IT: 'Palestre (Difficile)',
      US: 'Gyms & Clubs (Hard)',
      UK: 'Gyms & Clubs (Hard)',
    },
  },
  {
    id: 'software',
    labels: {
      TR: 'Yazılım & Bulut',
      DE: 'Software & Cloud',
      FR: 'Logiciels & Cloud',
      IT: 'Software & Cloud',
      US: 'Software & Cloud',
      UK: 'Software & Cloud',
    },
  },
  {
    id: 'utility',
    labels: {
      TR: 'Alışveriş & Hizmet',
      DE: 'Shopping & Utilities',
      FR: 'Shopping & Services',
      IT: 'Shopping & Servizi',
      US: 'Shopping & Utility',
      UK: 'Shopping & Utility',
    },
  },
  {
    id: 'telecom',
    labels: {
      TR: 'Telekom & TV',
      DE: 'Telekom & TV',
      FR: 'Télécom & TV',
      IT: 'Telecom & TV',
      US: 'Telecom & TV',
      UK: 'Telecom & TV',
    },
  },
  {
    id: 'media',
    labels: {
      TR: 'Haber & Yayın',
      DE: 'Nachrichten & Audio',
      FR: 'Presse & Médias',
      IT: 'News & Media',
      US: 'News & Audio',
      UK: 'News & Audio',
    },
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentRegion,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onDraftDisputeClick,
  totalServicesCount,
}) => {
  const isTR = currentRegion.code === 'TR';
  const isDE = currentRegion.code === 'DE';
  const isFR = currentRegion.code === 'FR';
  const isIT = currentRegion.code === 'IT';
  const isUS = currentRegion.code === 'US';
  const isUK = currentRegion.code === 'UK';

  const heroContent = HERO_I18N[currentRegion.code] || HERO_I18N['TR'];

  return (
    <div className="relative overflow-hidden pt-8 pb-8 border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-5">
          {/* Region-Specific Dynamic Tagline & Branding */}
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {heroContent.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {heroContent.subtitle}
            </p>
          </div>

          {/* Live Impact & Community Savings Counter */}
          <LiveImpactCounter currentRegion={currentRegion} />

          {/* Dynamic Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-2xl pt-1">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-left">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="text-gray-500 block">
                  {isTR ? 'İptal Süresi' : isDE ? 'Kündigungsdauer' : isFR ? 'Délai' : isIT ? 'Tempo disdetta' : 'Cancel Speed'}
                </span>
                <span className="font-bold text-gray-900">
                  1–3 {isTR ? 'Dakika' : isDE ? 'Minuten' : isFR ? 'minutes' : isIT ? 'minuti' : 'Minutes'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-left">
              <Scale className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="text-xs">
                <span className="text-gray-500 block">
                  {isTR ? 'Yasal Dayanak' : isDE ? 'Rechtsgrundlage' : isFR ? 'Base légale' : isIT ? 'Base legale' : 'Legal Engine'}
                </span>
                <span className="font-bold text-gray-900 font-mono text-[11px] truncate block max-w-[120px] sm:max-w-none">
                  {isTR
                    ? '6502 S. Kanun'
                    : isDE
                    ? 'BGB § 312k / DSGVO'
                    : isFR
                    ? 'Loi 3 clics / Hamon'
                    : isIT
                    ? 'Cod. Consumo / Bersani'
                    : isUS
                    ? 'FTC 16 CFR § 425'
                    : 'CCR 2013 / CRA'}
                </span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="text-gray-500 block">
                  {isTR ? 'Para Birimi' : isDE ? 'Währung' : isFR ? 'Devise' : isIT ? 'Valuta' : 'Currency'}
                </span>
                <span className="font-bold text-gray-900">{currentRegion.currencyCode} ({currentRegion.currencySymbol})</span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="w-full max-w-2xl pt-2 space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="service-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  isTR
                    ? `Türkiye servislerinde ara (örn. MACFit, Netflix, Exxen, Bein)... (${totalServicesCount} servis)`
                    : isDE
                    ? `Deutsche Dienste durchsuchen (z.B. DAZN, FitX, WOW, Audible)... (${totalServicesCount} Dienste)`
                    : isFR
                    ? `Rechercher parmi les services en France (ex. Canal+, Basic-Fit, Free)... (${totalServicesCount} services)`
                    : isIT
                    ? `Cerca tra i servizi in Italia (es. DAZN, Virgin Active, TIM)... (${totalServicesCount} servizi)`
                    : isUS
                    ? `Search US services (e.g., Planet Fitness, Adobe CC, NYT, Hulu)... (${totalServicesCount} services)`
                    : `Search UK services (e.g., PureGym, TV Licence, Sky TV, Audible)... (${totalServicesCount} services)`
                }
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 px-1.5 py-0.5 rounded bg-gray-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar justify-start sm:justify-center">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const label = cat.labels[currentRegion.code] || cat.labels['US'] || cat.labels['TR'];
                return (
                  <button
                    key={cat.id}
                    id={`category-filter-${cat.id}`}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

