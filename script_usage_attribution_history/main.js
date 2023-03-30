DD_API_KEY = "TO FILL"
DD_APP_KEY = "TO FILL"
TAG_KEYS = [
  "cost_center",
  // "department",
  // "service"
]
DD_SITE = "https://api.datadoghq.eu"
MONTHS = [
  "2022-01",
  "2022-02",
  "2022-03",
  "2022-04",
  "2022-05",
  "2022-06",
  "2022-07",
  "2022-08",
  "2022-09",
  "2022-10",
  "2022-11",
  "2022-12",
  "2023-01",
  "2023-02",
  "2023-03"
]
const USAGE_SHEET_NAME = "usage"
const USAGE_FOR_PT_SHEET_NAME = "usage_for_pt"
const SLEEP_SEC = 4

function main() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  SpreadsheetApp.setActiveSpreadsheet(ss)
  const sheet = ss.getSheetByName(USAGE_SHEET_NAME)

  let usage_skus = undefined
  let monthlyUsage = []
  const monthLength = MONTHS.length
  for (let i=0; i<monthLength; i++) {
    Logger.log(`Progress: ${MONTHS[i]} - ${i}/${monthLength}`)
    const monthlyUsageAttribution = getMonthlyUsageAttribution(MONTHS[i])
    // Logger.log({ metadata: monthlyUsageAttribution.metadata })

    if (!usage_skus) {
      usage_skus = Object.keys(monthlyUsageAttribution.usage[0].values)
    }

    monthlyUsage = monthlyUsage.concat(monthlyUsageAttribution.usage)
    Utilities.sleep(SLEEP_SEC*1000);
  }
  
  const usageArray = usageToArray(monthlyUsage, usage_skus)
  // Logger.log(usageArray)
  const titles = [
    "month", "tags"
  ].concat(usage_skus)
  // Logger.log({titles})
  // Logger.log(JSON.stringify(Object.keys(monthlyUsage[0].values)))
  fillTable(sheet, usageArray, titles)


  const usageArrayForPT = usageToArrayForPT(monthlyUsage, usage_skus)
  const titlesForPT = ["month", "tags", "sku", "value"]
  const sheetForPT = ss.getSheetByName(USAGE_FOR_PT_SHEET_NAME)
  fillTable(sheetForPT, usageArrayForPT, titlesForPT)
}

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

// https://docs.datadoghq.com/api/latest/usage-metering/#get-monthly-usage-attribution
function getMonthlyUsageAttribution(month) {
  const url = `${DD_SITE}/api/v1/usage/monthly-attribution`
  const headers = {
    'DD-API-KEY': DD_API_KEY,
    'DD-APPLICATION-KEY': DD_APP_KEY,
    'Content-Type': 'application/json'
  }
  var options = {
    'method' : 'get',
    'contentType': 'application/json',
    // 'payload' : JSON.stringify(data)
    'headers': headers
  };
  const params = {
    'start_month': month,
    'fields': '*',
    'tag_breakdown_keys': TAG_KEYS.join(",")
  }
  Logger.log({ fn: 'getMonthlyUsageAttribution', url: buildUrl_(url, params), options })
  var response = UrlFetchApp.fetch(buildUrl_(url, params), options);
  Logger.log(response.getContentText());
  return JSON.parse(response.getContentText())
}

function usageToArray(usage, usage_skus) {
  let usageArray = new Array(usage.length)
  for (let i = 0, usageLength = usage.length; i<usageLength; i++) {
    const item = usage[i]
    const {
      month,
      org_name,
      public_id,
      tag_config_source,
      tags,
      values,
      updated_at,
      region
    } = item
    const valuesArray = new Array(usage_skus.length)
    for (var key in values) {
        if (values.hasOwnProperty(key)) {
            // console.log(key + " -> " + values[key]);
            // valuesArray.push(values[key])
            const index = usage_skus.indexOf(key)
            valuesArray[index] = values[key]
        }
    }
    const line = [
      month,
      JSON.stringify(tags),
    ].concat(valuesArray)
    usageArray[i] = line
  }
  return usageArray
}

function usageToArrayForPT(usage, usage_skus) {
  let usageArray = []
  for (let i = 0, usageLength = usage.length; i<usageLength; i++) {
    const item = usage[i]
    const {
      month,
      org_name,
      public_id,
      tag_config_source,
      tags,
      values,
      updated_at,
      region
    } = item
    for (var key in values) {
        if (values.hasOwnProperty(key)) {
          const line = [
            month,
            JSON.stringify(tags),
            key,
            values[key]
          ]
          usageArray.push(line)
        }
    }
  }
  return usageArray
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