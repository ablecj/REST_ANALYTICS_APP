
// function for the date picker



// firrst chart
$(document).ready(function() {

  let myChart1, myChart2, myChart3, myChart4;
// Initialize charts on document ready
$(document).ready(function() {
  initializeCharts();
  // Attach the resize event handler
  $(window).on('resize', resizeCharts);
});


// // date picker function
  $('#start_date').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true
});
// handling the click event on the icon 
$('#start_date_icon').click(function(){
  $('#start_date').focus();
})

  // Initialize the datepicker on the input field
  $('#end_date').datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true
  });
  // Handle the click event on the calendar icon to open the datepicker
  $('#end_date_icon').click(function() {
      $('#end_date').focus(); // Trigger focus event to open the datepicker
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



// new datepicker code
// document.addEventListener('DOMContentLoaded', function() {
//   // Initialize the datepickers
//   const startDatePicker = datepicker('#start_date', {
//       formatter: (input, date, instance) => {
//           const value = date.toISOString().split('T')[0];
//           input.value = value; // e.g. 2020-06-01
//       },
//       onSelect: function(instance, date) {
//           instance.hide();
//       }
//   });

//   const endDatePicker = datepicker('#end_date', {
//       formatter: (input, date, instance) => {
//           const value = date.toISOString().split('T')[0];
//           input.value = value; // e.g. 2020-06-01
//       },
//       onSelect: function(instance, date) {
//           instance.hide();
//       }
//   });

//   // Handle the click event on the calendar icons to open the datepickers
//   document.getElementById('start_date_icon').addEventListener('click', function() {
//       startDatePicker.show();
//   });

//   document.getElementById('end_date_icon').addEventListener('click', function() {
//       endDatePicker.show();
//   });

//   // Set yesterday's date
//   var yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   var formattedDate = yesterday.toISOString().split('T')[0];

//   startDatePicker.setDate(new Date(formattedDate), true); // true to trigger onSelect
//   endDatePicker.setDate(new Date(formattedDate), true); // true to trigger onSelect
// });


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
  if (!myChart1) {
    myChart1 = echarts.init(document.getElementById('ch1'));
}
 

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
  if (!myChart2) {
    myChart2 = echarts.init(document.getElementById('ch2'));
}
  
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
  if (!myChart3) {
    myChart3 = echarts.init(document.getElementById('ch3'));
}

 // Format the date to 'yyyy-mm-dd'
 const formattedData = data.map(item => {
  const date = new Date(item.transaction_date);
  const formattedDate = date.toISOString().split('T')[0]; // Get 'yyyy-mm-dd' part
  return {
    ...item,
    formattedDate: formattedDate
  };
});

var option = {
  xAxis: {
    type: 'category',
    data: formattedData.map(item => item.formattedDate)
  },
  yAxis: {
    type: 'value',
    data: formattedData.map(item => item.total_revenue),
  },
  series: [
    {
      data: formattedData.map(item => item.total_revenue),
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
  if (!myChart4) {
    myChart4 = echarts.init(document.getElementById('ch4'));
}
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
    // Format the transaction_date to 'yyyy-mm-dd'
    const date = new Date(item.transaction_date);
    const formattedDate = date.toISOString().split('T')[0]; // Get 'yyyy-mm-dd' part
    // Push the formatted data into the dataset
    dataset.push([formattedDate, item.oldcustomer, item.newcustomer]);
  });
  
  return dataset;
}

function initializeCharts() {
  // Initialize all charts
  myChart1 = echarts.init(document.getElementById('ch1'));
  myChart2 = echarts.init(document.getElementById('ch2')); // Assuming you have elements with id 'ch2'
  myChart3 = echarts.init(document.getElementById('ch3')); // Assuming you have elements with id 'ch3'
  myChart4 = echarts.init(document.getElementById('ch4')); // Assuming you have elements with id 'ch4'
}
function resizeCharts() {
  if (myChart1) myChart1.resize();
  if (myChart2) myChart2.resize();
  if (myChart3) myChart3.resize();
  if (myChart4) myChart4.resize();
}


});







