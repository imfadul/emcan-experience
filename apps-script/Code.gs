/**
 * Emcan Group — lead-capture web app (deployed separately from the website).
 *
 * Receives JSON from POST /api/contact, validates, appends a row to a Google
 * Sheet, and emails a notification. Configure via Project Settings → Script
 * Properties (NOT in code):
 *   SHARED_SECRET  — must match LEADS_SHARED_SECRET in the site env (optional).
 *   NOTIFY_EMAIL   — where new-lead notifications are sent.
 *   SHEET_ID       — optional; defaults to the active/bound spreadsheet.
 *
 * Setup: run setupSheet() once (creates the "Leads" tab with headers), then
 * Deploy → New deployment → Web app → Execute as "Me", Access "Anyone".
 * Paste the /exec URL into the site's LEADS_ENDPOINT_URL.
 */

var SHEET_NAME = 'Leads';

var COLUMNS = [
  'Timestamp',
  'Full Name',
  'Company',
  'Email',
  'Phone',
  'Country',
  'Selected Emcan Company',
  'Inquiry Type',
  'Project Type',
  'Project Location',
  'Project Stage',
  'Preferred Contact Method',
  'Message',
  'Status',
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'no_body' });
    }

    var data = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();

    // Optional shared-secret check.
    var secret = props.getProperty('SHARED_SECRET');
    if (secret && data.secret !== secret) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    // Minimal server-side validation (mirrors the site).
    if (!s_(data.fullName) || !isEmail_(s_(data.email)) || s_(data.message).length < 10) {
      return json_({ ok: false, error: 'invalid' });
    }

    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      cell_(data.fullName),
      cell_(data.company),
      cell_(data.email),
      cell_(data.phone),
      cell_(data.country),
      cell_(data.selectedCompany),
      cell_(data.inquiryType),
      cell_(data.projectType),
      cell_(data.projectLocation),
      cell_(data.projectStage),
      cell_(data.preferredContact),
      cell_(data.message),
      'New',
    ]);

    notify_(props.getProperty('NOTIFY_EMAIL'), data);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Health check. */
function doGet() {
  return json_({ ok: true, service: 'emcan-leads' });
}

/** Run once to create the sheet and header row. */
function setupSheet() {
  var sheet = getSheet_();
  sheet.clear();
  sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, COLUMNS.length);
  return 'Sheet "' + SHEET_NAME + '" is ready with ' + COLUMNS.length + ' columns.';
}

/* ----------------------------- helpers ----------------------------- */

function getSheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    ss = SpreadsheetApp.create('Emcan Group — Leads');
  }
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function notify_(to, data) {
  if (!to) return;
  var subject = 'New Emcan lead — ' + s_(data.fullName);
  var body =
    'A new enquiry was submitted.\n\n' +
    'Name: ' + s_(data.fullName) + '\n' +
    'Company: ' + s_(data.company) + '\n' +
    'Email: ' + s_(data.email) + '\n' +
    'Phone: ' + s_(data.phone) + '\n' +
    'Country: ' + s_(data.country) + '\n' +
    'Selected company: ' + s_(data.selectedCompany) + '\n' +
    'Inquiry type: ' + s_(data.inquiryType) + '\n' +
    'Project type: ' + s_(data.projectType) + '\n' +
    'Project location: ' + s_(data.projectLocation) + '\n' +
    'Project stage: ' + s_(data.projectStage) + '\n' +
    'Preferred contact: ' + s_(data.preferredContact) + '\n\n' +
    'Message:\n' + s_(data.message);
  MailApp.sendEmail(to, subject, body);
}

function s_(v) {
  return (v === null || v === undefined ? '' : String(v)).trim();
}

/** Sanitize for a sheet cell: clamp length and neutralize formula injection. */
function cell_(v) {
  var str = s_(v).slice(0, 4000);
  if (/^[=+\-@]/.test(str)) str = "'" + str;
  return str;
}

function isEmail_(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
