export function renderIf(label, value) {
  if (!value) return "";
  return `<p><strong>${label}:</strong> ${value}</p>`;
}
export function getPaymentMethodName(code) {
  const methods = {
    "1": "Instrument nicht definiert",
    "2": "Automatisches Clearinghaus-Gutschrift",
    "3": "Automatisches Clearinghaus-Lastschrift",
    "4": "Rückbuchung einer ACH-Lastschrift auf ein Sichtkonto",
    "5": "Rückbuchung einer ACH-Gutschrift auf ein Sichtkonto",
    "6": "ACH-Sichtgutschrift",
    "7": "ACH-Sichtlastschrift",
    "8": "Zurückhalten",
    "9": "Nationale oder regionale Abwicklung",
    "10": "Barzahlung",
    "11": "Rückbuchung einer ACH-Gutschrift auf ein Sparkonto",
    "12": "Rückbuchung einer ACH-Lastschrift auf ein Sparkonto",
    "13": "ACH-Spargutschrift",
    "14": "ACH-Sparlastschrift",
    "15": "Hausgutschrift (Buchungsgutschrift)",
    "16": "Hauslastschrift (Buchungslastschrift)",
    "17": "ACH-Sichtgutschrift (CCD-Format)",
    "18": "ACH-Sichtlastschrift (CCD-Format)",
    "19": "ACH-Sichtgutschrift (CTP-Format)",
    "20": "Scheck",
    "21": "Bankbestätigter Wechsel",
    "22": "Beglaubigter Bankwechsel",
    "23": "Bankscheck (ausgestellt von einem Finanzinstitut)",
    "24": "Wechsel wartet auf Annahme",
    "25": "Beglaubigter Scheck",
    "26": "Lokaler Scheck",
    "27": "ACH-Sichtlastschrift (CTP-Format)",
    "28": "ACH-Sichtgutschrift (CTX-Format)",
    "29": "ACH-Sichtlastschrift (CTX-Format)",
    "30": "Überweisung",
    "31": "Lastschriftübertragung",
    "32": "ACH-Sichtgutschrift (CCD+ Format)",
    "33": "ACH-Sichtlastschrift (CCD+ Format)",
    "34": "ACH-vorausvereinbarte Zahlung und Einzahlung (PPD)",
    "35": "ACH-Spargutschrift (CCD Format)",
    "36": "ACH-Sparlastschrift (CCD Format)",
    "37": "ACH-Spargutschrift (CTP Format)",
    "38": "ACH-Sparlastschrift (CTP Format)",
    "39": "ACH-Spargutschrift (CTX Format)",
    "40": "ACH-Sparlastschrift (CTX Format)",
    "41": "ACH-Spargutschrift (CCD+ Format)",
    "42": "Zahlung auf Bankkonto",
    "43": "ACH-Sparlastschrift (CCD+ Format)",
    "44": "Akzeptierter Wechsel",
    "45": "Referenzierter Homebanking-Übertrag",
    "46": "Interbank-Lastschriftübertragung",
    "47": "Homebanking-Lastschriftübertragung",
    "48": "Bankkarte",
    "49": "Lastschrift",
    "50": "Zahlung per Postgiro",
    "51": "FR, Norme 6 97-Telereglement CFONB – Option A",
    "52": "Dringende Geschäftszahlung",
    "53": "Dringende Staatszahlung",
    "54": "Kreditkarte",
    "55": "Debitkarte",
    "56": "Bankgiro",
    "57": "Dauervereinbarung",
    "58": "SEPA-Überweisung",
    "59": "SEPA-Lastschrift",
    "60": "Schuldschein",
    "61": "Vom Schuldner unterzeichneter Schuldschein",
    "62": "Schuldschein vom Schuldner unterzeichnet und von einer Bank indossiert",
    "63": "Schuldschein vom Schuldner unterzeichnet und von Dritten indossiert",
    "64": "Von Bank unterzeichneter Schuldschein",
    "65": "Von Bank unterzeichneter und von einer anderen Bank indossierter Schuldschein",
    "66": "Von Dritten unterzeichneter Schuldschein",
    "67": "Von Dritten unterzeichneter und von einer Bank indossierter Schuldschein",
    "68": "Online-Zahlungsdienst",
    "70": "Wechsel, gezogen vom Gläubiger auf den Schuldner",
    "74": "Wechsel, gezogen vom Gläubiger auf eine Bank",
    "75": "Wechsel vom Gläubiger, indossiert von einer anderen Bank",
    "76": "Wechsel, gezogen vom Gläubiger auf eine Bank, von Dritten indossiert",
    "77": "Wechsel, gezogen vom Gläubiger auf eine dritte Partei",
    "78": "Wechsel, gezogen vom Gläubiger auf Dritten, akzeptiert und von Bank indossiert",
    "91": "Nicht übertragbarer Bankwechsel",
    "92": "Nicht übertragbarer lokaler Scheck",
    "93": "Referenz-Giro",
    "94": "Dringender Giro",
    "95": "Freiform-Giro",
    "96": "Angeforderte Zahlungsmethode wurde nicht verwendet",
    "97": "Verrechnung zwischen Partnern",
    "98": "JP, Elektronisch aufgezeichnete Geldforderungen",
    "ZZZ": "Individuell definiert"
  };

  return methods[code] || code || "-";
}

export function translateText(text) {
  if (!text) return "-";

  const dict = {
    "reverse charge": "Reverse-Charge-Verfahren",
    "vat exempt": "Mehrwertsteuerbefreit",
    "zero rated goods": "Nullbesteuerte Waren",
    "payment by": "Zahlung per",
    "bank transfer": "Überweisung",
    "your order": "Ihre Bestellung",
    "your reference": "Ihre Referenz",
    "due date": "Fälligkeitsdatum",
    "account manager": "Kundenbetreuer",
    "without deductions": "ohne Abzug",
    "payable":"Zahlbar",
    "invoice":"Rechnung"
    // add more terms here
   };
let translated = text;
for (const [en, de] of Object.entries(dict)) {
  const regex = new RegExp(en, "gi");
  translated = translated.replace(regex, de);
}
return translated;
}