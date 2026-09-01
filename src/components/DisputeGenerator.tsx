import React, { useState, useEffect } from 'react';
import { DisputeFormData, RegionConfig, ServiceItem } from '../types';
import {
  FileText,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  Shield,
  RotateCcw,
  Scale,
  Building2,
  User,
  Mail,
  Calendar,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DisputeGeneratorProps {
  currentRegion: RegionConfig;
  prefillService: ServiceItem | null;
  onClearPrefill?: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const DisputeGenerator: React.FC<DisputeGeneratorProps> = ({
  currentRegion,
  prefillService,
  onClearPrefill,
  onShowToast,
}) => {
  const isTR = currentRegion.code === 'TR';
  const isUS = currentRegion.code === 'US';
  const isUK = currentRegion.code === 'UK';
  const isDE = currentRegion.code === 'DE';
  const isFR = currentRegion.code === 'FR';
  const isIT = currentRegion.code === 'IT';

  const defaultFormData: DisputeFormData = {
    fullName: '',
    companyName: '',
    accountEmail: '',
    amountPaid: '',
    transactionDate: new Date().toISOString().split('T')[0],
    disputeReasonId: currentRegion.disputeReasons[0]?.id || '',
    referenceNumber: '',
    customNotes: '',
    userAddress: '',
    userPhone: '',
  };

  const [formData, setFormData] = useState<DisputeFormData>(defaultFormData);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Sync reason if region changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      disputeReasonId:
        currentRegion.disputeReasons.find((r) => r.id === prev.disputeReasonId)?.id ||
        currentRegion.disputeReasons[0]?.id ||
        '',
    }));
  }, [currentRegion]);

  // Sync prefill service if supplied
  useEffect(() => {
    if (prefillService) {
      const displayName = prefillService.selectedTierName
        ? `${prefillService.name} (${prefillService.selectedTierName})`
        : prefillService.name;

      setFormData((prev) => ({
        ...prev,
        companyName: displayName,
        amountPaid: Number.isInteger(prefillService.avgMonthlyCost)
          ? prefillService.avgMonthlyCost.toString()
          : prefillService.avgMonthlyCost.toFixed(2),
        disputeReasonId: prefillService.disputePresetReasonId || prev.disputeReasonId,
        customNotes: prefillService.trapAlert
          ? isTR
            ? `Hizmet/Üyelik Kısıtı: ${prefillService.trapAlert}`
            : isDE
            ? `Vertragskonditionen: ${prefillService.trapAlert}`
            : isFR
            ? `Conditions du contrat : ${prefillService.trapAlert}`
            : isIT
            ? `Condizioni contrattuali: ${prefillService.trapAlert}`
            : `Membership/Service issue: ${prefillService.trapAlert}`
          : '',
      }));
      setActivePreset(displayName);
    }
  }, [prefillService, isTR, isDE, isFR, isIT]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate real-time legal letter text
  const letterText = currentRegion.letterTemplate(formData, currentRegion);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(letterText);
      setCopied(true);
      onShowToast(
        isTR
          ? 'Dilekçe metni panoya kopyalandı! Resmi kurumlara veya şirkete iletebilirsiniz.'
          : isDE
          ? 'Kündigungsschreiben kopiert! Bereit für den Versand an den Anbieter oder Ihre Bank.'
          : isFR
          ? 'Lettre de contestation copiée ! Prête à être envoyée au fournisseur ou à votre banque.'
          : isIT
          ? 'Lettera di contestazione copiata! Pronta per l\'invio al fornitore o alla banca.'
          : isUS
          ? 'Dispute letter copied to clipboard! Ready to send to merchant or file with your card bank.'
          : 'Dispute letter copied to clipboard! Ready to send to trader or present to your UK bank.',
        'success'
      );

      // Trigger celebratory confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });

      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      onShowToast(
        isTR
          ? 'Kopyalama başarısız oldu. Lütfen metni seçerek kopyalayınız.'
          : 'Copying failed. Please highlight the text to copy.',
        'error'
      );
    }
  };

  const handleDownloadTxt = () => {
    const filename = `${currentRegion.brandName}_${(formData.companyName || 'Dispute')
      .replace(/\s+/g, '_')
      .toLowerCase()}_${new Date().toISOString().split('T')[0]}.txt`;
    const element = document.createElement('a');
    const file = new Blob([letterText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast(
      isTR
        ? `Dilekçe indirildi: ${filename}`
        : isDE
        ? `Schreiben heruntergeladen: ${filename}`
        : isFR
        ? `Courrier téléchargé : ${filename}`
        : isIT
        ? `Documento scaricato: ${filename}`
        : `Dispute letter downloaded: ${filename}`,
      'success'
    );
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${currentRegion.disputeEngineTitle} - ${formData.companyName}</title>
            <style>
              body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; color: #000; }
              pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
            </style>
          </head>
          <body>
            <pre>${letterText}</pre>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleQuickAmount = (amount: number) => {
    setFormData((prev) => ({ ...prev, amountPaid: amount.toString() }));
  };

  const handleResetForm = () => {
    setFormData(defaultFormData);
    setActivePreset(null);
    if (onClearPrefill) onClearPrefill();
    onShowToast(isTR ? 'Form sıfırlandı' : isDE ? 'Formular zurückgesetzt' : isFR ? 'Formulaire réinitialisé' : isIT ? 'Modulo reimpostato' : 'Form reset to blank', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Engine Header */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentRegion.legalAuthorityBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {currentRegion.disputeEngineTitle}
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl">{currentRegion.disputeEngineSub}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResetForm}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors border border-gray-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isTR ? 'Formu Temizle' : isDE ? 'Zurücksetzen' : isFR ? 'Effacer' : isIT ? 'Reimposta' : 'Reset Form'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Real-time Legal Draft on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>
                {isTR
                  ? '1. Tüketici & Şirket Bilgileri'
                  : isDE
                  ? '1. Verbraucher- & Unternehmensdaten'
                  : isFR
                  ? '1. Informations Consommateur & Société'
                  : isIT
                  ? '1. Dati Consumatore & Azienda'
                  : '1. Claimant & Merchant Info'}
              </span>
            </h3>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {isTR ? 'Adınız Soyadınız' : isDE ? 'Vollständiger Name' : isFR ? 'Nom et Prénom' : isIT ? 'Nome e Cognome' : 'Your Full Legal Name'} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={
                    isTR
                      ? 'Örn: Ahmet Yılmaz'
                      : isDE
                      ? 'z.B. Max Mustermann'
                      : isFR
                      ? 'ex. Jean Dupont'
                      : isIT
                      ? 'es. Mario Rossi'
                      : isUS
                      ? 'e.g., John Doe'
                      : 'e.g., John Smith'
                  }
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {isTR ? 'Şirket / Hizmet Sağlayıcı Adı' : isDE ? 'Unternehmen / Anbietername' : isFR ? 'Nom du service / de l\'entreprise' : isIT ? 'Nome Azienda / Servizio' : 'Company / Merchant Name'} *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder={
                    isTR
                      ? 'Örn: MACFit / Mars Spor Kulübü'
                      : isDE
                      ? 'z.B. DAZN / FitX / WOW TV'
                      : isFR
                      ? 'ex. Canal+ / Basic-Fit / Free'
                      : isIT
                      ? 'es. DAZN / Virgin Active / TIM'
                      : isUS
                      ? 'e.g., Planet Fitness / Adobe Inc.'
                      : 'e.g., PureGym Ltd / Sky UK'
                  }
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Account Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {isTR ? 'Kayıtlı E-posta / Hesap Kimliği' : isDE ? 'Vertrags-E-Mail / Benutzer-ID' : isFR ? 'E-mail du compte' : isIT ? 'Email del conto / Username' : 'Account Email / Member Username'} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="accountEmail"
                  value={formData.accountEmail}
                  onChange={handleInputChange}
                  placeholder={
                    isTR
                      ? 'adiniz@ornek.com'
                      : isDE
                      ? 'max.mustermann@beispiel.de'
                      : isFR
                      ? 'jean.dupont@exemple.fr'
                      : isIT
                      ? 'mario.rossi@esempio.it'
                      : 'john.doe@example.com'
                  }
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Address & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  {isTR ? 'Müşteri / Sipariş No' : isDE ? 'Kunden- / Auftragsnummer' : isFR ? 'Réf. Client / Contrat' : isIT ? 'Codice Cliente / Contratto' : 'Order / Member ID'}
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleInputChange}
                  placeholder={isTR ? 'Örn: AB-98214' : isDE ? 'z.B. DE-84920' : isFR ? 'ex. FR-84920' : isIT ? 'es. IT-84920' : isUS ? 'e.g., US-84920' : 'e.g., UK-74921'}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  {isTR ? 'Telefon / Adres' : isDE ? 'Telefon / Anschrift' : isFR ? 'Téléphone / Adresse' : isIT ? 'Telefono / Indirizzo' : 'Phone / Address'}
                </label>
                <input
                  type="text"
                  name="userAddress"
                  value={formData.userAddress}
                  onChange={handleInputChange}
                  placeholder={
                    isTR
                      ? 'İstanbul / +90 (5XX) XXX XX XX'
                      : isDE
                      ? 'Berlin / +49 (151) 00000000'
                      : isFR
                      ? 'Paris / +33 6 00 00 00 00'
                      : isIT
                      ? 'Roma / +39 300 0000000'
                      : isUS
                      ? 'New York, NY / +1 (555) 000-0000'
                      : 'London, UK / +44 7000 000000'
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Financial & Dispute Grounds */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              <span>
                {isTR
                  ? '2. Tahsilat & Hukuki Gerekçe'
                  : isDE
                  ? '2. Zahlungsdetails & Rechtsgrundlage'
                  : isFR
                  ? '2. Montant du litige & Motif légal'
                  : isIT
                  ? '2. Importo & Fondamento Giuridico'
                  : '2. Transaction & Legal Ground'}
              </span>
            </h3>

            {/* Amount Paid & Currency */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700">
                  {isTR ? 'Haksız Tahsil Edilen / İstenen Tutar' : isDE ? 'Streitiger / Erstattungsbetrag' : isFR ? 'Montant contesté à rembourser' : isIT ? 'Importo contestato / da rimborsare' : 'Disputed / Refund Amount'} *
                </label>
                <span className="text-xs text-blue-600 font-mono font-bold">
                  {currentRegion.currency}
                </span>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold font-mono text-sm">
                  {currentRegion.currencySymbol}
                </div>
                <input
                  type="number"
                  step="0.01"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Sample quick amount pills */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-gray-500">
                  {isTR ? 'Örnek tutarlar:' : isDE ? 'Vorschläge:' : isFR ? 'Montants rapides :' : isIT ? 'Suggeriti:' : 'Quick pick:'}
                </span>
                {currentRegion.sampleAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAmount(amt)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold"
                  >
                    {currentRegion.currencySymbol}
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {isTR ? 'Tahsilat / İşlem Tarihi' : isDE ? 'Datum der Abbuchung' : isFR ? 'Date du prélèvement / litige' : isIT ? 'Data dell\'addebito / operazione' : 'Date of Charge / Dispute'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Dispute Reason Dropdown (Region specific) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {isTR ? 'Yasal İtiraz / Şikayet Maddesi' : isDE ? 'Gesetzlicher Kündigungsgrund' : isFR ? 'Motif légal de résiliation / contestation' : isIT ? 'Motivo legale del recesso / contestazione' : 'Statutory Grounds for Dispute'} *
              </label>
              <select
                name="disputeReasonId"
                value={formData.disputeReasonId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              >
                {currentRegion.disputeReasons.map((reason) => (
                  <option key={reason.id} value={reason.id}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {isTR ? 'Ek Notlar / Olay Özeti (İsteğe Bağlı)' : isDE ? 'Zusätzliche Angaben / Nachweise (Optional)' : isFR ? 'Notes complémentaires (Facultatif)' : isIT ? 'Note aggiuntive / Dettagli (Opzionale)' : 'Additional Notes / Evidence (Optional)'}
              </label>
              <textarea
                name="customNotes"
                rows={2}
                value={formData.customNotes}
                onChange={handleInputChange}
                placeholder={
                  isTR
                    ? 'Örn: Telefonla aradığımda müşteri temsilcisi telefonu yüzüme kapattı...'
                    : isDE
                    ? 'z.B. Nach Kündigung weiter abgebucht; Kündigungsbutton auf Website fehlte.'
                    : isFR
                    ? 'ex. Résiliation effectuée mais prélèvements poursuivis sans motif valable.'
                    : isIT
                    ? 'es. Richiesta di recesso inoltrata ma continuano gli addebiti mensili.'
                    : isUS
                    ? 'e.g., Charged after online cancellation confirmation; merchant refused FTC compliance.'
                    : 'e.g., Cancelled within 14-day statutory cooling-off window; direct debit continues to be taken.'
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Parchment Preview & Actions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                {isTR
                  ? 'Resmi Dilekçe Canlı Önizleme'
                  : isDE
                  ? 'Offizielles Schreiben Live-Vorschau'
                  : isFR
                  ? 'Aperçu en direct de la lettre officielle'
                  : isIT
                  ? 'Anteprima in tempo reale della lettera'
                  : 'Official Legal Letter Live Preview'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="print-letter-btn"
                onClick={handlePrint}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                title={isTR ? 'Yazdır veya PDF Kaydet' : isDE ? 'Drucken / PDF speichern' : isFR ? 'Imprimer / Sauvegarder en PDF' : isIT ? 'Stampa / Salva in PDF' : 'Print / Save as PDF'}
              >
                <Printer className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden sm:inline">{isTR ? 'Yazdır' : isDE ? 'Drucken' : isFR ? 'Imprimer' : isIT ? 'Stampa' : 'Print'}</span>
              </button>

              <button
                id="download-letter-btn"
                onClick={handleDownloadTxt}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                title={isTR ? 'Metin (.txt) olarak indir' : isDE ? 'Als .txt herunterladen' : isFR ? 'Télécharger (.txt)' : isIT ? 'Scarica (.txt)' : 'Download text file'}
              >
                <Download className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden sm:inline">{isTR ? 'İndir' : isDE ? 'Download' : isFR ? 'Télécharger' : isIT ? 'Scarica' : 'Download'}</span>
              </button>

              <button
                id="copy-letter-btn"
                onClick={handleCopyToClipboard}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copied
                    ? (isTR ? 'Kopyalandı! ✓' : isDE ? 'Kopiert! ✓' : isFR ? 'Copié ! ✓' : isIT ? 'Copiato! ✓' : 'Copied! ✓')
                    : (isTR ? 'Panoya Kopyala' : isDE ? 'In Zwischenablage kopieren' : isFR ? 'Copier le texte' : isIT ? 'Copia testo' : 'Copy to Clipboard')}
                </span>
              </button>
            </div>
          </div>

          {/* Legal Document Container */}
          <div className="relative rounded-2xl bg-white border border-dashed border-gray-300 p-6 sm:p-8 font-mono text-xs sm:text-[13px] leading-relaxed text-gray-800 shadow-sm overflow-hidden">
            {/* Watermark Authority Badge */}
            <div className="absolute top-6 right-6 opacity-5 pointer-events-none select-none text-right">
              <Scale className="w-32 h-32 text-gray-900 ml-auto" />
              <span className="font-extrabold uppercase text-sm block">{currentRegion.brandName} Legal</span>
            </div>

            {/* Letter Body */}
            <pre className="whitespace-pre-wrap font-mono text-gray-800 select-text selection:bg-blue-100 selection:text-blue-900 leading-relaxed">
              {letterText}
            </pre>
          </div>

          {/* How to use hint */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
            <p className="font-bold text-gray-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              {isTR
                ? 'Bu Dilekçeyi Nasıl Kullanabilirsiniz?'
                : isDE
                ? 'Wie Sie dieses Kündigungsschreiben einsetzen:'
                : isFR
                ? 'Comment utiliser ce document de contestation :'
                : isIT
                ? 'Come utilizzare questo documento legale:'
                : 'How to Use This Dispute Document:'}
            </p>
            <p className="leading-relaxed">
              {isTR ? (
                <>
                  1. Metni kopyalayıp <strong>e-Devlet Tüketici Hakem Heyeti (TÜBİS)</strong> sistemine online yükleyebilirsiniz.
                  <br />
                  2. Şirketin destek e-postasına veya iadeli taahhütlü posta/noter ihtarı olarak göndererek resmi kayıt oluşturabilirsiniz.
                </>
              ) : isDE ? (
                <>
                  1. Senden Sie das Schreiben per E-Mail oder Einwurf-Einschreiben an den Anbieter unter Berufung auf <strong>BGB § 312k (Kündigungsbutton)</strong> und <strong>BGB § 309 Nr. 9</strong>.
                  <br />
                  2. Bei unberechtigter Abbuchung leiten Sie dieses Schreiben an Ihre Bank weiter für eine <strong>SEPA-Lastschrift-Rückbuchung (Chargeback)</strong> binnen 8 Wochen.
                </>
              ) : isFR ? (
                <>
                  1. Envoyez ce document par e-mail ou lettre recommandée avec avis de réception (LRAR) au service client sous la <strong>Loi Hamon (C. consom. art. L221-18)</strong> et la <strong>Loi résiliation en 3 clics (L215-1-1)</strong>.
                  <br />
                  2. Transmettez-le à votre établissement bancaire pour engager une <strong>procédure de rétrofacturation (Chargeback)</strong> ou contester un prélèvement SEPA.
                </>
              ) : isIT ? (
                <>
                  1. Inviare tramite PEC (Posta Elettronica Certificata) o Raccomandata A/R all'ufficio reclami ai sensi del <strong>Codice del Consumo (Art. 52)</strong> e della <strong>Legge Bersani (L. 40/2007)</strong>.
                  <br />
                  2. Presentare copia alla propria banca per disporre lo <strong>storno immediato dell'addebito diretto SEPA (Chargeback)</strong>.
                </>
              ) : isUS ? (
                <>
                  1. Send directly to the merchant billing & legal department citing the <strong>FTC Click-to-Cancel Rule (16 CFR Part 425)</strong>.
                  <br />
                  2. If unrefunded within 3 business days, forward this demand letter to your card issuing bank to initiate a <strong>Fair Credit Billing Act (FCBA 15 U.S.C. § 1666) Chargeback</strong> (Visa Reason Code 13.7 / Mastercard 4853).
                </>
              ) : (
                <>
                  1. Email directly to the trader’s cancellations team to exercise your statutory cooling-off right under <strong>Regulation 29 of the Consumer Contracts Regulations 2013 (SI 2013/3134)</strong>.
                  <br />
                  2. Present to your UK bank to trigger an immediate refund under the <strong>Direct Debit Guarantee Scheme</strong> or Section 75 Consumer Credit Act claim.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
