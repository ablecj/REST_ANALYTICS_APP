// function for the date picker

// firrst chart
$(document).ready(function () {
  const env = "local"; // Change to 'prod' for production environment

  // Initialize varpath based on env
  let varpath = "";
  if (env === "prod") {
    varpath = "/restaurant";
  }

  let myChart1, myChart2, myChart3, myChart4, myChart5, myChart6;
  // Initialize charts on document ready
  $(document).ready(function () {
    initializeCharts();
    // Attach the resize event handler
    $(window).on("resize", resizeCharts);
  });

  // // date picker function
  $("#start_date").datepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
  });
  // handling the click event on the icon
  $("#start_date_icon").click(function () {
    $("#start_date").focus();
  });

  // Initialize the datepicker on the input field
  $("#end_date").datepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
  });
  // Handle the click event on the calendar icon to open the datepicker
  $("#end_date_icon").click(function () {
    $("#end_date").focus(); // Trigger focus event to open the datepicker
  });

  // function for setting the yesterdays date
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Format date as dd/mm/yyyy
  var dd = String(yesterday.getDate()).padStart(2, "0");
  var mm = String(yesterday.getMonth() + 1).padStart(2, "0"); // January is 0
  var yyyy = yesterday.getFullYear();

  var formattedDate = yyyy + "-" + mm + "-" + dd;

  $("#start_date")
    .datepicker({
      format: "yyyy-mm-dd",
      autoclose: true,
      todayHighlight: true,
    })
    .datepicker("setDate", formattedDate);

  $("#end_date")
    .datepicker({
      format: "yyyy-mm-dd",
      autoclose: true,
      todayHighlight: true,
    })
    .datepicker("setDate", formattedDate);

  // Function to get restaurant names
  async function getRestaurantNames() {
    try {
      const response = await $.ajax({
        url: "/get_restaurants",
        type: "GET",
      });

      console.log(response, "data in frontend");
      var selectBox = $("#restaurant");
      $.each(response, function (index, restaurant) {
        selectBox.append(
          '<option value="' +
            restaurant.restaurant_name +
            '">' +
            restaurant.restaurant_name +
            "</option>"
        );
      });
    } catch (error) {
      console.error("Error fetching restaurant names:", error);
    }
  }

  async function fetchMaxTransactionDate() {
    try {
      const response = await $.ajax({
        url: "/get_max_transaction_date",
        type: "GET",
      });

      console.log(response, "max date in frontend");
      var maxDate = response.max_date;
      if (maxDate) {
        $("#end_date").datepicker("setDate", new Date(maxDate));
        $("#start_date").datepicker("setDate", new Date(maxDate));
      }
    } catch (error) {
      console.error("Error fetching max transaction date:", error);
    }
  }

  // Function to initialize default filters and fetch data
  async function initializeFiltersAndFetchData() {
    var defaultFilters = {
      start_date: $("#start_date").val(),
      end_date: $("#end_date").val(),
      restaurant_name: $("#restaurant").val(),
    };

    console.log(defaultFilters, "defaultFilters");

    // Fetch top 5 items
    fetchTop5Items(defaultFilters, function (data) {
      updateTop5Items(data);
    });

    // Fetch top 10 categories
    fetchTop10Category(defaultFilters, function (data) {
      updateTop10Category(data);
    });

    // Fetch daily revenue
    fetchDailyRevenue(defaultFilters, function (data) {
      updateDailyRevenue(data);
    });

    // Fetch old vs new customer
    fetchOldVsNewCustomer(defaultFilters, function (data) {
      updateOldVsNewCustomer(data);
    });
    // fetch cart dtd
    fetchcarddtd(defaultFilters, function (data) {
      updateCarddtd(data);
    });

    // fetch cart mtd
    fetchcardmtd(defaultFilters, function (data) {
      updateCardmtd(data);
    });

    // fetch cart ytd
    fetchcardytd(defaultFilters, function (data) {
      updateCardytd(data);
    });

    // Monthly order and Revenue chart function call
    fetchMonthlyOrderAndRevenue(defaultFilters, function (data) {
      updateMonthlyOrderAndRevenue(data);
    });
    // function call for dineinvsdelivaryrevenue
    fetchDineInDeliveryRevenue(defaultFilters, function (data){
      updateDineInDeliveryRevenue(data);
    });
  }

  // Main function to fetch restaurant names and then initialize filters and fetch data
  async function main() {
    await getRestaurantNames();
    await fetchMaxTransactionDate();
    initializeFiltersAndFetchData();
  }
  // Call the main function
  main();

  //click events
  $("#applyFilters").click(function () {
    var filters = {
      // category: $('#category').val(),
      start_date: $("#start_date").val(),
      end_date: $("#end_date").val(),
      restaurant_name: $("#restaurant").val(),

      // frequency: $('#frequency').val()
    };
    console.log(filters, "filters");
    // alert(start_date, end_date, restaurant);

    // fetchto5Items
    fetchTop5Items(filters, function (data) {
      updateTop5Items(data);
    });
    // fetch top 10 categories
    fetchTop10Category(filters, function (data) {
      updateTop10Category(data);
    });

    // fetch functionality for daily revenue
    fetchDailyRevenue(filters, function (data) {
      updateDailyRevenue(data);
    });

    // fetch functionality for oldvsnew customer
    fetchOldVsNewCustomer(filters, function (data) {
      updateOldVsNewCustomer(data);
    });

    // fetch cart dtd
    fetchcarddtd(filters, function (data) {
      updateCarddtd(data);
    });

    // fetch cart mtd
    fetchcardmtd(filters, function (data) {
      updateCardmtd(data);
    });

    // fetch cart ytd
    fetchcardytd(filters, function (data) {
      updateCardytd(data);
    });
    // Monthly order and Revenue chart function call
    fetchMonthlyOrderAndRevenue(filters, function (data) {
      updateMonthlyOrderAndRevenue(data);
    });
    // function call for dineinvsdelivaryrevenue
    fetchDineInDeliveryRevenue(filters, function (data){
      updateDineInDeliveryRevenue(data);
    });
  });

  // fetchTop5Items
  function fetchTop5Items(filters, callback) {
    console.log(filters, "top5filtes");
    $.ajax({
      url: "/get_top5items",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ filters: filters }),
      success: callback,
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
      },
    });
  }
  // callbackfunction for fetchtop5items
  function updateTop5Items(data) {
    if (!myChart1) {
      myChart1 = echarts.init(document.getElementById("ch1"));
    }

    var option = {
      title: {
        text: "Top 5 Items",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          return params[0].name + ": " + params[0].value;
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: data.map((item) => item.item_name),
        axisLabel: {
          show: false, // Hide y-axis labels
        },
      },
      series: [
        {
          type: "bar",
          data: data.map((item) => item.item_count),
          label: {
            show: true,
            position: "insideLeft", // Position the labels inside the bars
            formatter: function (params) {
              return data[params.dataIndex].item_name; // Use the y-axis value (item_name) as the label
            },
            color: "#fff", // Optionally, set the color of the label text
          },
          itemStyle: {
            color: "#FB6D49",
          },
        },
      ],
    };

    myChart1.setOption(option);
  }

  //get data from mysql db ,
  function fetchTop10Category(filters, callback) {
    console.log("Fetching data with filters:", filters);
    $.ajax({
      url: "/get_top10category",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ filters: filters }),

      success: callback,
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
      },
    });
  }
  function updateTop10Category(data) {
    console.log(data, "updatetop10category");
    if (!myChart2) {
      myChart2 = echarts.init(document.getElementById("ch2"));
    }

    // Specify the configuration items and data for the chart
    var option = {
      title: {
        text: "Top 10 Category",
      },
      tooltip: {},
      legend: {
        data: ["sales"],
      },
      xAxis: {
        data: data.map((item) => item.category_name),
        axisLabel: {
          rotate: 25, // Rotate the x-axis labels by 30 degrees
        },
      },
      yAxis: {
        // data: data.map(item=> item.total_amount)
        axisLabel: {
          formatter: function (value) {
            if (value >= 1000) {
              return value / 1000 + "k";
            }
            return value;
          },
        },
      },
      series: [
        {
          // name: 'sales',
          type: "bar",
          data: data.map((item) => item.total_amount),
          itemStyle: {
            color: "#FFAF46",
          },
        },
      ],
    };

    myChart2.setOption(option);
  }

  // function for the third chart
  function fetchDailyRevenue(filters, callback) {
    $.ajax({
      url: "/get_dailyRevenue",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ filters: filters }),

      success: callback,
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
      },
    });
  }
  // update dailyrevenue callback function
  function updateDailyRevenue(data) {
    // third chart
    if (!myChart3) {
      myChart3 = echarts.init(document.getElementById("ch3"));
    }

    // Format the date to 'yyyy-mm-dd'
    const formattedData = data.map((item) => {
      const date = new Date(item.transaction_date);
      const formattedDate = date.toISOString().split("T")[0]; // Get 'yyyy-mm-dd' part
      return {
        ...item,
        formattedDate: formattedDate,
      };
    });

    var option = {
      title: {
        text: "Daily Revenue",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      xAxis: {
        type: "category",
        data: formattedData.map((item) => item.formattedDate),
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: function (value) {
            if (value >= 1000) {
              return value / 1000 + "k";
            }
            return value;
          },
        },
      },
      series: [
        {
          data: formattedData.map((item) => item.total_revenue),
          type: "line",
          itemStyle: {
            color: "#FFAF46", // Custom line color
          },
        },
      ],
    };

    myChart3.setOption(option);
  }

  // function for fourth chart
  function fetchOldVsNewCustomer(filters, callback) {
    $.ajax({
      url: "/get_newvsoldcust",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ filters: filters }),
      success: callback,
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
      },
    });
  }
  function updateOldVsNewCustomer(data) {
    // Process the response to match the format required by ECharts
    var dataset = formatCustomerData(data);

    // Initialize the chart if it's not already initialized
    if (!myChart4) {
      myChart4 = echarts.init(document.getElementById("ch4"));
    }

    var option = {
      title: {
        text: "Old Customer v/s New Customer",
      },
      legend: {
        orient: "horizontal",
        top: "top",
        right: "right",
      },
      tooltip: {},
      dataset: {
        source: dataset,
      },
      xAxis: { type: "category" },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [
        {
          type: "bar",
          itemStyle: {
            color: "#664069", // Customize the color for the first series
          },
        },
        {
          type: "bar",
          itemStyle: {
            color: "#D84B76", // Customize the color for the second series
          },
        },
      ],
    };

    myChart4.setOption(option);
  }

  // function definition for fetchMonthlyOrderAndRevenue
  function fetchMonthlyOrderAndRevenue(filters, callback) {
    $.ajax({
      url: "/get_monthlyorederandrevenue",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ filters: filters }),
      success: callback,
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
      },
    });
  }
  // function definition for updatechart
  function updateMonthlyOrderAndRevenue(data) {
    console.log(data, "data from the monthlyorder");
    if (!myChart5) {
      myChart5 = echarts.init(document.getElementById("ch5"));
    }

    var option = {
      title: {
        text: 'Monthly Order & Revenue'
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
      },
      toolbox: {
        feature: {
          // dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["bar"] },
          restore: { show: true },
          // saveAsImage: { show: true }
        },
      },
      legend: {
        data: ["Evaporation", "Temperature"],
      },
      xAxis: [
        {
          type: "category",
          data: data.map((item) => item.month_name),
          axisPointer: {
            type: "shadow",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Revenue",
          axisLabel: {
            formatter: function (value) {
              if (value >= 1000) {
                return value / 1000 + "k";
              }
              return value;
            },
          },
          // min: 0,
          // max: 250,
          // interval: 50,
          // axisLabel: {
          //   formatter: '{value} ml'
          // }
        },
        {
          type: "value",
          name: "Order Count",
          axisLabel: {
            formatter: function (value) {
              if (value >= 1000) {
                return value / 1000 + "k";
              }
              return value;
            },
          },
          // min: 0,
          // max: 25,
          // interval: 5,
          // axisLabel: {
          //   formatter: '{value} °C'
          // }
        },
      ],
      series: [
        {
          name: "Revenue",
          type: "bar",
          tooltip: {
            valueFormatter: function (value) {
              if (value > 1000) {
                value = (value / 1000).toFixed(1) + "K";
              } else {
                value + " Rs";
              }
              return value + " Rs";
            },
          },
          data: data.map((item) => item.revenue),
          // data: formattedData,
        },
        // {
        //   name: 'Precipitation',
        //   type: 'bar',
        //   tooltip: {
        //     valueFormatter: function (value) {
        //       return value + ' ml';
        //     }
        //   },
          // data: data.map((item)=> item.order_count)
        // },
        {
          name: "Oreder Count",
          type: "line",
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              if (value > 1000) {
                value = (value / 1000).toFixed(1) + "K";
              } else {
                return value + "";
              }
              return value + " No";
            },
          },
          data: data.map((item) => item.order_count),
        },
      ],
    };

    option && myChart5.setOption(option);
  }
// function definition for DineDeliveryRevenue
function fetchDineInDeliveryRevenue(filters, callback){
  $.ajax({
    url: "/get_dineindeliveryrevenue",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ filters: filters }),
    success: callback,
    error: function (xhr, status, error) {
      console.error("Error fetching data:", status, error);
    },
  });
}

function updateDineInDeliveryRevenue(data){
  console.log(data, "data dineindeliveryrevenue");
  if (!myChart6) {
    myChart6 = echarts.init(document.getElementById("ch6"));
  }
// formated date
var formattedData = data.map((item)=>{
  const date = new Date(item.date);
  const formattedDate = date.toISOString().split("T")[0]; // Get 'yyyy-mm-dd' part
  return {
    ...item,
    formattedDate: formattedDate,
  };
})
var option = {
  title: {
    text: 'Dine  Delivery '
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Dine In', 'Delivery']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: formattedData.map((item)=> item.formattedDate)
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: function (value) {
        if (value >= 1000) {
          return value / 1000 + "k";
        }
        return value;
      },
    },
  },
  series: [
    {
      name: 'Dine In',
      type: 'line',
      stack: 'Total',
      data: data.map((item)=> item.DineIn)
    },
    {
      name: 'Delivery',
      type: 'line',
      stack: 'Total',
      data: data.map((item)=> item.Delivery)
    },
  ]
};

option && myChart6.setOption(option);
}

  // Custom function to format the fetched data into the required dataset structure
  function formatCustomerData(data) {
    // Create the dataset source array with headers
    var dataset = [["Transaction Date", "Old Customers", "New Customers"]];

    // Loop through the data and format each row
    data.forEach(function (item) {
      // Format the transaction_date to 'yyyy-mm-dd'
      const date = new Date(item.transaction_date);
      const formattedDate = date.toISOString().split("T")[0]; // Get 'yyyy-mm-dd' part
      // Push the formatted data into the dataset
      dataset.push([formattedDate, item.oldcustomer, item.newcustomer]);
    });

    return dataset;
  }

  function initializeCharts() {
    // Initialize all charts
    myChart1 = echarts.init(document.getElementById("ch1"));
    myChart2 = echarts.init(document.getElementById("ch2")); 
    myChart3 = echarts.init(document.getElementById("ch3")); 
    myChart4 = echarts.init(document.getElementById("ch4")); 
    myChart5 = echarts.init(document.getElementById("ch5")); 
    myChart6 = echarts.init(document.getElementById("ch6")); 
  }
  function resizeCharts() {
    if (myChart1) myChart1.resize();
    if (myChart2) myChart2.resize();
    if (myChart3) myChart3.resize();
    if (myChart4) myChart4.resize();
    if (myChart5) myChart5.resize();
    if (myChart6) myChart6.resize();
  }

  // function for formatting the number
  function formatNumber(value) {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    } else {
      return value.toString();
    }
  }
  //get data from mysql db for card dtd ,
  function fetchcarddtd(filters, callback) {
    console.log("Fetching data with filters:", filters);
    $.ajax({
      url: "/get_cart_dtd",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ filters: filters }),
      success: callback,
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
      },
    });
  }
  // function for updating the data inside the card dtd
  function updateCarddtd(data) {
    if (data && data.length > 0) {
      const cardDatadtd = data[0];

      // checking the dtdtotalrev & ldtdtotalrev
      const dtdtotalrev = Number(cardDatadtd.dtdtotalrev);
      const ldtdtotalrev = Number(cardDatadtd.ldtdtotalrev);
      // checking the dtdnewcust & ldtdnewcust
      const dtdnewcust = Number(cardDatadtd.dtdnewcust);
      const ldtdnewcust = Number(cardDatadtd.ldtdnewcust);
      // selected date dtd &ldtd checking they are number or not
      if (isNaN(dtdtotalrev) || isNaN(ldtdtotalrev)) {
        console.error("DTDtotalrev or LDTDtotalrev values are not numbers.");
        return;
      }
      // checking dtdnewcust & ldtdnewcust
      if (isNaN(dtdnewcust) || isNaN(ldtdnewcust)) {
        console.error("DTDnewcust or LDTDnewcust values are not numbers.");
        return;
      }

      // Calculate the percentage change for total revenue
      var percentTotalDtd = Math.round(
        ((dtdtotalrev - ldtdtotalrev) / (dtdtotalrev + ldtdtotalrev)) * 100
      );

      // Calculate the percentage change for new customers
      var percentNewCustDtd = Math.round(
        ((dtdnewcust - ldtdnewcust) / (dtdnewcust + ldtdnewcust)) * 100
      );

      console.log(cardDatadtd, "cardDatadtd");
      $("#total-revenue-dtd").text(formatNumber(cardDatadtd.dtdtotalrev));
      $("#ldtd-total-reve").text(
        formatNumber(cardDatadtd.ldtdtotalrev) + " " + "(ldtd)"
      );
      $("#new-cust-dtd").text(formatNumber(cardDatadtd.dtdnewcust));
      $("#ldtd-new-cust").text(
        formatNumber(cardDatadtd.ldtdnewcust) + " " + "(ldtd)"
      );
      $("#old-customer-dtd").text(formatNumber(cardDatadtd.dtdoldcust));
      $("#table-occupancy-dtd").text(formatNumber(cardDatadtd.dtdtableocpny));

      // Determine the icon and text color for total revenue percentage
      var iconHtmlTotalRev = "";
      var textColorTotalRev = "";
      if (percentTotalDtd > 0) {
        iconHtmlTotalRev =
          '<i class="fas fa-arrow-up" style="color: green;"></i>';
        textColorTotalRev = "green";
      } else if (percentTotalDtd < 0) {
        iconHtmlTotalRev =
          '<i class="fas fa-arrow-down" style="color: red;"></i>';
        textColorTotalRev = "red";
      } else {
        textColorTotalRev = "black";
      }

      // Determine the icon and text color for new customers percentage
      var iconHtmlNewCust = "";
      var textColorNewCust = "";
      if (percentNewCustDtd > 0) {
        iconHtmlNewCust =
          '<i class="fas fa-arrow-up" style="color: green;"></i>';
        textColorNewCust = "green";
      } else if (percentNewCustDtd < 0) {
        iconHtmlNewCust =
          '<i class="fas fa-arrow-down" style="color: red;"></i>';
        textColorNewCust = "red";
      } else {
        textColorNewCust = "black";
      }

      // Update the HTML content with the calculated percentage, icon, and text color
      $("#t-r-dtd").html(
        '<span style="color: ' +
          textColorTotalRev +
          ';">' +
          percentTotalDtd +
          "%" +
          " " +
          iconHtmlTotalRev +
          "</span>"
      );
      $("#n-c-dtd").html(
        '<span style="color: ' +
          textColorNewCust +
          ';">' +
          percentNewCustDtd +
          "%" +
          " " +
          iconHtmlNewCust +
          "</span>"
      );
    } else {
      console.error("No data to update the cards.");
    }
  }

  //get data from mysql db for card mtd ,
  function fetchcardmtd(filters, callback) {
    console.log("Fetching data with filters:", filters);
    $.ajax({
      url: "/get_cart_mtd",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ filters: filters }),
      success: callback,
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
      },
    });
  }
  // function for updating the card data monthtilldate
  function updateCardmtd(data) {
    if (data && data.length > 0) {
      const cardDatamtd = data[0];
      // Ensure both values are numbers
      const mtdtotalrev = Number(cardDatamtd.mtdtotalrev);
      const lmtdtotalrev = Number(cardDatamtd.lmtdtotalrev);
      // ensure both values are number: also it is for newcust
      const mtdnewcust = Number(cardDatamtd.mtdnewcust);
      const lmtdnewcust = Number(cardDatamtd.lmtdnewcust);
      // checking mtd &ldtd are number or not
      if (isNaN(mtdtotalrev) || isNaN(lmtdtotalrev)) {
        console.error("MTD or LMTD values are not numbers.");
        return;
      }
      // checking both mtdnewcust &ldtdnewcust
      if (isNaN(mtdnewcust) || isNaN(lmtdnewcust)) {
        console.error("MTD or LMTD values are not numbers.");
        return;
      }
      // Corrected formula for percentage change
      var percentageTotalrevenue = Math.round(
        ((mtdtotalrev - lmtdtotalrev) / (mtdtotalrev + lmtdtotalrev)) * 100
      );
      var percentageNewCust = Math.round(
        ((mtdnewcust - lmtdnewcust) / (mtdnewcust + lmtdnewcust)) * 100
      );
      // console.log(cardDatamtd, "data from mtd")
      $("#total-revenue-mtd").text(formatNumber(cardDatamtd.mtdtotalrev));
      $("#lmtd-total-reve").text(
        formatNumber(cardDatamtd.lmtdtotalrev) + " " + "(lmtd)"
      );
      $("#new-cust-mtd").text(formatNumber(cardDatamtd.mtdnewcust));
      $("#lmtd-new-cust").text(
        formatNumber(cardDatamtd.lmtdnewcust) + " " + "(lmtd)"
      );
      $("#old-customer-mtd").text(formatNumber(cardDatamtd.mtdoldcust));
      $("#table-occupancy-mtd").text(formatNumber(cardDatamtd.mtdtableocpny));
      // Determine the icon and text color based on percentage change
      var iconHtml = "";
      var textColor = "";
      // condition for total revenue percentage
      if (percentageTotalrevenue > 0) {
        iconHtml = '<i class="fas fa-arrow-up" style="color: green;"></i>';
        textColor = "green";
      } else if (percentageTotalrevenue < 0) {
        iconHtml = '<i class="fas fa-arrow-down" style="color: red;"></i>';
        textColor = "red";
      } else {
        textColor = "black";
      }
      if (percentageNewCust > 0) {
        iconHtml = '<i class="fas fa-arrow-up" style="color: green;"></i>';
        textColor = "green";
      } else if (percentageNewCust < 0) {
        iconHtml = '<i class="fas fa-arrow-down" style="color: red;"></i>';
        textColor = "red";
      } else {
        textColor = "black";
      }
      // Update the HTML content with the calculated percentage, icon, and text color
      $("#t-r-mtd").html(
        '<span style="color: ' +
          textColor +
          ';">' +
          percentageTotalrevenue +
          "%" +
          " " +
          iconHtml +
          "</span>"
      );
      $("#n-c-mtd").html(
        '<span style="color: ' +
          textColor +
          ';">' +
          percentageNewCust +
          "%" +
          " " +
          iconHtml +
          "</span>"
      );
    } else {
      console.error("No data to update the cards.");
    }
  }

  //get data from mysql db for card ytd ,
  function fetchcardytd(filters, callback) {
    console.log("Fetching data with filters:", filters);
    $.ajax({
      url: "/get_cart_ytd",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ filters: filters }),
      success: callback,
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
      },
    });
  }
  // function for updating the card data ytd
  function updateCardytd(data) {
    if (data && data.length > 0) {
      const cardDataytd = data[0];

      $("#total-revenue-ytd").text(formatNumber(cardDataytd.ytdtotalrev));
      $("#new-customer-ytd").text(formatNumber(cardDataytd.ytdnewcust));
      $("#old-customer-ytd").text(formatNumber(cardDataytd.ytdoldcust));
      $("#table-occupancy-ytd").text(formatNumber(cardDataytd.ytdtableocpny));
    } else {
      console.error("No data to update the cards.");
    }
  }
});
