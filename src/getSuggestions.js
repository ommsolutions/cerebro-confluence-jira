import { memoize } from 'cerebro-tools'
import fetch from 'node-fetch'
import debounce from 'debounce-promise'

/**
 * Get jira and confluence suggestions suggestions for entered query
 * @param  {String} query
 * @return {Promise}
 */
const getSuggestions = (query, settings, target) => {
  if (target === "jira" || target === "jiradue") {
    return getJiraSuggestions(query, settings, target === "jiradue");
  }

  const url = `${settings.jiraUrl}/wiki/rest/api/search?cql=siteSearch%20~%20%22${query}%22&limit=10`
  return fetch(url, {
  	headers: {
  		"Authorization": "Basic " + btoa(`${settings.userName}:${settings.apiToken}`),
  		"Accept": "application/json"
  	}
  })
    .then(response => response.json())
    .then(response => {
    	const baseLink = response._links.base;
    	return (response.results || []).map(result => ({
    		url: baseLink + result.url,
    		title: result.title,
    		excerpt: result.excerpt
    	}));
    })
}

const getJiraSuggestions = (query, settings, due) => {
  const request = fetch(`${settings.jiraUrl}/rest/api/2/search`, {
  method: "POST",
  body: JSON.stringify({
    jql: due ? "assignee = currentUser() AND status = Open ORDER BY duedate ASC" : `text ~ "${query}"`,
        "startAt": 0,
        "maxResults": 15,
        "fields": [
          "summary",
          "issuetype",
          "assignee",
          "duedate"
        ],
  }),
    headers: {
      "Authorization": "Basic " + btoa(`${settings.userName}:${settings.apiToken}`),
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-Atlassian-Token": "no-check",
      "Origin": `${settings.jiraUrl}`
    }
  })
    .then(response => response.json())
    .then(response => {
      const issues = (response.issues || []).map(issue => {
        const iconUrl = issue.fields && issue.fields.issuetype ? issue.fields.issuetype.iconUrl : "";
        return {
          url: `${settings.jiraUrl}/browse/${issue.key}`,
          title: (iconUrl ? `<img src="${iconUrl}" style="width: 16px; height: 16px; margin-bottom: -2px; margin-right: 5px;">` : "") + issue.key + " " + issue.fields.summary,
          excerpt: issue.fields.duedate
        }
      });

      return issues;
    });

    return request;
}

export default memoize(
  debounce(getSuggestions, 200),
  {
    length: false,
    promise: 'then',
    // Expire translation cache in 30 minutes
    maxAge: 5 * 60 * 1000,
    preFetch: false
  })
