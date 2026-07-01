/**
 * Google Apps Script — Tropa Científica / APOS sync
 *
 * SETUP (5 min):
 * 1. Abra a planilha → menu Extensões → Apps Script
 * 2. Cole este código em Code.gs (substitua o conteúdo existente)
 * 3. No lado esquerdo, clique Project Settings (⚙) → Script Properties
 *    Adicione DUAS propriedades:
 *      WEBHOOK_URL     = https://dptdoprxjusyeirmygbb.supabase.co/functions/v1/sheets-inbound
 *      WEBHOOK_SECRET  = <o valor do secret SHEETS_WEBHOOK_SECRET>
 *      (peça o valor ao admin — está guardado nos secrets do backend)
 * 4. Clique Triggers (relógio) → Add Trigger
 *      Function: onSheetChange
 *      Event source: From spreadsheet
 *      Event type: On change
 *      Save (autorize com sua conta Google)
 *
 * Pronto. Toda edição na planilha vai disparar a sync em < 1 min.
 */

var SYNCED_SHEETS = [
  "01_Profile","02_Bio","03_Dashboard",
  "04_Publicacoes","05_Anais_CONACIPS",
  "06_Formacao","07_Cursos","08_Certificacoes",
  "09_Experiencia","10_Projetos","11_Skills",
  "12_Instituicoes","13_Links","14_SEO_CMS","16_Settings"
];

function onSheetChange(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet().getName();
    if (SYNCED_SHEETS.indexOf(sheet) === -1) return;
    sendWebhook({ sheet: sheet });
  } catch (err) {
    console.error(err);
  }
}

// Manual trigger (útil pra testar): rode esta função uma vez pra validar
function syncAllNow() {
  sendWebhook({ sheets: SYNCED_SHEETS });
}

function sendWebhook(payload) {
  var props = PropertiesService.getScriptProperties();
  var url = props.getProperty("WEBHOOK_URL");
  var secret = props.getProperty("WEBHOOK_SECRET");
  if (!url || !secret) throw new Error("Script properties WEBHOOK_URL / WEBHOOK_SECRET missing");

  var body = JSON.stringify(payload);
  var sig = hmacSha256Hex(secret, body);

  var res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: body,
    headers: { "x-sheets-signature": sig },
    muteHttpExceptions: true
  });
  console.log(res.getResponseCode(), res.getContentText());
}

function hmacSha256Hex(secret, message) {
  var bytes = Utilities.computeHmacSha256Signature(message, secret);
  var hex = "";
  for (var i = 0; i < bytes.length; i++) {
    var b = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    hex += ("0" + b.toString(16)).slice(-2);
  }
  return hex;
}
