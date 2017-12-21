// Calls the Nutritionix natural language search API with the
// provided user input
function callNutritionixNaturalSearch(mealTime, quantity, food, executeThisWhenComplete) {
	var apiKey = 'a6ad2fabb4d3a05e6dbd5453734d01d8';
	var appId = '4ca70c03'

	// For DEBUG only
	//var food = '1 peanut butter sandwich';

	var queryURL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';

	$.ajax({
        url: queryURL,
        headers: {'x-app-id': appId, 'x-app-key': apiKey},
        method: "POST",
        data: {
            query: userInput,
            timezone: 'US/Pacific',
        },
    }).done(function(response) {
    	//console.log(response.foods[0]);

        return response;
    });
}