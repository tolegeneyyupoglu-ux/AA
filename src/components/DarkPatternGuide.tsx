import React from 'react';
import { RegionConfig } from '../types';
import { ShieldCheck, Scale, AlertOctagon, HelpCircle, FileCheck, ExternalLink } from 'lucide-react';

interface DarkPatternGuideProps {
  currentRegion: RegionConfig;
  onOpenDispute: () => void;
}

export const DarkPatternGuide: React.FC<DarkPatternGuideProps> = ({
  currentRegion,
  onOpenDispute,
}) => {
  const isTR = currentRegion.code === 'TR';
  const isUS = currentRegion.code === 'US';
  const isUK = currentRegion.code === 'UK';
  const isDE = currentRegion.code === 'DE';
  const isFR = currentRegion.code === 'FR';
  const isIT = currentRegion.code === 'IT';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentRegion.legalAuthorityBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {isTR
                ? 'Tüketici Hakları & Abonelik İptal Hukuku'
                : isDE
                ? 'Verbraucherrechte & Kündigungsschutzgesetz'
                : isFR
                ? 'Droits du consommateur & Législation de résiliation'
                : isIT
                ? 'Diritti del Consumatore & Normativa Recesso'
                : `${currentRegion.name} Statutory Consumer Rights & Cancellation Law`}
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl">
              {isTR
                ? '6502 sayılı Kanun ve Tüketici Hakem Heyeti içtihatlarına göre şirketlerin uyguladığı tuzaklara karşı sahip olduğunuz yasal haklar.'
                : isDE
                ? 'Gesetzliche Bestimmungen (BGB, Kündigungsbutton-Gesetz) gegen Abo-Fallen und automatische Vertragsverlängerungen.'
                : isFR
                ? 'Dispositions légales (Loi Hamon, résiliation en 3 clics) contre les renouvellements tacites et clauses abusives.'
                : isIT
                ? 'Tutele normative (Codice del Consumo, Legge Bersani) contro rinnovi automatici e penali ingiustificate.'
                : 'Key statutory consumer protection laws, chargeback rights, and cancellation rules protecting consumers against deceptive recurring billing.'}
            </p>
          </div>

          <button
            onClick={onOpenDispute}
            className="shrink-0 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>
              {isTR
                ? 'Hakem Heyeti Dilekçesi Hazırla'
                : isDE
                ? 'Kündigungsschreiben erstellen'
                : isFR
                ? 'Rédiger une lettre de résiliation'
                : isIT
                ? 'Genera lettera di recesso'
                : 'Draft Statutory Dispute Letter'}
            </span>
          </button>
        </div>
      </div>

      {/* Region Specific Cards */}
      {isTR ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 14 Günlük Cayma Hakkı */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">14 Günlük Yasal Cayma Hakkı</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Mesafeli Sözleşmeler Yönetmeliği uyarınca, internet veya telefon üzerinden akdedilen tüm abonelik sözleşmelerinden{' '}
              <strong className="text-gray-900">14 gün içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin</strong> cayma
              hakkınız bulunmaktadır.
            </p>
          </div>

          {/* Card 2: Belirsiz Süreli Fesih Hakkı */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Aboneliği Dilediğiniz Zaman Feshetme Hakkı</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              6502 Sayılı Kanun Madde 52/4 gereğince; tüketici, belirsiz süreli veya süresi bir yıldan daha uzun olan belirli süreli
              abonelik sözleşmesini <strong className="text-gray-900">herhangi bir gerekçe göstermeksizin ve ceza ödemeksizin</strong>{' '}
              istediği zaman feshetme hakkına sahiptir.
            </p>
          </div>

          {/* Card 3: Spor Salonu ve Şube Zorlaması Tuzağı */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Haksız Şartlar & Şubeye Gitme Zorunluluğu</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              İnternet üzerinden kaydolmanıza izin veren bir şirketin, iptal için şubeye gitmeyi veya noter ihtarını zorunlu kılması
              "Tüketici Sözleşmelerindeki Haksız Şartlar Yönetmeliği" uyarınca{' '}
              <strong className="text-red-700">kesin olarak hükümsüzdür</strong>.
            </p>
          </div>

          {/* Card 4: TÜBİS e-Devlet Başvuru Yolu */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">TÜBİS e-Devlet Üzerinden Başvuru</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tüketici Hakem Heyeti başvuruları tamamen ücretsizdir. Uygulamamızdan üreteceğiniz resmi dilekçeyi e-Devlet{' '}
              <strong className="text-gray-900">Tüketici Bilgi Sistemi (TÜBİS)</strong> üzerinden 5 dakikada yükleyebilirsiniz. Kararlar mahkeme ilamı niteliğindedir.
            </p>
          </div>
        </div>
      ) : isDE ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: BGB § 312k Kündigungsbutton */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">BGB § 312k: Pflicht zum Kündigungsbutton</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Unternehmen müssen für online abschließbare Verträge einen leicht zugänglichen <strong className="text-gray-900">„Kündigungsbutton“</strong> bereitstellen. Fehlt dieser, können Verbraucher den Vertrag jederzeit fristlos kündigen.
            </p>
          </div>

          {/* Card 2: BGB § 309 Nr. 9 Faire Verträge */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">BGB § 309 Nr. 9: Gesetz für faire Verträge</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Nach Ablauf der Mindestlaufzeit dürfen sich Verträge nur noch auf unbestimmte Zeit verlängern. Verbraucher haben das Recht, <strong className="text-gray-900">jederzeit mit einer Frist von maximal 1 Monat</strong> zu kündigen.
            </p>
          </div>

          {/* Card 3: 14-Tage Widerrufsrecht */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">14 Tage Gesetzliches Widerrufsrecht (§ 355 BGB)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bei online oder telefonisch abgeschlossenen Abonnements besteht ein <strong className="text-gray-900">14-tägiges Widerrufsrecht ohne Angabe von Gründen</strong> mit vollem Erstattungsanspruch binnen 14 Tagen.
            </p>
          </div>

          {/* Card 4: SEPA-Rückbuchung & DSGVO */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">SEPA-Lastschrift Widerruf & DSGVO Art. 17</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Unberechtigte Lastschriften nach Kündigung können Sie bei Ihrer Bank bis zu <strong className="text-gray-900">8 Wochen</strong> (bei fehlendem Mandat bis 13 Monate) kostenfrei zurückbuchen lassen.
            </p>
          </div>
        </div>
      ) : isFR ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Résiliation en 3 clics */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Loi « Résiliation en 3 clics » (C. consom. L215-1-1)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tout professionnel permettant la souscription en ligne doit obligatoirement proposer un <strong className="text-gray-900">bouton de résiliation direct et gratuit</strong> accessible en 3 clics sans justification.
            </p>
          </div>

          {/* Card 2: Loi Hamon & Châtel */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Loi Hamon & Loi Châtel (Art. L215-1)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Après 1 an d’engagement, résiliez <strong className="text-gray-900">à tout moment sans frais ni pénalité</strong>. Le prestataire est tenu de vous rappeler la date limite de reconduction tacite.
            </p>
          </div>

          {/* Card 3: Rétractation 14 jours */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Droit de rétractation de 14 jours (L221-18)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Délai légal de <strong className="text-gray-900">14 jours francs</strong> pour annuler tout abonnement souscrit à distance, sans motif ni pénalités, avec remboursement intégral sous 14 jours.
            </p>
          </div>

          {/* Card 4: SignalConso & Chargeback */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">SignalConso (DGCCRF) & Rétrofacturation</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Signalez tout prélèvement abusif sur la plateforme officielle SignalConso et activez la procédure de <strong className="text-gray-900">Chargeback bancaire</strong> ou le rejet de prélèvement SEPA.
            </p>
          </div>
        </div>
      ) : isIT ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Diritto di Recesso 14 giorni */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Diritto di Recesso di 14 Giorni (Art. 52 Cod. Consumo)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Per tutti i contratti stipulati a distanza (online o via telefono) il consumatore ha diritto di recedere <strong className="text-gray-900">entro 14 giorni senza penali e senza dover fornire alcuna motivazione</strong>.
            </p>
          </div>

          {/* Card 2: Legge Bersani */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Legge Bersani (L. 40/2007) - Disdetta Libera</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Divieto di penali sproporzionate per il recesso anticipato da contratti di connettività, pay-tv e abbonamenti periodici con preavviso massimo di <strong className="text-gray-900">30 giorni</strong>.
            </p>
          </div>

          {/* Card 3: Ostacoli alla Disdetta */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Divieto di Pratiche Commerciali Scorrette (AGCM)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Obbligare il cliente a inviare raccomandate cartacee per recedere da un abbonamento sottoscritto online costituisce clausola vessatoria sanzionata dall'Autorità Garante della Concorrenza.
            </p>
          </div>

          {/* Card 4: ConciliaWeb & Storno SEPA */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">ConciliaWeb (AGCOM) & Storno Bancario</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Piattaforma telematica gratuita di conciliazione e possibilità di richiedere alla propria banca lo <strong className="text-gray-900">storno dell'addebito diretto SEPA entro 8 settimane</strong>.
            </p>
          </div>
        </div>
      ) : currentRegion.code === 'US' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: FTC Click-to-Cancel */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">FTC 2024 "Click-to-Cancel" Rule</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              The Federal Trade Commission (16 CFR Part 425) legally prohibits companies from creating complicated cancellation obstacles.
              If you signed up online, the merchant <strong className="text-gray-900">MUST provide a 1-click online cancellation method</strong>{' '}
              without forced phone calls or physical visits.
            </p>
          </div>

          {/* Card 2: FCBA & Bank Chargeback Rights */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Fair Credit Billing Act (FCBA)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Under 15 U.S.C. § 1666, recurring charges made after a cancellation request are classified as formal "Billing Errors".
              You have the right to file a dispute with your credit card issuing bank (Visa Reason Code 13.7 / Mastercard 4853).
            </p>
          </div>

          {/* Card 3: ROSCA Protection */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">ROSCA & Hidden Early Fee Penalties</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Restore Online Shoppers' Confidence Act (ROSCA) mandates that negative option features (like annual commitment discounts with
              huge early cancellation fees) must be clearly disclosed before obtaining billing information.
            </p>
          </div>

          {/* Card 4: CFPB & State AG Complaints */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Escalation to CFPB & State AG</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              If a merchant ignores your cancellation demand, lodging a complaint with the Consumer Financial Protection Bureau (CFPB) or
              your State Attorney General triggers mandatory investigation timelines.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Consumer Contracts Regs 2013 */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Statutory 14-Day Cooling-Off Period</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Under the Consumer Contracts Regulations 2013 (SI 2013/3134), UK consumers have an absolute statutory right to cancel any
              online or distance contract within 14 calendar days and receive a full refund within 14 days of notice.
            </p>
          </div>

          {/* Card 2: Consumer Rights Act 2015 */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Consumer Rights Act 2015 & CMA Guidance</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Terms that impose unfair obstacles to cancellation (such as excessive notice periods exceeding 30 days for rolling contracts or
              disproportionate termination charges) are legally non-binding under Part 2 of the CRA 2015.
            </p>
          </div>

          {/* Card 3: Direct Debit Guarantee */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Direct Debit Indemnity Scheme</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              If an error is made in the payment of your Direct Debit by the billing organization or your bank, you are entitled to a full
              and immediate refund of the amount paid from your bank under the UK Direct Debit Guarantee.
            </p>
          </div>

          {/* Card 4: TV Licence Exemption */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">TV Licence "No Licence Needed" Exemption</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              You only require a TV licence if you watch live broadcast television on any channel or use BBC iPlayer. If you only watch
              Netflix, YouTube, or gaming, you can submit an online declaration and claim a pro-rata refund for unused full quarters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
