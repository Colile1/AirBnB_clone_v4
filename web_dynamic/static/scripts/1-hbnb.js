$(document).ready(function() {
    const selectedAmenities = {};

    $('div.amenities input[type="checkbox"]').change(function() {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');
        
        if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }

        const amenitiesList = Object.values(selectedAmenities).join(', ');
        $('div.amenities h4').html(amenitiesList.length > 0 
            ? amenitiesList 
            : '&nbsp;');
    });
});
