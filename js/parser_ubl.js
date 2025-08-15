import { renderUBL } from './render_ubl.js';

export function parseUBL(xml) {
  const getText = (root, ...tags) => {
    let node = root;
    for (const tag of tags) {
      if (!node) return "";
      node = node.getElementsByTagNameNS("*", tag)[0];
    }
    return node?.textContent.trim() || "";
  };

  const invoice = xml.getElementsByTagNameNS("*", "Invoice")[0];
  const supplier = invoice?.getElementsByTagNameNS("*", "AccountingSupplierParty")[0];
  const customer = invoice?.getElementsByTagNameNS("*", "AccountingCustomerParty")[0];
  const payment  = invoice?.getElementsByTagNameNS("*", "PaymentMeans")[0];
  const taxTotal = invoice?.getElementsByTagNameNS("*", "TaxTotal")[0];
  const monetary = invoice?.getElementsByTagNameNS("*", "LegalMonetaryTotal")[0];

  const taxSubtotals = Array.from(taxTotal?.getElementsByTagNameNS("*", "TaxSubtotal") || []).map(sub => ({
    satz: getText(sub, "TaxCategory", "Percent"),
    basis: getText(sub, "TaxableAmount"),
    betrag: getText(sub, "TaxAmount")
  }));

  const invoiceObj = {
    typ:     getText(invoice, "InvoiceTypeCode"),
    nummer:  getText(invoice, "ID"),
    datum:   getText(invoice, "IssueDate"),
    fällig:  getText(invoice, "DueDate"),
    währung: getText(invoice, "DocumentCurrencyCode"),
    note:    "",

    käufer: {
      name:        getText(customer, "PartyName", "Name"),
      adresse:     getText(customer, "PostalAddress", "StreetName"),
      plz:         getText(customer, "PostalAddress", "PostalZone"),
      city:        getText(customer, "PostalAddress", "CityName"),
      country:     getText(customer, "PostalAddress", "Country", "IdentificationCode"),
      ustid:       getText(customer, "PartyTaxScheme", "CompanyID"),
    },

    verkäufer: {
      name:        getText(supplier, "Party", "PartyName", "Name"),
      adresse:     getText(supplier, "PostalAddress", "StreetName"),
      plz:         getText(supplier, "PostalAddress", "PostalZone"),
      city:        getText(supplier, "PostalAddress", "CityName"),
      country:     getText(supplier, "PostalAddress", "Country", "IdentificationCode"),
      ustid:       getText(supplier, "PartyTaxScheme", "CompanyID"),
      contactName: getText(supplier, "Contact", "Name"),
      contactTel:  getText(supplier, "Contact", "Telephone"),
      contactEmail:getText(supplier, "Contact", "ElectronicMail")
    },

    positionen: Array.from(invoice.getElementsByTagNameNS("*", "InvoiceLine")).map(line => ({
      artikel:      getText(line,"Item", "Name"),
      menge:        getText(line, "InvoicedQuantity"),
      einzelpreis:  getText(line, "Price", "PriceAmount"),
      gesamt:       getText(line, "LineExtensionAmount"),
      steuerSatz:   getText(line, "Item", "ClassifiedTaxCategory", "Percent"),
      steuerBasis:  getText(line, "TaxSubtotal", "TaxableAmount"),
      steuerBetrag: getText(line, "TaxSubtotal", "TaxAmount")
    })),

    allowances: Array.from(invoice.getElementsByTagNameNS("*", "AllowanceCharge")).map(a => ({
    reason:     getText(a, "AllowanceChargeReason"),
    amount:     getText(a, "Amount"),
    indicator:  getText(a, "ChargeIndicator") === 'true'
  })),

    netto:  getText(monetary, "LineExtensionAmount"),
    steuer: getText(taxTotal, "TaxAmount"),
    brutto: getText(monetary, "PayableAmount"),
    steuerDetails: taxSubtotals,

    paymentMethod: getText(payment, "PaymentMeansCode"),
    iban:          getText(payment, "PayeeFinancialAccount", "ID")
  };

  console.log("⚙️ Parsed UBL invoice:", invoiceObj);
  renderUBL(invoiceObj);
}
