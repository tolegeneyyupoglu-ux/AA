import React, { useState } from 'react';
import { RegionConfig, ServiceItem } from '../types';
import { PiggyBank, Plus, Trash2, CheckCircle2, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomSubscription {
  id: string;
  name: string;
  monthlyCost: number;
}

interface SavingsTrackerProps {
  currentRegion: RegionConfig;
  services: ServiceItem[];
  cancelledIds: string[];
  onToggleCancelled: (id: string) => void;
  onOpenDisputeForService: (service: ServiceItem) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const SavingsTracker: React.FC<SavingsTrackerProps> = ({
  currentRegion,
  services,
  cancelledIds,
  onToggleCancelled,
  onOpenDisputeForService,
  onShowToast,
}) => {
  const isTR = currentRegion.code === 'TR';
  const isDE = currentRegion.code === 'DE';
  const isFR = currentRegion.code === 'FR';
  const isIT = currentRegion.code === 'IT';

  const [customSubs, setCustomSubs] = useState<CustomSubscription[]>([]);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCost, setNewSubCost] = useState('');

  // Calculate cancelled services
  const cancelledServices = services.filter((s) => cancelledIds.includes(s.id));
  const serviceMonthlyTotal = cancelledServices.reduce((acc, s) => acc + s.avgMonthlyCost, 0);
  const customMonthlyTotal = customSubs.reduce((acc, s) => acc + s.monthlyCost, 0);

  const totalMonthlySavings = serviceMonthlyTotal + customMonthlyTotal;
  const totalYearlySavings = totalMonthlySavings * 12;

  const handleAddCustomSub = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(newSubCost);
    if (!newSubName.trim() || isNaN(cost) || cost <= 0) {
      onShowToast(
        isTR
          ? 'Lütfen geçerli bir isim ve aylık tutar giriniz.'
          : isDE
          ? 'Bitte geben Sie einen gültigen Namen und Monatsbetrag ein.'
          : isFR
          ? 'Veuillez saisir un nom valide et un coût mensuel positif.'
          : isIT
          ? 'Inserisci un nome valido e un importo mensile positivo.'
          : 'Please enter a valid name and positive monthly cost.',
        'error'
      );
      return;
    }

    const newSub: CustomSubscription = {
      id: 'custom-' + Date.now(),
      name: newSubName.trim(),
      monthlyCost: cost,
    };

    setCustomSubs((prev) => [...prev, newSub]);
    setNewSubName('');
    setNewSubCost('');

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
    });

    onShowToast(
      isTR
        ? `${newSub.name} tasarruf kasanıza eklendi!`
        : isDE
        ? `${newSub.name} wurde zu Ihrem Spartresor hinzugefügt!`
        : isFR
        ? `${newSub.name} a été ajouté à votre coffre d'économies !`
        : isIT
        ? `${newSub.name} aggiunto al tuo salvadanaio!`
        : `${newSub.name} added to your savings vault!`,
      'success'
    );
  };

  const handleRemoveCustomSub = (id: string) => {
    setCustomSubs((prev) => prev.filter((s) => s.id !== id));
    onShowToast(
      isTR
        ? 'Kayıt kaldırıldı'
        : isDE
        ? 'Eintrag entfernt'
        : isFR
        ? 'Entrée supprimée'
        : isIT
        ? 'Elemento rimosso'
        : 'Entry removed',
      'info'
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isTR
                  ? 'Canlı Tasarruf Hesaplayıcı'
                  : isDE
                  ? 'Echtzeit-Sparrechner'
                  : isFR
                  ? 'Calculateur d\'économies en direct'
                  : isIT
                  ? 'Calcolatore di risparmio in tempo reale'
                  : 'Real-time Subscription Savings'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {isTR
                ? 'İptal Edilen Abonelikler & Tasarruf Kasası'
                : isDE
                ? 'Gekündigte Abos & Spartresor'
                : isFR
                ? 'Abonnements résiliés & Coffre d\'économies'
                : isIT
                ? 'Abbonamenti disdetti & Salvadanaio'
                : 'Subscription Vault & Savings Tracker'}
            </h2>
            <p className="text-sm text-gray-500 max-w-xl">
              {isTR
                ? 'İptal ettiğiniz tüm hizmetleri takip edin, cebinizde kalan parayı aylık ve yıllık olarak görün.'
                : isDE
                ? 'Behalten Sie alle gekündigten Verträge im Blick und sehen Sie Ihre monatlichen & jährlichen Ersparnisse.'
                : isFR
                ? 'Suivez tous les services résiliés et visualisez vos gains mensuels et annuels préservés.'
                : isIT
                ? 'Monitora tutte le sottoscrizioni disdette e visualizza il risparmio mensile e annuale accumulato.'
                : 'Track all subscriptions you successfully cancelled and visualize your monthly & annual wealth retention.'}
            </p>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <span className="text-xs text-gray-500 block">
                {isTR
                  ? 'Aylık Tasarruf'
                  : isDE
                  ? 'Monatlich gespart'
                  : isFR
                  ? 'Économie / mois'
                  : isIT
                  ? 'Risparmio mensile'
                  : 'Monthly Retained'}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono">
                {currentRegion.currencySymbol}
                {totalMonthlySavings.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <span className="text-xs text-gray-500 block">
                {isTR
                  ? 'Yıllık Tasarruf'
                  : isDE
                  ? 'Jährlich gespart'
                  : isFR
                  ? 'Économie / an'
                  : isIT
                  ? 'Risparmio annuale'
                  : 'Annual Retained'}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900 font-mono">
                {currentRegion.currencySymbol}
                {totalYearlySavings.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cancelled Services List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  {isTR
                    ? 'İptal Edilen Servisler'
                    : isDE
                    ? 'Gekündigte Dienste'
                    : isFR
                    ? 'Services résiliés'
                    : isIT
                    ? 'Servizi disdetti'
                    : 'Cancelled Subscriptions'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {cancelledServices.length + customSubs.length}
                </span>
              </h3>
            </div>

            {cancelledServices.length === 0 && customSubs.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-gray-50 border border-dashed border-gray-300 space-y-3">
                <PiggyBank className="w-10 h-10 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-700 font-medium">
                  {isTR
                    ? 'Henüz iptal edilmiş servis işaretlemediniz.'
                    : isDE
                    ? 'Noch keine gekündigten Dienste erfasst.'
                    : isFR
                    ? 'Aucun abonnement résilié enregistré pour le moment.'
                    : isIT
                    ? 'Nessun servizio disdetto registrato finora.'
                    : 'No cancelled subscriptions logged yet.'}
                </p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  {isTR
                    ? 'Ana sayfadaki servis kartlarından "İptal Ettim Olarak İşaretle" butonuna basarak buraya ekleyebilirsiniz.'
                    : isDE
                    ? 'Klicken Sie auf den Service-Karten auf „Als gekündigt markieren“ oder tragen Sie eigene Abos rechts ein.'
                    : isFR
                    ? 'Cliquez sur « Marquer comme résilié » sur une fiche ou ajoutez un abonnement personnalisé à droite.'
                    : isIT
                    ? 'Clicca su "Segna come disdetto" sulle schede o aggiungi abbonamenti personalizzati a destra.'
                    : 'Click "Mark as Cancelled" on any service card or add custom memberships using the form on the right.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* Built-in services */}
                {cancelledServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
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
                        <h4 className="text-sm font-bold text-gray-900">{service.name}</h4>
                        <span className="text-xs text-gray-500">{service.categoryLabel}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-600 font-mono">
                          +{currentRegion.currencySymbol}
                          {service.avgMonthlyCost.toFixed(2)}
                          <span className="text-xs text-gray-400 font-normal">/{isTR ? 'ay' : isDE ? 'Monat' : isFR ? 'mois' : isIT ? 'mese' : 'mo'}</span>
                        </span>
                        <span className="block text-[11px] text-gray-500 font-mono">
                          +{currentRegion.currencySymbol}
                          {(service.avgMonthlyCost * 12).toFixed(0)}/{isTR ? 'yıl' : isDE ? 'Jahr' : isFR ? 'an' : isIT ? 'anno' : 'yr'}
                        </span>
                      </div>

                      <button
                        onClick={() => onToggleCancelled(service.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                        title={isTR ? 'Kaldır' : isDE ? 'Entfernen' : isFR ? 'Supprimer' : isIT ? 'Rimuovi' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Custom Subscriptions */}
                {customSubs.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                        ★
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{sub.name}</h4>
                        <span className="text-xs text-blue-600">
                          {isTR ? 'Özel Kayıt' : isDE ? 'Eigener Eintrag' : isFR ? 'Entrée personnalisée' : isIT ? 'Voce personalizzata' : 'Custom Entry'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-600 font-mono">
                          +{currentRegion.currencySymbol}
                          {sub.monthlyCost.toFixed(2)}
                          <span className="text-xs text-gray-400 font-normal">/{isTR ? 'ay' : isDE ? 'Monat' : isFR ? 'mois' : isIT ? 'mese' : 'mo'}</span>
                        </span>
                        <span className="block text-[11px] text-gray-500 font-mono">
                          +{currentRegion.currencySymbol}
                          {(sub.monthlyCost * 12).toFixed(0)}/{isTR ? 'yıl' : isDE ? 'Jahr' : isFR ? 'an' : isIT ? 'anno' : 'yr'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveCustomSub(sub.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                        title={isTR ? 'Kaldır' : isDE ? 'Entfernen' : isFR ? 'Supprimer' : isIT ? 'Rimuovi' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Add Custom & Wealth Insights */}
        <div className="lg:col-span-5 space-y-6">
          {/* Add Custom Subscription Card */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>
                {isTR
                  ? 'Özel Abonelik Ekle'
                  : isDE
                  ? 'Abo manuell hinzufügen'
                  : isFR
                  ? 'Ajouter un abonnement'
                  : isIT
                  ? 'Aggiungi abbonamento manuale'
                  : 'Add Custom Cancelled Subscription'}
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              {isTR
                ? 'Listede olmayan bir spor salonu, dergi, yazılım veya fatura ekleyin:'
                : isDE
                ? 'Tragen Sie weitere Fitnessstudios, SaaS-Tools, Zeitschriften oder Abos ein:'
                : isFR
                ? 'Enregistrez d\'autres salles de sport, logiciels, magazines ou forfaits résiliés :'
                : isIT
                ? 'Registra altre palestre, riviste, software o abbonamenti periodici che hai disdetto:'
                : 'Log any other gym, SaaS tool, magazine, or recurring subscription you stopped:'}
            </p>

            <form onSubmit={handleAddCustomSub} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isTR
                    ? 'Abonelik / Şirket Adı'
                    : isDE
                    ? 'Name des Anbieters / Abos'
                    : isFR
                    ? 'Nom du service / de l\'abonnement'
                    : isIT
                    ? 'Nome del servizio / fornitore'
                    : 'Subscription Name'}
                </label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder={
                    isTR
                      ? 'Örn: Yerel Fitness Kulübü'
                      : isDE
                      ? 'z.B. Lokales Fitnessstudio / Software'
                      : isFR
                      ? 'ex. Salle de sport locale / SaaS'
                      : isIT
                      ? 'es. Palestra di quartiere / Software'
                      : 'e.g., Local Gym / SaaS App'
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isTR
                    ? `Aylık Ücret (${currentRegion.currencySymbol})`
                    : isDE
                    ? `Monatliche Kosten (${currentRegion.currencySymbol})`
                    : isFR
                    ? `Coût mensuel (${currentRegion.currencySymbol})`
                    : isIT
                    ? `Costo mensile (${currentRegion.currencySymbol})`
                    : `Monthly Cost (${currentRegion.currencySymbol})`}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">
                    {currentRegion.currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={newSubCost}
                    onChange={(e) => setNewSubCost(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isTR
                    ? 'Tasarruf Kasasına Ekle'
                    : isDE
                    ? 'Zum Spartresor hinzufügen'
                    : isFR
                    ? 'Ajouter au coffre'
                    : isIT
                    ? 'Aggiungi al salvadanaio'
                    : 'Add to Savings Vault'}
                </span>
              </button>
            </form>
          </div>

          {/* Compound Savings Projection */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>
                {isTR
                  ? '5 Yıllık Birikim Projeksiyonu'
                  : isDE
                  ? '5-Jahres-Vermögensprognose'
                  : isFR
                  ? 'Projection d\'épargne sur 5 ans'
                  : isIT
                  ? 'Proiezione di risparmio a 5 anni'
                  : '5-Year Compound Value'}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isTR
                ? `Bu iptaller sayesinde 5 yılda toplamda en az ${currentRegion.currencySymbol}${(
                    totalYearlySavings * 5
                  ).toFixed(2)} cebinizde kalacak.`
                : isDE
                ? `Durch diese Kündigungen sparen Sie in 5 Jahren insgesamt mindestens ${currentRegion.currencySymbol}${(
                    totalYearlySavings * 5
                  ).toFixed(2)} ein.`
                : isFR
                ? `Grâce à ces résiliations, vous conservez au moins ${currentRegion.currencySymbol}${(
                    totalYearlySavings * 5
                  ).toFixed(2)} sur 5 ans.`
                : isIT
                ? `Grazie a queste disdette risparmi almeno ${currentRegion.currencySymbol}${(
                    totalYearlySavings * 5
                  ).toFixed(2)} nei prossimi 5 anni.`
                : `By eliminating these recurring leaks, you preserve at least ${currentRegion.currencySymbol}${(
                    totalYearlySavings * 5
                  ).toFixed(2)} over 5 years.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
