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
  
  let selectedTags = new Set();
  let filterMode = 'OR'; // 'OR' or 'AND'

  // Tag search functionality
  function filterTagButtons() {
    const searchTerm = tagSearch.value.toLowerCase().trim();
    let visibleTagCount = 0;
    
    tagSelectables.forEach(button => {
      const tagName = button.getAttribute('data-search');
      const shouldShow = searchTerm === '' || tagName.includes(searchTerm);
      
      if (shouldShow) {
        button.style.display = 'inline-block';
        visibleTagCount++;
      } else {
        button.style.display = 'none';
      }
    });
    
    noTagsFound.style.display = visibleTagCount === 0 ? 'block' : 'none';
  }

  tagSearch.addEventListener('input', filterTagButtons);

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