import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Loading, KeyboardNav, KeyboardNavItem } from 'cerebro-ui'
import Preload from './Preload'
import getSuggestions from '../getSuggestions'
import styles from './styles.css'

const replaceHighlighter = (input) => input ? input.replace(/@@@hl@@@/g, "<strong>").replace(/@@@endhl@@@/g, "</strong>") : "";

class Preview extends Component {
  renderSuggestions(suggestions, openFn) {
    const className = [
      styles.wrapper
    ].join(' ')
    return (
      <div className={className}>
        <KeyboardNav>
          <ul className={styles.list}>
            {
              suggestions.map((s, i) => (
                <KeyboardNavItem
                  key={i}
                  tagName={'li'}
                  onSelect={() => openFn(s.url)}
                >
                  <h4 dangerouslySetInnerHTML={{__html: replaceHighlighter(s.title)}}></h4>
                  {s.excerpt &&
                    <small dangerouslySetInnerHTML={{__html: replaceHighlighter(s.excerpt)}}></small>
                  }
                </KeyboardNavItem>
              ))
            }
          </ul>
        </KeyboardNav>
      </div>
    )
  }
  render() {
    const { query, open, target, settings } = this.props
    return (
      <Preload promise={getSuggestions(query, settings, target)} loader={<Loading />}>
        {(suggestions) => this.renderSuggestions(suggestions || [], open)}
      </Preload>
    )
  }
}

Preview.propTypes = {
  query: PropTypes.string.isRequired,
  open: PropTypes.func.isRequired
}

export default Preview
