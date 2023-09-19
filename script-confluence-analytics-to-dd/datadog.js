function buildMetricSerie(metric_name, metric_type, value, tags) {
    return {
      "metric": metric_name,
      "type": metric_type, // The available types are 0 (unspecified), 1 (count), 2 (rate), and 3 (gauge).
      "points": [
        {
          
          "timestamp": Math.floor(NOW / 1000),
          "value": value
        }
      ],
      "tags": tags
    }
  }
  
  function postMetricSeriesToDatadog(series) {
    const data = {
      "series": series
    }
    const options = {
      'method' : 'post',
      'payload' : JSON.stringify(data),
      'headers': {
        'Content-Type': 'application/json',
        'DD-API-KEY': DD_API_KEY
      }
    };
    const url = `https://api.datadoghq.com/api/v2/series?api_key=${DD_API_KEY}`
    const response = UrlFetchApp.fetch(url, options);
    const responseContent = response.getContent()
    return responseContent
  }
  
  function postMetricToDatadog(metric_name, metric_type, value, tags) {
    const data = {
      "series": [
        {
          "metric": metric_name,
          "type": metric_type, // The available types are 0 (unspecified), 1 (count), 2 (rate), and 3 (gauge).
          "points": [
            {
              
              "timestamp": Math.floor(NOW / 1000),
              "value": value
            }
          ],
          "tags": tags
        }
      ]
    }
    // Logger.log(NOW)
    // Logger.log(data)
    const options = {
      'method' : 'post',
      // Convert the JavaScript object to a JSON string.
      'payload' : JSON.stringify(data),
      'headers': {
        'Content-Type': 'application/json',
        'DD-API-KEY': DD_API_KEY
      }
    };
    // https://docs.datadoghq.com/api/latest/metrics/#submit-metrics
    const url = `https://api.datadoghq.com/api/v2/series?api_key=${DD_API_KEY}`
    const response = UrlFetchApp.fetch(url, options);
    // https://developers.google.com/apps-script/reference/url-fetch
    // Logger.log(response)
    const responseContent = response.getContent()
    return responseContent
  }