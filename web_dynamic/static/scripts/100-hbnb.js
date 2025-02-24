$(document).ready(function() {
    const apiStatus = $('#api_status');
    const selectedAmenities = {};
    const selectedStates = {};
    const selectedCities = {};

    // API Status Check
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/status/',
        success: function(data) {
            apiStatus.toggleClass('available', data.status === 'OK');
        }
    });

    // Generic checkbox handler
    const createCheckboxHandler = (storage, parentStorage = null) => function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        
        if ($(this).is(':checked')) {
            storage[id] = name;
            if (parentStorage) parentStorage[id] = name;
        } else {
            delete storage[id];
            if (parentStorage) delete parentStorage[id];
        }
        
        updateLocationsHeader();
    };

    // Update locations header text
    const updateLocationsHeader = () => {
        const locations = [
            ...Object.values(selectedStates),
            ...Object.values(selectedCities)
        ];
        $('.locations h4').html(
            locations.join(', ') || '&nbsp;'
        );
    };

    // Event handlers
    $('.amenities input[type="checkbox"]').change(function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        $(this).is(':checked') ? 
            selectedAmenities[id] = name : 
            delete selectedAmenities[id];
        $('.amenities h4').html(
            Object.values(selectedAmenities).join(', ') || '&nbsp;'
        );
    });

    $('.state input[type="checkbox"]').change(
        createCheckboxHandler(selectedStates)
    );

    $('.city input[type="checkbox"]').change(
        createCheckboxHandler(selectedCities, selectedStates)
    );

    // Enhanced fetch function
    const fetchPlaces = () => {
        const filters = {
            amenities: Object.keys(selectedAmenities),
            states: Object.keys(selectedStates),
            cities: Object.keys(selectedCities)
        };

        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(filters),
            success: renderPlaces,
            error: () => $('section.places').html('<p>Error loading places</p>')
        });
    };

    // Rendering function
    const renderPlaces = (places) => {
        $('section.places').empty().append(
            places.map(place => $('<article>').html(`
                <div class="title_box">
                    <h2>${place.name}</h2>
                    <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                    <div class="max_guest">
                        ${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}
                    </div>
                    <div class="number_rooms">
                        ${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}
                    </div>
                    <div class="number_bathrooms">
                        ${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}
                    </div>
                </div>
                ${place.description ? `<div class="description">${place.description}</div>` : ''}
            `))
        );
    };

    // Initial load
    fetchPlaces();

    // Filter button handler
    $('#filter-btn').click(() => {
        if (Object.keys(selectedAmenities).length > 0 ||
            Object.keys(selectedStates).length > 0 ||
            Object.keys(selectedCities).length > 0) {
            fetchPlaces();
        } else {
            alert('Please select at least one filter');
        }
    });
});
