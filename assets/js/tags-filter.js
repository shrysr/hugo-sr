document.addEventListener('DOMContentLoaded', function() {
  const tagSelectables = document.querySelectorAll('.tag-selectable');
  const postItems = document.querySelectorAll('.post-item');
  const selectedTagsList = document.getElementById('selected-tags-list');
  const clearAllButton = document.getElementById('clear-all');
  const postCount = document.getElementById('post-count');
  const activeFiltersSection = document.getElementById('active-filters');
  const noResults = document.getElementById('no-results');
  const tagSearch = document.getElementById('tag-search');
  const noTagsFound = document.getElementById('no-tags-found');
  const filterModeToggle = document.getElementById('filter-mode-toggle');
  const filterModeSpan = document.getElementById('filter-mode');
  const filterExplanationText = document.getElementById('filter-explanation-text');
  
  // Debug: Check if elements are found
  console.log('Tag search element found:', tagSearch ? 'YES' : 'NO');
  console.log('Tag selectables found:', tagSelectables.length);
  console.log('NoTagsFound element found:', noTagsFound ? 'YES' : 'NO');
  
  let selectedTags = new Set();
  let filterMode = 'OR'; // 'OR' or 'AND'

  // Tag search functionality - improved with fuzzy search
  function filterTagButtons() {
    if (!tagSearch) {
      console.error('tagSearch element not found!');
      return;
    }
    
    const searchTerm = tagSearch.value.toLowerCase().trim();
    let visibleTagCount = 0;
    
    console.log('Filtering with search term:', searchTerm);
    
    tagSelectables.forEach(button => {
      const tagName = button.getAttribute('data-search');
      
      // Semantic fuzzy search: match words and word boundaries
      let shouldShow = false;
      if (searchTerm === '') {
        shouldShow = true;
      } else {
        const originalTagName = button.getAttribute('data-tag') || '';
        const displayName = originalTagName.toLowerCase();
        
        // Split search term into words
        const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
        
        // Check different matching strategies with priority order
        shouldShow = searchWords.every(word => {
          // Priority 1: Exact word match at word boundaries
          const camelCaseWords = originalTagName.split(/(?=[A-Z])/).map(w => w.toLowerCase());
          if (camelCaseWords.some(w => w === word)) {
            return true;
          }
          
          // Priority 2: Word starts with search term
          if (camelCaseWords.some(w => w.startsWith(word))) {
            return true;
          }
          
          // Priority 3: Direct substring match (but only for longer search terms)
          if (word.length >= 3 && (tagName.includes(word) || displayName.includes(word))) {
            return true;
          }
          
          // Priority 4: Tag starts with search term
          if (tagName.startsWith(word) || displayName.startsWith(word)) {
            return true;
          }
          
          // Priority 5: Acronym matching - for 2+ character searches
          if (word.length >= 2) {
            const acronym = originalTagName.replace(/[a-z]/g, '').toLowerCase();
            if (acronym.includes(word)) {
              return true;
            }
          }
          
          // Priority 6: Fuzzy matching only for 3+ characters and must start at word boundary
          if (word.length >= 3) {
            // Check if fuzzy match starts at beginning of a camelCase word
            for (const camelWord of camelCaseWords) {
              let searchIndex = 0;
              for (let i = 0; i < camelWord.length && searchIndex < word.length; i++) {
                if (camelWord[i] === word[searchIndex]) {
                  searchIndex++;
                }
              }
              if (searchIndex === word.length && searchIndex > 0) {
                return true;
              }
            }
          }
          
          return false;
        });
      }
      
      if (shouldShow) {
        button.style.setProperty('display', 'inline-block', 'important');
        visibleTagCount++;
      } else {
        button.style.setProperty('display', 'none', 'important');
      }
    });
    
    console.log('Visible tag count:', visibleTagCount);
    if (noTagsFound) {
      noTagsFound.style.display = visibleTagCount === 0 && searchTerm !== '' ? 'block' : 'none';
    }
  }

  // Add event listener with error handling
  if (tagSearch) {
    tagSearch.addEventListener('input', filterTagButtons);
    console.log('Event listener added to tag search input');
  } else {
    console.error('tagSearch element not found - cannot add event listener!');
  }

  // Filter mode toggle functionality
  function toggleFilterMode() {
    filterMode = filterMode === 'OR' ? 'AND' : 'OR';
    updateFilterModeDisplay();
    filterPosts();
  }

  function updateFilterModeDisplay() {
    filterModeSpan.textContent = filterMode;
    
    if (filterMode === 'OR') {
      filterExplanationText.innerHTML = 'Showing posts that have <strong>any</strong> of the selected tags';
    } else {
      filterExplanationText.innerHTML = 'Showing posts that have <strong>all</strong> of the selected tags';
    }
  }

  filterModeToggle.addEventListener('click', toggleFilterMode);

  function updateSelectedTags() {
    selectedTagsList.innerHTML = '';
    
    if (selectedTags.size === 0) {
      activeFiltersSection.style.display = 'none';
      return;
    }
    
    activeFiltersSection.style.display = 'block';
    
    selectedTags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'selected-tag';
      span.innerHTML = `${tag}<button class="remove-tag" data-tag="${tag}">×</button>`;
      selectedTagsList.appendChild(span);
    });
  }

  function filterPosts() {
    let visibleCount = 0;
    
    postItems.forEach(post => {
      const postTagsString = post.getAttribute('data-tags');
      if (!postTagsString) {
        post.classList.add('hidden');
        return;
      }
      
      const postTags = postTagsString.split(',').map(tag => tag.trim().toLowerCase());
      
      let shouldShow = true;
      if (selectedTags.size > 0) {
        const selectedTagsLower = Array.from(selectedTags).map(tag => tag.toLowerCase());
        
        if (filterMode === 'OR') {
          // OR filtering: show if post has ANY of the selected tags
          shouldShow = selectedTagsLower.some(selectedTag => 
            postTags.includes(selectedTag)
          );
        } else {
          // AND filtering: show if post has ALL of the selected tags
          shouldShow = selectedTagsLower.every(selectedTag => 
            postTags.includes(selectedTag)
          );
        }
      }
      
      if (shouldShow) {
        post.classList.remove('hidden');
        visibleCount++;
      } else {
        post.classList.add('hidden');
      }
    });

    // Update count and results
    postCount.textContent = `(${visibleCount})`;
    noResults.style.display = (selectedTags.size > 0 && visibleCount === 0) ? 'block' : 'none';
  }

  // Event handlers for tag selection
  tagSelectables.forEach(tag => {
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      const tagName = this.getAttribute('data-tag');
      
      if (selectedTags.has(tagName)) {
        selectedTags.delete(tagName);
        this.classList.remove('selected');
      } else {
        selectedTags.add(tagName);
        this.classList.add('selected');
      }
      
      updateSelectedTags();
      filterPosts();
    });
  });

  // Event handler for removing selected tags
  selectedTagsList.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-tag')) {
      const tag = e.target.getAttribute('data-tag');
      selectedTags.delete(tag);
      
      // Update the selectable tag appearance
      const selectableTag = document.querySelector(`.tag-selectable[data-tag="${tag}"]`);
      if (selectableTag) {
        selectableTag.classList.remove('selected');
      }
      
      updateSelectedTags();
      filterPosts();
    }
  });

  // Clear all filters
  clearAllButton.addEventListener('click', function() {
    selectedTags.clear();
    tagSelectables.forEach(tag => tag.classList.remove('selected'));
    updateSelectedTags();
    filterPosts();
  });

  // Initialize the page
  updateFilterModeDisplay();
  filterPosts();
});