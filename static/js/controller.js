
// function for the date picker



// firrst chart
$(document).ready(function() {
// date picker function
  $('#start_date').datepicker({
    format: 'yyyy-mm-dd'
});
$('#end_date').datepicker({
  format: 'yyyy-mm-dd'
});

// function for setting the yesterdays date
var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

// Format date as dd/mm/yyyy
var dd = String(yesterday.getDate()).padStart(2, '0');
var mm = String(yesterday.getMonth() + 1).padStart(2, '0'); // January is 0
var yyyy = yesterday.getFullYear();

var formattedDate = yyyy + '-' + mm + '-' + dd;

$('#start_date').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayHighlight: true
}).datepicker('setDate', formattedDate);

$('#end_date').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayHighlight: true
}).datepicker('setDate', formattedDate);



// Function to get restaurant names
async function getRestaurantNames() {
  try {
    const response = await $.ajax({
      url: '/get_restaurants',
      type: 'GET'
    });

    console.log(response, "data in frontend");
    var selectBox = $('#restaurant');
    $.each(response, function(index, restaurant) {
      selectBox.append('<option value="' + restaurant.restaurant_name + '">' + restaurant.restaurant_name + '</option>');
    });
  } catch (error) {
    console.error("Error fetching restaurant names:", error);
  }
}

// Function to initialize default filters and fetch data
async function initializeFiltersAndFetchData() {
  var defaultFilters = {
    start_date: $('#start_date').val(),
    end_date: $('#end_date').val(),
    restaurant_name: $('#restaurant').val(),
  };

  console.log(defaultFilters, "defaultFilters");

  // Fetch top 5 items
  fetchTop5Items(defaultFilters, function(data) {
    updateTop5Items(data);
  });

  // Fetch top 10 categories
  fetchTop10Category(defaultFilters, function(data) {
    updateTop10Category(data);
  });

  // Fetch daily revenue
  fetchDailyRevenue(defaultFilters, function(data) {
    updateDailyRevenue(data);
  });

  // Fetch old vs new customer
  fetchOldVsNewCustomer(defaultFilters, function(data) {
    updateOldVsNewCustomer(data);
  });
}

// Main function to fetch restaurant names and then initialize filters and fetch data
async function main() {
  await getRestaurantNames();
  initializeFiltersAndFetchData();
}
// Call the main function
main();





  // var chartDom = document.getElementById('ch1');
  // var myChart1 = echarts.init(chartDom);
  // var option = {
  //     title: {
  //         text: 'World Population'
  //     },
  //     tooltip: {
  //         trigger: 'axis',
  //         axisPointer: {
  //             type: 'shadow'
  //         }
  //     },
  //     legend: {},
  //     grid: {
  //         left: '3%',
  //         right: '4%',
  //         bottom: '3%',
  //         containLabel: true
  //     },
  //     xAxis: {
  //         type: 'value',
  //         boundaryGap: [0, 0.01]
  //     },
  //     yAxis: {
  //         type: 'category',
  //         data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
  //     },
  //     series: [
  //         {
  //             // name: '2011',
  //             type: 'bar',
  //             data: [18203, 23489, 29034, 104970, 131744, 630230]
  //         },
        
  //     ]
  // };
  // myChart1.setOption(option);

// second card
// var myChart2 = echarts.init(document.getElementById('ch2'));
  
// // Specify the configuration items and data for the chart
// var option = {
//   title: {
//     text: 'ECharts Getting'
//   },
//   tooltip: {},
//   legend: {
//     data: ['sales']
//   },
//   xAxis: {
//     data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
//   },
//   yAxis: {},
//   series: [
//     {
//       name: 'sales',
//       type: 'bar',
//       data: [5, 20, 36, 10, 10, 20]
//     }
//   ]
// };

// myChart2.setOption(option);

// // third second
// var chartDom = document.getElementById('ch3');
// var myChart3 = echarts.init(chartDom);
// var option;

// option = {
//   xAxis: {
//     type: 'category',
//     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//   },
//   yAxis: {
//     type: 'value'
//   },
//   series: [
//     {
//       data: [150, 230, 224, 218, 135, 147, 260],
//       type: 'line'
//     }
//   ]
// };

// myChart3.setOption(option);

// // fourth chart
// var chartDom = document.getElementById('ch4');
// var myChart4 = echarts.init(chartDom);
// var option;

// option = {
//   legend: {},
//   tooltip: {},
//   dataset: {
//     source: [
//       ['product',  '2016', '2017'],
//       ['Matcha Latte',  85.8, 93.7],
//       ['Milk Tea',  73.4, 55.1],
//       ['Cheese Cocoa',  65.2, 82.5],
//       ['Walnut Brownie',  53.9, 39.1]
//     ]
//   },
//   xAxis: { type: 'category' },
//   yAxis: {},
//   // Declare several bar series, each will be mapped
//   // to a column of dataset.source by default.
//   series: [ { type: 'bar' }, { type: 'bar' }]
// };

// myChart4.setOption(option);





// script for resize the window
$(window).on('resize', function(){
  myChart1.resize();
  myChart2.resize();
  myChart3.resize();
  myChart4.resize();
})

 //click events
 $('#applyFilters').click(function() {
  var filters = {
      // category: $('#category').val(),
      start_date: $('#start_date').val(),
      end_date: $('#end_date').val(),
      restaurant_name: $('#restaurant').val(),
      
      // frequency: $('#frequency').val()
  };
  console.log(filters, "filters")
  // alert(start_date, end_date, restaurant);

  // fetchto5Items
  fetchTop5Items(filters, function(data){
    updateTop5Items(data);
  })
  // fetch top 10 categories
  fetchTop10Category(filters, function(data) {
      updateTop10Category(data);
  });

  // fetch functionality for daily revenue
  fetchDailyRevenue(filters, function(data){
    updateDailyRevenue(data);
  });

  // fetch functionality for oldvsnew customer
  fetchOldVsNewCustomer(filters, function(data){
    updateOldVsNewCustomer(data);
  });

});

// fetchTop5Items
function fetchTop5Items(filters, callback){
  console.log(filters, "top5filtes");
  $.ajax({
    url: '/get_top5items',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({filters: filters}),
    success: callback,
    error: function(xhr, status, error){
      console.error("Error fetching data:", status, error);
    }
  })
}
// callbackfunction for fetchtop5items
function updateTop5Items(data){
  const myChart1 = echarts.init(document.getElementById('ch1'));

  var option = {
    title: {
        text: 'World Population'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        data: data.map(item=> item.item_count)
    },
    yAxis: {
        type: 'category',
        data: data.map(item => item.item_name)
    },
    series: [{ type: 'bar', data: data.map(item => item.item_count) }]
};
myChart1.setOption(option);
}


//get data from mysql db ,
function fetchTop10Category(filters, callback) {
  console.log("Fetching data with filters:", filters);
  $.ajax({
      url: '/get_top10category',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ filters: filters }),
      
      success: callback,
      error: function(xhr, status, error) {
          console.error("Error fetching data:", status, error);
      }
  });
}

function updateTop10Category(data) {
  console.log(data, "updatetop10category")
  var myChart2 = echarts.init(document.getElementById('ch2'));
  
  // Specify the configuration items and data for the chart
  var option = {
    title: {
      text: 'ECharts Getting'
    },
    tooltip: {},
    legend: {
      data: ['sales']
    },
    xAxis: {
      data: data.map(item=> item.category_name)
    },
    yAxis: {
      data: data.map(item=> item.total_amount)
    },
    series: [
      {
        // name: 'sales',
        type: 'bar',
        data: data.map(item=> item.total_amount)
      }
    ]
  };
  
  myChart2.setOption(option);
}

// function for the third chart
function fetchDailyRevenue(filters, callback){
  $.ajax({
    url: '/get_dailyRevenue',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ filters: filters }),
    
    success: callback,
    error: function(xhr, status, error) {
        console.error("Error fetching data:", status, error);
    }
});
}
// update dailyrevenue callback function
function updateDailyRevenue(data){
  // third chart
var chartDom = document.getElementById('ch3');
var myChart3 = echarts.init(chartDom);
var option;

option = {
  xAxis: {
    type: 'category',
    data: data.map(item=> item.transaction_date)
  },
  yAxis: {
    type: 'value',
    data: data.map(item=> item.total_revenue)
  },
  series: [
    {
      data: data.map(item=> item.total_revenue),
      type: 'line'
    }
  ]
};

myChart3.setOption(option);
}

// function for fourth chart
function fetchOldVsNewCustomer(filters, callback){
  $.ajax({
    url: '/get_newvsoldcust',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({filters: filters}),
    success: callback,
    error: function(xhr, status, error){
      console.error("Error fetching data:", status, error);
    }
  })
}
// function for the callback 
function updateOldVsNewCustomer(data){
    // Process the response to match the format required by ECharts
    var dataset = formatCustomerData(data);

  // fourth chart
var chartDom = document.getElementById('ch4');
var myChart4 = echarts.init(chartDom);
var option;

option = {
  legend: {},
  tooltip: {},
  dataset: {
    source: dataset
  },
  xAxis: { type: 'category' },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [ { type: 'bar' }, { type: 'bar' }]
};

myChart4.setOption(option);
}
// Custom function to format the fetched data into the required dataset structure
function formatCustomerData(data) {
  // Create the dataset source array with headers
  var dataset = [
    ['Transaction Date', 'Old Customers', 'New Customers']
  ];

  // Loop through the data and format each row
  data.forEach(function(item) {
    dataset.push([item.transaction_date, item.oldcustomer, item.newcustomer]);
  });

  return dataset;
}


});







