import { renderIf, getPaymentMethodName, translateText } from './helper.js';

export function renderUBL(i) {
  const fmtDate = d => d?.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1.$2.$3') || "";

  const html = `
    <div class="invoice-preview">
      <h1 style="text-align:center; color:#ff5555;">Rechnung</h1>

      <div class="header">
        <div>
         <p>
            <strong>${i.verkäufer.name}</strong><br/>
              ${i.verkäufer.adresse}<br/>
              ${i.verkäufer.plz} ${i.verkäufer.city} (${i.verkäufer.country})<br/>
              ${renderIf("USt-ID", i.verkäufer.ustid)}
              ${renderIf("Kontakt", i.verkäufer.contactName)}
              ${renderIf("Tel", i.verkäufer.contactTel)}
              ${renderIf("E-Mail", i.verkäufer.contactEmail)}
           </p>    
        </div>       
        <div style="text-align:right;">
          <p>
            <strong>${i.käufer.name}</strong><br/>
            ${i.käufer.adresse}<br/>
            ${i.käufer.plz} ${i.käufer.city} (${i.käufer.country})<br/>
            ${renderIf("USt-ID", i.käufer.ustid)}<br/>
          </p>
        </div>
      </div>

      <div class="meta">
        ${renderIf("Rechnungsnummer", i.nummer)}
        ${renderIf("Rechnungsdatum", fmtDate(i.datum))}
        ${renderIf("Währung", i.währung)}
      </div>

      <h3>Positionen</h3>
      <table>
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Menge</th>
            <th>Einzelpreis</th><th>Steuer</th><th>Gesamt</th>
          </tr>
        </thead>
        <tbody>
          ${i.positionen.map((p, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${p.artikel || "-"}</td>
              <td>${p.menge || "-"}</td>
              <td>${p.einzelpreis ? p.einzelpreis + " " + i.währung : "-"}</td>
              <td>${p.steuerSatz ? p.steuerSatz + " %" : "-"}</td>
              <td>${p.gesamt ? p.gesamt + " " + i.währung : "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      ${i.allowances.length ? `
  <h3>Abzüge / Zuschläge</h3>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Typ</th><th>Grund</th><th>Betrag</th>
      </tr>
    </thead>
    <tbody>
      ${i.allowances.map((a, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${a.indicator ? "Zuschlag" : "Abzug"}</td>
          <td>${a.reason || "-"}</td>
          <td>
                 ${a.amount
                     ? (a.indicator
                        ?  a.amount + " " + i.währung       // Zuschlag
                             : "-" + a.amount + " " + i.währung  // Abzug as negative
                            )
                           : "-"
                          }
                         </td>
                        </tr>
                       `).join("")}
                      </tbody>
                     </table>
                   ` : ""}
      
      <h3>Steuerberechnung</h3>
      <table>
        <thead><tr>
          <th>#</th><th>Steuersatz</th><th>Steuerbetrag</th><th>Steuerbasis</th>
        </tr></thead>
        <tbody>
          ${i.steuerDetails
            .filter(t => parseFloat(t.satz) !== 0) // Skip 0%
            .map((t, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${t.satz ? t.satz + " %" : "-"}</td>
                <td>${t.betrag ? t.betrag + " " + i.währung : "-"}</td>
                <td>${t.basis ? t.basis + " " + i.währung : "-"}</td>
              </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="summary">
        ${renderIf("Netto", i.netto ? i.netto + " " + i.währung : "-")}
        ${renderIf("Steuer", i.steuer ? i.steuer + " " + i.währung : "-")}
        ${renderIf("Brutto", i.brutto ? i.brutto + " " + i.währung : "-")}
      </div>

      <div class="payment">
        <h3>Zahlungsinformationen</h3>
        ${renderIf("Fälligkeitsdatum", fmtDate(i.fällig))}
        ${renderIf("Zahlungsmethode", getPaymentMethodName(i.paymentMethod))}
        ${renderIf("IBAN", i.iban)}
        ${renderIf("Hinweise", translateText(i.note))}
      </div>
    </div>
  `;

  document.getElementById("invoiceDisplay").innerHTML = html;
}
