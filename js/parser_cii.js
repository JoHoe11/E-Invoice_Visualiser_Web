import { renderCII } from './render_cii.js';

export function parseCII(xml) {
  function getDeepText(root, ...tags) {
    let node = root;
    for (const tag of tags) {
      if (!node) return "";
      node = node.getElementsByTagNameNS("*", tag)[0];
    }
    return node?.textContent.trim() || "";
  }

  const header      = xml.getElementsByTagNameNS('*', 'ExchangedDocument')[0];
  const transaction = xml.getElementsByTagNameNS('*', 'SupplyChainTradeTransaction')[0];
  const agreement   = transaction?.getElementsByTagNameNS('*', 'ApplicableHeaderTradeAgreement')[0];
  const settlement  = transaction?.getElementsByTagNameNS('*', 'ApplicableHeaderTradeSettlement')[0];

  const buyerParty  = agreement?.getElementsByTagNameNS('*', 'BuyerTradeParty')[0];
  const sellerParty = agreement?.getElementsByTagNameNS('*', 'SellerTradeParty')[0];
  const headerSum   = settlement?.getElementsByTagNameNS('*', 'SpecifiedTradeSettlementHeaderMonetarySummation')[0];

  // parse the first payment means
  const payMeans = settlement?.getElementsByTagNameNS('*', 'SpecifiedTradeSettlementPaymentMeans')?.[0];

  const steuerDetails = Array.from(
    settlement.getElementsByTagNameNS('*', 'ApplicableTradeTax')
  ).map(tax => ({
    satz:  getDeepText(tax, 'RateApplicablePercent'),
    basis: getDeepText(tax, 'BasisAmount'),
    betrag:getDeepText(tax, 'CalculatedAmount')
  }));

  const invoice = {
    typ:     getDeepText(header,    'TypeCode'),
    nummer:  getDeepText(header,    'ID'),
    datum:   getDeepText(header,    'IssueDateTime','DateTimeString'),
    note:    getDeepText(header,    'IncludedNote','Content'),
    währung: getDeepText(settlement,'InvoiceCurrencyCode'),
    fällig:  getDeepText(settlement,'SpecifiedTradePaymentTerms','DueDateDateTime','DateTimeString'),

    käufer: {
      name:        getDeepText(buyerParty, 'Name'),
      adresse:     getDeepText(buyerParty, 'PostalTradeAddress','LineOne'),
      plz:         getDeepText(buyerParty, 'PostalTradeAddress','PostcodeCode'),
      city:        getDeepText(buyerParty, 'PostalTradeAddress','CityName'),
      country:     getDeepText(buyerParty, 'PostalTradeAddress','CountryID'),
      ustid:       getDeepText(buyerParty, 'SpecifiedTaxRegistration','ID'),
      contactName: getDeepText(buyerParty, 'DefinedTradeContact','PersonName'),
      contactTel:  getDeepText(buyerParty, 'DefinedTradeContact','TelephoneUniversalCommunication','CompleteNumber'),
      contactEmail:getDeepText(buyerParty, 'DefinedTradeContact','EmailURIUniversalCommunication','URIID')
    },

    verkäufer: {
      name:        getDeepText(sellerParty, 'Name'),
      adresse:     getDeepText(sellerParty, 'PostalTradeAddress','LineOne'),
      plz:         getDeepText(sellerParty, 'PostalTradeAddress','PostcodeCode'),
      city:        getDeepText(sellerParty, 'PostalTradeAddress','CityName'),
      country:     getDeepText(sellerParty, 'PostalTradeAddress','CountryID'),
      ustid:       getDeepText(sellerParty, 'SpecifiedTaxRegistration','ID'),
      contactName: getDeepText(sellerParty, 'DefinedTradeContact','PersonName'),
      contactTel:  getDeepText(sellerParty, 'DefinedTradeContact','TelephoneUniversalCommunication','CompleteNumber'),
      contactEmail:getDeepText(sellerParty, 'DefinedTradeContact','EmailURIUniversalCommunication','URIID')
    },

    positionen: Array.from(
      transaction.getElementsByTagNameNS('*', 'IncludedSupplyChainTradeLineItem')
    ).map(line => {
      const product       = line.getElementsByTagNameNS('*', 'SpecifiedTradeProduct')[0];
      const agreementLine = line.getElementsByTagNameNS('*', 'SpecifiedLineTradeAgreement')[0];
      const delivery      = line.getElementsByTagNameNS('*', 'SpecifiedLineTradeDelivery')[0];
      const settleLine    = line.getElementsByTagNameNS('*', 'SpecifiedLineTradeSettlement')[0];
      const lineTax       = settleLine?.getElementsByTagNameNS('*', 'ApplicableTradeTax')[0];
      const moneyLine     = settleLine?.getElementsByTagNameNS('*', 'SpecifiedTradeSettlementLineMonetarySummation')[0];

      return {
        artikel:      getDeepText(product,       'Name'),
        beschreibung: getDeepText(product,       'Description'),
        menge:        getDeepText(delivery,      'BilledQuantity'),
        einzelpreis:  getDeepText(agreementLine, 'NetPriceProductTradePrice','ChargeAmount'),
        gesamt:       getDeepText(moneyLine,     'LineTotalAmount'),
        steuerSatz:   getDeepText(lineTax,       'RateApplicablePercent'),
        steuerBasis:  "",
        steuerBetrag: ""
      };
    }),

    allowances: [],

    netto:         getDeepText(headerSum,'LineTotalAmount'),
    steuer:        getDeepText(headerSum,'TaxTotalAmount'),
    brutto:        getDeepText(headerSum,'GrandTotalAmount'),
    steuerDetails,

    // <— new payment info fields
    paymentMethod: getDeepText(payMeans, 'TypeCode'),
    iban:          getDeepText(payMeans, 'PayeePartyCreditorFinancialAccount','IBANID')
  };

  console.log("⚙️ Parsed CII invoice:", invoice);
  renderCII(invoice);
}
