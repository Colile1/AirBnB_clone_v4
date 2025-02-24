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

    // Amenities Filter (from previous task)
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
