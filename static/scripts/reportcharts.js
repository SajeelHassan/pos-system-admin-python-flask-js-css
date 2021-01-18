import { result } from "./reports.js";

console.log('in chartswalijs ', result);

// let labels1 = ['YES', 'YES BUT IN GREEN'];
// let data1 = [69, 31];
// let colors1 = ['#49A9EA', '#36CAAB'];

// getting products sold

var productsSoldData;
var xmlObj2 = new XMLHttpRequest();
xmlObj2.open('get', '/incResultSold', true);
xmlObj2.send();
xmlObj2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
        productsSoldData = JSON.parse(this.responseText);
        xmlObj2.abort();
        console.trace(productsSoldData);
    }
}

// let myDoughnutChart = document.getElementById("myChart").getContext('2d');

// let chart1 = new Chart(myDoughnutChart, {
//     type: 'line',
//     data: {
//         labels: ['hello', 'YES', 'YES BUT IN GREEN', 'YES', 'YES BUT IN GREEN', 'YES', 'YES BUT IN GREEN'],
//         datasets: [{
//             data: [0, 10, 20, 10, 20, 10, 30],
//             backgroundColor: ['#49A9EA', '#49A9EA', '#36CAAB', '#49A9EA', '#36CAAB', '#49A9EA', '#36CAAB']
//         }]
//     },
//     options: {
//         title: {
//             text: "Do you like doughnuts?",
//             display: true
//         }
//     }
// });
console.log("in chartsss", theProductsSold);

let labels2 = ['American Airlines Group', 'Ryanair', 'China Southern Airlines', 'Lufthansa Group', 'American Airlines Group', 'Ryanair', 'China Southern Airlines', 'Lufthansa Group', 'American Airlines Group', 'Ryanair', 'China Southern Airlines', 'Lufthansa Group', 'American Airlines Group', 'Ryanair', 'China Southern Airlines', 'Lufthansa Group', 'American Airlines Group', 'Ryanair', 'China Southern Airlines', 'Lufthansa Group', 'American Airlines Group', 'Ryanair', 'China Southern Airlines', 'Lufthansa Group'];
let data2 = [199.6, 130.3, 126.3, 130, 199.6, 130.3, 126.3, 130, 199.6, 130.3, 126.3, 130, 199.6, 130.3, 126.3, 130, 199.6, 130.3, 126.3, 130, 199.6, 130.3, 126.3, 130];
let colors2 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF', '#49A9EA', '#36CAAB', '#34495E', '#B370CF', '#49A9EA', '#36CAAB', '#34495E', '#B370CF', '#49A9EA', '#36CAAB', '#34495E', '#B370CF', '#49A9EA', '#36CAAB', '#34495E', '#B370CF', '#49A9EA', '#36CAAB', '#34495E', '#B370CF', '#49A9EA', '#36CAAB', '#34495E', '#B370CF'];

let myChart2 = document.getElementById("chart-count-sales").getContext('2d');
console.log('in charts');
let chart2 = new Chart(myChart2, {
    type: 'bar',
    data: {
        labels: labels2,
        datasets: [{
            data: data2,
            data: data2,
            backgroundColor: colors2

        }]
    },
    options: {
        title: {
            text: "Number of passengers carried in 2017 (in mio.)",
            display: true
        },
        legend: {
            display: false
        }
    }
});


// let labels3 = ['Attack', 'Defense', 'Passing', 'Tackle', 'Speed'];
// let myChart3 = document.getElementById("myChart3").getContext('2d');

// let chart3 = new Chart(myChart3, {
//     type: 'radar',
//     data: {
//         labels: labels3,
//         datasets: [
//             {
//                 label: 'Messi',
//                 fill: true,
//                 backgroundColor: "rgba(179, 181, 198, 0.2)",
//                 borderColor: "rgba(179, 181, 198, 1)",
//                 pointBorderColor: "#fff",
//                 pointBackgroundColor: "rgba(179, 181, 198, 1)",
//                 data: [50, 12, 55, 7, 29]
//             },
//             {
//                 label: 'Ronaldo',
//                 fill: true,
//                 backgroundColor: "rgba(255, 99, 132, 0.2)",
//                 borderColor: "rgba(255, 99, 132, 1)",
//                 pointBorderColor: "#fff",
//                 pointBackgroundColor: "rgba(255, 99, 132, 1)",
//                 data: [51, 10, 32, 20, 44]
//             }
//         ]
//     },
//     options: {
//         title: {
//             text: "Skills",
//             display: true
//         }
//     }
// });

// let labels4 = ['Germany', 'France', 'UK', 'Italy', 'Spain', 'Others(23)'];
// let data4 = [83, 67, 66, 61, 47, 187];
// let colors4 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF', '#AC5353', '#CFD4D8'];

// let myChart4 = document.getElementById("myChart4").getContext('2d');

// let chart4 = new Chart(myChart4, {
//     type: 'pie',
//     data: {
//         labels: labels4,
//         datasets: [{
//             data: data4,
//             backgroundColor: colors4
//         }]
//     },
//     options: {
//         title: {
//             text: "Population of the European Union (in mio)",
//             display: true
//         }
//     }
// });
