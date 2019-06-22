$('#login-btn').click(function() {
    var username = $('#username').val();
    var password = $('#password').val();

    console.log(username);
    console.log(password);

    if (username == "admin" && password == "p@ssword") {
        localStorage.setItem("login", 1);
        checkIfLoggedIn();
    } else {
        $('#login-error').show();
    }
});

function checkIfLoggedIn() {
    var loginStatus = localStorage.getItem('login');
    if (loginStatus == 1) {
        if (!window.location.href.includes("dashboard.html")) {
            window.location.href = "dashboard.html";
        }
    } else {
        if (!window.location.href.includes("index.html")) {
            window.location.href = "index.html";
        }
    }
}

checkIfLoggedIn();

$('#logout-btn').click(function() {
    localStorage.removeItem("login");
    checkIfLoggedIn();
});

var audio = document.getElementById("player");
if (audio) {
    audio.volume = 0.05;
}

google.charts.load('current', { 'packages': ['bar'] });
google.charts.setOnLoadCallback(drawChart);

var burgerBySpeciesChart = null;

var burgerBySpeciesChartOptions = {
    chart: {
        title: 'Burger by Species',
    },
    bars: 'horizontal' // Required for Material Bar Charts.
};

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Burgers', 'Species'],
        [0, 0]
    ]);
    burgerBySpeciesChart = new google.charts.Bar($('#burger-by-species-chart')[0]);
    burgerBySpeciesChart.draw(data, google.charts.Bar.convertOptions(burgerBySpeciesChartOptions));

    refreshCharts();
}

function refreshCharts(){
	var text = localStorage.getItem('charts_data');

	if(text){

		var json = $.parseJSON(text);

		var data = [];

		var species = ['Burgers'];
		var saleEnties = [];

		console.log(json['burger_by_species']);

		$.each(json['burger_by_species'], function(burger, sales_by_species){
			var saleEntry = [];
			saleEntry.push(burger);
			$.each(sales_by_species, function(specie, sale){
				if(species.indexOf(specie) == -1){
					species.push(specie);
				}
				saleEntry.push(sale);
			});
			saleEnties.push(saleEntry)
		});

		data.push(species);

		$.each(saleEnties, function(index, entry){
			data.push(entry);
		});

		console.log(data);

		data = google.visualization.arrayToDataTable(data);
		burgerBySpeciesChart.draw(data, google.charts.Bar.convertOptions(burgerBySpeciesChartOptions));

	}
}


$('#uploader').on('change', function(event) {
    var reader = new FileReader();

    reader.onload = function(evt) {
        var text = evt.target.result;

        //merging of json

        localStorage.setItem('charts_data', text);
        refreshCharts();
    }

    reader.readAsText($('#uploader')[0].files[0]);
});