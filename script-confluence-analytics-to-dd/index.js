/**
 * MAIN FUNCTIONS
 */
function getConfluencePagesWithAnalyticsAndPublishToDD_HCP(spaces = { HCP: SPACES["HCP"] }) {
  getConfluencePagesWithAnalyticsAndPublishToDD(spaces)
}
function getConfluencePagesWithAnalyticsAndPublishToDD_TEMTAM(spaces = { TEMTAM: SPACES["TEMTAM"] }) {
  getConfluencePagesWithAnalyticsAndPublishToDD(spaces)
}
function getConfluencePagesWithAnalyticsAndPublishToDD_TS(spaces = { TS: SPACES["TS"] }) {
  getConfluencePagesWithAnalyticsAndPublishToDD(spaces)
}
function getConfluencePagesWithAnalyticsAndPublishToDD_SOE(spaces = { SOE: SPACES["SOE"] }) {
  getConfluencePagesWithAnalyticsAndPublishToDD(spaces)
}
function getSpaceIdsFromList(spaceKeys = [
  "TEMTAM",
  "HCP",
  "SOE",
  "TS",
]) {
  Logger.log(
    getSpaceIds(spaceKeys)
  )
}

function getConfluencePagesWithAnalyticsAndPublishToDD(spaces = SPACES) {
  Logger.log({ spaces })
  const spaceNames = Object.keys(spaces)
  spaceNames.forEach(spaceName => {
    const spaceId = spaces[spaceName].id
    Logger.log(`[${spaceName}][${spaceId}] START: Collect pages`)
    const pages = getContentWithAnalytics(spaceName, spaceId, "page")
    _publishPageDataToDD(pages)
    Logger.log(`[${spaceName}][${spaceId}] START: Collect blogs`)
    const blogposts = getContentWithAnalytics(spaceName, spaceId, "blogpost")
    _publishPageDataToDD(blogposts)
    Logger.log(`[${spaceName}][${spaceId}] END: Collect pages and blogs`)
  })
}
/**
 * END
 */



function getContentWithAnalytics(spaceName, spaceId, contentType = "page") {
  // GET CONTENT
  const res = contentType == "page" ? getPages(spaceId) : getBlogposts(spaceId)

  // INIT
  const pageCount = res.length
  let i = 0
  const userDetails = {}

  // GENERATE CONTENT WITH ANALYTICS
  return res
    // .slice(0, 1000)
    // .slice(1000, 2000)
    // .slice(2000, 3000)
    .map(content => {
      Logger.log(`[${spaceName}][${spaceId}] Analytics collection - progress ${i}/${pageCount}`)
      i = i + 1
      return _getRelevantDataForContent(spaceName, content, userDetails, contentType)
    })
}

function _getRelevantDataForContent(spaceName, content, userDetails, contentType = "page") {
  const {id, title, status, parentId, spaceId, authorId, version, createdAt} = content
  const {number: versionNumber, authorId: versionAuthorId, createdAt: versionCreatedAt} = version
  const space = spaceName

  // Get author
  let authorName = ""
  if (userDetails[authorId]) {
    authorName = userDetails[authorId]
  } else {
    const authorDetails = getUser(authorId)
    authorName = authorDetails.publicName
    userDetails[authorId] = authorDetails.publicName
  }
  let versionAuthorName = ""
  if (userDetails[versionAuthorId]) {
    versionAuthorName = userDetails[versionAuthorId]
  } else {
    const authorDetails = getUser(versionAuthorId)
    versionAuthorName = authorDetails.publicName
    userDetails[versionAuthorId] = authorDetails.publicName
  }

  // Return relevant information
  return {
    contentType,
    id,
    title,
    status,
    parentId,
    space,
    spaceId,
    authorId,
    authorName,
    createdAt,
    versionNumber,
    versionAuthorId,
    versionAuthorName,
    versionCreatedAt,
    views: getViews(id).count,
    viewers: getViewers(id).count,
    labels: contentType == "page" ? getLabels(id).results : getBlogpostLabels(id).results
  }
}

function _publishPageDataToDD(contentArr) {
  // INIT
  const pageCount = contentArr.length
  const contentKeys = contentArr.length > 0 ? Object.keys(contentArr[0]) : []

  for (let i = 0; i < pageCount; i++) {
    const content = contentArr[i]
    Logger.log(`Datadog publish metric - progress ${i}/${pageCount}`)
    const contentLabels = content.labels.map(label => `label:${label.name}`) // transform labels into Datadog tags
    const defaultTags = SPACES[content.space].tags
    const tags = contentKeys
      .filter(key => key != "views" && key != "viewers" && key != "labels")
      .map(key => `${key}:${content[key]}`) // transform metadata into Datadog tags
      .concat(defaultTags)
      .concat(contentLabels)
    // Logger.log(tags)

    const metricSeries = [
      buildMetricSerie("confluence.pages.views", 3, content.views, tags),
      buildMetricSerie("confluence.pages.viewers", 3, content.viewers, tags),
      buildMetricSerie("confluence.pages.version_count", 3, content.versionNumber, tags)
    ]
    // Logger.log(metricSeries)

    postMetricSeriesToDatadog(metricSeries)
  }
}