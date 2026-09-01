import React, { useState } from 'react';
import { ServiceItem, RegionConfig } from '../types';
import {
  X,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  ArrowRight,
  Loader2,
  Check,
  Layers,
  Flame,
  ShieldAlert
} from 'lucide-react';

interface ConciergeModalProps {
  service: ServiceItem | null;
  regionConfig: RegionConfig;
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export type TierType = 'single' | 'unlimited';

interface TierOption {
  id: TierType;
  titleTR: string;
  titleEN: string;
  titleDE: string;
  titleFR: string;
  titleIT: string;
  descTR: string;
  descEN: string;
  descDE: string;
  descFR: string;
  descIT: string;
  badgeTR?: string;
  badgeEN?: string;
  badgeDE?: string;
  badgeFR?: string;
  badgeIT?: string;
  priceTR: string;
  oldPriceTR: string;
  priceUS: string;
  oldPriceUS: string;
  priceUK: string;
  oldPriceUK: string;
  priceEUR: string;
  oldPriceEUR: string;
  isPopular?: boolean;
}

const TIERS: TierOption[] = [
  {
    id: 'single',
    titleTR: 'Tekli İptal',
    titleEN: 'Single Cancellation',
    titleDE: 'Einzige Kündigung',
    titleFR: 'Résiliation Unique',
    titleIT: 'Disdetta Singola',
    descTR: 'Seçtiğin 1 abonelik için resmi süreç yönetimi.',
    descEN: 'Official cancellation for 1 selected service.',
    descDE: 'Rechtssichere Kündigungsabwicklung für 1 ausgewählten Dienst.',
    descFR: 'Prise en charge officielle pour 1 abonnement sélectionné.',
    descIT: 'Gestione ufficiale della disdetta per 1 abbonamento selezionato.',
    badgeTR: '%38 İNDİRİM • ERKEN ERİŞİM',
    badgeEN: '44% OFF • EARLY ACCESS',
    badgeDE: '38% RABATT • EARLY ACCESS',
    badgeFR: '38% DE RÉDUCTION • ACCÈS ANTICIPÉ',
    badgeIT: '38% SCONTO • ACCESSO ANTICIPATO',
    priceTR: '₺49',
    oldPriceTR: '₺79',
    priceUS: '$4.99',
    oldPriceUS: '$8.99',
    priceUK: '£4.99',
    oldPriceUK: '£7.99',
    priceEUR: '€4.99',
    oldPriceEUR: '€7.99',
  },
  {
    id: 'unlimited',
    titleTR: 'Tam Dijital Temizlik',
    titleEN: 'Full Digital Detox (VIP Plus)',
    titleDE: 'Vollständige Bereinigung (VIP Plus)',
    titleFR: 'Désabonnement Complet (VIP Plus)',
    titleIT: 'Pulizia Completa (VIP Plus)',
    descTR: 'Tüm aktif aboneliklerin iptali ve banka harcama itirazı (Chargeback) desteği.',
    descEN: 'Cancel all unwanted subscriptions + bank dispute support.',
    descDE: 'Kündigung aller unerwünschten Abos + Erstattungs- & Chargeback-Support.',
    descFR: 'Résiliation de tous vos abonnements + assistance contestation bancaire.',
    descIT: 'Disdetta di tutti gli abbonamenti attivi + supporto rimborso e chargeback.',
    badgeTR: '%35 İNDİRİM • EN ÇOK TERCİH EDİLEN',
    badgeEN: '41% OFF • BEST VALUE',
    badgeDE: '35% RABATT • BELIEBTESTE WAHL',
    badgeFR: '35% DE RÉDUCTION • PLUS POPULAIRE',
    badgeIT: '35% SCONTO • PIÙ SCELTO',
    priceTR: '₺129',
    oldPriceTR: '₺199',
    priceUS: '$12.99',
    oldPriceUS: '$24.99',
    priceUK: '£9.99',
    oldPriceUK: '£16.99',
    priceEUR: '€12.99',
    oldPriceEUR: '€19.99',
    isPopular: true,
  },
];

export const ConciergeModal: React.FC<ConciergeModalProps> = ({
  service,
  regionConfig,
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [selectedTier, setSelectedTier] = useState<TierType>('single');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subscriberId, setSubscriberId] = useState('');
  const [extraServices, setExtraServices] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !service) return null;

  const code = regionConfig.code;
  const isTR = code === 'TR';
  const isUS = code === 'US';
  const isUK = code === 'UK';
  const isDE = code === 'DE';
  const isFR = code === 'FR';
  const isIT = code === 'IT';

  const activeTierObj = TIERS.find((t) => t.id === selectedTier) || TIERS[0];

  const getTierTitle = (t: TierOption) => {
    if (isTR) return t.titleTR;
    if (isDE) return t.titleDE;
    if (isFR) return t.titleFR;
    if (isIT) return t.titleIT;
    return t.titleEN;
  };

  const getTierDesc = (t: TierOption) => {
    if (isTR) return t.descTR;
    if (isDE) return t.descDE;
    if (isFR) return t.descFR;
    if (isIT) return t.descIT;
    return t.descEN;
  };

  const getTierBadge = (t: TierOption) => {
    if (isTR) return t.badgeTR;
    if (isDE) return t.badgeDE;
    if (isFR) return t.badgeFR;
    if (isIT) return t.badgeIT;
    return t.badgeEN;
  };

  const getTierPrice = (t: TierOption) => {
    if (isTR) return t.priceTR;
    if (isUS) return t.priceUS;
    if (isUK) return t.priceUK;
    return t.priceEUR;
  };

  const getTierOldPrice = (t: TierOption) => {
    if (isTR) return t.oldPriceTR;
    if (isUS) return t.oldPriceUS;
    if (isUK) return t.oldPriceUK;
    return t.oldPriceEUR;
  };

  const activePriceFormatted = getTierPrice(activeTierObj);
  const activeOldPriceFormatted = getTierOldPrice(activeTierObj);

  const emailPlaceholder = isTR
    ? 'adiniz@ornek.com'
    : isDE
    ? 'max.mustermann@beispiel.de'
    : isFR
    ? 'jean.dupont@exemple.fr'
    : isIT
    ? 'mario.rossi@esempio.it'
    : 'john.doe@example.com';

  const phonePlaceholder = isTR
    ? '+90 (5XX) XXX XX XX'
    : isDE
    ? '+49 (151) 00000000'
    : isFR
    ? '+33 6 00 00 00 00'
    : isIT
    ? '+39 300 0000000'
    : isUS
    ? '+1 (555) 000-0000'
    : '+44 7000 000000';

  const namePlaceholder = isTR
    ? 'Örn: Ahmet Yılmaz'
    : isDE
    ? 'z.B. Max Mustermann'
    : isFR
    ? 'ex. Jean Dupont'
    : isIT
    ? 'es. Mario Rossi'
    : 'e.g. John Doe';

  const sslBadgeText = isTR
    ? '256-Bit SSL Şifreleme • Shopier / Kart Güvencesi'
    : isDE
    ? '256-Bit SSL Verschlüsselung • DSGVO-konform • Stripe / Giropay / PayPal'
    : isFR
    ? 'Cryptage SSL 256 bits • Conforme RGPD • Stripe / CB / Apple Pay'
    : isIT
    ? 'Crittografia SSL a 256 bit • Conforme GDPR • Stripe / Satispay / Carta'
    : isUS
    ? '256-Bit SSL Encryption • Stripe / Apple Pay'
    : '256-Bit SSL Encryption • Stripe / Google Pay';

  const guaranteeText = isTR
    ? '%100 İptal veya İade Garantisi'
    : isDE
    ? '100% Kündigungs- oder Geld-zurück-Garantie'
    : isFR
    ? 'Garantie 100% résiliation ou remboursement'
    : isIT
    ? 'Garanzia di disdetta al 100% o rimborso'
    : '100% Cancel or Refund Guarantee';

  const privacyBadgeText = isTR
    ? 'KVKK Uyumlu Gizlilik'
    : isDE
    ? 'DSGVO & BGB § 312k Konform'
    : isFR
    ? 'Conforme RGPD & Loi Hamon'
    : isIT
    ? 'Conforme GDPR & Codice Consumo'
    : isUS
    ? 'CCPA & US Privacy Compliant'
    : 'UK GDPR & DPA 2018 Compliant';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccessToast) {
        onSuccessToast(
          isTR
            ? `VIP İptal Talebiniz Alındı (${activeTierObj.titleTR})! ${service.name} için hukuk ekibimiz 24 saat içinde işleme başlayacaktır.`
            : isDE
            ? `VIP-Kündigungsauftrag erhalten (${activeTierObj.titleDE})! Unser Team leitet die Kündigung für ${service.name} innerhalb von 24 Stunden ein.`
            : isFR
            ? `Demande VIP reçue (${activeTierObj.titleFR}) ! Notre équipe traite votre résiliation pour ${service.name} sous 24h.`
            : isIT
            ? `Richiesta VIP ricevuta (${activeTierObj.titleIT})! Il nostro team sta elaborando la disdetta per ${service.name} entro 24 ore.`
            : `VIP Cancellation Request Received (${activeTierObj.titleEN})! Our team is processing your ${service.name} cancellation.`
        );
      }
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSelectedTier('single');
    setFullName('');
    setEmail('');
    setPhone('');
    setSubscriberId('');
    setExtraServices('');
    setNotes('');
    onClose();
  };

  return (
    <div
      id="concierge-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto overflow-x-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        id="concierge-modal-content"
        className="relative w-full max-w-[480px] box-border bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-x-hidden my-3 sm:my-6 transition-all"
      >
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 text-white relative box-border">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              {isTR
                ? 'VIP CONCIERGE İPTAL HİZMETİ'
                : isDE
                ? 'VIP-KÜNDIGUNGSSERVICE'
                : isFR
                ? 'SERVICE CONCIERGE VIP'
                : isIT
                ? 'SERVIZIO DISDETTE VIP'
                : 'VIP CONCIERGE CANCELLATION'}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {isTR ? '24 Saatte Fesih' : isDE ? 'In 24 Std. erledigt' : isFR ? 'Régularisé en 24h' : isIT ? 'Risoluzione in 24h' : '24h Resolution'}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white leading-snug">
            {isTR
              ? `${service.name} Aboneliğinizi Sizin Adınıza İptal Edelim`
              : isDE
              ? `Wir kündigen ${service.name} rechtssicher für Sie`
              : isFR
              ? `Nous résilions votre abonnement ${service.name} pour vous`
              : isIT
              ? `Disdiciamo ${service.name} per conto tuo in 24 ore`
              : `Let Us Cancel Your ${service.name} Subscription For You`}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isTR
              ? 'Müşteri hizmetleriyle tartışmak, cayma bedeliyle uğraşmak veya şubeye gitmek zorunda kalmayın. Hukuk ve tüketici hakları ekibimiz resmi sürecinizi 24 saat içinde yönetsin.'
              : isDE
              ? 'Kein stundenlanges Diskutieren im Kundenservice, keine Kündigungshindernisse oder Briefpost. Unser Verbraucherschutz-Team wickelt die Kündigung innerhalb von 24 Stunden rechtssicher ab.'
              : isFR
              ? 'Ne perdez plus de temps au téléphone ou avec des lettres recommandées complexes. Notre service juridique prend en charge votre résiliation complète sous 24h.'
              : isIT
              ? 'Evita file, raccomandate postali o telefonate estenuanti con i call center. Il nostro team legale gestisce la disdetta formale in piena conformità entro 24 ore.'
              : 'Never waste hours arguing with retention reps, navigating dark pattern portals, or mailing certified letters. Our consumer protection team handles the entire cancellation within 24 hours.'}
          </p>

          <div className="mt-3 sm:mt-4 flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${service.domain}&sz=128`}
                  alt={`${service.name} logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = `https://icon.horse/icon/${service.domain}`;
                  }}
                />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold text-white block truncate">{service.name}</span>
                {service.selectedTierName && (
                  <span className="text-[11px] text-slate-300 block truncate">
                    {service.selectedTierName} ({service.currencySymbol}{service.avgMonthlyCost.toFixed(2)}/ay)
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[11px] text-slate-400">
                {isTR ? 'VIP İptal Ücreti:' : isDE ? 'VIP-Gebühr:' : isFR ? 'Frais VIP :' : isIT ? 'Costo VIP:' : 'VIP Service Fee:'}
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{activePriceFormatted}</div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 box-border max-h-[80vh] overflow-y-auto overflow-x-hidden">
          {isSuccess ? (
            <div className="text-center py-4 sm:py-6 space-y-4 box-border">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  {isTR
                    ? 'Talebiniz Başarıyla Alındı!'
                    : isDE
                    ? 'Auftrag erfolgreich eingegangen!'
                    : isFR
                    ? 'Demande enregistrée avec succès !'
                    : isIT
                    ? 'Pratica avviata con successo!'
                    : 'Request Successfully Received!'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                  {isTR
                    ? `${service.name} (${getTierTitle(activeTierObj)}) aboneliğinizin resmi fesih süreci başlatılmıştır. WhatsApp (${phone}) ve E-posta (${email}) üzerinden 24 saat içinde onay belgeniz iletilecektir.`
                    : isDE
                    ? `Die Kündigung für ${service.name} (${getTierTitle(activeTierObj)}) wurde eingeleitet. Ihre Bestätigung erhalten Sie an ${email} und WhatsApp (${phone}).`
                    : isFR
                    ? `La résiliation pour ${service.name} (${getTierTitle(activeTierObj)}) est en cours. Votre justificatif officiel sera envoyé à ${email} et WhatsApp (${phone}).`
                    : isIT
                    ? `La disdetta per ${service.name} (${getTierTitle(activeTierObj)}) è stata presa in carico. Riceverai la ricevuta su ${email} e WhatsApp (${phone}).`
                    : `The formal cancellation for ${service.name} (${getTierTitle(activeTierObj)}) has been initiated. Your official confirmation will be sent to ${email} and WhatsApp (${phone}) within 24 hours.`}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-left text-xs space-y-2 text-emerald-900 box-border">
                <div className="flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isTR
                      ? 'İşlem Takip No: '
                      : isDE
                      ? 'Vorgangsnummer: '
                      : isFR
                      ? 'Réf. Dossier : '
                      : isIT
                      ? 'Codice Pratica: '
                      : 'Case Reference: '}
                    #UB-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>
                <p className="text-emerald-700 leading-relaxed">
                  {isTR
                    ? 'Ekibimiz servis sağlayıcınıza 6502 sayılı Kanun ve Tüketici Hakları tebliği uyarınca ıslak/elektronik imzalı fesih bildirimini gönderecektir.'
                    : isDE
                    ? 'Unser Team stellt die Kündigungserklärung unter Einhaltung von BGB § 312k, BGB § 309 Nr. 9 und DSGVO direkt beim Anbieter zu.'
                    : isFR
                    ? 'Notre équipe notifie la résiliation officielle selon la Loi Hamon, la Loi Châtel et la Loi n° 2022-1158 (3 clics).'
                    : isIT
                    ? 'La disdetta verrà notificata a mezzo PEC / Raccomandata A/R in piena conformità al Codice del Consumo e alla Legge Bersani.'
                    : isUS
                    ? 'Our consumer protection team will file the formal termination notice under the FTC Click-to-Cancel Rule and Fair Credit Billing Act standards.'
                    : 'Our legal desk will submit the statutory termination notice in accordance with the Consumer Contracts Regulations 2013 and CRA 2015.'}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                {isTR ? 'Tamam & Kapat' : isDE ? 'Fertig & Schließen' : isFR ? 'Terminé & Fermer' : isIT ? 'Chiudi' : 'Done & Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 box-border">
              {/* TIERED PRICING PACKAGE SELECTOR */}
              <div className="box-border">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>
                    {isTR
                      ? '1. İptal Paketini Seçin'
                      : isDE
                      ? '1. Kündigungspaket wählen'
                      : isFR
                      ? '1. Choisissez votre formule'
                      : isIT
                      ? '1. Seleziona il pacchetto'
                      : '1. Choose Cancellation Plan'}
                  </span>
                  <span className="text-[11px] text-blue-600 font-semibold lowercase">
                    {isTR ? 'tek seferlik ödeme' : isDE ? 'einmalige Zahlung' : isFR ? 'paiement unique' : isIT ? 'pagamento una tantum' : 'one-time payment'}
                  </span>
                </label>

                <div className="grid grid-cols-1 gap-2.5 box-border">
                  {TIERS.map((tier) => {
                    const isSelected = selectedTier === tier.id;
                    const price = getTierPrice(tier);
                    const oldPrice = getTierOldPrice(tier);
                    const badge = getTierBadge(tier);

                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`relative rounded-xl p-3 sm:p-3.5 border transition-all cursor-pointer select-none box-border w-full ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                        }`}
                      >
                        {tier.isPopular && badge && (
                          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                            {badge}
                          </span>
                        )}
                        {!tier.isPopular && badge && (
                          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-200 shadow-xs">
                            {badge}
                          </span>
                        )}

                        <div className="flex items-start justify-between gap-2.5 sm:gap-3 box-border">
                          <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                            <div className="mt-0.5 shrink-0">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-300 bg-white'
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                  {getTierTitle(tier)}
                                </span>
                              </div>
                              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-snug">
                                {getTierDesc(tier)}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-[11px] sm:text-xs text-gray-400 line-through">{oldPrice}</div>
                            <div className="text-sm sm:text-base font-black text-gray-900">{price}</div>
                            <div className="text-[9px] sm:text-[10px] text-gray-400">
                              {isTR ? 'Tek Seferlik' : isDE ? 'Einmalig' : isFR ? 'Unique' : isIT ? 'Una tantum' : 'One-off'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Extra Services Field for Unlimited / VIP Plus */}
              {selectedTier === 'unlimited' && (
                <div className="p-3 sm:p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 animate-in fade-in duration-200 box-border w-full">
                  <label className="block text-xs font-bold text-blue-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">
                        {isTR
                          ? 'İptal Edilecek Diğer Servisler (İsteğe Bağlı)'
                          : isDE
                          ? 'Weitere zu kündigende Abos (Optional)'
                          : isFR
                          ? 'Autres abonnements (Facultatif)'
                          : isIT
                          ? 'Altri abbonamenti (Opzionale)'
                          : 'Other Subscriptions to Cancel (Optional)'}
                      </span>
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold shrink-0">
                      {isTR ? 'Kapsamlı Dosya' : isDE ? 'Sammelauftrag' : isFR ? 'Multi-abonnements' : isIT ? 'Pratica multipla' : 'Multi-service'}
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder={
                      isTR
                        ? 'Örn: Netflix, Spotify, gym üyeliğim, Adobe ve diğerleri...'
                        : isDE
                        ? 'z.B. DAZN, FitX, WOW TV, BahnCard, Adobe...'
                        : isFR
                        ? 'ex. Canal+, Basic-Fit, Deezer, Freebox...'
                        : isIT
                        ? 'es. DAZN, Virgin Active, TIM, NOW...'
                        : 'e.g., Netflix, Gym membership, Adobe CC, and others...'
                    }
                    value={extraServices}
                    onChange={(e) => setExtraServices(e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 box-border"
                  />
                  <p className="text-[10px] sm:text-[11px] text-blue-800 leading-tight">
                    {isTR
                      ? '✨ Tüm aktif abonelikleriniz taranacak, fesih bildirimleri gönderilecek ve haksız kesintiler için banka itirazı hazırlanacaktır.'
                      : isDE
                      ? '✨ Alle angegebenen Verträge werden geprüft, rechtssichere Kündigungserklärungen eingereicht und Erstattungen eingefordert.'
                      : isFR
                      ? '✨ Tous les abonnements mentionnés seront notifiés et les remboursements réclamés sous la loi Hamon et Châtel.'
                      : isIT
                      ? '✨ Tutti i servizi indicati verranno disdetti formalmente e predisposta la diffida per i rimborsi non dovuti.'
                      : '✨ All listed subscriptions will be audited, statutory termination notices sent, and bank chargebacks filed.'}
                  </p>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-3 pt-1 box-border">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {isTR
                    ? '2. İletişim & Abone Bilgileri'
                    : isDE
                    ? '2. Kontaktdaten & Vertragsangaben'
                    : isFR
                    ? '2. Coordonnées & Identifiants'
                    : isIT
                    ? '2. Dati di contatto & Abbonato'
                    : '2. Contact & Subscription Details'}
                </div>

                <div className="box-border">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {isTR ? 'Ad Soyad' : isDE ? 'Vor- und Nachname' : isFR ? 'Nom & Prénom' : isIT ? 'Nome e Cognome' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={namePlaceholder}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-10 sm:h-11 px-3 sm:px-3.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors box-border"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 box-border">
                  <div className="box-border">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      {isTR ? 'İletişim E-postası' : isDE ? 'E-Mail-Adresse' : isFR ? 'Adresse e-mail' : isIT ? 'Email di contatto' : 'Contact Email'} *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 sm:h-11 px-3 sm:px-3.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors box-border"
                    />
                  </div>

                  <div className="box-border">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>{isTR ? 'Telefon & WhatsApp' : isDE ? 'Telefon / Mobil' : isFR ? 'Téléphone portable' : isIT ? 'Telefono / Cellulare' : 'Phone / WhatsApp'} *</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">{isTR ? 'Onay için' : isDE ? 'Für Status' : isFR ? 'Suivi SMS' : isIT ? 'Per conferma' : 'For updates'}</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 sm:h-11 px-3 sm:px-3.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors box-border"
                    />
                  </div>
                </div>

                <div className="box-border">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="truncate pr-2">
                      {isTR
                        ? 'Servis Kullanıcı Adı / Abone No'
                        : isDE
                        ? 'Kunden- / Mitgliedsnummer (falls vorhanden)'
                        : isFR
                        ? 'Numéro d\'abonné / Réf. client'
                        : isIT
                        ? 'Codice Cliente / ID Abbonamento'
                        : 'Service Username / Subscriber ID'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal shrink-0">{isTR ? 'Varsa' : isDE ? 'Optional' : isFR ? 'Facultatif' : isIT ? 'Opzionale' : 'Optional'}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={
                      isTR
                        ? 'Örn: Abone no, kayıtlı e-posta veya TC son 4 hane'
                        : isDE
                        ? 'z.B. Vertragsnummer, Kunden-ID oder E-Mail'
                        : isFR
                        ? 'ex. Numéro client ou e-mail de compte'
                        : isIT
                        ? 'es. Codice fiscale o codice abbonato'
                        : 'e.g. Account email, membership ID'
                    }
                    value={subscriberId}
                    onChange={(e) => setSubscriberId(e.target.value)}
                    className="w-full h-10 sm:h-11 px-3 sm:px-3.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors box-border"
                  />
                </div>

                <div className="box-border">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {isTR
                      ? 'Özel Not / Talep Detayı (İsteğe Bağlı)'
                      : isDE
                      ? 'Besondere Hinweise / Sachverhalt (Optional)'
                      : isFR
                      ? 'Remarques ou détails particuliers (Facultatif)'
                      : isIT
                      ? 'Note particolari o dettagli (Opzionale)'
                      : 'Special Notes / Plan Details (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={
                      isTR
                        ? 'Örn: Yıllık taahhüt uyarısı veriyor, şubeye gitmemi istiyorlar...'
                        : isDE
                        ? 'z.B. Automatische Verlängerung beanstanden, Kündigungsbutton fehlt...'
                        : isFR
                        ? 'ex. Renouvellement automatique non consenti, refus de résiliation en ligne...'
                        : isIT
                        ? 'es. Rimodulazione tariffaria, addebito non autorizzato dopo recesso...'
                        : 'e.g. Stuck in annual contract, refusing online cancellation...'
                    }
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none box-border"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 box-border">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-13 px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.98] disabled:opacity-75 cursor-pointer box-border"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{isTR ? 'Ödeme & Güvenli Bağlantı Kuruluyor...' : isDE ? 'Verbindung wird gesichert...' : isFR ? 'Sécurisation de la connexion...' : isIT ? 'Connessione protetta in corso...' : 'Securing Connection...'}</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      <span className="truncate">
                        {selectedTier === 'single'
                          ? isTR
                            ? `Güvenli Ödeme (${activePriceFormatted}) & Hemen İptal Et →`
                            : isDE
                            ? `Sicher bezahlen (${activePriceFormatted}) & Jetzt kündigen →`
                            : isFR
                            ? `Paiement sécurisé (${activePriceFormatted}) & Résilier maintenant →`
                            : isIT
                            ? `Pagamento sicuro (${activePriceFormatted}) & Disdici ora →`
                            : `Secure Checkout (${activePriceFormatted}) & Cancel Now →`
                          : isTR
                          ? `Güvenli Ödeme (${activePriceFormatted}) & Hepsini İptal Et →`
                          : isDE
                          ? `Sicher bezahlen (${activePriceFormatted}) & Alle kündigen →`
                          : isFR
                          ? `Paiement sécurisé (${activePriceFormatted}) & Tout résilier →`
                          : isIT
                          ? `Pagamento sicuro (${activePriceFormatted}) & Disdici tutti →`
                          : `Secure Checkout (${activePriceFormatted}) & Cancel All →`}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-auto shrink-0" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] sm:text-[11px] text-gray-500 text-center px-1">
                  <Lock className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="truncate">{sslBadgeText}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-2.5 sm:pt-3 border-t border-gray-100 box-border">
                <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-100 box-border">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700 leading-tight truncate">
                    {guaranteeText}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-100 box-border">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700 leading-tight truncate">
                    {privacyBadgeText}
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

