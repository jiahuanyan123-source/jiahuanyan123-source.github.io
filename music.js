const releases = [...document.querySelectorAll('[data-release]')];
const searchInput = document.querySelector('[data-search-input]');
const yearFilter = document.querySelector('[data-year-filter]');
const count = document.querySelector('[data-result-count]');
const empty = document.querySelector('[data-empty]');

function filterCatalog() {
  const query = searchInput.value.trim().normalize('NFKC').toLocaleLowerCase();
  const year = yearFilter.value;
  let songs = 0;
  let albums = 0;
  for (const release of releases) {
    let visible = 0;
    for (const track of release.querySelectorAll('[data-track]')) {
      const matches = (year === 'all' || release.dataset.year === year)
        && track.dataset.search.normalize('NFKC').toLocaleLowerCase().includes(query);
      track.hidden = !matches;
      if (matches) visible += 1;
    }
    release.hidden = visible === 0;
    songs += visible;
    if (visible) albums += 1;
  }
  count.textContent = `${songs} 首歌曲 / ${albums} 项发行`;
  empty.hidden = songs !== 0;
}

searchInput.addEventListener('input', filterCatalog);
yearFilter.addEventListener('change', filterCatalog);
document.querySelector('[data-reset]').addEventListener('click', () => {
  searchInput.value = '';
  yearFilter.value = 'all';
  filterCatalog();
  searchInput.focus();
});
if (window.lucide) window.lucide.createIcons();
document.querySelector('[data-filters]').hidden = false;
