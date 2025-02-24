$(document).ready(function() {
    const apiStatus = $('#api_status');
    const selectedAmenities = {};
    let placesLoaded = false;

    // API Status Check
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/status/',
        success: function(data) {
            apiStatus.toggleClass('available', data.status === 'OK');
        }
    });

    // Amenities Filter
    $('.amenities input[type="checkbox"]').change(function() {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');
        $(this).is(':checked') ? 
            selectedAmenities[amenityId] = amenityName : 
            delete selectedAmenities[amenityId];
        
        $('.amenities h4').html(
            Object.values(selectedAmenities).join(', ') || '&nbsp;'
        );
    });

    // Enhanced fetchPlaces function
    const fetchPlaces = (filters = {}) => {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                amenities: Object.keys(selectedAmenities),
                ...filters
            }),
            success: renderPlaces,
            error: (xhr, status, error) => {
                console.error('Places fetch error:', error);
                $('section.places').html('<p>Error loading places</p>');
            }
        });
    };

    // Places rendering function
    const renderPlaces = (places) => {
        $('section.places').empty().append(
            places.map(place => {
                const price = place.price_by_night ? 
                    `$${place.price_by_night}` : 'Price Not Set';
                
                return $('<article>').html(`
                    <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">${price}</div>
                    </div>
                    <div class="information">
                        ${createInfoField(place.max_guest, 'Guest', 'guests')}
                        ${createInfoField(place.number_rooms, 'Bedroom', 'bedrooms')}
                        ${createInfoField(place.number_bathrooms, 'Bathroom', 'bathrooms')}
                    </div>
                    ${place.description ? 
                        `<div class="description">${place.description}</div>` : ''}
                `);
            })
        );
    };

    // Helper function for info fields
    const createInfoField = (count, singular, plural) => 
        count > 0 ? `
            <div class="${plural}">
                ${count} ${count === 1 ? singular : singular + 's'}
            </div>
        ` : '';

    // Initial places load
    fetchPlaces();

    // Filter button click handler
    $('#filter-btn').click(() => {
        if (Object.keys(selectedAmenities).length > 0) {
            fetchPlaces();
        } else {
            alert('Please select at least one amenity to filter');
        }
    });
});
