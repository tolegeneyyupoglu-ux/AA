import { DisputeFormData, RegionCode, RegionConfig } from '../types';

export const REGION_CONFIGS: Record<RegionCode, RegionConfig> = {
  TR: {
    code: 'TR',
    flag: '🇹🇷',
    name: 'Türkiye',
    brandName: 'EndSub',
    domainBadge: 'endsub.online',
    tagline: 'Aboneliklerinizi Zahmetsizce İptal Edin, Paranızı Geri Alın.',
    currency: 'TL (₺)',
    currencySymbol: '₺',
    currencyCode: 'TRY',
    disputeEngineTitle: 'Tüketici Hakem Heyeti İade Dilekçesi',
    disputeEngineSub: '6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca resmi cayma ve haksız tahsilat itiraz dilekçesi',
    legalAuthorityBadge: '6502 Sayılı Kanun & Mesafeli Sözleşmeler Yönetmeliği',
    defaultStatute: '6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği Md. 15',
    sampleAmounts: [149, 349, 1450, 2400],
    disputeReasons: [
      {
        id: 'auto_renewal_unauthorized',
        label: 'Bilgim / Onayım Dışında Otomatik Yenileme',
        legalClauseText:
          'Hizmet sağlayıcı, süresi biten aboneliği açık ve yazılı/elektronik teyidim olmaksızın otomatik olarak yenilemiş ve hesabımdan hukuka aykırı şekilde ücret tahsil etmiştir.',
      },
      {
        id: 'cancellation_ignored',
        label: 'İptal Talebime Rağmen Ücret Kesilmeye Devam Etti',
        legalClauseText:
          'Daha önce usulüne uygun olarak ilettiğim üyelik iptali talebine rağmen şirket iptal işlemini gerçekleştirmemiş ve haksız tahsilata devam etmiştir.',
      },
      {
        id: 'cooling_off_14days',
        label: '14 Günlük Yasal Cayma Hakkı Kullanımı',
        legalClauseText:
          'Mesafeli Sözleşmeler Yönetmeliği 9. ve 15. maddeleri gereğince sözleşmenin kurulduğu tarihten itibaren 14 (on dört) gün içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkımı kullanmaktayım.',
      },
      {
        id: 'dark_pattern_gym',
        label: 'İmkansız Kılınan İptal Prosedürü / Şube Zorlaması (Spor Salonu vb.)',
        legalClauseText:
          'Hizmete online veya mesafeli yöntemle üye olunmasına karşın iptal sürecinde haksız şartlar (fiziki şubeye gitme zorunluluğu, telefon labirentleri) dayatılarak cayma hakkının kullanımı haksız şekilde engellenmektedir.',
      },
      {
        id: 'service_unusable',
        label: 'Hizmetin Ayıplı / Kullanılamaz Olması',
        legalClauseText:
          'Taahhüt edilen hizmet kalitesi ve içeriği sağlanamamış olup 6502 sayılı Kanun kapsamında ayıplı hizmet nedeniyle sözleşmeden dönme ve bedel iadesi talep edilmektedir.',
      },
    ],
    letterTemplate: (data: DisputeFormData, config: RegionConfig): string => {
      const today = new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const selectedReason =
        config.disputeReasons.find((r) => r.id === data.disputeReasonId) ||
        config.disputeReasons[0];

      return `TÜKETİCİ HAKEM HEYETİ BAŞKANLIĞI'NA
(Veya İlgili Hizmet Sağlayıcı: ${data.companyName.toUpperCase()} MÜŞTERİ HİZMETLERİ VE HUKUK BİRİMİ'NE)

TARİH: ${today}

ŞİKAYET EDEN (TÜKETİCİ):
Adı Soyadı: ${data.fullName || '[ADINIZ SOYADINIZ]'}
İletişim / E-posta: ${data.accountEmail || '[E-POSTA ADRESİNİZ]'}
Adres / Telefon: ${data.userAddress || '[İKAMETGAH ADRESİNİZ / TELEFON NUMARANIZ]'}

ŞİKAYET EDİLEN (HİZMET SAĞLAYICI):
Firma Unvanı: ${data.companyName || '[HİZMET SAĞLAYICI FİRMA ADI]'}
Hesap / Müşteri No: ${data.referenceNumber || '[MÜŞTERİ / ABONELİK NUMARANIZ]'}

KONU: 6502 Sayılı Tüketicinin Korunması Hakkında Kanun Kapsamında Aboneliğin Feshi ve ${config.currencySymbol}${data.amountPaid || '0.00'} Tutarındaki Haksız Tahsilatın İadesi Talebidir.

AÇIKLAMALAR:
1. Şikayet edilen ${data.companyName || 'hizmet sağlayıcı'} nezdinde ${data.accountEmail || 'kayıtlı hesabım'} üzerinden abonelik hizmeti almış bulunmaktayım.
2. ${data.transactionDate ? data.transactionDate + ' tarihinde' : 'Son dönemde'} hesabımdan / kredi kartımdan bilgim, açık onayım veya sözleşmeye uygunluk hilafına ${config.currencySymbol}${data.amountPaid || '0.00'} tutarında mükerrer / haksız çekim gerçekleştirilmiştir.
3. İTİRAZ GEREKÇESİ: ${selectedReason.legalClauseText}
${data.customNotes ? `4. EK BİLGİ VE HUSUSLAR: ${data.customNotes}` : ''}

HUKUKİ DAYANAK:
- 6502 sayılı Tüketicinin Korunması Hakkında Kanun (Md. 5, Md. 13, Md. 52 Abonelik Sözleşmeleri)
- Mesafeli Sözleşmeler Yönetmeliği (Cayma Hakkı ve Bildirim Esasları)
- Tüketici Sözleşmelerindeki Haksız Şartlar Hakkında Yönetmelik

NETİCE VE TALEP:
Yukarıda arz ve izah edilen yasal gerekçeler muvacehesinde;
1. Şikayet olunan kurum nezdindeki aboneliğimin/üyeliğimin derhal ve hiçbir cezai şart yansıtılmaksızın FESHİNE,
2. Haksız olarak tahsil edilen ${config.currencySymbol}${data.amountPaid || '0.00'} bedelin kesinti yapılmaksızın ödeme yapılan banka hesabıma/kartıma yasal faiziyle birlikte DERHAL İADESİNE karar verilmesini saygılarımla arz ve talep ederim.

Tüketici (İmza):
${data.fullName || '[ADINIZ SOYADINIZ]'}`;
    },
  },

  US: {
    code: 'US',
    flag: '🇺🇸',
    name: 'United States',
    brandName: 'EndSub',
    domainBadge: 'endsub.online',
    tagline: 'Cancel Any Subscription Effortlessly & Save Money.',
    currency: 'USD ($)',
    currencySymbol: '$',
    currencyCode: 'USD',
    disputeEngineTitle: 'FTC / Bank Chargeback & Refund Demand Letter',
    disputeEngineSub: 'Statutory demand under the Fair Credit Billing Act (FCBA) & FTC Click-to-Cancel Rule (16 CFR Part 425)',
    legalAuthorityBadge: 'FTC Click-to-Cancel & Fair Credit Billing Act (FCBA)',
    defaultStatute: '15 U.S.C. § 1666 (FCBA) & FTC 16 CFR Part 425 Negative Option Rule',
    sampleAmounts: [15.49, 24.99, 54.99, 120.00],
    disputeReasons: [
      {
        id: 'ftc_click_to_cancel_violation',
        label: 'FTC "Click-to-Cancel" Violation (No Simple Online Cancellation)',
        legalClauseText:
          'Under the FTC Negative Option Rule (16 CFR Part 425), merchants who accept online signups are legally mandated to offer an equally accessible 1-click online cancellation mechanism without forced phone queues, in-person visits, or deceptive retention loops.',
      },
      {
        id: 'early_cancellation_fee_trap',
        label: 'Deceptive Early Termination Fee / Hidden Contract Trap',
        legalClauseText:
          'The subscription terms violated Restore Online Shoppers\' Confidence Act (ROSCA, 15 U.S.C. §§ 8401-8405) by failing to provide clear and conspicuous disclosure of automatic renewal terms and early termination penalties prior to purchase.',
      },
      {
        id: 'cancellation_ignored_billed',
        label: 'Subscription Cancelled but Charged Again (Billing Error)',
        legalClauseText:
          'I submitted a valid cancellation request prior to the billing cycle cutoff. Continued debit constitutes a formal Billing Error under the Fair Credit Billing Act (15 U.S.C. § 1666) and unauthorized electronic fund transfer under Regulation E (12 CFR Part 1005).',
      },
      {
        id: 'in_person_gym_barrier',
        label: 'Unreasonable Cancellation Barrier (In-Person / Certified Mail Only)',
        legalClauseText:
          'The vendor imposes onerous physical obstacles (mandatory certified mail or physical visits) designed specifically as a dark pattern to obstruct consumer statutory cancellation rights.',
      },
      {
        id: 'free_trial_trap',
        label: 'Deceptive Free Trial Auto-Conversion without Notice',
        legalClauseText:
          'The promotional trial was converted to a paid recurring tier without timely pre-billing notice or explicit consent, violating Section 5 of the Federal Trade Commission Act (15 U.S.C. § 45).',
      },
    ],
    letterTemplate: (data: DisputeFormData, config: RegionConfig): string => {
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const selectedReason =
        config.disputeReasons.find((r) => r.id === data.disputeReasonId) ||
        config.disputeReasons[0];

      return `FORMAL NOTICE OF DISPUTE, CANCELLATION & REFUND DEMAND
(Pursuant to the Fair Credit Billing Act 15 U.S.C. § 1666 & FTC Click-to-Cancel Regulations)

DATE: ${today}

TO:
Merchant: ${data.companyName.toUpperCase() || '[MERCHANT / COMPANY NAME]'}
Customer Billing & Legal Department
Attn: Card Issuing Bank Dispute Department / CFPB Consumer Records

FROM (CONSUMER):
Cardholder / Account Name: ${data.fullName || '[YOUR FULL NAME]'}
Account Email / Username: ${data.accountEmail || '[YOUR EMAIL ADDRESS]'}
Customer Reference / Order ID: ${data.referenceNumber || '[ACCOUNT ID / TRANSACTION ID]'}
Contact Phone / Address: ${data.userAddress || '[YOUR MAILING ADDRESS / PHONE]'}

RE: Billing Dispute & Immediate Demand for Refund of ${config.currencySymbol}${data.amountPaid || '0.00'} for Unauthorized / Disputed Recurring Charge

1. DISPUTED TRANSACTION DETAILS:
- Merchant Name: ${data.companyName || '[MERCHANT NAME]'}
- Disputed Amount: ${config.currencySymbol}${data.amountPaid || '0.00'}
- Transaction Date: ${data.transactionDate || '[DATE OF CHARGE]'}
- Account Identifier: ${data.accountEmail || data.referenceNumber || '[ACCOUNT IDENTIFIER]'}

2. FACTUAL BASIS & LEGAL GROUNDS:
I am writing to formally dispute the charge detailed above and demand the immediate, unconditional cancellation of any associated ongoing membership, subscription, or recurring payment profile.

${selectedReason.legalClauseText}
${data.customNotes ? `\nAdditional Case Notes: ${data.customNotes}` : ''}

3. STATUTORY NOTICE & COMPLIANCE:
- Fair Credit Billing Act (FCBA, 15 U.S.C. § 1666): Mandates investigation and reversal of unauthorized charges and uncorrected billing errors.
- FTC Negative Option Rule (16 CFR Part 425): Prohibits misrepresenting material terms and requires simple, click-to-cancel mechanisms equivalent to the sign-up process.
- Electronic Fund Transfer Act (EFTA, 15 U.S.C. § 1693e) & Regulation E: Preauthorized electronic fund transfers may be revoked at any time by the consumer.

4. DEMANDED ACTION:
I request that you:
a) Immediately process a full refund of ${config.currencySymbol}${data.amountPaid || '0.00'} to the original payment method.
b) Permanently terminate all active recurring billing, tokenized payment authorizations, and account renewals.
c) Provide written confirmation of account closure within three (3) business days.

Failing prompt resolution, this document serves as evidentiary documentation for an immediate formal Card Network Chargeback filing (Visa/Mastercard Reason Code 13.7 / 4853 - Cancelled Recurring Transaction) and complaints with the Federal Trade Commission (FTC) and Consumer Financial Protection Bureau (CFPB).

Sincerely,

${data.fullName || '[YOUR FULL NAME]'}
(Electronic Signature / Certified Record)`;
    },
  },

  UK: {
    code: 'UK',
    flag: '🇬🇧',
    name: 'United Kingdom',
    brandName: 'EndSub',
    domainBadge: 'endsub.online',
    tagline: 'Cancel Any Subscription Effortlessly & Save Money.',
    currency: 'GBP (£)',
    currencySymbol: '£',
    currencyCode: 'GBP',
    disputeEngineTitle: 'UK Statutory 14-Day Cooling-Off & Refund Request',
    disputeEngineSub: 'Formal statutory cancellation under the Consumer Contracts Regulations 2013 & Consumer Rights Act 2015',
    legalAuthorityBadge: 'Consumer Contracts Regs 2013 & Consumer Rights Act 2015',
    defaultStatute: 'Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 (SI 2013/3134)',
    sampleAmounts: [8.99, 14.12, 39.99, 85.00],
    disputeReasons: [
      {
        id: 'uk_cooling_off_14days',
        label: 'Statutory 14-Day Cooling-Off Period (Right to Cancel)',
        legalClauseText:
          'Under Regulation 29 & 30 of the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, I have the statutory right to cancel this distance contract within 14 days without giving any reason and receive a full refund within 14 days of notice.',
      },
      {
        id: 'unfair_contract_terms_cma',
        label: 'Unfair Contract Terms (Onerous Notice Period / Exit Penalty)',
        legalClauseText:
          'Under Part 2 of the Consumer Rights Act 2015 and CMA Guidance on Unfair Contract Terms (CMA37), terms imposing disproportionate cancellation notice periods, automatic rollover traps, or excessive termination fees are legally non-binding and unenforceable.',
      },
      {
        id: 'tv_licence_statutory_refund',
        label: 'TV Licence UK - No Licence Needed / Unused Months Refund',
        legalClauseText:
          'Under the Communications Act 2003 and TV Licensing refund policy, I declare that I do not watch live TV on any channel or use BBC iPlayer at this premises, and claim a statutory pro-rata refund for all unused quarterly license periods.',
      },
      {
        id: 'cancellation_already_given',
        label: 'Cancellation Notice Previously Served - Unauthorized Direct Debit',
        legalClauseText:
          'Notice of cancellation was previously served in accordance with the agreement. Continued debits violate the Direct Debit Guarantee and represent an unauthorized withdrawal subject to immediate indemnity claim through my UK bank.',
      },
      {
        id: 'service_not_as_described',
        label: 'Digital Content Not Conforming / Service Quality Failure',
        legalClauseText:
          'Under Section 49 & 56 of the Consumer Rights Act 2015, the service was not supplied with reasonable care and skill. I exercise my statutory right to price reduction and refund.',
      },
    ],
    letterTemplate: (data: DisputeFormData, config: RegionConfig): string => {
      const today = new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const selectedReason =
        config.disputeReasons.find((r) => r.id === data.disputeReasonId) ||
        config.disputeReasons[0];

      return `STATUTORY NOTICE OF CONTRACT CANCELLATION & REFUND CLAIM
(Pursuant to the Consumer Contracts Regulations 2013 & Consumer Rights Act 2015)

DATE: ${today}

TO:
${data.companyName.toUpperCase() || '[COMPANY / TRADER NAME]'}
Customer Relations & Cancellations Department
(Copy for Bank Direct Debit Indemnity / Section 75 Claims)

FROM (CONSUMER):
Full Name: ${data.fullName || '[YOUR FULL NAME]'}
Account Email: ${data.accountEmail || '[YOUR EMAIL ADDRESS]'}
Customer Reference / Account No: ${data.referenceNumber || '[CUSTOMER / ACCOUNT NO]'}
UK Address & Contact: ${data.userAddress || '[YOUR UK POSTAL ADDRESS / CONTACT NUMBER]'}

SUBJECT: Formal Cancellation of Contract and Demand for Refund of ${config.currencySymbol}${data.amountPaid || '0.00'}

Dear Sir / Madam,

1. CONTRACT DETAILS:
- Service / Membership: ${data.companyName || '[SERVICE NAME]'}
- Account / Reference: ${data.accountEmail || data.referenceNumber || '[ACCOUNT REFERENCE]'}
- Transaction Amount Disputed: ${config.currencySymbol}${data.amountPaid || '0.00'}
- Date of Transaction: ${data.transactionDate || '[DATE OF CHARGE]'}

2. STATUTORY GROUNDS FOR CANCELLATION & REFUND:
I hereby give notice that I cancel my contract for the supply of the aforementioned service and request a full refund of all amounts debited.

${selectedReason.legalClauseText}
${data.customNotes ? `\nAdditional Information: ${data.customNotes}` : ''}

3. LEGAL STATUTES RELIED UPON:
- Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 (SI 2013/3134)
- Consumer Rights Act 2015 (Part 2 Unfair Terms & Sections 49-56 Supply of Services)
- The Direct Debit Guarantee Scheme / UK Chargeback Rules (where applicable)

4. REQUIRED ACTIONS:
Please confirm in writing within 14 days that:
a) This contract and any linked direct debit / continuous payment authority (CPA) have been terminated.
b) The refund amount of ${config.currencySymbol}${data.amountPaid || '0.00'} has been remitted to my original payment source.

If this matter is not resolved satisfactorily within statutory timeframes, I will escalate this claim directly to my bank via the Direct Debit Indemnity / Card Chargeback scheme, and report this conduct to Trading Standards and the Competition and Markets Authority (CMA).

Yours faithfully,

${data.fullName || '[YOUR FULL NAME]'}`;
    },
  },

  DE: {
    code: 'DE',
    flag: '🇩🇪',
    name: 'Deutschland',
    brandName: 'EndSub',
    domainBadge: 'endsub.online',
    tagline: 'Abonnements mühelos kündigen & Geld sparen.',
    currency: 'EUR (€)',
    currencySymbol: '€',
    currencyCode: 'EUR',
    disputeEngineTitle: 'Rechtsverbindliches Kündigungsschreiben',
    disputeEngineSub: 'Offizielle Kündigungserklärung und Erstattungsforderung nach BGB § 312k, BGB § 309 Nr. 9 und DSGVO',
    legalAuthorityBadge: 'BGB § 312k (Kündigungsbutton) & DSGVO',
    defaultStatute: 'BGB § 312k (Kündigung von Verträgen im elektronischen Geschäftsverkehr) & BGB § 309 Nr. 9',
    sampleAmounts: [9.98, 24.90, 34.99, 89.00],
    disputeReasons: [
      {
        id: 'bgb_kuendigungsbutton_fehlend',
        label: 'Fehlender / Versteckter Kündigungsbutton (Verstoß gegen BGB § 312k)',
        legalClauseText:
          'Gemäß § 312k Abs. 1 und Abs. 2 BGB sind Unternehmer verpflichtet, Verbrauchern im elektronischen Geschäftsverkehr eine ständige, gut lesbare und unmittelbar erreichbare Kündigungsschaltfläche zur Verfügung zu stellen. Da diese gesetzliche Vorgabe nicht erfüllt wurde, kündige ich den Vertrag hiermit jederzeit und fristlos gemäß § 312k Abs. 6 BGB.',
      },
      {
        id: 'unberechtigte_automatische_verlaengerung',
        label: 'Unwirksame automatische Verlängerung (BGB § 309 Nr. 9 n.F.)',
        legalClauseText:
          'Nach Ablauf der Erstvertragslaufzeit ist eine stillschweigende Vertragsverlängerung um mehr als einen Monat unzulässig (§ 309 Nr. 9 lit. b BGB). Der Vertrag kann jederzeit mit einer Frist von höchstens einem Monat gekündigt werden. Weitergehende Abbuchungen sind rechtswidrig und zu erstatten.',
      },
      {
        id: 'widerrufsrecht_14tage',
        label: '14-tägiges gesetzliches Widerrufsrecht (§ 355 / § 356 BGB)',
        legalClauseText:
          'Hiermit widerrufe ich den von mir geschlossenen Fernabsatzvertrag fristgerecht innerhalb der 14-tägigen gesetzlichen Frist gemäß § 355 BGB i.V.m. § 356 BGB. Ich fordere die unverzügliche und vollständige Rückzahlung aller geleisteten Beträge ohne Abzüge.',
      },
      {
        id: 'fitnessstudio_erschwernis',
        label: 'Unzulässige Kündigungserschwernisse (Fitnessstudio / Vor-Ort-Zwang)',
        legalClauseText:
          'Vertragsklauseln, die eine Kündigung ausschließlich vor Ort oder per Einschreiben vorschreiben, obwohl der Vertrag online geschlossen werden konnte, verstoßen gegen § 307 BGB und sind unwirksam. Die Kündigung in Textform ist rechtswirksam zugegangen.',
      },
      {
        id: 'mangelhafte_leistung',
        label: 'Außerordentliche fristlose Kündigung aus wichtigem Grund (§ 314 BGB)',
        legalClauseText:
          'Aufgrund erheblicher Pflichtverletzungen bzw. Nichterbringung der geschuldeten Leistung kündige ich das Vertragsverhältnis hiermit außerordentlich und fristlos aus wichtigem Grund gemäß § 314 BGB unter Vorbehalt von Schadensersatzansprüchen.',
      },
    ],
    letterTemplate: (data: DisputeFormData, config: RegionConfig): string => {
      const today = new Date().toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const selectedReason =
        config.disputeReasons.find((r) => r.id === data.disputeReasonId) ||
        config.disputeReasons[0];

      return `RECHTSVERBINDLICHE KÜNDIGUNGSERKLÄRUNG UND RÜCKFORDERUNG
(Gemäß BGB § 312k, BGB § 309 Nr. 9 & DSGVO)

DATUM: ${today}

EMPFÄNGER:
${data.companyName.toUpperCase() || '[UNTERNEHMEN / VERTRAGSPARTNER]'}
Kundenservice / Rechtsabteilung
(Kopie für Zahlungsdienstleister / SEPA-Lastschrift-Rückbuchung)

ABSENDER (VERBRAUCHER):
Vollständiger Name: ${data.fullName || '[VORNAME NACHNAME]'}
E-Mail-Adresse: ${data.accountEmail || '[IHRE E-MAIL-ADRESSE]'}
Kundennummer / Vertragsnummer: ${data.referenceNumber || '[KUNDEN- / VERTRAGSNUMMER]'}
Anschrift: ${data.userAddress || '[STRASSE, HAUSNUMMER, PLZ, ORT]'}
Telefon: ${data.userPhone || '[TELEFONNUMMER]'}

BETREFF: Fristlose / ordentliche Kündigung des Vertragsverhältnisses und Aufforderung zur Rückerstattung von ${config.currencySymbol}${data.amountPaid || '0.00'}

Sehr geehrte Damen und Herren,

hiermit kündige ich den mit Ihnen bestehenden Vertrag / das Abonnement für ${data.companyName || '[LEISTUNG]'} mit sofortiger Wirkung, hilfsweise zum nächstmöglichen Zeitpunkt.

1. VERTRAGSDATEN:
- Kunden-/Vertragsnummer: ${data.referenceNumber || data.accountEmail || '[ANGABE]'}
- Beanstandeter Betrag: ${config.currencySymbol}${data.amountPaid || '0.00'}
- Buchungsdatum: ${data.transactionDate || '[DATUM]'}

2. RECHTLICHE BEGRÜNDUNG:
${selectedReason.legalClauseText}
${data.customNotes ? `\nZusätzliche Sachverhaltsangaben: ${data.customNotes}` : ''}

3. RECHTSGRUNDLAGEN:
- Bürgerliches Gesetzbuch (BGB) § 312k (Kündigung von Verträgen im elektronischen Geschäftsverkehr)
- BGB § 309 Nr. 9 (Verbot automatischer Verlängerung über 1 Monat nach Erstlaufzeit)
- BGB § 355 / § 356 (Widerrufsrecht bei Fernabsatzverträgen)
- Art. 17 DSGVO (Recht auf Löschung personenbezogener Daten nach Abwicklung)

4. FORDERUNGEN:
a) Bestätigen Sie mir die Kündigung und das Beendigungsdatum schriftlich oder per E-Mail innerhalb von 7 Werktagen.
b) Erstatten Sie den unberechtigt eingezogenen Betrag in Höhe von ${config.currencySymbol}${data.amountPaid || '0.00'} unverzüglich auf das ursprüngliche Zahlungsmittel zurück.
c) Widerruf des SEPA-Lastschriftmandats: Mit Wirksamwerden der Kündigung erlischt jede Ermächtigung zum Einzug von Forderungen von meinem Bankkonto.

Sollte keine fristgerechte Bestätigung erfolgen, werde ich eine SEPA-Rücklastschrift einleiten sowie eine Meldung an die zuständige Verbraucherzentrale und die Bundesnetzagentur veranlassen.

Mit freundlichen Grüßen

${data.fullName || '[VORNAME NACHNAME]'}`;
    },
  },

  FR: {
    code: 'FR',
    flag: '🇫🇷',
    name: 'France',
    brandName: 'EndSub',
    domainBadge: 'endsub.online',
    tagline: 'Résiliez vos abonnements en toute simplicité et économisez.',
    currency: 'EUR (€)',
    currencySymbol: '€',
    currencyCode: 'EUR',
    disputeEngineTitle: 'Lettre de Résiliation Formelle',
    disputeEngineSub: 'Demande officielle de résiliation et de remboursement selon la Loi Hamon, la Loi Châtel et la Loi n° 2022-1158 (3 clics)',
    legalAuthorityBadge: 'Loi Hamon & Loi Châtel (Code de la consommation)',
    defaultStatute: 'Loi Hamon (Art. L. 215-1 & L. 221-18 du Code de la consommation) & Loi n° 2022-1158 (Résiliation en 3 clics)',
    sampleAmounts: [11.99, 22.99, 29.99, 80.00],
    disputeReasons: [
      {
        id: 'loi_3_clics_non_respectee',
        label: 'Non-respect de la résiliation en 3 clics (Loi n° 2022-1158)',
        legalClauseText:
          'Conformément à la Loi n° 2022-1158 et à l\'article L. 215-1-1 du Code de la consommation, les professionnels offrant la souscription en ligne sont tenus de mettre à disposition une fonctionnalité gratuite et directe de résiliation en 3 clics. Tout obstacle imposé est illégal.',
      },
      {
        id: 'loi_chatel_non_information',
        label: 'Absence d\'avis d\'échéance / Reconduction tacite (Loi Châtel - Art. L. 215-1)',
        legalClauseText:
          'Conformément à l\'article L. 215-1 du Code de la consommation (Loi Châtel), le professionnel n\'ayant pas informé le consommateur par écrit de la faculté de ne pas reconduire le contrat dans les délais prescrits, le contrat peut être résilié à tout moment sans frais ni pénalités.',
      },
      {
        id: 'retractation_14_jours',
        label: 'Droit de rétractation légal de 14 jours (Art. L. 221-18)',
        legalClauseText:
          'En application des articles L. 221-18 et suivants du Code de la consommation, j\'exerce mon droit légal de rétractation dans le délai de 14 jours francs suivant la souscription du contrat à distance, sans motif ni pénalités, et demande le remboursement intégral des sommes versées.',
      },
      {
        id: 'loi_hamon_apres_un_an',
        label: 'Résiliation sans frais après 1 an d\'engagement (Loi Hamon)',
        legalClauseText:
          'En vertu des dispositions de la Loi Hamon (article L. 224-42 du Code de la consommation), ayant dépassé la première année d\'engagement, je demande la résiliation immédiate et sans frais de mon contrat d\'abonnement avec un préavis légal.',
      },
      {
        id: 'resiliation_motif_legitime',
        label: 'Résiliation pour motif légitime ou manquement contractuel grave',
        legalClauseText:
          'En raison d\'un manquement caractérisé du fournisseur aux obligations contractuelles de service (art. 1217 du Code civil), je sollicite la résiliation de plein droit du contrat et la restitution des sommes indûment perçues.',
      },
    ],
    letterTemplate: (data: DisputeFormData, config: RegionConfig): string => {
      const today = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const selectedReason =
        config.disputeReasons.find((r) => r.id === data.disputeReasonId) ||
        config.disputeReasons[0];

      return `LETTRE FORMELLE DE RÉSILIATION ET DEMANDE DE REMBOURSEMENT
(En application de la Loi Hamon, Loi Châtel & Code de la consommation)

DATE : ${today}

DESTINATAIRE :
${data.companyName.toUpperCase() || '[NOM DE L’ENTREPRISE / SERVICE CLIENT]'}
Service Résiliation & Contentieux
(Copie pour contestation bancaire / Répression des fraudes DGCCRF)

EXPÉDITEUR (CONSOMMATEUR) :
Nom & Prénom : ${data.fullName || '[VOTRE NOM ET PRÉNOM]'}
Adresse e-mail : ${data.accountEmail || '[VOTRE ADRESSE E-MAIL]'}
Numéro d'abonné / Référence : ${data.referenceNumber || '[NUMÉRO DE CLIENT / CONTRAT]'}
Adresse postale : ${data.userAddress || '[VOTRE ADRESSE POSTALE]'}
Téléphone : ${data.userPhone || '[VOTRE NUMÉRO DE TÉLÉPHONE]'}

OBJET : Notification de résiliation de l'abonnement et mise en demeure de remboursement de ${config.currencySymbol}${data.amountPaid || '0.00'}

Madame, Monsieur,

Par la présente, je vous notifie formellement ma décision de résilier mon contrat d'abonnement souscrit auprès de vos services pour ${data.companyName || '[NOM DU SERVICE]'}.

1. DÉTAILS DE L'ABONNEMENT :
- Référence client : ${data.referenceNumber || data.accountEmail || '[RÉFÉRENCE]'}
- Montant contesté / prélevé : ${config.currencySymbol}${data.amountPaid || '0.00'}
- Date du prélèvement : ${data.transactionDate || '[DATE DU PRÉLÈVEMENT]'}

2. MOTIF LÉGAL DE LA RÉSILIATION :
${selectedReason.legalClauseText}
${data.customNotes ? `\nInformations complémentaires : ${data.customNotes}` : ''}

3. FONDEMENTS JURIDIQUES :
- Loi n° 2022-1158 & Article L. 215-1-1 du Code de la consommation (« Résiliation en 3 clics »)
- Loi Châtel (Article L. 215-1 du Code de la consommation)
- Loi Hamon (Résiliation infra-annuelle sans pénalités)
- Règlement Général sur la Protection des Données (RGPD - Art. 17 Droit à l'effacement)

4. DEMANDES :
Je vous mets en demeure de :
a) Prendre acte de la résiliation immédiate de mon contrat et de m'en délivrer confirmation écrite sous 8 jours ouvrés.
b) Procéder au remboursement intégral de la somme de ${config.currencySymbol}${data.amountPaid || '0.00'} indûment prélevée.
c) Révoquer toute autorisation de prélèvement bancaire SEPA associée à mon compte.

À défaut de règlement amiable dans les délais légaux, je transmettrai ce dossier à la DGCCRF (SignalConso) et formerai une demande de rejet de prélèvement auprès de mon établissement bancaire.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${data.fullName || '[VOTRE NOM ET PRÉNOM]'}`;
    },
  },

  IT: {
    code: 'IT',
    flag: '🇮🇹',
    name: 'Italia',
    brandName: 'EndSub',
    domainBadge: 'endsub.online',
    tagline: 'Disdici qualsiasi abbonamento facilmente e risparmia.',
    currency: 'EUR (€)',
    currencySymbol: '€',
    currencyCode: 'EUR',
    disputeEngineTitle: 'Lettera Formale di Disdetta / Recesso',
    disputeEngineSub: 'Modulo formale di disdetta e richiesta di rimborso conforme al Codice del Consumo e alla Legge Bersani',
    legalAuthorityBadge: 'Codice del Consumo (Art. 52) & Legge Bersani',
    defaultStatute: 'Art. 52 e ss. D.Lgs. 206/2005 (Codice del Consumo) & Legge Bersani n. 40/2007 (Delibera AGCOM)',
    sampleAmounts: [9.99, 19.90, 29.90, 80.00],
    disputeReasons: [
      {
        id: 'diritto_di_recesso_14gg',
        label: 'Diritto di recesso entro 14 giorni (Art. 52 Codice del Consumo)',
        legalClauseText:
          'Ai sensi dell\'art. 52 del D.Lgs. 206/2005 (Codice del Consumo), esercito il diritto di recesso dal contratto stipulato a distanza entro 14 giorni dalla conclusione, senza alcuna penalità e richiedendo il rimborso integrale delle somme versate.',
      },
      {
        id: 'legge_bersani_disdetta_senza_penali',
        label: 'Disdetta senza penali né costi ingiustificati (Legge Bersani n. 40/2007)',
        legalClauseText:
          'In conformità alla Legge Bersani (L. 40/2007) e alle delibere AGCOM, i contratti di servizi per adesione possono essere disdetti in qualsiasi momento senza penali né costi di disattivazione non giustificati da reali spese tecniche.',
      },
      {
        id: 'mancata_esecuzione_disdetta_pregressa',
        label: 'Addebito successivo a regolare richiesta di disdetta',
        legalClauseText:
          'Nonostante la formale comunicazione di recesso/disdetta precedentemente inviata, la società ha proseguito con addebiti indebiti sul metodo di pagamento, integrando un illecito contrattuale e violazione degli obblighi di correttezza.',
      },
      {
        id: 'clausole_vessatorie_palestra',
        label: 'Clausole vessatorie e ostacoli procedurali (Art. 33 Codice del Consumo)',
        legalClauseText:
          'Le clausole contrattuali che impongono procedure di disdetta eccessivamente onerose o presenza fisica in sede integrano clausole vessatorie nulle ai sensi dell\'art. 36 del Codice del Consumo.',
      },
      {
        id: 'inadempimento_contrattuale_servizio',
        label: 'Risoluzione per grave inadempimento contrattuale (Art. 1453 c.c.)',
        legalClauseText:
          'A causa della grave e reiterata inadempienza o discontinuità del servizio fornito, intendo risolvere con effetto immediato il contratto ai sensi dell\'art. 1453 c.c. con restituzione del canone non goduto.',
      },
    ],
    letterTemplate: (data: DisputeFormData, config: RegionConfig): string => {
      const today = new Date().toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const selectedReason =
        config.disputeReasons.find((r) => r.id === data.disputeReasonId) ||
        config.disputeReasons[0];

      return `LETTERA FORMALE DI DISDETTA / RECESSO E RICHIESTA DI RIMBORSO
(Ai sensi del D.Lgs. 206/2005 - Codice del Consumo e Legge Bersani n. 40/2007)

DATA: ${today}

SPETTABILE:
${data.companyName.toUpperCase() || '[NOME SOCIETÀ / SERVIZIO CLIENTI]'}
Ufficio Gestione Contratti, Disdette e Reclami
(Trasmessa via PEC / Raccomandata A/R / Canali Ufficiali di Assistenza)

DA (CONSUMATORE):
Nome e Cognome: ${data.fullName || '[NOME E COGNOME]'}
Codice Fiscale / Rif. Cliente: ${data.referenceNumber || '[CODICE FISCALE / CODICE CLIENTE]'}
Email / PEC: ${data.accountEmail || '[INDIRIZZO EMAIL / PEC]'}
Indirizzo di Residenza: ${data.userAddress || '[INDIRIZZO, CAP, CITTÀ]'}
Telefono: ${data.userPhone || '[NUMERO DI TELEFONO]'}

OGGETTO: Formale disdetta/recesso dal contratto di abbonamento e diffida per rimborso di ${config.currencySymbol}${data.amountPaid || '0.00'}

Il/La sottoscritto/a comunica formale disdetta e recesso immediato dal contratto di abbonamento relativo al servizio ${data.companyName || '[NOME SERVIZIO]'}.

1. RIFERIMENTI DELL'ABBONAMENTO:
- Codice Cliente / Account: ${data.referenceNumber || data.accountEmail || '[IDENTIFICATIVO]'}
- Importo addebitato contestato: ${config.currencySymbol}${data.amountPaid || '0.00'}
- Data operazione di addebito: ${data.transactionDate || '[DATA ADDEBITO]'}

2. MOTIVAZIONE GIURIDICA:
${selectedReason.legalClauseText}
${data.customNotes ? `\nUlteriori note e circostanze: ${data.customNotes}` : ''}

3. NORMATIVA DI RIFERIMENTO:
- D.Lgs. 6 settembre 2005, n. 206 (Codice del Consumo - Diritto di Recesso e Clausole Vessatorie)
- Legge 2 aprile 2007, n. 40 (Legge Bersani - Disdetta contratti senza penali)
- Regolamento UE 2016/679 (GDPR - Diritto alla cancellazione dei dati)

4. RICHIESTE:
Si richiede espressamente di:
a) Confermare per iscritto l'avvenuta chiusura e cessazione del rapporto contrattuale entro 7 giorni.
b) Accreditare l'importo indebitamente percepito di ${config.currencySymbol}${data.amountPaid || '0.00'} sullo stesso mezzo di pagamento utilizzato per l'addebito.
c) Revocare con effetto immediato ogni mandato di addebito diretto SEPA (SDD) associato al conto corrente o carta di pagamento.

In difetto di riscontro positivo entro i termini di legge, la presente costituirà base probatoria per il formale disconoscimento bancario (Chargeback), ricorso tramite piattaforma ConciliaWeb (AGCOM) e segnalazione all'Autorità Garante della Concorrenza e del Mercato (AGCM).

Distinti saluti,

${data.fullName || '[NOME E COGNOME]'}`;
    },
  },
};
