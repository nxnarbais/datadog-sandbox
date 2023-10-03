const SHEET_NAME_ORG_CHART = "org_chart"

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  SpreadsheetApp.setActiveSpreadsheet(ss)

  // Get all sheet names
  const sheetNames = getAllSheetNames(ss)

  // For each sheet (except default), get the org chart data and format it
  const orgCharts = {}
  for (let k = 0, sheetCount = sheetNames.length; k < sheetCount; k++) {
    const sheetName = sheetNames[k]
    if (sheetName == "default") {
      continue
    }
    const sheet = ss.getSheetByName(sheetName)

    const sheetArray = getTableValues(sheet)
    // Logger.log(sheetArray)
    // Logger.log(sheetArray.map(row => row.join(",")).join("\n"))

    const orgChart = []
    for (let i = 1, rowCount = sheetArray.length; i < rowCount; i++) {
      const item = {}
      for (let j = 0, attrCount = sheetArray[0].length; j < attrCount; j++) {
        item[sheetArray[0][j]] = sheetArray[i][j]
      }
      orgChart.push(item)
    }

    orgCharts[sheetName] = orgChart
      .filter(item => item.id != "") // Remove empty lines
  }
  Logger.log(JSON.stringify(orgCharts.customer_name))
  const selCustomer = e.parameter.customer // customer value from the query params https://stackoverflow.com/questions/44519009/how-to-include-data-in-a-url-for-a-google-apps-script-web-app-to-read


  const tempOutput = HtmlService.createTemplateFromFile('index');
  tempOutput.orgChartCSV = JSON.stringify(orgCharts)
  tempOutput.selCustomer = selCustomer
  return tempOutput.evaluate()


  // const sheet = ss.getSheetByName(SHEET_NAME_ORG_CHART)


  // // var ssID = ss.getId();
  // // var requestData = { "method": "GET", "headers": { "Authorization": "Bearer " + ScriptApp.getOAuthToken() } };
  // // // var blobs = sheetNames.map(s => {
  // // //   var params = ssID + "/export?gid=" + ss.getSheetByName(s).getSheetId() + "&format=csv";
  // // //   var url = "https://docs.google.com/spreadsheets/d/" + params;
  // // //   return UrlFetchApp.fetch(url, requestData).getBlob().setName(s); // <--- Modified
  // // // });
  // // var params = ssID + "/export?gid=" + sheet.getSheetId() + "&format=csv";
  // // var url = "https://docs.google.com/spreadsheets/d/" + params;
  // // Logger.log(url)
  // // const resp = UrlFetchApp.fetch(url, requestData).getBlob().setName(s); // <--- Modified
  // // const csv = resp.getContentText();
  // // Logger.log(csv)

  // const sheetArray = getTableValues(sheet)
  // Logger.log(sheetArray)
  // Logger.log(sheetArray.map(row => row.join(",")).join("\n"))
  // const tempOutput = HtmlService.createTemplateFromFile('index');

  // const orgChart = []
  // for (let i = 1, rowCount = sheetArray.length; i < rowCount; i++) {
  //   const item = {}
  //   for (let j = 0, attrCount = sheetArray[0].length; j < attrCount; j++) {
  //     item[sheetArray[0][j]] = sheetArray[i][j]
  //   }
  //   orgChart.push(item)
  // }
  // // Logger.log(orgChart)
  // // Logger.log(orgChart[0])
  // // Logger.log(orgChart[1])
  // // Logger.log(JSON.stringify(orgChart))

  // // [{id=O-6066, tags=mytag, name=XX Ian Devling, profileUrl=http://example.com/employee/profile, area=Corporate, parentId=, office=CTO office, imageUrl=https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/cto.jpg, isLoggedUser=false, positionName=Chief Executive Officer, size=}, {parentId=O-6066, area=Corporate, imageUrl=https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg, name=Davolio Nancy, profileUrl=http://example.com/employee/profile, id=O-6067, isLoggedUser=false, tags=avc, positionName=CTO, size=, office=CEO office}, {area=Corporate, positionName=CTO, size=, profileUrl=http://example.com/employee/profile, tags=plop, parentId=O-6066, isLoggedUser=false, office=CEO office, id=O-6068, name=Leverling Janet, imageUrl=https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/female.jpg}]


  // tempOutput.orgChartCSV = sheetArray.map(row => row.join(",")).join("\n")
  // tempOutput.orgChartCSV = JSON.stringify(orgChart)
  // return tempOutput.evaluate()
  // // return HtmlService.createHtmlOutputFromFile('index');
}

function doPost() {
  return null
}

// // Use this code for Google Docs, Slides, Forms, or Sheets.
// function onOpen() {
//   SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
//       .createMenu('Dialog')
//       .addItem('Open', 'openDialog')
//       .addToUi();
// }

// function openDialog() {
//   var html = HtmlService.createHtmlOutputFromFile('index');
//   SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
//       .showModalDialog(html, 'Dialog title');
// }

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
//     .addItem('get top custom metrics', 'getTopMetricsToSheet')
//     .addSeparator()
//     .addItem('analyze top custom metrics', 'getCardinalityEstimatorOnTopCM')
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

function getAllSheetNames(ss) { 
  var out = new Array()
  var sheets = ss.getSheets();
  for (var i=0 ; i<sheets.length ; i++) out.push( [ sheets[i].getName() ] )
  return out
}