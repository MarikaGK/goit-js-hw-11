// imports
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// const pixabay data
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34547571-9a733d7c1e3b0ef917f0b0722';

// variables from HTML
const input = document.querySelector('.search-form__input');
const searchBtn = document.querySelector("button[type='submit']");
const resultsDiv = document.querySelector('.search-result');
const paginationDiv = document.querySelector('.pagination');

// pagination button
paginationDiv.innerHTML =
  '<button class="load-more-btn" type="submit">Load more</button>';
const loadMoreBtn = document.querySelector('.load-more-btn');
loadMoreBtn.classList.add('is-hidden');

let pageNum = 1;
let shownHits = 40;

const totalHitsInfo = d => {
  if (pageNum === 1) {
    Notiflix.Notify.info(`Hooray! We found ${d} images.`);
    return;
  }
};

const resetMarkup = e => {
  e.innerHTML = '';
};

// FUNCTIONS

// rendering images from fetch data
function renderImages(r) {
  const hits = r.data.hits;

  // adding images cards to HTML
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

  // initializing simplelightbox
  var lightbox = new SimpleLightbox('.search-result a', {
    captions: true,
    captionsData: 'alt',
    captiondelay: 250,
  });
}

// fetching data from pixabay API
async function getImages() {
  try {
    let inputValue = input.value.trim();
    axios.defaults.baseURL = BASE_URL;
    axios.defaults.params = {
      key: API_KEY,
      q: `${inputValue}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: `40`,
      page: pageNum.toString(),
    };
    const response = await axios.get();
    renderImages(response);
    totalHitsInfo(response.data.total);
    loadMoreImagesBtn(response.data.total);
    return;
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
}

function loadMoreImagesBtn(d) {
  if (d <= shownHits) {
    loadMoreBtn.classList.add('is-hidden');
    return;
  }
  if (shownHits < d) {
    loadMoreBtn.classList.remove('is-hidden');
    shownHits += 40;
    pageNum += 1;
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
  shownHits = 40;
  getImages();
};

// event listeners

searchBtn.addEventListener('click', checkInput);
loadMoreBtn.addEventListener('click', getImages);
