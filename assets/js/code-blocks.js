/**
 * code-blocks.js
 *
 * Enhances Hugo Chroma-highlighted code blocks with:
 *   1. Header bar: language label (top-right) + optional collapse toggle
 *   2. Collapsible behaviour: blocks with >= MIN_COLLAPSIBLE_LINES default to collapsed,
 *      showing a short preview. Smaller blocks get the header only.
 *
 * CSS companion: assets/css/code-blocks.css
 *   - Zebra striping:  .highlight .line:nth-child(even)
 *   - Header styles:   .code-header, .code-lang, .code-toggle
 *   - Collapse:        .code-content-wrapper, .is-collapsed, gradient ::after
 */

(function () {
  'use strict';

  /** Lines needed to make a block collapsible. */
  var MIN_COLLAPSIBLE_LINES = 10;

  /**
   * Collapsed preview height in rem (~3 lines of code).
   * Accounts for pre top-padding (1.25rem) + 3 lines (0.9rem × 1.7 each).
   */
  var COLLAPSED_REM = 7;

  /** Transition duration in ms — must match CSS if you ever add a fallback there. */
  var TRANSITION_MS = 300;

  /** Convert rem to px using the root font size. */
  function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  /**
   * Smoothly collapse a content wrapper.
   * Sets max-height from its current scrollHeight down to the preview height.
   */
  function collapseWrapper(wrapper, header) {
    var fullPx = wrapper.scrollHeight;
    var collapsedPx = remToPx(COLLAPSED_REM);

    /* Pin the current full height first (no visible change). */
    wrapper.style.maxHeight = fullPx + 'px';
    /* Force a reflow so the browser registers the starting value. */
    /* eslint-disable-next-line no-unused-expressions */
    wrapper.offsetHeight;

    wrapper.style.transition = 'max-height ' + TRANSITION_MS + 'ms ease';
    wrapper.style.maxHeight = collapsedPx + 'px';
    wrapper.classList.add('is-collapsed');
    header.setAttribute('aria-expanded', 'false');

    /* Remove the inline transition after it completes. */
    wrapper.addEventListener('transitionend', function cleanup() {
      wrapper.style.transition = '';
      wrapper.removeEventListener('transitionend', cleanup);
    });
  }

  /**
   * Smoothly expand a content wrapper.
   * Animates max-height from preview height to the content's scrollHeight,
   * then removes the constraint entirely so the block flows freely.
   */
  function expandWrapper(wrapper, header) {
    /* scrollHeight gives the full content height even when clipped. */
    var fullPx = wrapper.scrollHeight;

    wrapper.style.transition = 'max-height ' + TRANSITION_MS + 'ms ease';
    wrapper.style.maxHeight = fullPx + 'px';
    wrapper.classList.remove('is-collapsed');
    header.setAttribute('aria-expanded', 'true');

    wrapper.addEventListener('transitionend', function cleanup() {
      /* Remove max-height constraint so the block handles re-paints naturally. */
      wrapper.style.maxHeight = 'none';
      wrapper.style.transition = '';
      wrapper.removeEventListener('transitionend', cleanup);
    });
  }

  /**
   * Build and insert the header bar for a single .highlight block.
   * Returns the header element (or null if nothing was inserted).
   */
  function buildHeader(highlight, lang, isCollapsible) {
    /* Skip if there is nothing to show in the header. */
    if (!lang && !isCollapsible) return null;

    var header = document.createElement('div');
    header.className = 'code-header' + (isCollapsible ? ' code-header--collapsible' : '');

    /* Language label — omit for plain-text or unlabelled blocks. */
    if (lang && lang !== 'text') {
      var langSpan = document.createElement('span');
      langSpan.className = 'code-lang';
      langSpan.textContent = lang.toUpperCase();
      header.appendChild(langSpan);
    }

    /* Chevron toggle — only for collapsible blocks. */
    if (isCollapsible) {
      var toggle = document.createElement('span');
      toggle.className = 'code-toggle';
      toggle.setAttribute('aria-hidden', 'true');
      toggle.textContent = '▾';
      header.appendChild(toggle);

      /* Accessibility: make header keyboard-operable as a button. */
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', 'false');
    }

    /* Insert header as the first child of .highlight. */
    highlight.insertBefore(header, highlight.firstChild);
    return header;
  }

  /**
   * Wrap the <pre> element in a .code-content-wrapper div so we can
   * animate max-height independently of the header bar.
   */
  function wrapPre(pre) {
    var wrapper = document.createElement('div');
    wrapper.className = 'code-content-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    return wrapper;
  }

  /** Initialise all .highlight blocks on the page. */
  function initCodeBlocks() {
    var highlights = document.querySelectorAll('.highlight');

    highlights.forEach(function (highlight) {
      /* Resolve language from the code element's data-lang attribute. */
      var codeEl = highlight.querySelector('code[data-lang]');
      var lang = codeEl ? codeEl.getAttribute('data-lang') : null;

      /* Count visible lines to decide whether the block should collapse. */
      var lineCount = highlight.querySelectorAll('.line').length;
      var isCollapsible = lineCount >= MIN_COLLAPSIBLE_LINES;

      /* Build and insert the header bar. */
      var header = buildHeader(highlight, lang, isCollapsible);

      /* Wrap the <pre> in the content wrapper. */
      var pre = highlight.querySelector('pre');
      if (!pre) return;
      var wrapper = wrapPre(pre);

      if (isCollapsible && header) {
        /* Set initial collapsed state without animation. */
        wrapper.style.maxHeight = remToPx(COLLAPSED_REM) + 'px';
        wrapper.classList.add('is-collapsed');

        /* Toggle on click. */
        header.addEventListener('click', function () {
          if (wrapper.classList.contains('is-collapsed')) {
            expandWrapper(wrapper, header);
          } else {
            collapseWrapper(wrapper, header);
          }
        });

        /* Toggle on keyboard Enter / Space. */
        header.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
          }
        });
      }
    });
  }

  /* Run after the DOM is ready. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeBlocks);
  } else {
    initCodeBlocks();
  }
})();
