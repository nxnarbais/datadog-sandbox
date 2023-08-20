DD_API_KEY = ""
DD_APP_KEY = ""
DD_SITE = "https://api.datadoghq.com"

const SHEET_NAME_TOP_CM = "top_cm"
const SHEET_NAME_TOP_CM_ANALYZED = "top_cm_analyzed"

const TOP_METRIC_COUNT = 100
const SLEEP_SEC = 5
const CUSTOM_METRIC_PRICE = 0.05

// https://docs.datadoghq.com/api/latest/metrics/#get-a-list-of-metrics
function getMetricList() {
  const url = `${DD_SITE}/api/v2/metrics`
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
    // 'filter[configured]': false,
    // 'filter[tags_configured]': false,
    // 'filter[metric_type]': 'count',
    // 'filter[include_percentiles]': false,
    // 'filter[queried]': ??,
    // 'filter[tags]': ??
  }
  Logger.log({ fn: 'getMetricList', url: buildUrl_(url, params), options })
  const response = UrlFetchApp.fetch(buildUrl_(url, params), options);
  Logger.log(response.getContentText());
  const jsonResponse = JSON.parse(response.getContentText())
  Logger.log(Object.keys(jsonResponse));
  Logger.log(`Metrics found: ${jsonResponse["data"].length}`);
  return jsonResponse
}

// https://docs.datadoghq.com/api/latest/usage-metering/#get-all-custom-metrics-by-hourly-average
function getTopMetrics(limit = 100) {
  const url = `${DD_SITE}/api/v1/usage/top_avg_metrics`
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
  const month = `${(new Date()).getFullYear()}-${String((new Date()).getMonth() + 1).padStart(2, '0')}`
  const params = {
    'limit': limit,
    'month': month
  }
  Logger.log({ fn: 'getTopMetrics', url: buildUrl_(url, params), options })
  const response = UrlFetchApp.fetch(buildUrl_(url, params), options);
  Logger.log(response.getContentText());
  const jsonResponse = JSON.parse(response.getContentText())
  Logger.log(Object.keys(jsonResponse));
  Logger.log(`Metrics found: ${jsonResponse["usage"].length}`);
  return jsonResponse
  // {"usage":[{"org_name":"Delivery Hero SE","public_id":"8pg7s9o4ntvqtoem","region":"eu","avg_metric_hour":141568,"max_metric_hour":182619,"metric_category":"custom","metric_name":"dh.fintech.alfred.payment.issuer.operations"},{"org_name":"Delivery Hero SE","public_id":"8pg7s9o4ntvqtoem","region":"eu","avg_metric_hour":82070,"max_metric_hour":523410,"metric_category":"custom","metric_name":"pandora.cart_service.external.http.response_time"},{"org_name":"Delivery Hero SE","public_id":"8pg7s9o4ntvqtoem","region":"eu","avg_metric_hour":78942,"max_metric_hour":211680,"metric_category":"custom","metric_name":"pandora.watson.external.http.response_time"},{"org_name":"Delivery Hero SE","public_id":"8pg7s9o4ntvqtoem","region":"eu","avg_metric_hour":74054,"max_metric_hour":367490,"metric_category":"custom","metric_name":"pandora.cart_service.external.grpc.response_time"},{"org_name":"Delivery Hero ...
}

function getTopMetricsToSheet() {
  Logger.log('START: getTopMetricsToSheet')
  const topMetrics = getTopMetrics(TOP_METRIC_COUNT)
  // Logger.log(topMetrics['usage'])
  const titles = Object.keys(topMetrics['usage'][0])
  const rows = topMetrics['usage'].map(metricMetadata => { // This mapping ensures consistency in the order of the columns
    return titles.map(key => metricMetadata[key])
  })
  Logger.log(`Top metrics collected with titles: ${titles.join(", ")} and for a total of ${rows.length} rows`)

  var ss = SpreadsheetApp.getActiveSpreadsheet()
  SpreadsheetApp.setActiveSpreadsheet(ss)
  const sheet = ss.getSheetByName(SHEET_NAME_TOP_CM)
  // Logger.log(titles)
  // Logger.log(rows)
  
  fillTable(sheet, rows, titles)
  Logger.log('END: getTopMetricsToSheet')
}

// https://docs.datadoghq.com/api/latest/metrics/#list-active-tags-and-aggregations
function getMetricActiveTags(metric_name) {
  const url = `${DD_SITE}/api/v2/metrics/${metric_name}/active-configurations`
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
    // 'window[seconds]': 604800 // 1 week
  }
  Logger.log({ fn: 'getMetricActiveTags', url: buildUrl_(url, params), options })
  const response = UrlFetchApp.fetch(buildUrl_(url, params), options);
  var responseCode = response.getResponseCode()
  var responseBody = response.getContentText()
  if (responseCode === 200) {
    Logger.log(response.getContentText());
    const jsonResponse = JSON.parse(response.getContentText())
    Logger.log(Object.keys(jsonResponse['data']));
    return jsonResponse
    // {"data":{"type":"actively_queried_configurations","id":"dh.fintech.alfred.payment.issuer.operations","attributes":{"active_tags":["env","qualifier","status","subsidiary","card_issuer","environment"],"active_aggregations":[{"space":"avg","time":"avg"},{"space":"sum","time":"avg"},{"space":"sum","time":"sum"}]}}}
  } else {
    Logger.log(Utilities.formatString("Request failed. Expected 200, got %d: %s", responseCode, responseBody))
  }  
}

// https://docs.datadoghq.com/api/latest/metrics/#tag-configuration-cardinality-estimator
function getMetricCardinalityEstimator(metric_name, tags, num_aggregations = 1) {
  const url = `${DD_SITE}/api/v2/metrics/${metric_name}/estimate`
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
    'filter[groups]': tags.join(','),
    'filter[hours_ago]': 48,
    'filter[num_aggregations]': num_aggregations,
    // 'filter[pct]': ,
    // 'filter[timespan_h]': ,
  }
  Logger.log({ fn: 'getMetricCardinalityEstimator', url: buildUrl_(url, params), options })
  const response = UrlFetchApp.fetch(buildUrl_(url, params), options);
  Logger.log(response.getContentText());
  const jsonResponse = JSON.parse(response.getContentText())
  Logger.log(Object.keys(jsonResponse['data']));
  return jsonResponse
  // {"data":{"type":"metric_cardinality_estimate","attributes":{"estimated_output_series":90451,"estimate_type":"count_or_gauge","estimated_at":"2023-04-26T05:40:48.613022Z"},"id":"dh.fintech.alfred.payment.issuer.operations"}}
}

function getMetricActiveTagsAndCardinalityEstimator(metric_name) {
  try {
    const metricActiveTags = getMetricActiveTags(metric_name)
    const activeTags = metricActiveTags['data']['attributes']['active_tags']
    const activeAggregations = metricActiveTags['data']['attributes']['active_aggregations']
    try {
      const cardinalityEstimation = getMetricCardinalityEstimator(metric_name, activeTags, activeAggregations ? activeAggregations.length : 1)
      return {
        // metricActiveTags,
        activeTags,
        activeAggregations,
        cardinality: cardinalityEstimation['data']['attributes']['estimated_output_series']
      }
    } catch (err) {
      return {
        activeTags,
        activeAggregation,
        cardinality: -1
      }
    }
  } catch (err) {
    return {
      activeTags: ["error on active tags"],
      activeAggregation: ["error on active tags"],
      cardinality: -1
    }
  }
}

function getCardinalityEstimatorOnTopCM() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  SpreadsheetApp.setActiveSpreadsheet(ss)
  const sheet = ss.getSheetByName(SHEET_NAME_TOP_CM)
  const topMetrics = getTableValues(sheet)
  Logger.log(`Metric collected from tab "top_cm": ${topMetrics.length - 1}`)

  const topMetricsAnalyzed = []
  for (let i = 1, topMetricsLength = topMetrics.length; i < topMetricsLength; i++) {
    Logger.log(`Progress ${i}/${topMetricsLength}`)
    // Logger.log(topMetrics[i])
    const metricMetadata = {
      org_name: topMetrics[i][0],
      public_id: topMetrics[i][1],
      region: topMetrics[i][2],
      avg_metric_hour: topMetrics[i][3],
      max_metric_hour: topMetrics[i][4],
      metric_category: topMetrics[i][5],
      metric_name: topMetrics[i][6]
    }
    // Logger.log({metricMetadata})
    const activeTagsAndCardinality = getMetricActiveTagsAndCardinalityEstimator(metricMetadata.metric_name)
    topMetricsAnalyzed.push(Object.assign(metricMetadata, activeTagsAndCardinality))
  }
  // Logger.log(topMetricsAnalyzed)

  const parsedTopMetricsAnalyzed = topMetricsAnalyzed.map(metricMetadata => {
    return Object.assign(metricMetadata, { 
      activeTags: metricMetadata.activeTags.join(', '), 
      activeAggregations: JSON.stringify(metricMetadata.activeAggregations),
      potentialGain: metricMetadata.cardinality != -1 ? 1 - metricMetadata.cardinality / metricMetadata.avg_metric_hour : 0, 
      potentialGainUSD: metricMetadata.cardinality != -1 ? (metricMetadata.avg_metric_hour - metricMetadata.cardinality) * CUSTOM_METRIC_PRICE : 0
    })
  })

  const titles = Object.keys(parsedTopMetricsAnalyzed[0])
  const rows = parsedTopMetricsAnalyzed.map(metricMetadata => {
    return titles.map(key => metricMetadata[key])
  })
  // var ss = SpreadsheetApp.getActiveSpreadsheet()
  // SpreadsheetApp.setActiveSpreadsheet(ss)
  const sheetOutput = ss.getSheetByName(SHEET_NAME_TOP_CM_ANALYZED)
  Logger.log(titles)
  Logger.log(rows)
  fillTable(sheetOutput, rows, titles)
}

/**
 * MENU
 */

/**
 * @OnlyCurrentDoc
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('metric analyzed')
      .addSeparator()
      .addItem('get top custom metrics', 'getTopMetricsToSheet')
      .addSeparator()
      .addItem('analyze top custom metrics', 'getCardinalityEstimatorOnTopCM')
      .addToUi();  
  createStatsMenu()
}

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
