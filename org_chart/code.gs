const SHEET_NAME_ORG_CHART = "org_chart"

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  SpreadsheetApp.setActiveSpreadsheet(ss)
  const sheet = ss.getSheetByName(SHEET_NAME_ORG_CHART)

  // var ssID = ss.getId();
  // var requestData = { "method": "GET", "headers": { "Authorization": "Bearer " + ScriptApp.getOAuthToken() } };
  // // var blobs = sheetNames.map(s => {
  // //   var params = ssID + "/export?gid=" + ss.getSheetByName(s).getSheetId() + "&format=csv";
  // //   var url = "https://docs.google.com/spreadsheets/d/" + params;
  // //   return UrlFetchApp.fetch(url, requestData).getBlob().setName(s); // <--- Modified
  // // });
  // var params = ssID + "/export?gid=" + sheet.getSheetId() + "&format=csv";
  // var url = "https://docs.google.com/spreadsheets/d/" + params;
  // Logger.log(url)
  // const resp = UrlFetchApp.fetch(url, requestData).getBlob().setName(s); // <--- Modified
  // const csv = resp.getContentText();
  // Logger.log(csv)


  const sheetArray = getTableValues(sheet)
  // Logger.log(sheetArray)
  // Logger.log(sheetArray.map(row => row.join(",")).join("\n"))
  const tempOutput = HtmlService.createTemplateFromFile('index');

  const orgChart = []
  for (let i = 1, rowCount = sheetArray.length; i < rowCount; i++) {
    const item = {}
    for (let j = 0, attrCount = sheetArray[0].length; j < attrCount; j++) {
      item[sheetArray[0][j]] = sheetArray[i][j]
    }
    orgChart.push(item)
  }

  tempOutput.orgChartCSV = sheetArray.map(row => row.join(",")).join("\n")
  tempOutput.orgChartCSV = JSON.stringify(orgChart)
  return tempOutput.evaluate()
  // return HtmlService.createHtmlOutputFromFile('index');
}

function doPost() {
  return null
}

// Use this code for Google Docs, Slides, Forms, or Sheets.
function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Dialog')
      .addItem('Open', 'openDialog')
      .addToUi();
}

function openDialog() {
  var html = HtmlService.createHtmlOutputFromFile('index');
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showModalDialog(html, 'Dialog title');
}

/**
* MENU
*/

// /**
// * @OnlyCurrentDoc
// */
// function onOpen() {
// var ui = SpreadsheetApp.getUi();
// ui.createMenu('metric analyzer')
//     .addSeparator()
//     .addItem('item title', 'function_name')
//     .addToUi();
// createStatsMenu()
// }

/**
* COMMON FUNCTIONS
*/
/**
* Builds a complete URL from a base URL and a map of URL parameters.
* @param {string} url The base URL.
* @param {Object.<string, string>} params The URL parameters and values.
* @return {string} The complete URL.
* @private
*/
function buildUrl_(url, params) {
  var paramString = Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString;
}

function fillTable(sheet, rows, titles) {
  sheet.getRange(2,1,rows.length, rows[0].length).setValues(rows)
  if (titles) {
    sheet.getRange(1,1,1, titles.length).setValues([titles])
  }
}

function getTableValues(sheet) {
  return sheet.getDataRange().getValues()
}