$(document).ready(function() {
    // Previous state management and filter code from 100-hbnb.js
    const apiStatus = $('#api_status');
    const selectedAmenities = {};
    const selectedStates = {};
    const selectedCities = {};

    // ... [Include all previous state management code from 100-hbnb.js] ...

    // Reviews Toggle System
    const reviewCache = {};
    
    $('section.places').on('click', '#reviews-toggle', async function() {
        const toggle = $(this);
        const placeId = toggle.data('place-id');
        const container = toggle.closest('.reviews');

        if (toggle.text() === 'show') {
            if (!reviewCache[placeId]) {
                try {
                    const response = await $.get(
                        `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`
                    );
                    reviewCache[placeId] = response.map(review => `
                        <li>
                            <h3>From ${review.user.first_name} ${review.user.last_name}</h3>
                            <p>${review.text}</p>
                            <em>${new Date(review.created_at).toLocaleDateString()}</em>
                        </li>
                    `).join('');
                } catch (error) {
                    reviewCache[placeId] = '<li>Error loading reviews</li>';
                }
            }
            
            container.find('ul').html(reviewCache[placeId]);
            toggle.text('hide');
        } else {
            container.find('ul').empty();
            toggle.text('show');
        }
    });

    // Modified places rendering with review toggle
    const renderPlaces = (places) => {
        $('section.places').empty().append(
            places.map(place => {
                const article = $('<article>').html(`
                    <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">$${place.price_by_night}</div>
                    </div>
                    <div class="information">
                        ${renderInfoField(place.max_guest, 'Guest')}
                        ${renderInfoField(place.number_rooms, 'Bedroom')}
                        ${renderInfoField(place.number_bathrooms, 'Bathroom')}
                    </div>
                    ${place.description ? `<div class="description">${place.description}</div>` : ''}
                    <div class="reviews">
                        <h2>Reviews 
                            <span id="reviews-toggle" 
                                  data-place-id="${place.id}"
                                  style="cursor: pointer; margin-left: 10px;">show</span>
                        </h2>
                        <ul class="reviews-list" style="display: none;"></ul>
                    </div>
                `);
                return article;
            })
        );
    };

    // Helper function for info fields
    const renderInfoField = (count, singular) => 
        count > 0 ? `
            <div class="max_guest">
                ${count} ${singular}${count !== 1 ? 's' : ''}
            </div>
        ` : '';

    // Maintain existing filter and fetch functionality
    // ... [Keep existing filter and fetch code from 100-hbnb.js] ...
});
