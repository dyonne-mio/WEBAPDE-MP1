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
    audio.volume = 0.00;
}

google.charts.load('current', { 'packages': ['bar', 'corechart'] });
google.charts.setOnLoadCallback(drawChart);

var burgerBySpeciesChart = null;
var burgerSalesChart = null;
var salesBySpecieChart = null;
var burgerSalesByTimeChart = null;
var specieSalesByTimeChart = null;

var burgerBySpeciesChartOptions = {
    title: 'Burger by Specie',
    theme: 'material',
    animation: {
        startup: true,
        duration: 1000,
        easing: 'out'
    },
    height: 500,
    bar: { groupWidth: "80%" },
    vAxis: {
        title: 'Burgers',
    },
    hAxis: {
        title: 'Sales',
    }
};

var burgerSalesChartOptions = {
    title: 'Burger Sales',
    theme: 'material',
    height: 400,
    animation: {
        "startup": true,
        duration: 1000,
        easing: 'out'
    },
    vAxis: {
        title: 'Burgers',
    },
    hAxis: {
        title: 'Sales',
    }
};

var saleBySpecieOption = {
    title: 'Sales by Specie',
    theme: 'material',
    height: 400,
    animation: {
        "startup": true,
        duration: 1000,
        easing: 'out'
    },
    vAxis: {
        title: 'Sales',
    },
    hAxis: {
        title: 'Species',
    }
};

var burgerSalesByTimeChartOptions = {
    title: 'Burger sales by date',
    theme: 'material',
    height: 400,
    animation: {
        "startup": true,
        duration: 500,
        easing: 'out'
    },
    vAxis: {
        title: 'Sales',
    },
    hAxis: {
        title: 'Time',
        format: 'hh a'
    }
}

var specieSalesByTimeChartOptions = {
    title: 'Specie sales by date',
    theme: 'material',
    height: 400,
    animation: {
        "startup": true,
        duration: 500,
        easing: 'out'
    },
    vAxis: {
        title: 'Sales',
    },
    hAxis: {
        title: 'Time',
        format: 'hh a'
    }
}

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Burgers', 'Species'],
        [0, 0]
    ]);
    burgerBySpeciesChart = new google.visualization.BarChart($('#burger-by-species-chart')[0]);
    burgerBySpeciesChart.draw(data, burgerBySpeciesChartOptions);

    data = google.visualization.arrayToDataTable([
        ['Burgers', 'Sales'],
        [0, 0]
    ]);

    burgerSalesChart = new google.visualization.BarChart($('#burger-sales-chart')[0]);
    burgerSalesChart.draw(data, burgerSalesChartOptions);

    data = google.visualization.arrayToDataTable([
        ['Specie', 'Burger'],
        [0, 0]
    ]);

    salesBySpecieChart = new google.visualization.ColumnChart($('#sales-by-specie-chart')[0]);
    salesBySpecieChart.draw(data, saleBySpecieOption);


    data = new google.visualization.DataTable();

    data.addColumn('timeofday', 'Time of Day');
    data.addColumn('number', 'Sales');

    burgerSalesByTimeChart = new google.visualization.ColumnChart($('#burger-sales-by-time-chart')[0]);
    burgerSalesByTimeChart.draw(data, burgerSalesByTimeChartOptions);

    data = new google.visualization.DataTable();

    data.addColumn('timeofday', 'Time of Day');
    data.addColumn('number', 'Sales');

    specieSalesByTimeChart = new google.visualization.ColumnChart($('#specie-sales-by-time-chart')[0]);

    refreshCharts();
}

var dates = {};

function refreshCharts() {
    var text = localStorage.getItem('charts_data');

    dates = {};

    var data = [
        ['', ''],
        [0, 0]
    ];

    data = google.visualization.arrayToDataTable(data);

    burgerBySpeciesChart.draw(data, burgerBySpeciesChartOptions);
    burgerSalesChart.draw(data, burgerSalesChartOptions);
    salesBySpecieChart.draw(data, google.charts.Bar.convertOptions(saleBySpecieOption));

    $("#date-select").val($("#date-select option:eq(1)").val());
    $("#date-select").trigger('change');

    if (text) {

        data = [];

        var json = $.parseJSON(text);


        var species = ['Burgers'];
        var saleEnties = [];

        console.log(json);

        //BURGER BY SPECIE DATA CONVERSION

        $.each(json['burger_by_species'], function(burger, sales_by_species) {
            var saleEntry = [];
            saleEntry.push(burger);
            $.each(sales_by_species, function(specie, sale) {
                if (species.indexOf(specie) == -1) {
                    species.push(specie);
                }
                saleEntry.push(sale);
            });
            saleEnties.push(saleEntry)
        });

        data.push(species);

        $.each(saleEnties, function(index, entry) {
            data.push(entry);
        });

        console.log(data);

        data = google.visualization.arrayToDataTable(data);
        burgerBySpeciesChart.draw(data, burgerBySpeciesChartOptions);


        //BURGER SALES DATA CONVERSION

        data = [];

        data.push(['Burger', 'Sales']) //HEADER

        $.each(json['burger_sales'], function(burger, sales) {
            data.push([burger, sales]);
        });

        console.log(data);

        data = google.visualization.arrayToDataTable(data);
        burgerSalesChart.draw(data, burgerSalesChartOptions);

        //SALES BY SPECIE DATA CONVERSION

        data = [];

        data.push(['Species', 'Sales'/*, { "role": "style" }*/]); //HEADER

        $.each(json['species_sales'], function(specie, sales) {
            data.push([specie, sales /*, getRandomColor() */]);
        });

        console.log(data);

        data = google.visualization.arrayToDataTable(data);
        salesBySpecieChart.draw(data, google.charts.Bar.convertOptions(saleBySpecieOption));

        //BURGER SALES BY DATETIME

        dates = {};

        $('#date-select').html('');
        $('#date-select').addOpt('Please select a date', '');

        $.each(json['sales'], function(sale_id, sale) {
            var date = sale.datetime.split(" ")[0];
            var time = sale.datetime.split(" ")[1];
            if (!dates.hasOwnProperty(date)) {
                dates[date] = [];
                $('#date-select').addOpt(date, date);
            }
            var hour = time.split(':')[0];

            if (!dates[date].hasOwnProperty(hour.toString())) {
                dates[date][hour.toString()] = [];
            }

            dates[date][hour.toString()].push({
                burger: sale.burger,
                specie: sale.species,
                time: time
            });
        });

        $("#date-select").val($("#date-select option:eq(1)").val());
        $("#date-select").trigger('change');
    }
}

$('#date-select').on('change', function() {


    var data = new google.visualization.DataTable();
    var dataSpecie = new google.visualization.DataTable();


    data.addColumn('datetime', 'Time of Day');
    data.addColumn('number', 'Sales');

    dataSpecie.addColumn('datetime', 'Time of Day');
    dataSpecie.addColumn('number', 'Sales');

    burgerSalesByTimeChart.draw(data, google.charts.Bar.convertOptions(burgerSalesByTimeChartOptions));
    specieSalesByTimeChart.draw(dataSpecie, google.charts.Bar.convertOptions(specieSalesByTimeChartOptions));


    if (!$(this).val()) {
        return;
    }

    var burgerTypes = [];
    var burgerSales = {};

    var specieTypes = [];
    var specieSales = {};

    $.each(dates[$(this).val()], function(time, sales) {
        if (!burgerSales.hasOwnProperty(time)) {
            burgerSales[time] = {};
        }

        if (!specieSales.hasOwnProperty(time)) {
            specieSales[time] = {};
        }

        $.each(sales, function(index, sale) {
            if (burgerTypes.indexOf(sale.burger) == -1) {
                burgerTypes.push(sale.burger);
            }

            if (specieTypes.indexOf(sale.specie) == -1) {
                specieTypes.push(sale.specie);
            }

            if (!burgerSales[time].hasOwnProperty(sale.burger)) {
                burgerSales[time][sale.burger] = 0;
            }

            if (!specieSales[time].hasOwnProperty(sale.specie)) {
                specieSales[time][sale.specie] = 0;
            }

            if (burgerSales.hasOwnProperty(time) && burgerSales[time].hasOwnProperty(sale.burger)) {
                burgerSales[time][sale.burger] += 1;
            }
            if (specieSales.hasOwnProperty(time) && specieSales[time].hasOwnProperty(sale.specie)) {
                specieSales[time][sale.specie] += 1;
            }
        });
    });

    burgerTypes.sort();

    specieTypes.sort();

    $.each(burgerTypes, function(i, burger) {
        data.addColumn('number', burger);
    });

    $.each(specieTypes, function(i, specie) {
        dataSpecie.addColumn('number', specie);
    });

    var rows = [];
    var specieSalesByTimeRows = [];

    var dateParts = $(this).val().split('-');

    $.each(dates[$(this).val()], function(time, sales) {
        if (!time) {
            return true;
        }
        if (!sales) {
            return true;
        }
        var row = [new Date(dateParts[0], dateParts[1], dateParts[2], time), sales.length];
        var specieSalesRow = [new Date(dateParts[0], dateParts[1], dateParts[2], time), sales.length];


        $.each(burgerTypes, function(i, burger) {
            var burgerSold = 0;
            if (burgerSales.hasOwnProperty(time) && burgerSales[time].hasOwnProperty(burger)) {
                burgerSold = burgerSales[time][burger];
            }
            row.push(burgerSold);
        });

        $.each(specieTypes, function(i, specie) {
            var burgerSold = 0;
            if (specieSales.hasOwnProperty(time) && specieSales[time].hasOwnProperty(specie)) {
                burgerSold = specieSales[time][specie];
            }
            specieSalesRow.push(burgerSold);
        });

        rows.push(row);
        specieSalesByTimeRows.push(specieSalesRow);
    });

    data.addRows(rows);
    dataSpecie.addRows(specieSalesByTimeRows);

    burgerSalesByTimeChart.draw(data, google.charts.Bar.convertOptions(burgerSalesByTimeChartOptions));
    specieSalesByTimeChart.draw(dataSpecie, google.charts.Bar.convertOptions(specieSalesByTimeChartOptions));

});


$.fn.addOpt = function(text, value) {
    $(this).append('<option value="' + value + '">' + text + '</option>');
};

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// $('#uploader').on('change', function(event) {

// });


$('#replace-button').click(function() {

    if (!$('#uploader').val()) {
        return;
    }

    var reader = new FileReader();

    reader.onload = function(evt) {
        var text = evt.target.result;

        localStorage.setItem('charts_data', text);

        alert('Chart data has been uploaded.');

        refreshCharts();
        refreshTables();
    }

    reader.readAsText($('#uploader')[0].files[0]);

});

$.fn.addRows = function(data) {
    $(this).DataTable().rows.add(data).draw(false);
    return $(this);
};

$.fn.clearDataTable = function() {
    $(this).DataTable().clear().draw();
    return $(this);
};

$('#sales-table').DataTable({
    "paging": true,
    "searching": true,
    order: [
        [0, "desc"]
    ],
    "columns": [
        { "name": "Date", 'data': "datetime" },
        { "name": "Burger", "data": "burger" },
        { "name": "Specie", "data": "species" },
    ]
});

var burgerSalesBySpecieTable = $('#burger-sales-by-specie-table');

burgerSalesBySpecieTable.DataTable();

$('#burger-sales-table').DataTable();

$('#species-sales-table').DataTable();


function refreshTables() {
    $('#sales-table').clearDataTable();
    burgerSalesBySpecieTable.clearDataTable();
    $('#burger-sales-table').clearDataTable();
    $('#species-sales-table').clearDataTable();

    var text = localStorage.getItem('charts_data');

    if (text) {

        var chartsData = $.parseJSON(text);

        var sales = [];

        $.each(chartsData['sales'], function(id, sale) {
            sales.push(sale);
        });

        var burgerByspecieTableData = [];

        var specieSaleTableData = [];

        //[burger, specie, sales]
        //[krabby pattie, coral, 18]
        //[krabby pattie, giant clam, 199]

        $.each(chartsData['burger_by_species'], function(burger, specie_sales) {
            $.each(specie_sales, function(specie, sales) {

                var row = [];

                row.push(burger);
                row.push(specie);
                row.push(sales);

                burgerByspecieTableData.push(row);
            });
        });

        var burgerSalesTableData = [];

        //[burger, sales]

        $.each(chartsData['burger_sales'], function(burger, sales) {
            var row = [burger, sales];
            burgerSalesTableData.push(row);
        });

        $.each(chartsData['species_sales'], function(specie, sales) {
            var row = [specie, sales];
            specieSaleTableData.push(row);
        });

        $('#sales-table').addRows(sales);
        burgerSalesBySpecieTable.addRows(burgerByspecieTableData);
        $('#burger-sales-table').addRows(burgerSalesTableData);
        $('#species-sales-table').addRows(specieSaleTableData);
    }
}

refreshTables();

$('#clear-button').click(function() {

    var r = confirm("Clear data?");
    if (r == true) {
        localStorage.removeItem('charts_data');
        refreshTables();
        refreshCharts();
    }

});