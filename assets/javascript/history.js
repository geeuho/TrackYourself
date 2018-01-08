// Globals
var apiKey = "a6ad2fabb4d3a05e6dbd5453734d01d8";
var appId = "4ca70c03"

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

var loggedInUser = sessionStorage.username;

$(document).ready(function(){
  if(!sessionStorage.username) {
  	window.location = "./index.html";
  }
});

// Listeners
$("#submit-btn").on("click", function(event) {
	event.preventDefault();

	$("#data-results").empty();

	if(validateInput()) {
		extractData();

		$("#chart-div").css("display", "block");
	} else {
		$("#chart-div").css("display", "none");

		$("#data-results").empty();
	}
});

$(document).on("click", ".accordion-displayed", accordionRowHide);
$(document).on("click", ".accordion-hidden", accordionRowDisplay);

$("#start-date-input").on("click", function() {
	$(this).removeClass("red-border");
});

$("#end-date-input").on("click", function() {
	$(this).removeClass("red-border");
});


$(function() {
	$( "#start-date-input" ).datepicker();
	$( "#end-date-input" ).datepicker();
});

/*$(function() {
	$( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
	$( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
});*/
// End Listeners

function validateInput() {
	var startDate = $("#start-date-input").val().trim();
	var endDate = $("#end-date-input").val().trim();

	if(!moment(startDate, "MM/DD/YYYY", true).isValid()) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Please provide a valid start date.", "top");

		$("#start-date-input").addClass("red-border");

		return false;
	}

	if(!moment(endDate, "MM/DD/YYYY", true).isValid()) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Please provide a valid end date.", "top");

		$("#end-date-input").addClass("red-border");

		return false;
	}

	if(startDate.length === 0) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Please specify start date value.", "top");

		$("#start-date-input").addClass("red-border");

		return false;
	}

	if(endDate.length === 0) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Please specify end date value.", "top");

		$("#end-date-input").addClass("red-border");

		return false;
	}

	if(moment(startDate, "MM/DD/YYYY").isAfter(moment(endDate, "MM/DD/YYYY")) || 
			moment(endDate, "MM/DD/YYYY").isBefore(moment(startDate, "MM/DD/YYYY"))) {
		createNotifyMessage("Missing Value", "glyphicon glyphicon-warning-sign", "danger", "Start date must be before or equal to end date.", "top");

		$("#start-date-input").addClass("red-border");
		$("#end-date-input").addClass("red-border");

		return false;
	}

	return true;
}

function accordionRowHide() {
	var siblings = $(this).attr("siblings-class");

	$(this).siblings(".c_" + siblings).fadeOut("fast");
	$(this).removeClass("accordion-displayed");
	$(this).addClass("accordion-hidden");

	// Update glyphicons
	$(this).children("td").removeClass("glyphicon glyphicon-triangle-bottom");
	$(this).children("td").addClass("glyphicon glyphicon-triangle-right");
}

function accordionRowDisplay() {
	var siblings = $(this).attr("siblings-class");

	$(this).siblings(".c_" + siblings).fadeIn("fast");
	$(this).removeClass("accordion-hidden");
	$(this).addClass("accordion-displayed");

	// Update glyphicons
	$(this).children("td").removeClass("glyphicon glyphicon-triangle-right");
	$(this).children("td").addClass("glyphicon glyphicon-triangle-bottom");
}

function extractData() {
	var startDate = moment($("#start-date-input").val().trim(), "MM/DD/YYYY");
	var endDate = moment($("#end-date-input").val().trim(), "MM/DD/YYYY");

	var graphLabels = [];
	var intakeGraphData = [];
	var burnedGraphData = [];

	database.ref('/users/' + loggedInUser).orderByKey().startAt(startDate.format("YYYY-MM-DD")).endAt(endDate.format("YYYY-MM-DD")).once("value")
		.then(function(snapshot) {

				if(!snapshot.exists()) {
					createNotifyMessage("No Data Found", "glyphicon glyphicon-warning-sign", "info", "No data found for the provided date range.", "top");

					$("#chart-div").css("display", "none");

				} else {
					snapshot.forEach(function(datesSnapshot) {

						// Looping through dates
						var dateKey = moment(datesSnapshot.key, "YYYY-MM-DD");

						graphLabels.push(dateKey.format("MM/DD/YYYY"));

						var calorieIntake = 0;
						var caloriesBurned = 0;

						// Date only row
						$("#data-results").append(createDateOnlyRow(dateKey));
						// End row with date only

						var foodRows = 0;
						var exerciseRows = 0;

						var dayCalorieTotal = 0;

						datesSnapshot.forEach(function(dataForDate) {
							dataForDate.forEach(function(data) {
								var type = data.val().type;
								var dataValues = data.val().data;
								var calories = data.val().calories;

								dayCalorieTotal += calories;

								// New row
								var tr = $("<tr></tr>");
								tr.addClass("c_" + dateKey + " data-row");

								// Fill date column with empty cell
								td = $("<td></td>");
								tr.append(td);

								//Hide the row
								tr.css("display", "none");

								if(type === "food") {
									foodRows++;

									td = $("<td></td>");
									td.text(dataValues.mealTime);
									tr.append(td);

									// td = $("<td></td>");
									// td.text(dataValues.servingQty);
									// tr.append(td);

									td = $("<td></td>");
									td.text(dataValues.servingQty + " " + dataValues.foodName);
									tr.append(td);

									// Empty cells for exercise data
									td = $("<td></td>");
									td.text("--");
									tr.append(td);

									td = $("<td></td>");
									td.text("--");
									tr.append(td);
									// End empty cells

									td = $("<td></td>");
									td.text(calories.toFixed(2));
									tr.append(td);
						
									$("#data-results").append(tr);

									calorieIntake += calories;
								} else if(type === "exercise") {
									exerciseRows++;

									// Empty cells for food data
									td = $("<td></td>");
									td.text("--");
									tr.append(td);

									td = $("<td></td>");
									td.text("--");
									tr.append(td);
									// End empty cells

									td = $("<td></td>");
									td.text(dataValues.durationMins + " minutes " + dataValues.exerciseType);
									tr.append(td);

									// td = $("<td></td>");
									// td.text(dataValues.exerciseType);
									// tr.append(td);

									td = $("<td></td>");
									td.text(dataValues.distance);
									tr.append(td);	

									td = $("<td></td>");
									td.text(calories.toFixed(2));
									tr.append(td);	

									$("#data-results").append(tr);

									caloriesBurned += calories;
								}
							});
						});

						// Add calorie total to date only cell
						$("#total-" + dateKey).text("Total:  " + dayCalorieTotal.toFixed(2));

						if(foodRows === 0) {
							var tr = $("<tr></tr>");
							tr.addClass("c_" + dateKey);

							var td = $("<td></td>");
							td.text("No food data found");
							td.attr("colspan", "6");

							tr.append(td);

							tr.css("display", "none");

							$("#data-results").append(tr);
						} else if(exerciseRows === 0) {
							var tr = $("<tr></tr>");
							tr.addClass("c_" + dateKey);

							var td = $("<td></td>");
							td.text("No exercise data found");
							td.attr("colspan", "6");

							tr.append(td);

							tr.css("display", "none");

							$("#data-results").append(tr);
						}

						intakeGraphData.push({date: dateKey.format("MM/DD/YYYY"), intake: calorieIntake.toFixed(2)});
						burnedGraphData.push({date: dateKey.format("MM/DD/YYYY"), burned: caloriesBurned.toFixed(2)});
					});

					var intakeLineColors = ["#ff0000", "#ff4d4d", "#ff9999", "#ffe6e6"];
					var burnedLineColors = ["#008000", "#00b300", "#00e600", "#1aff1a"];

					drawLineChart("myChart", // div_id
		    								intakeGraphData,  // results1
		    								burnedGraphData, // results2
		    								"intake", // yColumn1
			    							"Calorie Intake", // yLabel1
			    							"burned", // yColumn2
			    							"Calories Burned", // yLabel2
										    "date", // xAxes
										    intakeLineColors,
										    burnedLineColors);
				}
	});
}

function createDateOnlyRow(dateKey) {
	// Row with date only for accordion effect
	var tr = $("<tr></tr>");
	tr.addClass("accordion-hidden date-only");
	tr.attr("siblings-class", dateKey);
	tr.attr("id", "row-" + dateKey);

	var td = $("<td></td>");

	var span = $("<span></span>");
	span.text(dateKey.format("MM/DD/YYYY"));

	td.append(span);

	var div = $("<div></div>");
	div.addClass("calorie-total-div");

	span = $("<span></span>");
	span.attr("id", "total-" + dateKey);

	div.append(span);

	td.append(div);

	td.addClass("glyphicon glyphicon-triangle-right");
	
	tr.append(td);

	return tr;
}

/*For future enhancement
function createDateTab(dateKey) {
	var ul = $("#dates-ul");

	var a = $("<a/>");
	a.attr("href", "#" + dateKey);
	a.text(dateKey.format("MM/DD/YYYY"));

	var li = $("<li></li>");
	li.append(a);

	ul.append(li);

	// Append the div containing the results table
	var div = $("<div></div>");
	div.attr("id", "#" + dateKey);
	div.addClass("container");


	div.append(createDataTable(dateKey));

	$("#tabs").append(div);
}*/

/*For future enhacement
function createDataTable(dateKey) {
	var table = $("<table></table>");
	table.addClass("table-hover");

	var thead = $("<thead></thead>");

	var tr = $("<tr></tr>");

	// Add column names
	var th = $("<th></th>");
	th.text("Meal");
	tr.append(th);

	th = $("<th></th>");
	th.text("Quantity");
	tr.append(th);

	th = $("<th></th>");
	th.text("Food");
	tr.append(th);

	th = $("<th></th>");
	th.text("Time");
	tr.append(th);

	th = $("<th></th>");
	th.text("Type");
	tr.append(th);

	th = $("<th></th>");
	th.text("Distance (miles)");
	tr.append(th);

	th = $("<th></th>");
	th.text("Calories");
	tr.append(th);

	table.append(tr);

	var tbody = $("<tbody></tbody>");
	tbody.attr("id", dateKey + "-results");

	table.append(tbody);

	return table;
}*/

function drawLineChart(div_id, intakeResults, burnedResults, intakeYColumn, intakeYLabel, burnedYColumn, burnedYLabel, xAxes, intakeColors, burnedColors) {
	var ctx = document.getElementById(div_id).getContext("2d");

	var width = window.innerWidth || document.body.clientWidth;
	
	var intakeGradientStroke = ctx.createLinearGradient(0, 0, width, 0);
	var burnedGradientStroke = ctx.createLinearGradient(0, 0, width, 0);

	intakeGradientStroke.addColorStop(0, intakeColors[0]);
	intakeGradientStroke.addColorStop(0.3, intakeColors[1]);
	intakeGradientStroke.addColorStop(0.6, intakeColors[2]);
	intakeGradientStroke.addColorStop(1, intakeColors[3]);

	burnedGradientStroke.addColorStop(0, burnedColors[0]);
	burnedGradientStroke.addColorStop(0.3, burnedColors[1]);
	burnedGradientStroke.addColorStop(0.6, burnedColors[2]);
	burnedGradientStroke.addColorStop(1, burnedColors[3]);

	// The labels are the same for both data sets so they are extracted from the intake results
	var labels = intakeResults.map(function(item) {
    return item[xAxes];
	});

	var intakeData = intakeResults.map(function(item) {
  	return item[intakeYColumn];
	});

	var burnedData = burnedResults.map(function(item) {
  	return item[burnedYColumn];
	});

  var myChart = new Chart(ctx, {
		type: "line",
    data: {
    	labels: labels,
      datasets: [
        {
          label: intakeYLabel,
          borderColor: intakeGradientStroke,
          pointBorderColor: intakeGradientStroke,
          pointBackgroundColor: intakeGradientStroke,
          pointHoverBackgroundColor: intakeGradientStroke,
          pointHoverBorderColor: intakeGradientStroke,
          pointBorderWidth: 8,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 1,
          pointRadius: 3,
          fill: false,
          borderWidth: 4,
          data: intakeData
        },
        {
        	label: burnedYLabel,
          borderColor: burnedGradientStroke,
          pointBorderColor: burnedGradientStroke,
          pointBackgroundColor: burnedGradientStroke,
          pointHoverBackgroundColor: burnedGradientStroke,
          pointHoverBorderColor: burnedGradientStroke,
          pointBorderWidth: 8,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 1,
          pointRadius: 3,
          fill: false,
          borderWidth: 4,
          data: burnedData
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
      	display: true,
        position: "top",
      },
      title:{
      	display:true,
        text:"Calorie Intake vs Calories Burned"
      },
      tooltips: {
       	mode: "index",
				intersect: true,
				position: "average",
			},
      scales: {
        yAxes: [
          {
            ticks: {
              fontFamily: "Roboto Mono",
              fontColor: "#ffffff",
              fontStyle: "bold",
              beginAtZero: true,
              maxTicksLimit: 5,
              padding: 20
            },
            gridLines: {
              color: "#ffffff",
              drawTicks: true,
              display: false,
              drawBorder: true
            },
            scaleLabel: {
            	display: true,
            }
          }
        ],
        xAxes: [
        	{
        		gridLines: {
          		zeroLineColor: "transparent"
          	},
            ticks: {
              padding: 20,
              fontColor: "#ffffff",
              fontStyle: "bold",
              fontFamily: "Roboto Mono",
              beginAtZero: true
            },
            gridLines: {
            	color: "#ffffff",
              drawTicks: true,
              display: false,
              drawBorder: true
            },
            scaleLabel: {
            	display: true,
            }
          }
        ]
      }
    }
  });
}

// Notify messages
function createNotifyMessage(title, glyphicon, type, message, from) {
	$.notify({
		title: "<strong>" + title + "</strong> - ",
		icon: glyphicon,
		message: message,
	},{
		type: type,
		animate: {
  	enter: "animated fadeInDown",
  	exit: "animated fadeOutRight"
	},
		placement: {
  		from: from,
  		align: "left"
	},
		offset: 20,
		spacing: 10,
		z_index: 1031,
	});
}