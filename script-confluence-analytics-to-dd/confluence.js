// Docs
// https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/
// https://developer.atlassian.com/server/confluence/confluence-rest-api-examples/

function getFromConfluenceURL(endpoint) {
  // const data = {
  //   'name': 'Bob Smith',
  //   'age': 35,
  //   'pets': ['fido', 'fluffy']
  // };
  const authString = `${EMAIL}:${CONFLUENCE_API_TOKEN}`
  const authHeader = 'Basic ' + Utilities.base64Encode(EMAIL + ':' + CONFLUENCE_API_TOKEN)
  const options = {
    'method' : 'get',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
    // Convert the JavaScript object to a JSON string.
    // 'payload' : JSON.stringify(data)
  };
  const url = `https://${CONFLUENCE_NAME}.atlassian.net${endpoint}`
  // Logger.log(url)
  // Logger.log({ authHeader, url, options })
  const response = UrlFetchApp.fetch(url, options);
  // https://developers.google.com/apps-script/reference/url-fetch
  if (response.getResponseCode() == 200) {
    // Logger.log(response)
    return response
    // const responseContent = response.getContent()
    // return responseContent
  } else {
    Logger.err({ 
      url,
      options,
      msg: "We have a problem"
    })
  }
}


// https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-space/#api-spaces-get
function getSpaceIds(spaceKeys = ["TEMTAM", "HCP"]) {
  const endpoint = `/wiki/api/v2/spaces?keys=${spaceKeys.join(",")}`
  const res = getFromConfluenceURL(endpoint)
  // const resJSON = JSON.parse(res)
  // Logger.log(resJSON)
  return JSON.parse(res)
}
// https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/#api-pages-get
function getPages(spaceId) {
  const initialEndpoint = `/wiki/api/v2/pages?space-id=${spaceId}&limit=250&status=current`
  // const initialEndpoint = `/wiki/api/v2/pages?space-id=${SPACE_ID_TEMTAM}&space-id=${SPACE_ID_HCP}&limit=250&status=current`
  // const initialEndpoint = `/wiki/api/v2/pages?space-id=${SPACE_ID_HCP}&limit=250&status=current`
  let pageList = []
  let endpoint = initialEndpoint
  while (pageList.length <= MAX_PAGES && !!endpoint) {
    Logger.log({ pageListLength: pageList.length, maxPages: MAX_PAGES, endpoint })
    const res = getFromConfluenceURL(endpoint)
    const resJSON = JSON.parse(res)
    pageList = pageList.concat(resJSON.results)
    endpoint = resJSON._links && resJSON._links.next
  }
  // Logger.log(pageList.length)
  return pageList
}
// https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-blog-post/#api-blogposts-get
function getBlogposts(spaceId) {
  const initialEndpoint = `/wiki/api/v2/blogposts?space-id=${spaceId}&limit=250&status=current`
  // const initialEndpoint = `/wiki/api/v2/blogposts?space-id=${SPACE_ID_TEMTAM}&space-id=${SPACE_ID_HCP}&limit=250&status=current`
  // const initialEndpoint = `/wiki/api/v2/blogposts?space-id=${SPACE_ID_HCP}&limit=250&status=current`
  let arr = []
  let endpoint = initialEndpoint
  while (arr.length <= MAX_PAGES && !!endpoint) {
    Logger.log({ arrLength: arr.length, maxPages: MAX_PAGES, endpoint })
    const res = getFromConfluenceURL(endpoint)
    const resJSON = JSON.parse(res)
    arr = arr.concat(resJSON.results)
    endpoint = resJSON._links && resJSON._links.next
  }
  // Logger.log(arr.length)
  return arr
}
// https://developer.atlassian.com/cloud/confluence/rest/v1/api-group-analytics/
function getViews(pageId) { // pageId example 2925464757
  const endpoint = `/wiki/rest/api/analytics/content/${pageId}/views`
  const res = getFromConfluenceURL(endpoint)
  return JSON.parse(res)
}
// https://developer.atlassian.com/cloud/confluence/rest/v1/api-group-analytics/
function getViewers(pageId) {
  const endpoint = `/wiki/rest/api/analytics/content/${pageId}/viewers`
  const res = getFromConfluenceURL(endpoint)
  // Logger.log(res)
  return JSON.parse(res)
}
// https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-label/#api-pages-id-labels-get
function getLabels(contentId) {
  const endpoint = `/wiki/api/v2/pages/${contentId}/labels`
  const res = getFromConfluenceURL(endpoint)
  // Logger.log(res)
  return JSON.parse(res)
}
// https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-label/#api-blogposts-id-labels-get
function getBlogpostLabels(contentId) {
  const endpoint = `/wiki/api/v2/blogposts/${contentId}/labels`
  const res = getFromConfluenceURL(endpoint)
  // Logger.log(res)
  return JSON.parse(res)
}
function getUser(accountId) {
  const endpoint = `/wiki/rest/api/user?accountId=${accountId}`
  const res = getFromConfluenceURL(endpoint)
  return JSON.parse(res)
}