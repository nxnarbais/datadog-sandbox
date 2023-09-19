function getContentWithAnalytics(contentType = "page") {
    // GET CONTENT
    const res = contentType == "page" ? getPages() : getBlogposts()
  
    // INIT
    const pageCount = res.length
    let i = 0
    const userDetails = {}
  
    // GENERATE CONTENT WITH ANALYTICS
    return res.map(content => {
      Logger.log(`Analytics collection - progress ${i}/${pageCount}`)
      i = i + 1
      return _getRelevantDataForContent(content, userDetails, contentType)
    })
  }
  
  function _getRelevantDataForContent(content, userDetails, contentType = "page") {
    const {id, title, status, parentId, spaceId, authorId, version, createdAt} = content
    const {number: versionNumber, authorId: versionAuthorId, createdAt: versionCreatedAt} = version
    const space = spaceId == SPACE_ID_1 ? "KEY_1" : spaceId == SPACE_ID_2 ? "KEY_2" : null
  
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
  
  function getConfluencePagesWithAnalyticsAndPublishToDD() {
    const pages = getContentWithAnalytics("page")
    _publishPageDataToDD(pages)
    const blogposts = getContentWithAnalytics("blogpost")
    _publishPageDataToDD(blogposts)
  }
  
  function _publishPageDataToDD(contentArr) {
    // INIT
    const pageCount = contentArr.length
    const contentKeys = contentArr.length > 0 ? Object.keys(contentArr[0]) : []
  
    for (let i = 0; i < pageCount; i++) {
      const content = contentArr[i]
      Logger.log(`Datadog publish metric - progress ${i}/${pageCount}`)
      const contentLabels = content.labels.map(label => `label:${label.name}`) // transform labels into Datadog tags
      const tags = contentKeys
        .filter(key => key != "views" && key != "viewers" && key != "labels")
        .map(key => `${key}:${content[key]}`) // transform metadata into Datadog tags
        .concat(DD_TAGS)
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