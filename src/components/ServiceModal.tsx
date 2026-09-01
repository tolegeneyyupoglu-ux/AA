import React from 'react';
import { RegionConfig, ServiceItem } from '../types';
import {
  X,
  ExternalLink,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface ServiceModalProps {
  service: ServiceItem | null;
  currentRegion: RegionConfig;
  onClose: () => void;
  onDraftDispute: (service: ServiceItem) => void;
  onOpenConcierge?: (service: ServiceItem) => void;
  isCancelled: boolean;
  onToggleCancelled: (serviceId: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  currentRegion,
  onClose,
  onDraftDispute,
  onOpenConcierge,
  isCancelled,
  onToggleCancelled,
}) => {
  if (!service) return null;
  const isTR = currentRegion.code === 'TR';
  const isDE = currentRegion.code === 'DE';
  const isFR = currentRegion.code === 'FR';
  const isIT = currentRegion.code === 'IT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header: Servis Başlığı & Logosu */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/70">
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
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{service.name}</h3>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    service.difficulty === 'easy'
                      ? 'bg-gray-100 text-gray-600 border-gray-200'
                      : service.difficulty === 'medium'
                      ? 'bg-orange-100 text-orange-700 border-orange-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                  }`}
                >
                  {service.difficultyLabel}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {service.selectedTierName ? (
                  <span className="font-semibold text-blue-600">{service.selectedTierName} • </span>
                ) : null}
                {service.categoryLabel} • {service.timeToCancel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Trap Alert Banner if any */}
          {service.trapAlert && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-red-900">
                  {isTR
                    ? 'Abonelik / İptal Tuzağı Uyarısı'
                    : isDE
                    ? 'Abo-Falle & Kündigungshürde'
                    : isFR
                    ? 'Avertissement piège de renouvellement'
                    : isIT
                    ? 'Attenzione trappola di rinnovo'
                    : 'Dark Pattern / Cancellation Trap'}
                </p>
                <p className="text-red-700 leading-relaxed">{service.trapAlert}</p>
              </div>
            </div>
          )}

          {/* Pricing & Time Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 block">
                {isTR ? 'Aylık Maliyet' : isDE ? 'Monatspreis' : isFR ? 'Coût mensuel' : isIT ? 'Costo mensile' : 'Monthly Cost'}
              </span>
              <span className="text-base font-bold text-gray-900 font-mono">
                {service.currencySymbol}
                {service.avgMonthlyCost.toFixed(2)}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 block">
                {isTR ? 'Yıllık Tasarruf' : isDE ? 'Ersparnis / Jahr' : isFR ? 'Économie / an' : isIT ? 'Risparmio / anno' : 'Yearly Savings'}
              </span>
              <span className="text-base font-bold text-emerald-600 font-mono">
                {service.currencySymbol}
                {(service.avgMonthlyCost * 12).toFixed(2)}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-xs text-gray-500 block">
                  {isTR ? 'Gereken Süre' : isDE ? 'Zeitaufwand' : isFR ? 'Délai estimé' : isIT ? 'Tempo stimato' : 'Estimated Time'}
                </span>
                <span className="text-xs font-semibold text-gray-900">{service.timeToCancel}</span>
              </div>
            </div>
          </div>

          {/* 1. Yasal Hak ve İpucu Kutusu */}
          {service.legalTip && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>
                  {isTR
                    ? 'Yasal Hak ve İpucu'
                    : isDE
                    ? 'Gesetzliches Recht & Tipp'
                    : isFR
                    ? 'Droit légal & Conseil'
                    : isIT
                    ? 'Diritto di legge & Consiglio'
                    : 'Statutory Right & Protection Tip'}
                </span>
              </div>
              <p className="leading-relaxed text-blue-950/80">{service.legalTip}</p>
            </div>
          )}

          {/* 2. İptal Adımları (Adım 1, Adım 2...) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>
                {isTR
                  ? 'Adım Adım İptal Rehberi'
                  : isDE
                  ? 'Schritt-für-Schritt Anleitung'
                  : isFR
                  ? 'Guide de résiliation étape par étape'
                  : isIT
                  ? 'Guida alla disdetta passo dopo passo'
                  : 'Step-by-Step Cancellation Guide'}
              </span>
            </h4>
            <div className="space-y-2.5">
              {service.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-mono text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="leading-relaxed flex-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* VIP Concierge Banner */}
          {onOpenConcierge && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                    VIP CONCIERGE
                  </span>
                  <span className="text-sm font-bold text-amber-950">
                    {isTR
                      ? 'Uğraşmak İstemiyor Musunuz?'
                      : isDE
                      ? 'Keine Zeit zum Kündigen?'
                      : isFR
                      ? 'Pas le temps de vous en occuper ?'
                      : isIT
                      ? 'Non hai tempo da perdere?'
                      : 'Want Zero Hassle?'}
                  </span>
                </div>
                <p className="text-xs text-amber-900/80">
                  {isTR
                    ? '24 saat içinde adınıza resmi fesih sürecini hukuk ekibimiz yönetsin.'
                    : isDE
                    ? 'Lassen Sie unser Team die Kündigung innerhalb von 24 Stunden rechtssicher für Sie durchführen.'
                    : isFR
                    ? 'Laissez nos experts gérer la résiliation officielle pour vous en 24h chrono.'
                    : isIT
                    ? 'Lascia che i nostri esperti gestiscano la disdetta ufficiale per te entro 24 ore.'
                    : 'Let our consumer protection team handle full cancellation in 24h.'}
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenConcierge(service);
                }}
                className="w-full sm:w-auto text-center px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
              >
                {isTR
                  ? 'Biz İptal Edelim →'
                  : isDE
                  ? 'Kündigen lassen →'
                  : isFR
                  ? 'Résilier pour moi →'
                  : isIT
                  ? 'Disdici per me →'
                  : 'Cancel For Me →'}
              </button>
            </div>
          )}
        </div>

        {/* Footer: "İptal Ettim Olarak İşaretle", "İade / İtiraz Dilekçesi Hazırla" ve "İptal Sayfasına Git" */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/70 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onToggleCancelled(service.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
              isCancelled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${isCancelled ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span>
              {isCancelled
                ? isTR
                  ? 'Abonelik İptal Edildi ✓'
                  : isDE
                  ? 'Abo gekündigt ✓'
                  : isFR
                  ? 'Abonnement résilié ✓'
                  : isIT
                  ? 'Abbonamento disdetto ✓'
                  : 'Subscription Cancelled ✓'
                : isTR
                  ? 'İptal Ettim Olarak İşaretle'
                  : isDE
                  ? 'Als gekündigt markieren'
                  : isFR
                  ? 'Marquer comme résilié'
                  : isIT
                  ? 'Segna come disdetto'
                  : 'Mark as Cancelled'}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDraftDispute(service);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>
                {isTR
                  ? 'İade / İtiraz Dilekçesi Hazırla'
                  : isDE
                  ? 'Kündigungsschreiben erstellen'
                  : isFR
                  ? 'Générer lettre de résiliation'
                  : isIT
                  ? 'Genera diffida / disdetta'
                  : 'Draft Dispute & Refund Letter'}
              </span>
            </button>

            {service.directUrl && !service.isGuideOnly && (
              <a
                href={service.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200 cursor-pointer"
              >
                <span>
                  {isTR
                    ? 'İptal Sayfasına Git'
                    : isDE
                    ? 'Zur Kündigungsseite'
                    : isFR
                    ? 'Page de résiliation'
                    : isIT
                    ? 'Pagina di disdetta'
                    : 'Direct Cancel Page'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
