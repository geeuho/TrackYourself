// Globals
var apiKey = 'a6ad2fabb4d3a05e6dbd5453734d01d8';
var appId = '4ca70c03'

// Listeners
$('#food-submit-btn').on('click', function(){
	// Get meal time
	var mealTime = $('#meal-time-input option:selected').text();
	var quantity = $('#quantity-input').val().trim();
	var food = $('#food-input').val().trim();

	populateFoodTable(mealTime, quantity, food);
});

$(document).on('click', '.delete-food-row', removeRowFromFoodTable);

var populateFoodTable = function(mealTime, quantity, food) {
	var userInput = mealTime + ' ' + quantity + ' ' + food;

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
    	
    	for(var i=0; i< response.foods.length; i++) {
				// Create a new row for the food item
		    var food = response.foods[i];

		    // New row
		    var tr = $('<tr></tr>');

		    // New cell
		    var td = $('<td></td>');
		    td.text(mealTime)
		    tr.append(td);

		    // New cell
		    var td = $('<td></td>');
		    td.text(food.food_name);
		    tr.append(td);

		    // New cell
		    td = $('<td></td>');
		    td.text(food.serving_qty);
		    tr.append(td);

		    // New cell
		    td = $('<td></td>');
		    td.text(food.nf_calories);
		    tr.append(td);

		    // New cell, contains delete button
		    td = $('<td></td>');

		    var button = $('<button></button>');
		    button.text('Delete');
		    button.addClass('btn btn-primary delete-food-row');

		    td.append(button);
		    tr.append(td);

		    // Append row to table body
		    $('#food-results').append(tr);
			}
    });
}

function removeRowFromFoodTable() {
	// The button is nested within a <td> so the parent method has 
	// to be called twice in order to traverse up the tree
	var rowToRemove = $(this).parent().parent();

	$(rowToRemove).remove();
}