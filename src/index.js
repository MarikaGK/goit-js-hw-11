import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34547571-9a733d7c1e3b0ef917f0b0722';

const input = document.querySelector('.search-form__input');
const searchBtn = document.querySelector("button[type='submit']");
const resultsDiv = document.querySelector('.search-result');
const paginationDiv = document.querySelector('.pagination');
paginationDiv.innerHTML =
  '<button class="load-more-btn" type="submit">Load more</button>';
const loadMoreBtn = document.querySelector('.load-more-btn');

let pageNum = 1;

const totalHitsInfo = d => {
  Notiflix.Notify.info(`Hooray! We found ${d} images.`);
};

const resetMarkup = e => {
  e.innerHTML = '';
};

function renderImages(r) {
  const hits = r.data.hits;
  console.log(hits);
  const renderedImages = hits
    .map(e => {
      return `<div class="photo-card">
    <a href="${e.largeImageURL}">
    <img class="photo" src="${e.previewURL}" alt="${e.tags}" loading="lazy" />
    </a>
    <div class="info">
    <p class="info-item">
    <b>Likes</b>${e.likes}
    </p>
    <p class="info-item">
    <b>Views</b>${e.views}
    </p>
    <p class="info-item">
        <b>Comments</b>${e.comments}
      </p>
      <p class="info-item">
      <b>Downloads</b>${e.downloads}
      </p>
    </div>
  </div>`;
    })
    .join('');
  resultsDiv.insertAdjacentHTML('beforeend', renderedImages);
  var lightbox = new SimpleLightbox('.search-result a', {
    captions: true,
    captionsData: 'alt',
    captiondelay: 250,
  });
}

async function getImages(name, page) {
  try {
    axios.defaults.baseURL = BASE_URL;
    axios.defaults.params = {
      key: API_KEY,
      q: `${name}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: `40`,
      page: page.toString(),
    };
    const response = await axios.get();
    renderImages(response);
    totalHitsInfo(response.data.total);
    loadMoreImages(response.data.total);
    return;
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
}

function loadMoreImages(d) {
  let shownHits = 40;
  if (d <= shownHits) {
    loadMoreBtn.classList.add('is-hidden');
    return;
  }
  if (shownHits < d) {
    loadMoreBtn.classList.remove('is-hidden');
    shownHits += 40;
    pageNum += 1;
    getImages(input.value.trim(), pageNum);
    return;
  }
}

const checkInput = e => {
  e.preventDefault();
  const inputValueTrimmed = input.value.trim();
  resetMarkup(resultsDiv);
  if (!inputValueTrimmed) {
    return Notiflix.Notify.info('Fill the search field');
  }
  if (inputValueTrimmed.length > 100) {
    return Notiflix.Notify.warning('This value may not exceed 100 characters');
  }
  pageNum = 1;
  getImages(inputValueTrimmed, pageNum);
};

// input.addEventListener('active', styleActiveForm);

searchBtn.addEventListener('click', checkInput);
loadMoreBtn.addEventListener('click', loadMoreImages);

loadMoreBtn.classList.add('is-hidden');
