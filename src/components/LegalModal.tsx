import React, { useState } from 'react';
import { RegionConfig } from '../types';
import { X, ShieldCheck, Mail, Scale, Lock, Info, CheckCircle2, Globe } from 'lucide-react';

export type LegalPageType = 'privacy' | 'terms' | 'about';

interface LegalModalProps {
  isOpen: boolean;
  initialPage?: LegalPageType;
  currentRegion: RegionConfig;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialPage = 'privacy',
  currentRegion,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalPageType>(initialPage);

  if (!isOpen) return null;

  const code = currentRegion.code;
  const isTR = code === 'TR';
  const isDE = code === 'DE';
  const isFR = code === 'FR';
  const isIT = code === 'IT';
  const isEN = code === 'US' || code === 'UK';

  // Language Key Helper
  const lang = isTR ? 'tr' : isDE ? 'de' : isFR ? 'fr' : isIT ? 'it' : 'en';

  const strings = {
    headerSubtitle: {
      tr: 'Tüketici Hakları, Yasal Güvenceler ve Şeffaflık Beyanları',
      de: 'Verbraucherrechte, AGB & Datenschutzkonformität (DSGVO)',
      fr: 'Droits des consommateurs, CGU & Conformité RGPD',
      it: 'Diritti dei consumatori, Termini & Conformità GDPR',
      en: 'Consumer Protection, Statutory Rights & Privacy Compliance',
    },
    tabs: {
      privacy: {
        tr: 'Gizlilik & KVKK / GDPR',
        de: 'Datenschutzerklärung (DSGVO)',
        fr: 'Politique de Confidentialité (RGPD)',
        it: 'Informativa Privacy (GDPR)',
        en: 'Privacy Policy (GDPR / CCPA)',
      },
      terms: {
        tr: 'Kullanım Koşulları & Yasal Dayanak',
        de: 'AGB & Verbraucherschutzrechte',
        fr: 'Conditions Générales & Droit Conso',
        it: 'Termini di Servizio & Normativa',
        en: 'Terms of Service & Statutory Rights',
      },
      about: {
        tr: 'Hakkımızda & İletişim',
        de: 'Über uns & Kontakt (Impressum)',
        fr: 'À propos & Contact',
        it: 'Chi siamo & Assistenza',
        en: 'About Us & Support Desk',
      },
    },
    privacy: {
      badgeTitle: {
        tr: 'Sıfır Veri Satışı & Tam GDPR / KVKK Güvencesi',
        de: '100% DSGVO-Konformität & Keine Weitergabe an Dritte',
        fr: 'Conformité RGPD intégrale & Zéro revente de données',
        it: 'Conformità GDPR e Tutela Assoluta dei Dati',
        en: 'Zero-Data-Broker Guarantee & Strict GDPR/CCPA Compliance',
      },
      badgeDesc: {
        tr: 'EndSub.online verilerinizi reklamverenlere satmaz veya profil oluşturmaz. Tüm işlemler 256-bit SSL şifreleme altındadır.',
        de: 'EndSub.online verkauft keine Daten an Werbetreibende. Sämtliche Kommunikation erfolgt über 256-Bit SSL/TLS-Verschlüsselung.',
        fr: 'EndSub.online ne vend aucune donnée à des annonceurs. Toutes les communications sont chiffrées de bout en bout en SSL 256 bits.',
        it: 'EndSub.online non vende i tuoi dati a inserzionisti. Tutte le comunicazioni sono protette da crittografia SSL a 256 bit.',
        en: 'EndSub.online never sells consumer data to third parties. All communication is protected with 256-bit TLS/SSL encryption.',
      },
      sec1Title: {
        tr: '1. Hangi Bilgileri Topluyoruz?',
        de: '1. Welche Daten erheben wir?',
        fr: '1. Données personnelles collectées',
        it: '1. Quali dati raccogliamo?',
        en: '1. Information We Collect',
      },
      sec1Desc: {
        tr: 'Yalnızca talep ettiğiniz iptal ve fesih işlemlerini resmi mercilere iletebilmek için zorunlu olan asgari bilgileri topluyoruz:',
        de: 'Wir erheben ausschließlich die zur rechtssicheren Kündigung erforderlichen Basisdaten:',
        fr: 'Nous collectons uniquement les informations strictement nécessaires à l\'exécution de vos démarches de résiliation :',
        it: 'Raccogliamo esclusivamente i dati strettamente necessari per inoltrare la richiesta di recesso contrattuale:',
        en: 'We only collect the minimal personal data necessary to execute your requested cancellation or dispute notices:',
      },
      sec1Items: {
        contact: {
          label: {
            tr: 'İletişim Bilgileri:',
            de: 'Kontaktdaten:',
            fr: 'Coordonnées :',
            it: 'Dati di contatto:',
            en: 'Contact Details:',
          },
          text: {
            tr: 'Ad, soyad, e-posta adresi, telefon numarası (onay ve SMS takibi için).',
            de: 'Vor- und Nachname, E-Mail-Adresse, Telefonnummer (zur Status- und Kündigungsbestätigung).',
            fr: 'Nom, prénom, adresse e-mail, numéro de téléphone (pour la confirmation et le suivi SMS).',
            it: 'Nome, cognome, indirizzo e-mail, numero di telefono (per notifiche e conferma recesso).',
            en: 'Full name, email address, phone number (for status confirmation and delivery verification).',
          },
        },
        contract: {
          label: {
            tr: 'Abonelik Tanımlayıcıları:',
            de: 'Vertragsdaten:',
            fr: 'Identifiants d\'abonnement :',
            it: 'Dati contrattuali:',
            en: 'Subscription Details:',
          },
          text: {
            tr: 'İlgili servise ait abone numarası, müşteri kodu veya kullanıcı adı.',
            de: 'Vertragsnummer, Kundennummer oder Benutzerkennung des jeweiligen Anbieters.',
            fr: 'Numéro d\'abonné, référence client ou identifiant associé au service concerné.',
            it: 'Codice cliente, numero di contratto o nome utente associato al servizio.',
            en: 'Subscriber ID, customer account number, or username associated with the provider.',
          },
        },
        payment: {
          label: {
            tr: 'Ödeme Güvenliği:',
            de: 'Zahlungssicherheit:',
            fr: 'Sécurité bancaire :',
            it: 'Sicurezza dei pagamenti:',
            en: 'Payment Security:',
          },
          text: {
            tr: 'Kredi kartı bilgileriniz sunucularımızda ASLA saklanmaz. Ödemeler PCI-DSS Seviye 1 sertifikalı global ödeme ağ geçitleri tarafından işlenir.',
            de: 'Kreditkartendaten werden NIEMALS auf unseren Servern gespeichert. Die Abwicklung erfolgt über PCI-DSS Level 1 zertifizierte Zahlungsanbieter.',
            fr: 'Vos numéros de carte ne sont JAMAIS stockés sur nos serveurs. Les transactions sont traitées par des passerelles certifiées PCI-DSS Niveau 1.',
            it: 'I dati della carta di credito NON vengono mai memorizzati sui nostri server. I pagamenti sono gestiti da circuiti certificati PCI-DSS Livello 1.',
            en: 'Payment card details are NEVER stored on our servers; transactions are processed directly by PCI-DSS Level 1 certified gateways.',
          },
        },
      },
      sec2Title: {
        tr: '2. Yasal Dayanak & Veri Saklama Süresi',
        de: '2. Rechtsgrundlage & Löschfristen',
        fr: '2. Base juridique & Durée de conservation',
        it: '2. Base giuridica & Periodo di conservazione',
        en: '2. Legal Basis & Data Retention',
      },
      sec2Desc: {
        tr: 'Verileriniz 6698 sayılı KVKK ve AB Genel Veri Koruma Tüzüğü (GDPR Madde 6/1-b - Sözleşmenin İfası) uyarınca işlenir. İptal talebiniz tamamlandıktan ve teyit iletildikten sonra talep formları 30 gün içinde sistemlerimizden kalıcı olarak temizlenir.',
        de: 'Die Datenverarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung. Nach erfolgreicher Kündigungszustellung und Ablauf der Nachweisfrist (30 Tage) werden personenbezogene Auftragsdaten automatisiert gelöscht.',
        fr: 'Le traitement des données est fondé sur l\'art. 6(1)(b) du RGPD (Exécution contractuelle). Après confirmation de la résiliation et expiration du délai de preuve (30 jours), les données du dossier sont définitivement purgées.',
        it: 'Il trattamento avviene ai sensi dell\'Art. 6(1)(b) del GDPR (Esecuzione del contratto). A seguito della conferma di recesso, i dati personali vengono eliminati definitivamente entro 30 giorni.',
        en: 'Data processing is conducted strictly under GDPR Art. 6(1)(b) (Performance of a Contract) and CCPA standards. Dispute drafts and concierge input are automatically purged after 30 days.',
      },
      sec3Title: {
        tr: '3. Kullanıcı Hakları (Unutulma Hakkı & Veri Talebi)',
        de: '3. Ihre Betroffenenrechte (Auskunft & Löschung)',
        fr: '3. Droits des utilisateurs (Droit à l\'oubli & Accès)',
        it: '3. Diritti dell\'interessato (Cancellazione & Accesso)',
        en: '3. Your Privacy Rights (Right to Erasure & Access)',
      },
      sec3Desc: {
        tr: 'Dilediğiniz an verilerinizin silinmesini, düzeltilmesini veya taşınmasını talep edebilirsiniz. Taleplerinizi ',
        de: 'Sie haben jederzeit das Recht auf Auskunft, Berichtigung oder Löschung gemäß Art. 15–17 DSGVO. Wenden Sie sich an ',
        fr: 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification et d\'effacement de vos données via ',
        it: 'Ai sensi del GDPR, hai il pieno diritto di richiedere l\'accesso, la rettifica o la cancellazione dei dati scrivendo a ',
        en: 'Under GDPR and CCPA, you retain full rights to access, rectify, or request the immediate deletion of your data at any time via ',
      },
    },
    terms: {
      badgeTitle: {
        tr: 'Tüketici Hakları & Yasal Bildirim Standardı',
        de: 'Rechtssicherheit & Gesetzliche Kündigungsfristen',
        fr: 'Cadre Juridique & Protection du Consommateur',
        it: 'Quadro Normativo & Diritto di Recesso',
        en: 'Statutory Consumer Protection & Regulatory Standards',
      },
      badgeDesc: {
        tr: 'EndSub.online, tüketicilere abonelik fesihlerinde yasal mevzuata tam uyumlu metin ve bildirim desteği sunar.',
        de: 'EndSub.online unterstützt Verbraucher bei der Wahrnehmung ihrer gesetzlichen Kündigungsrechte ohne unzulässige Hürden oder versteckte Verlängerungen.',
        fr: 'EndSub.online assiste les consommateurs pour exercer leur droit légal de résiliation sans subir de dark patterns ou de rétention abusive.',
        it: 'EndSub.online assiste i consumatori nell\'esercizio del diritto di recesso nel pieno rispetto delle normative vigenti.',
        en: 'EndSub.online assists consumers in exercising their statutory right to cancel without facing unlawful retention friction or hidden renewal barriers.',
      },
      sec1Title: {
        tr: '1. Yürürlükteki Tüketici Yasalarına Atıf',
        de: '1. Gesetzliche Kündigungsrechte & Rechtsgrundlagen',
        fr: '1. Textes de loi & Fondements juridiques régionaux',
        it: '1. Riferimenti normativi per Paese',
        en: '1. Regional Consumer Protection Statutes',
      },
      statutes: {
        de: {
          country: {
            tr: '🇩🇪 Almanya / AB:',
            de: '🇩🇪 Deutschland / EU:',
            fr: '🇩🇪 Allemagne / UE :',
            it: '🇩🇪 Germania / UE:',
            en: '🇩🇪 Germany / EU:',
          },
          body: {
            tr: 'BGB § 312k (İnternet aboneliklerinde zorunlu iptal butonu), BGB § 309 No. 9 (Aylık fesih hakkı tanımayan otomatik 1 yıllık uzatma yasağı) ve BGB § 355 (14 günlük yasal cayma hakkı).',
            de: 'BGB § 312k (Pflicht zum Kündigungsbutton), BGB § 309 Nr. 9 (Verbot automatischer 1-Jahres-Verlängerungen ohne monatliche Kündigungsoption) und BGB § 355 (14-Tage-Widerrufsrecht).',
            fr: 'BGB § 312k (Bouton de résiliation obligatoire en ligne), BGB § 309 n° 9 (Interdiction des renouvellements automatiques sans faculté de résiliation mensuelle) et BGB § 355 (Droit de rétractation de 14 jours).',
            it: 'BGB § 312k (Obbligo del pulsante di disdetta online), BGB § 309 n. 9 (Divieto di rinnovi taciti annuali senza opzione di disdetta mensile) e BGB § 355 (Diritto di recesso di 14 giorni).',
            en: 'BGB § 312k (Mandatory cancellation button requirement), BGB § 309 No. 9 (Prohibition of automatic 1-year contract lock-ins without monthly cancellation option), and BGB § 355 (14-day statutory withdrawal right).',
          },
        },
        fr: {
          country: {
            tr: '🇫🇷 Fransa:',
            de: '🇫🇷 Frankreich:',
            fr: '🇫🇷 France :',
            it: '🇫🇷 Francia:',
            en: '🇫🇷 France:',
          },
          body: {
            tr: 'Loi Hamon (Tüketici Kanunu Madde L215-1), Loi Châtel ve 2022-1158 Sayılı Kanun (İnternet üzerinden kurulan tüm sözleşmelerde \'3 Tıkla İptal\' zorunluluğu).',
            de: 'Code de la consommation Art. L215-1 (Loi Hamon & Loi Châtel) und Gesetz Nr. 2022-1158 (Verpflichtende 3-Klick-Kündigung für alle Online-Verträge).',
            fr: 'Code de la consommation Art. L215-1 (Loi Hamon & Loi Châtel) et Loi n° 2022-1158 (Résiliation en « 3 clics » obligatoire pour tout contrat souscrit en ligne).',
            it: 'Codice del consumo Art. L215-1 (Loi Hamon & Loi Châtel) e Legge n. 2022-1158 (Disdetta obbligatoria in 3 clic per contratti online).',
            en: 'Consumer Code Art. L215-1 (Loi Hamon & Loi Châtel), and Law No. 2022-1158 (Mandatory 3-click cancellation mechanism for all online consumer contracts).',
          },
        },
        it: {
          country: {
            tr: '🇮🇹 İtalya:',
            de: '🇮🇹 Italien:',
            fr: '🇮🇹 Italie :',
            it: '🇮🇹 Italia:',
            en: '🇮🇹 Italy:',
          },
          body: {
            tr: 'Tüketici Kanunu (Codice del Consumo D.Lgs. 206/2005), Bersani Kanunu (L. 40/2007 - Telekomünikasyon ve periyodik aboneliklerde cezasız fesih hakkı) ve AGCOM yönergeleri.',
            de: 'Codice del Consumo (GvD 206/2005), Bersani-Gesetz (L. 40/2007 - Gebührenfreie Kündigung für Telekommunikation und Abonnements) und AGCOM-Richtlinien.',
            fr: 'Code de la consommation (D.Lgs. 206/2005), Loi Bersani (L. 40/2007 - Résiliation sans pénalités pour les télécoms et abonnements) et directives AGCOM.',
            it: 'Codice del Consumo (D.Lgs. 206/2005), Legge Bersani (L. 40/2007 - Recesso e disdetta senza penali per servizi periodici e telecomunicazioni) e delibere AGCOM.',
            en: 'Consumer Code (D.Lgs. 206/2005), Bersani Law (L. 40/2007 - Fee-free early cancellation for periodic telecom and digital services), and AGCOM regulatory directives.',
          },
        },
        uk: {
          country: {
            tr: '🇬🇧 İngiltere:',
            de: '🇬🇧 Großbritannien:',
            fr: '🇬🇧 Royaume-Uni :',
            it: '🇬🇧 Regno Unito:',
            en: '🇬🇧 United Kingdom:',
          },
          body: {
            tr: 'Consumer Rights Act 2015, Consumer Contracts Regulations 2013 ve Digital Markets, Competition & Consumers Act (DMCC 2024 - kolay iptal ve otomatik yenileme hatırlatma zorunluluğu).',
            de: 'Consumer Rights Act 2015, Consumer Contracts Regulations 2013 und Digital Markets, Competition & Consumers Act (DMCC 2024 - vereinfachte Kündigungsrechte & Pflicht-Erinnerungen).',
            fr: 'Consumer Rights Act 2015, Consumer Contracts Regulations 2013 et Digital Markets, Competition & Consumers Act (DMCC 2024 - obligations de résiliation simplifiée).',
            it: 'Consumer Rights Act 2015, Consumer Contracts Regulations 2013 e Digital Markets, Competition & Consumers Act (DMCC 2024 - recesso semplificato obbligatorio).',
            en: 'Consumer Rights Act 2015, Consumer Contracts Regulations 2013, and the Digital Markets, Competition and Consumers Act (DMCC Act 2024 - mandatory straightforward cancellation and cooling-off reminder obligations).',
          },
        },
        us: {
          country: {
            tr: '🇺🇸 ABD (FTC & ROSCA):',
            de: '🇺🇸 Vereinigte Staaten (FTC & ROSCA):',
            fr: '🇺🇸 États-Unis (FTC & ROSCA) :',
            it: '🇺🇸 Stati Uniti (FTC & ROSCA):',
            en: '🇺🇸 United States (FTC & ROSCA):',
          },
          body: {
            tr: 'FTC \'Tıkla İptal Et\' Kuralı (16 CFR Part 425), Çevrimiçi Alışveriş Güven Yasası (ROSCA), California Otomatik Yenileme Yasası (ARL) ve FCBA (Adil Kredi Faturalandırma Yasası).',
            de: 'FTC \'Click to Cancel\' Vorschrift (16 CFR Part 425), ROSCA (Restore Online Shoppers\' Confidence Act), California ARL und Fair Credit Billing Act (FCBA).',
            fr: 'Règle « Click to Cancel » de la FTC (16 CFR Part 425), loi ROSCA, loi californienne sur le renouvellement automatique (ARL) et Fair Credit Billing Act (FCBA).',
            it: 'Regola FTC \'Click to Cancel\' (16 CFR Part 425), legge ROSCA, normativa rinnovi automatici della California (ARL) e Fair Credit Billing Act (FCBA).',
            en: 'FTC \'Click to Cancel\' Rule (16 CFR Part 425), Restore Online Shoppers\' Confidence Act (ROSCA), California Automatic Renewal Law (ARL), and the Fair Credit Billing Act (FCBA).',
          },
        },
        tr: {
          country: {
            tr: '🇹🇷 Türkiye:',
            de: '🇹🇷 Türkei:',
            fr: '🇹🇷 Turquie :',
            it: '🇹🇷 Turchia:',
            en: '🇹🇷 Turkey:',
          },
          body: {
            tr: '6502 Sayılı Tüketicinin Korunması Hakkında Kanun Madde 52/4 ("Tüketici, belirsiz süreli veya süresi bir yıldan daha uzun olan belirli süreli abonelik sözleşmesini herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin istediği zaman feshetme hakkına sahiptir.").',
            de: 'Gesetz Nr. 6502 zum Verbraucherschutz Art. 52/4 ("Verbraucher haben das Recht, unbefristete oder über 1 Jahr laufende Abonnementverträge jederzeit grundlos und ohne Vertragsstrafe zu kündigen.").',
            fr: 'Loi n° 6502 sur la protection des consommateurs, Art. 52/4 (« Le consommateur a le droit de résilier tout contrat d\'abonnement à durée indéterminée ou supérieure à un an, à tout moment, sans motif et sans pénalité financière »).',
            it: 'Legge n. 6502 sulla tutela dei consumatori, Art. 52/4 ("Il consumatore ha il diritto di recedere da contratti a tempo indeterminato o superiori a un anno in qualsiasi momento, senza obbligo di motivazione e senza penali.").',
            en: 'Law No. 6502 on the Protection of Consumers, Article 52/4 ("Consumers have the statutory right to terminate indefinite or fixed-term subscription contracts exceeding one year at any time without stating any reason and without paying any cancellation penalty.").',
          },
        },
      },
      sec2Title: {
        tr: '2. Hizmet Niteliği & Sorumluluk Sınırı',
        de: '2. Leistungsbeschreibung & Haftung',
        fr: '2. Nature du service & Limitation de responsabilité',
        it: '2. Oggetto del servizio & Clausola di esclusione della responsabilità',
        en: '2. Scope of Service & Legal Disclaimer',
      },
      sec2Desc: {
        tr: 'EndSub.online bir hukuk bürosu veya avukatlık ortaklığı değildir. Platformumuz tüketicilere mevzuata uygun dilekçe taslağı oluşturma, resmi fesih adımlarını rehberleme ve kullanıcı yetkilendirmesiyle fesih bildirimini iletme asistanlığı sunar. Servis sağlayıcının haksız cayma bedeli taleplerinde resmi Tüketici Hakem Heyetlerine başvuru adımları gösterilir.',
        de: 'EndSub.online ist keine Rechtsanwaltskanzlei. Unsere Plattform unterstützt Verbraucher mit standardisierten Musterschreiben, Schritt-für-Schritt-Anleitungen und einem optionalen Kündigungs-Concierge. Bei unberechtigten Gebührenforderungen werden die offiziellen Schlichtungs- und Rechtswege aufgezeigt.',
        fr: 'EndSub.online n\'est pas un cabinet d\'avocats. Notre plateforme met à disposition des modèles de courriers officiels, des guides de désabonnement et un service d\'assistance à la résiliation. En cas de frais injustifiés, les démarches auprès de la médiation de la consommation sont indiquées.',
        it: 'EndSub.online non è uno studio legale. La piattaforma fornisce modelli formali di disdetta, istruzioni guidate e un servizio di assistenza alla notifica del recesso. In caso di penali illegittime, vengono illustrati i passaggi per ricorrere agli organi di conciliazione competenti.',
        en: 'EndSub.online is an independent consumer empowerment platform and tech-enabled facilitation service, not a law firm. We assist users in generating statutory termination notices, navigating direct cancellation routes, and notifying service providers in accordance with consumer rights legislation.',
      },
    },
    about: {
      badgeTitle: {
        tr: 'EndSub.online: Tüketiciyi Koruyan Küresel İptal Ağı',
        de: 'EndSub.online: Globale Plattform für Verbraucherschutz & Abo-Kündigungen',
        fr: 'EndSub.online : Le Réseau Mondial de Libération des Abonnements',
        it: 'EndSub.online: La Rete Globale per la Tutela dei Consumatori',
        en: 'EndSub.online: The Global Consumer Subscription Freedom Platform',
      },
      badgeDesc: {
        tr: 'Misyonumuz: Şirketlerin kurduğu karanlık tasarım tuzaklarını (dark patterns), gizli taahhüt uzatmalarını ve karmaşık çağrı merkezi labirentlerini ortadan kaldırarak abonelik iptalini tek tıkla zahmetsiz hale getirmektir.',
        de: 'Unsere Mission: Wir beseitigen Abo-Fallen, automatische Vertragsverlängerungen und endlose Hotline-Warteschleifen, um Kündigungen so einfach wie den Vertragsabschluss zu machen.',
        fr: 'Notre mission : Éliminer les dark patterns, les renouvellements automatiques cachés et les labyrinthes de centres d\'appels pour rendre la résiliation aussi simple que l\'inscription.',
        it: 'La nostra missione: Abbattere i dark pattern, i rinnovi automatici nascosti e le attese ai call center per rendere la disdetta semplice e immediata.',
        en: 'Our mission is to dismantle dark patterns, hidden auto-renewals, and retention barriers, making cancellation as simple as signing up.',
      },
      supportDeskTitle: {
        tr: 'Müşteri Desteği & İletişim',
        de: 'Kundenservice & Support',
        fr: 'Support Client & Contact',
        it: 'Assistenza Clienti & Contatti',
        en: 'Customer Support Desk',
      },
      supportSla: {
        tr: '24 saat içinde yanıt garantisi:',
        de: 'Garantierte Rückmeldung binnen 24 Stunden:',
        fr: 'Réponse garantie sous 24h :',
        it: 'Risposta garantita entro 24 ore:',
        en: '24-hour response SLA:',
      },
      legalOfficeTitle: {
        tr: 'Veri Koruma & Hukuk Birimi',
        de: 'Datenschutz & Rechtsabteilung',
        fr: 'Protection des données & Juridique',
        it: 'Ufficio Privacy & Affari Legali',
        en: 'Privacy & Legal Office',
      },
      legalSla: {
        tr: 'KVKK / GDPR / CCPA talepleri:',
        de: 'DSGVO & Betroffenenanfragen:',
        fr: 'Demandes RGPD & Droit à l\'oubli :',
        it: 'Richieste GDPR & Privacy:',
        en: 'GDPR, CCPA & Consumer requests:',
      },
      standardsTitle: {
        tr: 'EndSub.online Faaliyet İlkeleri',
        de: 'EndSub Qualitäts- & Verbraucherstandards',
        fr: 'Nos Engagements & Standards de Service',
        it: 'Standard Operativi & Garanzie EndSub',
        en: 'EndSub Operational Standards & Commitments',
      },
      standard1: {
        tr: '1. Tüketiciden asla gizli abonelik ücreti alınmaz; tüm servisler şeffaf tek seferlik ödeme modelindedir.',
        de: '1. Keine wiederkehrenden Gebühren: Alle Services basieren ausschließlich auf transparenten Einmalzahlungen.',
        fr: '1. Aucun abonnement caché : Tous nos services d\'assistance reposent sur des tarifs forfaitaires uniques et transparents.',
        it: '1. Nessun costo ricorrente: tutti i servizi funzionano esclusivamente con pagamenti una tantum trasparenti.',
        en: '1. No recurring charges: All facilitation services operate strictly on transparent one-time fees.',
      },
      standard2: {
        tr: '2. İptal edilemeyen hiçbir işlem için ücret talep edilmez (%100 Başarı ya da Tam Para İadesi).',
        de: '2. 100% Erfolgs- oder Geld-zurück-Garantie auf alle VIP-Kündigungsaufträge.',
        fr: '2. Garantie 100% satisfaction ou remboursement intégral pour chaque prestation VIP.',
        it: '2. Risoluzione garantita al 100% o rimborso completo su tutti gli ordini VIP.',
        en: '2. 100% Guaranteed Resolution or Full Refund on all VIP concierge orders.',
      },
      standard3: {
        tr: '3. Tüm yasal hak arama dilekçeleri ve rehberler tüketici lehine ücretsiz sunulur.',
        de: '3. Alle gesetzlichen Kündigungsmuster und Schritt-für-Schritt-Anleitungen sind dauerhaft kostenlos nutzbar.',
        fr: '3. Tous les générateurs de courriers de litige et guides de résiliation sont mis à disposition gratuitement.',
        it: '3. Tutti i modelli di lettera e le guide pratiche di disdetta rimangono ad accesso libero e gratuito.',
        en: '3. All statutory dispute letter generators and direct cancellation guides remain free to the public.',
      },
    },
    closeBtn: {
      tr: 'Kapat',
      de: 'Schließen',
      fr: 'Fermer',
      it: 'Chiudi',
      en: 'Close',
    },
  };

  return (
    <div
      id="legal-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto overflow-x-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="legal-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-4 sm:my-6 transition-all flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                EndSub<span className="text-blue-400">.online</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                {currentRegion.flag} {currentRegion.name}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {strings.headerSubtitle[lang]}
            </p>
          </div>

          <button
            id="legal-modal-close-top"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50/80 px-4 sm:px-6 gap-2 overflow-x-auto">
          <button
            id="legal-tab-privacy"
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{strings.tabs.privacy[lang]}</span>
          </button>

          <button
            id="legal-tab-terms"
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'terms'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{strings.tabs.terms[lang]}</span>
          </button>

          <button
            id="legal-tab-about"
            onClick={() => setActiveTab('about')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>{strings.tabs.about[lang]}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-sm text-gray-700 leading-relaxed max-h-[60vh]">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">
                    {strings.privacy.badgeTitle[lang]}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    {strings.privacy.badgeDesc[lang]}
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="font-extrabold text-base text-gray-900">
                  {strings.privacy.sec1Title[lang]}
                </h3>
                <p>{strings.privacy.sec1Desc[lang]}</p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-600">
                  <li>
                    <strong>{strings.privacy.sec1Items.contact.label[lang]}</strong>{' '}
                    {strings.privacy.sec1Items.contact.text[lang]}
                  </li>
                  <li>
                    <strong>{strings.privacy.sec1Items.contract.label[lang]}</strong>{' '}
                    {strings.privacy.sec1Items.contract.text[lang]}
                  </li>
                  <li>
                    <strong>{strings.privacy.sec1Items.payment.label[lang]}</strong>{' '}
                    {strings.privacy.sec1Items.payment.text[lang]}
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-base text-gray-900">
                  {strings.privacy.sec2Title[lang]}
                </h3>
                <p>{strings.privacy.sec2Desc[lang]}</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-base text-gray-900">
                  {strings.privacy.sec3Title[lang]}
                </h3>
                <p>
                  {strings.privacy.sec3Desc[lang]}
                  <a href="mailto:privacy@endsub.online" className="text-blue-600 font-semibold underline">
                    privacy@endsub.online
                  </a>
                  .
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE & STATUTES */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-600" />
                  {strings.terms.badgeTitle[lang]}
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  {strings.terms.badgeDesc[lang]}
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="font-extrabold text-base text-gray-900">
                  {strings.terms.sec1Title[lang]}
                </h3>
                <div className="grid grid-cols-1 gap-2.5 text-xs text-gray-700">
                  {/* Germany / EU */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-bold text-gray-900">
                      {strings.terms.statutes.de.country[lang]}{' '}
                    </span>
                    <span>{strings.terms.statutes.de.body[lang]}</span>
                  </div>

                  {/* France */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-bold text-gray-900">
                      {strings.terms.statutes.fr.country[lang]}{' '}
                    </span>
                    <span>{strings.terms.statutes.fr.body[lang]}</span>
                  </div>

                  {/* Italy */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-bold text-gray-900">
                      {strings.terms.statutes.it.country[lang]}{' '}
                    </span>
                    <span>{strings.terms.statutes.it.body[lang]}</span>
                  </div>

                  {/* United Kingdom */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-bold text-gray-900">
                      {strings.terms.statutes.uk.country[lang]}{' '}
                    </span>
                    <span>{strings.terms.statutes.uk.body[lang]}</span>
                  </div>

                  {/* United States */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-bold text-gray-900">
                      {strings.terms.statutes.us.country[lang]}{' '}
                    </span>
                    <span>{strings.terms.statutes.us.body[lang]}</span>
                  </div>

                  {/* Turkey */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-bold text-gray-900">
                      {strings.terms.statutes.tr.country[lang]}{' '}
                    </span>
                    <span>{strings.terms.statutes.tr.body[lang]}</span>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-base text-gray-900">
                  {strings.terms.sec2Title[lang]}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {strings.terms.sec2Desc[lang]}
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: ABOUT & CONTACT */}
          {activeTab === 'about' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-blue-950">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  {strings.about.badgeTitle[lang]}
                </h4>
                <p className="text-xs text-blue-800">
                  {strings.about.badgeDesc[lang]}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>{strings.about.supportDeskTitle[lang]}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {strings.about.supportSla[lang]}
                  </p>
                  <a href="mailto:support@endsub.online" className="text-xs font-bold text-blue-600 underline block pt-1">
                    support@endsub.online
                  </a>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>{strings.about.legalOfficeTitle[lang]}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {strings.about.legalSla[lang]}
                  </p>
                  <a href="mailto:legal@endsub.online" className="text-xs font-bold text-blue-600 underline block pt-1">
                    legal@endsub.online
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 space-y-2 text-xs text-gray-600 bg-white">
                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{strings.about.standardsTitle[lang]}</span>
                </div>
                <p>{strings.about.standard1[lang]}</p>
                <p>{strings.about.standard2[lang]}</p>
                <p>{strings.about.standard3[lang]}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            EndSub.online • {currentRegion.name} ({currentRegion.code})
          </span>
          <button
            id="legal-modal-close-bottom"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {strings.closeBtn[lang]}
          </button>
        </div>
      </div>
    </div>
  );
};
