import React, { useState, useMemo } from 'react';
import { RegionConfig, ServiceItem, ServiceTier } from '../types';
import {
  AlertTriangle,
  ExternalLink,
  FileText,
  CheckCircle2,
  BookOpen,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
  currentRegion: RegionConfig;
  onOpenModal: (service: ServiceItem) => void;
  onDraftDispute: (service: ServiceItem) => void;
  onOpenConcierge?: (service: ServiceItem) => void;
  isCancelled: boolean;
  onToggleCancelled: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  currentRegion,
  onOpenModal,
  onDraftDispute,
  onOpenConcierge,
  isCancelled,
  onToggleCancelled,
}) => {
  const isTR = currentRegion.code === 'TR';
  const isDE = currentRegion.code === 'DE';
  const isFR = currentRegion.code === 'FR';
  const isIT = currentRegion.code === 'IT';
  const isUS = currentRegion.code === 'US';
  const isUK = currentRegion.code === 'UK';

  // Sub-tier selection state: defaults to selectedTierId or first tier's ID or empty
  const defaultTierId = useMemo(() => {
    if (service.selectedTierId) return service.selectedTierId;
    if (service.tiers && service.tiers.length > 0) {
      const popular = service.tiers.find((t) => t.isPopular);
      return popular ? popular.id : service.tiers[0].id;
    }
    return '';
  }, [service]);

  const [selectedTierId, setSelectedTierId] = useState<string>(defaultTierId);

  // Find active tier object
  const activeTier: ServiceTier | undefined = useMemo(() => {
    if (service.tiers && service.tiers.length > 0) {
      return service.tiers.find((t) => t.id === selectedTierId) || service.tiers[0];
    }
    return undefined;
  }, [service.tiers, selectedTierId]);

  // Current dynamic price based on selected tier
  const currentMonthlyPrice = useMemo(() => {
    if (activeTier) {
      return activeTier.monthlyCost;
    }
    return service.avgMonthlyCost;
  }, [activeTier, service.avgMonthlyCost]);

  const annualSavings = useMemo(() => {
    return currentMonthlyPrice * 12;
  }, [currentMonthlyPrice]);

  // Enriched service object containing current tier details to pass to modals
  const enrichedServiceForActions: ServiceItem = useMemo(() => {
    return {
      ...service,
      avgMonthlyCost: currentMonthlyPrice,
      selectedTierId: activeTier?.id || service.selectedTierId,
      selectedTierName: activeTier?.name || service.selectedTierName,
    };
  }, [service, currentMonthlyPrice, activeTier]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getVipPrice = () => {
    switch (currentRegion.code) {
      case 'TR':
        return '₺49';
      case 'US':
        return '$4.99';
      case 'UK':
        return '£4.99';
      case 'DE':
      case 'FR':
      case 'IT':
      default:
        return '€4.99';
    }
  };

  const getPerMonthUnit = () => {
    if (isTR) return '/ay';
    if (isDE) return '/Monat';
    if (isFR) return '/mois';
    if (isIT) return '/mese';
    return '/mo';
  };

  const rawTip = service.proTip || service.legalTip;
  const cleanTip = useMemo(() => {
    if (!rawTip) return '';
    return rawTip
      .replace(/^[\s💡]+/, '')
      .replace(/^(?:Tüketici İpucu|Tüketici Tüyosu|Tüyo|Consumer Tip|Pro Tip|Tipp|Astuce|Consiglio)\s*[:\-–]\s*/i, '')
      .trim();
  }, [rawTip]);

  return (
    <div
      id={`service-card-${service.id}`}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white border transition-all duration-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 ${
        isCancelled
          ? 'border-emerald-400 bg-emerald-50/20 ring-1 ring-emerald-400/30'
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      {/* Top Banner Accent */}
      {service.difficulty === 'hard' && !isCancelled && (
        <div className="bg-red-50 border-b border-red-100 px-3.5 py-1.5 text-[11px] font-semibold text-red-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            {isTR
              ? 'Abonelik Tuzağı Tespit Edildi'
              : isDE
              ? 'Abo-Falle erkannt'
              : isFR
              ? 'Piège d\'abonnement détecté'
              : isIT
              ? 'Trappola di rinnovo rilevata'
              : 'Dark Pattern Trap Warning'}
          </span>
          <span className="font-mono text-[10px] text-red-600 font-bold">{service.timeToCancel}</span>
        </div>
      )}

      {isCancelled && (
        <div className="bg-emerald-50 border-b border-emerald-100 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {isTR
              ? 'İptal Edildi Olarak Kaydedildi'
              : isDE
              ? 'Als gekündigt markiert'
              : isFR
              ? 'Marqué comme résilié'
              : isIT
              ? 'Segnato come disdetto'
              : 'Marked as Cancelled'}
          </span>
          <span className="font-mono text-[10px] text-emerald-700 font-bold">
            +{service.currencySymbol}{annualSavings.toFixed(0)}/{isTR ? 'yıl' : isDE ? 'Jahr' : isFR ? 'an' : isIT ? 'anno' : 'yr'}
          </span>
        </div>
      )}

      {/* Main Body */}
      <div className="p-5 space-y-3.5">
        {/* Service Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              <img
                src={`https://www.google.com/s2/favicons?domain=${service.domain}&sz=128`}
                alt={`${service.name} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = `https://icon.horse/icon/${service.domain}`;
                }}
              />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-gray-500">{service.categoryLabel}</p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${getDifficultyColor(
              service.difficulty
            )}`}
          >
            {service.difficultyLabel}
          </span>
        </div>

        {/* Dynamic Tier / Package Selector */}
        {service.tiers && service.tiers.length > 0 && (
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-600" />
                {isTR ? 'Paket / Tarife Seçimi:' : isDE ? 'Tarifauswahl:' : isFR ? 'Choix du forfait :' : isIT ? 'Scelta piano:' : 'Select Plan / Tier:'}
              </span>
              {activeTier?.badge && (
                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded text-[9px] font-semibold">
                  {activeTier.badge}
                </span>
              )}
            </div>
            <div className="relative">
              <select
                id={`tier-select-${service.id}`}
                value={selectedTierId}
                onChange={(e) => setSelectedTierId(e.target.value)}
                className="w-full text-[13px] font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
                style={{
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  textOverflow: 'unset',
                }}
              >
                {service.tiers.map((tier) => (
                  <option key={tier.id} value={tier.id} className="py-1 text-slate-900 text-xs sm:text-sm">
                    {tier.name} — {service.currencySymbol}{tier.monthlyCost.toFixed(2)}{getPerMonthUnit()}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Cost & Annual Savings metrics (Instantly calculated from selected tier) */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-semibold">
              {isTR
                ? 'Aylık Fiyat'
                : isDE
                ? 'Monatspreis'
                : isFR
                ? 'Prix / mois'
                : isIT
                ? 'Prezzo mensile'
                : 'Monthly Cost'}
            </span>
            <span className="font-bold text-gray-900 font-mono text-sm sm:text-base">
              {service.currencySymbol}
              {currentMonthlyPrice.toFixed(2)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-500 block text-[10px] uppercase font-semibold">
              {isTR
                ? 'Yıllık Tasarruf (+12x)'
                : isDE
                ? 'Ersparnis / Jahr (+12x)'
                : isFR
                ? 'Économie / an (+12x)'
                : isIT
                ? 'Risparmio / anno (+12x)'
                : 'Annual Saving (+12x)'}
            </span>
            <span className="font-bold text-emerald-600 font-mono text-sm sm:text-base">
              +{service.currencySymbol}
              {annualSavings.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Trap Alert Preview */}
        {service.trapAlert && (
          <div
            className="text-xs text-red-700 bg-red-50/70 p-2.5 rounded-xl border border-red-200/80"
            style={{
              height: 'auto',
              minHeight: 'fit-content',
              overflow: 'visible',
              lineHeight: 1.4,
            }}
          >
            <p
              style={{
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                textOverflow: 'unset',
                overflow: 'visible',
              }}
            >
              {service.trapAlert}
            </p>
          </div>
        )}

        {/* 💡 İpucu Kutusu (Tek sade ikon başlık + tam metin kesilme/taşma engelli) */}
        {cleanTip && (
          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100/90 text-xs text-blue-950 space-y-1.5 overflow-visible">
            <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
              <span className="text-sm leading-none">💡</span>
              <span>
                {isTR
                  ? 'İpucu'
                  : isDE
                  ? 'Tipp'
                  : isFR
                  ? 'Astuce'
                  : isIT
                  ? 'Consiglio'
                  : 'Tip'}
              </span>
            </div>
            <p
              className="text-xs text-blue-900/95 leading-relaxed"
              style={{
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                textOverflow: 'unset',
                overflow: 'visible',
              }}
            >
              {cleanTip}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer: 3 Standard Action Buttons On EVERY Service Card */}
      <div className="p-4 pt-0 space-y-2.5">
        {/* BUTON 1: VIP 24 Saatte Resmi İptal */}
        {onOpenConcierge && (
          <button
            id={`vip-concierge-btn-${service.id}`}
            onClick={() => onOpenConcierge(enrichedServiceForActions)}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-amber-500/15 border-2 border-amber-400 hover:border-amber-500 flex items-center justify-between group transition-all shadow-xs active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2 text-left min-w-0 pr-1 flex-1">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                VIP
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {isTR
                    ? 'VIP İptal Hizmeti'
                    : isDE
                    ? 'VIP-Kündigungsservice'
                    : isFR
                    ? 'Service VIP de Résiliation'
                    : isIT
                    ? 'Servizio VIP di Disdetta'
                    : 'VIP Cancellation Concierge'}
                </div>
                <div
                  className="text-amber-900/90 font-medium"
                  style={{
                    whiteSpace: 'normal',
                    fontSize: '11px',
                    lineHeight: '1.2',
                    wordBreak: 'break-word',
                  }}
                >
                  {isTR
                    ? '24 Saatte Hukuki Güvenceli & İade Garantili'
                    : isDE
                    ? '24h Rechtssicher & Geld-zurück-Garantie'
                    : isFR
                    ? 'Garantie légale & remboursement sous 24h'
                    : isIT
                    ? 'Assistenza legale 24h & garanzia'
                    : '24h Legal protection & refund guarantee'}
                </div>
              </div>
            </div>
            <span className="px-2 py-0.8 bg-amber-500 text-slate-950 text-xs font-black rounded-lg group-hover:bg-amber-400 transition-colors shrink-0 whitespace-nowrap shadow-xs">
              {getVipPrice()} →
            </span>
          </button>
        )}

        {/* BUTON 2 & 3: İptal Rehberi + Dilekçe Yaz */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id={`open-guide-btn-${service.id}`}
            onClick={() => onOpenModal(enrichedServiceForActions)}
            className="h-10 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border border-slate-700/60 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {isTR
                ? 'İptal Rehberi'
                : isDE
                ? 'Anleitung'
                : isFR
                ? 'Guide'
                : isIT
                ? 'Guida'
                : 'Cancel Guide'}
            </span>
          </button>

          <button
            id={`draft-dispute-btn-${service.id}`}
            onClick={() => onDraftDispute(enrichedServiceForActions)}
            className="h-10 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {isTR
                ? 'Dilekçe Yaz'
                : isDE
                ? 'Schreiben'
                : isFR
                ? 'Courrier'
                : isIT
                ? 'Diffida'
                : 'Draft Dispute'}
            </span>
          </button>
        </div>

        {/* Bottom utility row: Saved status & Direct portal */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
          <button
            id={`toggle-cancelled-${service.id}`}
            onClick={() => onToggleCancelled(service.id)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-700 transition-colors py-0.5 cursor-pointer text-[11px]"
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${isCancelled ? 'text-emerald-600 fill-emerald-100' : 'text-gray-400'}`}
            />
            <span className={isCancelled ? 'text-emerald-700 font-semibold' : ''}>
              {isCancelled
                ? isTR
                  ? 'İptal Edildi'
                  : isDE
                  ? 'Gekündigt'
                  : isFR
                  ? 'Résilié'
                  : isIT
                  ? 'Disdetto'
                  : 'Cancelled'
                : isTR
                  ? 'İptal ettim olarak kaydet'
                  : isDE
                  ? 'Als gekündigt speichern'
                  : isFR
                  ? 'Marquer résilié'
                  : isIT
                  ? 'Segna come disdetto'
                  : 'Mark cancelled'}
            </span>
          </button>

          <div className="flex items-center gap-2">
            {service.directUrl && (
              <a
                href={service.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
              >
                <span>Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
