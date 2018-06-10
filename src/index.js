import React from 'react'

import Preview from './Preview'
import confluenceIconPath from './confluence-icon.png'
import jiraIconPath from './jira-icon.png'

const confluenceId = 'search-confluence'
export const confluenceIcon = confluenceIconPath

const jiraId = 'search-jira'
export const jiraIcon = jiraIconPath

export const order = 1

/**
 * Search term in jira and confluence
 *
 * @param  {String} options.term
 * @param  {Object} options.actions
 * @param  {Function} options.display
 */
export const fn = ({ term, actions, display, settings }) => {
  /**
   * Open browser with google search of term
   * @param  {String} searchTerm
   */
  // eslint-disable-next-line no-var
  var searchConfluence = (searchTerm) => {
    const q = encodeURIComponent(searchTerm)
    actions.open(`${settings.confluenceUrl}/wiki/dosearchsite.action?queryString=${q}`)
    actions.hideWindow()
  }
  // eslint-disable-next-line no-var
  var searchJira = (searchTerm) => {
    const q = encodeURIComponent(searchTerm)
    actions.open(`${settings.jiraUrl}/secure/QuickSearch.jspa?searchString=${q}`)
    actions.hideWindow()
  }

  // eslint-disable-next-line no-var
  var open = (url) => {
    actions.open(url);
    actions.hideWindow();
  }

  if (term.indexOf("c ") === 0) {
    if (!settings.confluenceUrl || !settings.userName || !settings.apiToken) {
      display({
        id: confluenceId,
        icon: confluenceIcon,
        order,
        title: `You need to set the confluence-settings before you can use the search`,
        onKeyDown: (event) => { event.preventDefault(); actions.replaceTerm("Plugins Confluence-Jira"); }
      });
    } else {
      const cTerm = term.substr(2);

      display({
        id: confluenceId,
        icon: confluenceIcon,
        order,
        title: `Search confluence`,
        onSelect: () => searchConfluence(cTerm),
        getPreview: () => <Preview query={cTerm} key={cTerm} open={open} settings={settings} target="confluence" />
      });
    }
  } else if (term.indexOf("j ") === 0) {
    if (!settings.jiraUrl || !settings.userName || !settings.apiToken) {
      display({
        id: confluenceId,
        icon: confluenceIcon,
        order,
        title: `You need to set the confluence-settings before you can use the search`,
        onKeyDown: (event) => { event.preventDefault(); actions.replaceTerm("Plugins Confluence-Jira"); }
      });
    } else {
      const jTerm = term.substr(2);

      display({
        id: jiraId,
        icon: jiraIcon,
        order,
        title: `Search jira`,
        onSelect: () => searchJira(jTerm),
        getPreview: () => <Preview query={jTerm} key={jTerm} open={open} settings={settings} target="jira" />
      });
    }
  } else if (term.indexOf("jd") === 0) {
    if (!settings.jiraUrl || !settings.userName || !settings.apiToken) {
      display({
        id: confluenceId,
        icon: confluenceIcon,
        order,
        title: `You need to set the confluence-settings before you can use the search`,
        onKeyDown: (event) => { event.preventDefault(); actions.replaceTerm("Plugins Confluence-Jira"); }
      });
    } else {
      const jTerm = "jiradue";

      display({
        id: jiraId,
        icon: jiraIcon,
        order,
        title: `Due tasks in jira`,
        onSelect: () => searchJira(jTerm),
        getPreview: () => <Preview query={jTerm} key={jTerm} open={open} settings={settings} target={jTerm} />
      });
    }
  }
}

export const settings = {
  jiraUrl: {
    type: 'string',
    defaultValue: '',
    description: 'The URL of your Jira instance (e.g.: https://xxx.atlassian.net)'
  },
  confluenceUrl: {
    type: 'string',
    defaultValue: '',
    description: 'The URL of your Confluence instance (e.g.: https://xxx.atlassian.net)'
  },
  userName: {
    type: 'string',
    defaultValue: '',
    description: 'Your Jira/Confluence username (most likely the email-address)'
  },
  apiToken: {
    type: 'string',
    defaultValue: '',
    description: 'Your API-Token to access Jira/Confluence (for Cloud-Instances go to: https://id.atlassian.com/manage/api-tokens)'
  },
}
