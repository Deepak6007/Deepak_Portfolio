/**
 * Project brief inbox for deepak6007.github.io
 *
 * Every brief sent from the website lands as a row in this Google Sheet,
 * with a "Completed" checkbox you tick once you've replied, and you get an email alert.
 *
 * Setup (5 minutes):
 * 1. Create a new Google Sheet. Extensions > Apps Script. Paste this whole file. Save.
 * 2. Run "setup" once (Run button) and allow the permissions.
 * 3. Deploy > New deployment > type "Web app".
 *    Execute as: Me.  Who has access: Anyone.  Deploy, then copy the web app URL.
 * 4. In js/main.js set SHEET_ENDPOINT = 'that URL' and push the site.
 */

var NOTIFY_EMAIL = 'deepak7designer@gmail.com';
var SHEET_NAME = 'Briefs';
var HEADERS = ['Received', 'Name', 'Contact', 'Company', 'Service', 'Project', 'References', 'Budget', 'Timeline', 'Sent via', 'Completed'];

function setup() {
  var sheet = getSheet_();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function doPost(e) {
  // Handles form posts, JSON posts, and empty test runs without crashing.
  var data = {};
  if (e && e.parameter && Object.keys(e.parameter).length) {
    data = e.parameter;
  } else if (e && e.postData && e.postData.contents) {
    try { data = JSON.parse(e.postData.contents); } catch (err) { data = {}; }
  }
  if (!data.name && !data.contact) {
    return json_({ ok: false, error: 'Brief is missing a name and contact.' });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet_();
    if (sheet.getLastRow() === 0) setup();
    var row = [new Date(), data.name || '', data.contact || '', data.company || '', data.service || '',
               data.details || '', data.refs || '', data.budget || '', data.timeline || '', data.channel || '', false];
    sheet.appendRow(row);
    sheet.getRange(sheet.getLastRow(), HEADERS.length).insertCheckboxes();
  } finally {
    lock.releaseLock();
  }

  MailApp.sendEmail(NOTIFY_EMAIL,
    'New project brief: ' + (data.service || 'website enquiry') + ' from ' + (data.name || 'someone'),
    'Name: ' + data.name + '\nContact: ' + data.contact + '\nCompany: ' + (data.company || '-') +
    '\nService: ' + data.service + '\nBudget: ' + data.budget + '\nTimeline: ' + data.timeline +
    '\n\nProject:\n' + data.details + '\n\nReferences: ' + (data.refs || '-') +
    '\n\nSent via ' + (data.channel || 'website') + '. Tick "Completed" in the sheet once you reply.');

  return json_({ ok: true });
}

function doGet() {
  return json_({ ok: true, message: 'Brief inbox is running.' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
