// MatterWorks contact form -> Google Sheet + email notification
//
// Lives in the "Form Fills" spreadsheet (Extensions -> Apps Script).
// Deployed as a web app (Execute as: Me, Who has access: Anyone). The site's
// Vercel function (api/contact.js) POSTs each submission here as JSON; the
// script appends a row and emails NOTIFY_EMAIL.
//
// Expected sheet columns (row 1):
//   First Name | Last Name | Email | Company | What are you working on? | Submitted time stamp

var NOTIFY_EMAIL = 'max@matterworks.legal';
var SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    var firstName = String(data.firstName || '').trim();
    var lastName  = String(data.lastName  || '').trim();
    var email     = String(data.email     || '').trim();
    var company   = String(data.company   || '').trim();
    var message   = String(data.message   || '').trim();

    if (!firstName || !lastName || !email || !message) {
      return respond({ ok: false, error: 'Missing required fields' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    var submittedAt = new Date();
    sheet.appendRow([firstName, lastName, email, company, message, submittedAt]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: 'New website submission from ' + firstName + ' ' + lastName,
      body: [
        'Name: ' + firstName + ' ' + lastName,
        'Email: ' + email,
        'Company: ' + (company || '(not provided)'),
        '',
        'What are they working on:',
        message,
        '',
        'Saved to: ' + ss.getUrl()
      ].join('\n')
    });

    return respond({ ok: true });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

// Lets you open the web app URL in a browser to confirm it is deployed.
function doGet() {
  return respond({ ok: true, service: 'matterworks-contact' });
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
