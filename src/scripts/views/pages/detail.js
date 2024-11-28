import UrlParser from '../../routes/url-parser';
import API_ENDPOINT from '../../globals/api-endpoint';
import { createRestaurantDetailTemplate } from '../../views/templates/template-creator';

function startCarousel() {
  const carouselInner = document.querySelector('.carousel-inner');
  let index = 0;

  setInterval(() => {
    index++;
    if (index >= carouselInner.children.length) {
      index = 0;
    }
    carouselInner.style.transform = `translateX(-${index * 100}%)`;
  }, 3000);
}

async function handleReviewSubmission(restaurantId) {
  const form = document.getElementById('reviewForm');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const name = document.getElementById('reviewName').value;
    const review = document.getElementById('reviewText').value;

    try {
      const response = await fetch(API_ENDPOINT.ADD_REVIEW, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: restaurantId,
          name,
          review,
        }),
      });

      const responseData = await response.json();
      if (!responseData.error) {
        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.innerHTML = responseData.customerReviews
          .map(
            (review) => `
              <div class="carousel-item">
                <p>${review.name}</p>
                <p>${review.review}</p>
                <p>${review.date}</p>
              </div>
            `
          )
          .join('');

        form.reset();
        form.insertAdjacentHTML(
          'beforebegin',
          `
          <div class="success-message">Review submitted successfully!</div>
        `
        );
        setTimeout(() => {
          const successMessage = document.querySelector('.success-message');
          if (successMessage) successMessage.remove();
        }, 3000);
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      form.insertAdjacentHTML(
        'beforebegin',
        `
        <div class="error-message">
          Failed to submit review. Please try again later.
        </div>
      `
      );
      setTimeout(() => {
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
      }, 3000);
      console.error('Error submitting review:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Review';
    }
  });
}

async function displayRestaurantDetail(id) {
  const restaurantDetailContainer =
    document.querySelector('.restaurant-detail');

  restaurantDetailContainer.innerHTML = `
    <div class="loader-container">
      <div class="loader"></div>
    </div>
  `;

  try {
    const response = await fetch(API_ENDPOINT.DETAIL(id));
    const data = await response.json();

    if (response.ok) {
      restaurantDetailContainer.innerHTML = createRestaurantDetailTemplate(
        data.restaurant
      );

      const FavoriteButtonInitiator = (
        await import(
          /* webpackChunkName: "favorite-button-initiator" */ '../../utils/favorite-button-initiator'
        )
      ).default;
      FavoriteButtonInitiator.init({
        favoriteButtonContainer: document.querySelector(
          '#favoriteButtonContainer'
        ),
        restaurant: {
          id: data.restaurant.id,
          name: data.restaurant.name,
          pictureId: data.restaurant.pictureId,
          city: data.restaurant.city,
          rating: data.restaurant.rating,
          description: data.restaurant.description,
        },
      });

      startCarousel();
      handleReviewSubmission(id);

      restaurantDetailContainer.removeAttribute('tabindex');
    } else {
      restaurantDetailContainer.innerHTML = `
        <div class="error-message">
          ${data.message || 'Failed to load restaurant details'}
        </div>
      `;
    }
  } catch {
    restaurantDetailContainer.innerHTML = `
      <div class="error-message">
        Error: Failed to connect to the server. Please check your internet connection.
      </div>
    `;
  }
}

const Detail = {
  async render() {
    return `
      <div id="restaurantDetail" class="restaurant-detail"></div>
      <div id="favoriteButtonContainer"></div>
    `;
  },

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();

    const skipToDetailLink = document.getElementById('skipToDetailLink');
    const skipToContentLink = document.getElementById('skipToContentLink');
    skipToDetailLink.classList.remove('hide');
    skipToContentLink.classList.add('hide');

    skipToDetailLink.addEventListener('click', (e) => {
      e.preventDefault();
      const restaurantDetail = document.getElementById('restaurantDetail');
      restaurantDetail.setAttribute('tabindex', '-1');
      restaurantDetail.focus();
    });

    await displayRestaurantDetail(url.id);

    document.addEventListener('keydown', function handleFirstTab(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        skipToDetailLink.focus();
        document.removeEventListener('keydown', handleFirstTab);

        skipToDetailLink.addEventListener(
          'blur',
          function handleSkipLinkBlur() {
            const restaurantDetail =
              document.getElementById('restaurantDetail');
            restaurantDetail.setAttribute('tabindex', '-1');
            restaurantDetail.focus();
            skipToDetailLink.removeEventListener('blur', handleSkipLinkBlur);
          },
          { once: true }
        );
      }
    });
  },
};

export default Detail;
