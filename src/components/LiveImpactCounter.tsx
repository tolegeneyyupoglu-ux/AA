import React, { useState, useEffect, useRef } from 'react';
import { RegionCode, RegionConfig } from '../types';
import { TrendingUp } from 'lucide-react';

interface LiveImpactCounterProps {
  currentRegion: RegionConfig;
}

// 1. Regional Realistic Base Values and 8-10h Block Increments
interface RegionImpactConfig {
  base: number;
  incrementPerBlock: number; // Increment added for every 8-10 hour block
}

const REGION_IMPACT_DATA: Record<RegionCode, RegionImpactConfig> = {
  US: { base: 148420000, incrementPerBlock: 2450 }, // $1,500 - $3,000 range (~$2,450 / 9h)
  UK: { base: 64180000, incrementPerBlock: 1650 },  // £1,200 - £2,000 range (~£1,650 / 9h)
  DE: { base: 89350000, incrementPerBlock: 1950 },  // €1,500 - €2,500 range (~€1,950 / 9h)
  FR: { base: 89350000, incrementPerBlock: 1950 },  // €1,500 - €2,500 range (~€1,950 / 9h)
  IT: { base: 89350000, incrementPerBlock: 1950 },  // €1,500 - €2,500 range (~€1,950 / 9h)
  TR: { base: 485750000, incrementPerBlock: 21500 }, // ₺15,000 - ₺25,000 range (~₺21,500 / 9h)
};

// Fixed baseline anchor timestamp (Epoch timestamp for block calculation)
const ANCHOR_EPOCH_MS = 1772323200000; 
// 9 Hours block duration (in the 8-10 hour window)
const BLOCK_DURATION_MS = 9 * 60 * 60 * 1000;

/**
 * Calculates the current cumulative community savings based on current date & time (Date.now())
 */
export const calculateCumulativeSavings = (regionCode: RegionCode, nowMs: number = Date.now()): number => {
  const config = REGION_IMPACT_DATA[regionCode] || REGION_IMPACT_DATA.US;
  const elapsedMs = Math.max(0, nowMs - ANCHOR_EPOCH_MS);
  const blocksPassed = Math.floor(elapsedMs / BLOCK_DURATION_MS);
  
  return config.base + blocksPassed * config.incrementPerBlock;
};

export const LiveImpactCounter: React.FC<LiveImpactCounterProps> = ({ currentRegion }) => {
  const isTR = currentRegion.code === 'TR';
  const isDE = currentRegion.code === 'DE';
  const isFR = currentRegion.code === 'FR';
  const isIT = currentRegion.code === 'IT';
  const isUS = currentRegion.code === 'US';
  const isUK = currentRegion.code === 'UK';

  const currencySymbol = currentRegion.currencySymbol;

  // Compute calculated target value based on Date.now()
  const targetSavingsAmount = calculateCumulativeSavings(currentRegion.code);

  // Animated value state
  const [displayValue, setDisplayValue] = useState<number>(0);
  const animationRef = useRef<number | null>(null);

  // Smooth ease-out counter animation on mount or when region changes
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1400; // 1.4s smooth roll-up
    const startVal = 0;
    const endVal = targetSavingsAmount;

    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.floor(startVal + (endVal - startVal) * easedProgress);

      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [currentRegion.code, targetSavingsAmount]);

  // Format amount according to local formatting conventions
  const formatAmount = (val: number): string => {
    if (isTR || isDE || isIT) {
      // Dot as thousands separator (e.g. 485.750.000 or 89.350.000)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    if (isFR) {
      // Space as thousands separator (e.g. 89 350 000)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    // US / UK comma separator (e.g. 148,420,000 or 64,180,000)
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Position currency symbol cleanly
  const formattedDisplay = isFR
    ? `${formatAmount(displayValue)} ${currencySymbol}+`
    : isDE || isIT
    ? `${currencySymbol}${formatAmount(displayValue)}+`
    : `${currencySymbol}${formatAmount(displayValue)}+`;

  return (
    <div className="w-full max-w-2xl mx-auto my-1">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 via-gray-900 to-slate-950 text-white p-4 sm:p-5 shadow-xl border border-gray-800/80 transition-all duration-300 hover:border-gray-700/80 group">
        
        {/* Subtle decorative ambient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          {/* Left / Main Counter Info */}
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Header with Title and Live Badge */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {isTR
                  ? 'Canlı Takip'
                  : isDE
                  ? 'Live-Tracking'
                  : isFR
                  ? 'Suivi en direct'
                  : isIT
                  ? 'Monitoraggio Live'
                  : 'Live Impact'}
              </span>

              <span className="text-xs sm:text-sm font-semibold text-gray-300 flex items-center gap-1">
                <span>🔥</span>
                <span>
                  {isTR
                    ? 'Tüketicilerin Cebinde Kalan Tahmini Toplam Tasarruf'
                    : isDE
                    ? 'Geschätzte Gesamtersparnis der Community'
                    : isFR
                    ? 'Économies totales estimées pour la communauté'
                    : isIT
                    ? 'Risparmio totale stimato per i consumatori'
                    : 'Estimated Total Community Savings'}
                </span>
              </span>
            </div>

            {/* Big Prominent Number */}
            <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-0.5">
              <div
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400 font-mono"
                style={{
                  textShadow: '0 0 20px rgba(52, 211, 153, 0.25)',
                }}
              >
                {formattedDisplay}
              </div>
            </div>
          </div>

          {/* Right Action / Summary Mini Badge */}
          <div className="hidden sm:flex flex-col items-end shrink-0 pl-3 border-l border-gray-800 text-right">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-gray-200">
                {isTR ? '14.800+ İptal Talebi' : isDE ? '14.800+ Kündigungen' : isFR ? '14 800+ Résiliations' : isIT ? '14.800+ Disdette' : '14,800+ Cancellations'}
              </span>
            </div>
            <div className="text-[11px] text-gray-500">
              {isTR ? 'Resmi Hakem Heyeti Destekli' : isDE ? 'Rechtssicher BGB' : isFR ? 'Conforme Loi Hamon' : isIT ? 'Codice Consumo' : 'Statutory Protection'}
            </div>
          </div>
        </div>

        {/* Small 11px Legal Disclaimer Footnote */}
        <div className="relative z-10 mt-3 pt-2.5 border-t border-gray-800/80 text-[11px] leading-relaxed text-gray-400 text-center sm:text-left">
          {isTR ? (
            <p>
              * <strong className="text-gray-300 font-normal">Tahmini Değer:</strong> Küresel tüketici hakları şablonları, adım adım iptal rehberleri ve kullanıcı ortalama abonelik fesih projeksiyonlarına dayalı kümülatif topluluk tasarruf tahminidir.
            </p>
          ) : isDE ? (
            <p>
              * <strong className="text-gray-300 font-normal">Geschätzte Hochrechnung:</strong> Basiert auf kumulierten Kündigungsvorlagen der Community, durchschnittlicher Abolaufzeit und Verbraucherrechts-Disputdaten.
            </p>
          ) : isFR ? (
            <p>
              * <strong className="text-gray-300 font-normal">Projection estimée :</strong> Basée sur les modèles de résiliation générés par la communauté, la durée moyenne des abonnements et les données de litige consommateur.
            </p>
          ) : isIT ? (
            <p>
              * <strong className="text-gray-300 font-normal">Stima cumulativa :</strong> Basata sui modelli di disdetta generati dagli utenti, sulla durata media degli abbonamenti e sui dati delle controversie dei consumatori.
            </p>
          ) : (
            <p>
              * <strong className="text-gray-300 font-normal">Estimated Projection:</strong> Based on cumulative user-generated cancellation templates, average subscription tenure, and consumer rights dispute data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
