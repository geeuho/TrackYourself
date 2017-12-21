$('#submit-btn').on('click', function(){
	var userInput = $('#user-input').val().trim();

	callNutritionixNaturalLanguage(userInput);
});

function callNutritionixInstantSearch() {
	var apiKey = 'a6ad2fabb4d3a05e6dbd5453734d01d8';
	var appId = '4ca70c03'

	var food = 'peanut butter sandwich';

	var queryURL = 'https://trackapi.nutritionix.com/v2/search/instant?query=' + food;
	console.log(queryURL);

	$.ajax({
        url: queryURL,
        method: "GET",
        headers: {'x-app-id': appId, 'x-app-key': apiKey},
    }).done(function(response) {
    	console.log(response);
    });
}

function callNutritionixNaturalLanguage(userInput) {
	var apiKey = 'a6ad2fabb4d3a05e6dbd5453734d01d8';
	var appId = '4ca70c03'

	// For DEBUG only
	//var food = '1 peanut butter sandwich';

	var queryURL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';

	$.ajax({
        url: queryURL,
        headers: {'x-app-id': appId, 'x-app-key': apiKey},
        method: "POST",
        data: {query: userInput,
        	timezone: 'US/Pacific',
        	},
    }).done(function(response) {
    	console.log(response.foods[0]);

    	// New row
    	var tr = $('<tr></tr>');

    	var td = $('<td></td>');
    	
    	var imageUrl = response.foods[0].photo.thumb;
    	console.log(imageUrl);

    	var img = $('<img/>');
    	img.attr('src', imageUrl);
    	img.attr('alt', 'food image');

    	td.append(img);
    	tr.append(td);

    	td = $('<td></td>');
    	td.text(response.foods[0].serving_qty);
    	tr.append(td);

    	td = $('<td></td>');
    	td.text(response.foods[0].serving_unit);
    	tr.append(td);

    	td = $('<td></td>');
    	td.text(response.foods[0].food_name);
    	tr.append(td);

    	td = $('<td></td>');
    	td.text(response.foods[0].nf_calories);
    	tr.append(td);

    	$('#result-rows').append(tr);
    });
}