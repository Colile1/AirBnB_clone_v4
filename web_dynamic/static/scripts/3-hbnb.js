$(document).ready(function() {
    // API Status Check
    const apiStatus = $('#api_status');
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/status/',
        success: function(data) {
            apiStatus.toggleClass('available', data.status === 'OK');
        },
        error: function() {
            apiStatus.removeClass('available');
        }
    });

    // Fetch and display places
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function(data) {
            data.forEach(place => {
                const article = $('<article>');
                
                const titleBox = $('<div>').addClass('title_box');
                titleBox.append($('<h2>').text(place.name));
                titleBox.append($('<div>').addClass('price_by_night').text(`$${place.price_by_night}`));

                const information = $('<div>').addClass('information');
                information.append($('<div>').addClass('max_guest')
                    .html(`${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`));
                information.append($('<div>').addClass('number_rooms')
                    .html(`${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`));
                information.append($('<div>').addClass('number_bathrooms')
                    .html(`${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`));

                const description = $('<div>').addClass('description')
                    .html(place.description);

                article.append(titleBox);
                article.append(information);
                article.append(description);
                
                $('section.places').append(article);
            });
        },
        error: function(error) {
            console.error('Error fetching places:', error);
        }
    });

    // Amenities Filter (from previous tasks)
    const selectedAmenities = {};
    $('.amenities input[type="checkbox"]').change(function() {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');
        
        if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }

        const amenitiesList = Object.values(selectedAmenities).join(', ');
        $('.amenities h4').html(amenitiesList || '&nbsp;');
    });
});
