// Reference was made to Zeller's Rule on the links provided:
// http://mathforum.org/dr.math/faq/faq.calendar.html

// Leap Years conditions found in the second link:
// https://www.timeanddate.com/date/leapyear.html


// http://mathforum.org/dr.math/faq/faq.calendar.html
let ZellersWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

// https://www.timeanddate.com/date/leapyear.html
checkIfLeapYear = (year) => {
  YearInNumber = parseInt(year);
  if (YearInNumber % 4 === 0 && YearInNumber % 100 !== 0 || YearInNumber % 400 === 0) {
    return true;
  }
  return false;
}

// http://mathforum.org/dr.math/faq/faq.calendar.html
firstDayOfTheMonth = (month, year) => {

  // According to Zeller's Rule, January and February fall under the previous year
  if(month === "January" || month === "February") {
    year = `${parseInt(year) - 1}`;
  }

  let ZellersRuleMonths = {
    March: 1,
    April: 2,
    May: 3,
    June: 4,
    July: 5,
    August: 6,
    September: 7,
    October: 8,
    November: 9,
    December: 10,
    January: 11,
    February: 12
  };

  // Zeller's Rule formula
  // k represents the first day of the month
  let k = 1;

  // m represents month number based on Zeller's Rule
  let m = ZellersRuleMonths[month];

  // D represents last 2 digits in the year. eg: D = 19 when year = "2019"
  let D = parseInt(year.substr(2,3));

  // C represents first 2 digits in the year. eg: C = 20 when year = "2019"
  let C = parseInt(year.substr(0, 2));

  let f =  (k + Math.floor((13*m-1)/5) + D + Math.floor(D/4) + Math.floor(C/4) - (2*C));
  let remainder = f % 7;

  if (remainder < 0) {
    remainder = remainder + 7;
  }
  // Returns the first day of the month in question
  return ZellersWeek[remainder];
}


displayDate = (event, position) => {
  let day = ZellersWeek[position];
  let dateValue = event.target.innerHTML;
  let monthValue = document.getElementById("month-picker").value;
  let yearValue = document.getElementById("year-picker").value;
  let displayedDate = document.getElementById("date");

  displayedDate.innerHTML = `${day}, ${dateValue} ${monthValue} ${yearValue}`;
}

// render the rows and columns with their corresponding values in dates section of the calendar
renderDays = (month, year, NumberOfDaysInMonth) => {

  // Make the first few days empty based on the first day of the month in the first row.
  let firstDay = firstDayOfTheMonth(month, year);
  let firstDaysRow = document.createElement("tr");
  let positionOfFirstDayInRow = ZellersWeek.indexOf(firstDay);

  for (i = 0; i < positionOfFirstDayInRow; i++) {
    let emptyColumn = document.createElement("td");
    firstDaysRow.appendChild(emptyColumn);
  }

  // Fill in the rest of the first row
  let remainderDaysInFirstRow = 7 - positionOfFirstDayInRow;
  let initialiseDay = 1;

  for (let i = 0; i < remainderDaysInFirstRow; i++) {
    let fullColumn = document.createElement("td");
    let dateNode = document.createTextNode(initialiseDay);

    fullColumn.appendChild(dateNode);
    firstDaysRow.appendChild(fullColumn);
    fullColumn.addEventListener("click", (event) => displayDate(event, i));
    initialiseDay = initialiseDay + 1;
  }

  // Add the first row to the DOM
  document.getElementById("dates").appendChild(firstDaysRow);

  // Find out how many rows a particular month will require
  let numberOfDaysInMonth = NumberOfDaysInMonth[month];
  let numberOfRows = Math.round(numberOfDaysInMonth / 7);

  // For each additional row, fill all rows with 7 columns
  for (let i = 1; i <= numberOfRows; i++) {
    let daysRow = document.createElement("tr");

    for (let j = 0; j < 7; j++) {
      if (initialiseDay > numberOfDaysInMonth) break;
      let fullColumn = document.createElement("td");
      let dateNode = document.createTextNode(initialiseDay);

      fullColumn.appendChild(dateNode);
      daysRow.appendChild(fullColumn);
      fullColumn.addEventListener("click", (event) => displayDate(event, j));
      initialiseDay = initialiseDay + 1;
    }

    // Add the the additional rows to the DOM
    document.getElementById("dates").appendChild(daysRow);
  }
}


generateCalendar = (month, year) => {

  let NumberOfDaysInMonth = {
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };

  // Account for leap years, only if February is concerned.
  // Zeller's Rule formula already accounts for leap years for all other months.
  if (month === "February") {
    let leapYear = checkIfLeapYear(year);
    if (leapYear) {
      NumberOfDaysInMonth["February"] = 29;
    }
  }
  renderDays(month, year, NumberOfDaysInMonth)
}

// Month drop-down
populateMonth = () => {
  let MonthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // render options for drop-down
  MonthList.forEach(month => {
    let monthOption = document.createElement("option");
    let monthNode = document.createTextNode(month);
  
    monthOption.appendChild(monthNode);

    document.getElementById("month-picker").appendChild(monthOption);
  })

  // Initially displays current Month
  let indexOfMonth = new Date().getMonth()
  document.getElementById("month-picker").value = MonthList[indexOfMonth];
}

// call the function
populateMonth();


// Month drop-down
populateYear = () => {

  // render options for drop-down year between 1500 to 2500
  for (let year = 2500; year > 1500; year--) {
    let yearOption = document.createElement("option");
    let yearNode = document.createTextNode(year);

    yearOption.appendChild(yearNode);
    document.getElementById("year-picker").appendChild(yearOption);
  }

  // Initially displays current year
  document.getElementById("year-picker").value = new Date().getFullYear();
}

// call the function
populateYear();

// onchange listener for both drop-downs
updateCalendar = () => {
  // clear all nodes inside of the `<tbody></tbody>`
  let datesNode = document.getElementById("dates")
  while (datesNode.firstChild) {
    datesNode.removeChild(datesNode.firstChild);
  }
  // call generateCalender with current month and date selected
  let monthValue = document.getElementById("month-picker").value;
  let yearValue = document.getElementById("year-picker").value;
  generateCalendar(monthValue, yearValue);
}

// call updateCalendar
updateCalendar();
