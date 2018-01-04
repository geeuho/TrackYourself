// Globals
var apiKey = 'a6ad2fabb4d3a05e6dbd5453734d01d8';
var appId = '4ca70c03';

// Initialize Firebase
var config = {
	apiKey: "AIzaSyCtZlEIl3iT_WHQdOvvxzu8LyFjueJUg5A",
	authDomain: "trackyourself-1e739.firebaseapp.com",
	databaseURL: "https://trackyourself-1e739.firebaseio.com",
	projectId: "trackyourself-1e739",
	storageBucket: "",
	messagingSenderId: "345964565415"
};

firebase.initializeApp(config);

var database = firebase.database();

// Listeners
$('#food-submit-btn').on('click', function(){
	// Get meal time
	var mealTime = $('#meal-time-input option:selected').text();
	var quantity = $('#quantity-input').val().trim();
	var food = $('#food-input').val().trim();

	populateFoodTable(mealTime, quantity, food);

	// Clear inputs
	$('#quantity-input').val('');
	$('#food-input').val('');
});

$('#exercise-submit-btn').on('click', function(){
	var durationMins = $('#exercise-duration-input').val().trim();
	var exercise = $('#exercise-dropdown-input option:selected').text();

	if(exercise.length === 0) {
		exercise = $('#exercise-string-input').val().trim();
	}

	// Appending the word 'minutes' to duration input in order
	// to facilitate Nutritionix natural language API
	durationMins = durationMins + ' minutes';

	populateExerciseTable(durationMins, exercise);

	// Clear inputs
	$('#exercise-duration-input').val('');

	if($('#exercise-string-input').val().length > 0) {
		$('#exercise-string-input').val('');
	} else {
		$($('#exercise-dropdown-input').children()[0]).prop('selected', true);
	}
});

$(document).on('click', '.delete-row', removeRowFromTable);

$('#save-btn').on('click', function() {
	// Check if there is anything to save
	var foodResults = $('#food-results').children('tr');

	var exerciseResults = $('#exercise-results').children('tr');

	if(foodResults.length === 0) {
		console.log('No food data to save.');

	} else {
		saveFoodRows(foodResults);
	}

	if(exerciseResults.length === 0) {
		console.log('No exercise data to save.');

	} else {
		saveExerciseRows(exerciseResults);
	}
});

function populateFoodTable(mealTime, quantity, food) {
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
		    td.attr('value', 'mealTime');
		    tr.append(td);

		    // New cell Food
		    var td = $('<td></td>');
		    td.text(food.food_name);
		    td.attr('value', 'foodName');
		    tr.append(td);

		    // New cell Quantity
		    td = $('<td></td>');
		    td.text(food.serving_qty);
		    td.attr('value', 'servingQty');
		    tr.append(td);

		    // New cell Calories
		    td = $('<td></td>');
		    td.text(food.nf_calories);
		    td.attr('value', 'calories');
		    tr.append(td);

		    // New cell, contains delete button
		    td = $('<td></td>');

		    var button = $('<button></button>');
		    button.text('Delete');
		    button.addClass('btn btn-primary delete-row');

		    td.append(button);
		    tr.append(td);

		    // Append row to table body
		    $('#food-results').append(tr);
			}
    });
}

function populateExerciseTable(durationInMinutes, exercise) {
	var apiKey = 'a6ad2fabb4d3a05e6dbd5453734d01d8';    
	var appId = '4ca70c03'

  var queryURL = 'https://trackapi.nutritionix.com/v2/natural/exercise';

  var combinedInput = durationInMinutes + ' ' + exercise;

	$.ajax({
		url: queryURL,
    headers: {'x-app-id': appId, 'x-app-key': apiKey},
    method: "POST",
    data: {
        query: combinedInput,
    },
	}).done(function(response) {
		
		for(var i=0; i< response.exercises.length; i++) {
			var exercise = response.exercises[0];

			// New row
			var tr = $('<tr></tr>');

			// New cell Time
			var td = $('<td></td>');
			td.text(exercise.duration_min);
			td.attr('value', 'durationMins');
			tr.append(td);

			// New cell Type
			td = $('<td></td>');
			td.text(exercise.name);
			td.attr('value', 'exerciseType');
			tr.append(td);

			// Empty cell Distance
			td = $('<td></td>');
			td.text('');
			td.attr('value', 'distance');
			tr.append(td);

			// New cell Calories Burned
			td = $('<td></td>');
			td.text(exercise.nf_calories);
			td.attr('value', 'caloriesBurned');
			tr.append(td);

			// New cell, contains delete button
	    td = $('<td></td>');

	    var button = $('<button></button>');
	    button.text('Delete');
	    button.addClass('btn btn-primary delete-row');

	    td.append(button);
	    tr.append(td);

			$('#exercise-results').append(tr);
		}
	});    
}

function removeRowFromTable() {
	// The button is nested within a <td> so the parent method has 
	// to be called twice in order to traverse up the tree
	var rowToRemove = $(this).parent().parent();

	$(rowToRemove).remove();
}

function saveFoodRows(foodResults) {
	var todaysDate = moment($('#date').text(), 'ddd MMM DD YYYY');

	var dataObj = {};

	for(var i=0; i<foodResults.children().length; i++) {
		if($(foodResults.children()[i]).text() === 'Delete') {
			database.ref('/' + todaysDate.format('x') + '/food').push().set(dataObj);

			// Create a new object for the next set of data
			dataObj = {};
		} else {
			dataObj[$(foodResults.children()[i]).attr('value')] = $(foodResults.children()[i]).text();
		}		
	}
}

function saveExerciseRows(exerciseResults) {
	var todaysDate = moment($('#date').text(), 'ddd MMM DD YYYY');

	var dataObj = {};

	for(var i=0; i<exerciseResults.children().length; i++) {
		if($(exerciseResults.children()[i]).text() === 'Delete') {
			database.ref('/' + todaysDate.format('x') + '/exercise').push().set(dataObj);

			// Create a new object for the next set of data
			dataObj = {};
		} else {
			dataObj[$(exerciseResults.children()[i]).attr('value')] = $(exerciseResults.children()[i]).text();
		}		
	}
}