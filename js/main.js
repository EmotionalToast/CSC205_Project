//Declaring tables
let table = document.getElementById("courseTable");
let detailsTable = document.getElementById("detailsTable");

//Variable to check if classes are hidden
let classesHidden = false;

//When the page fully loads
window.onload = (event) => {
    build();
}

//Fetch the data
let courseList;
async function fetchData () {
    console.log("Fetching data...")
    await fetch('https://csc205.cscprof.com/courses')
        .then(response => response.json())
        .then(data => courseList = data);

    console.log("Data fetched!");
}

//Build the tables
async function build(){
    //Fetch the data first with an await so the data is loaded before anything tries to acces it
    await fetchData();

    //Clear search box on refresh
    searchbox.value = "";

    //Creating the main table headers
    let tableHeaders = ["Course Number"];
    let mergedTableHeaders = [].concat.apply(tableHeaders, (Object.keys(courseList[0]).
        filter((attribute) =>
            attribute.includes('Title') ||
            attribute.includes('Faculty') ||
            attribute.includes('Openings')
        )));

    //Filter the courses to align with the headers
    filteredCourses = courseList.map(a => ({ 
        Department: a.Department + " " + a.Number + " " + a.Section,
        Title: a.Title, 
        Faculty: a.Faculty, 
        Openings: a.Openings + "/" + a.Capacity
    }));

    //Generate the main table
    generateTableHead(table, mergedTableHeaders);
    generateTable(table, filteredCourses);

    //Filter the keys for the first column of the details table
    detailTableKeys = Object.keys(courseList[0]).
        filter((attribute) =>
            attribute.includes('Title') ||
            attribute.includes('Faculty') ||
            attribute.includes('Openings') ||
            attribute.includes('Day') ||
            attribute.includes('Campus') ||
            attribute.includes('Building') ||
            attribute.includes('Room') ||
            attribute.includes('Credits') ||
            attribute.includes('Date') ||
            attribute.includes('Rating')
        );

    //Generate the details table
    generateDetails(detailsTable, detailTableKeys);
}

//Main table functions
function generateTableHead(table, tableHeaders) {

    let thead = table.createTHead();
    let row = thead.insertRow();

    for (let key of tableHeaders) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);

        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, courseList) {
    let tbody = table.createTBody();
    tbody.setAttribute("id","classData");

    for (let course of courseList) {
        let row = tbody.insertRow();

        //Add id to each course row for styling
        row.setAttribute("id", "courseRow");

        //Add an onclick event to the row passing the course code of the selected course
        row.setAttribute("onclick", "replaceDetailsData(\"" + course.Department + "\")");

        for (value in course) {
            let cell = row.insertCell();
            let text = document.createTextNode(course[value]);

            cell.appendChild(text);
        }
    }
    
    colorTable();
}
//

//Details table functions
function formatData(course){

    //Check if there is a start and end time
    if(course.StartTime == null && course.EndTime == null){
        course["Time"] = "Check with Faculty";
    }
    else{

        //Declaring the time so it can format the rest properly, this takes out the :00.0 at the end of start and end time
        course["Time"] = course.StartTime.substring(0, course.StartTime.indexOf(":00.0")) + " - " + course.EndTime.substring(0, course.StartTime.indexOf(":00.0"));
        
        //Check if the class takes place after 12
        if(course.StartTime.substring(0, 2) > 12){
            let times = course.Time.split("-");

            let startingTime = times[0].split(":");
            let endingTime = times[1].split(":");

            newStartTime = startingTime[0] - 12;
            newEndTime = endingTime[0] - 12;

            //Format the time for night
            course.Time = newStartTime + ":" + startingTime[1] + "PM - " + newEndTime + ":" + endingTime[1] + "PM";
        }

        //Check if the class starting in the morning but ends after 12
        else if(course.EndTime.substring(0, 2) > 12){
            let times = course.Time.split("-");

            let startingTime = times[0].split(":");
            let endingTime = times[1].split(":");

            newEndTime = endingTime[0] - 12;

            //Format the time for starting in morning and ending in evening
            course.Time = startingTime[0] + ":" + startingTime[1] + "AM - " + newEndTime + ":" + endingTime[1] + "PM";
        }

        //All else, class takes place only in the morning
        else{

            //Format for just the morning
            course["Time"] = course.StartTime.substring(0, course.StartTime.indexOf(":00.0")) + "AM - " + course.EndTime.substring(0, course.StartTime.indexOf(":00.0")) + "AM";
        }
    }

    //Check if there is a building and room
    if(course.Room == null && course.Building == null){
        course.Room = "No Room";
        course.Building = "No Building";
    }

    course["Course Code"] = course.Department + " " + course.Number + " " + course.Section;
    course["OpeningsAndCapacity"] = course.Openings + "/" + course.Capacity;
    
    //Return the completely formatted course
    return course;
}

function generateDetails(table, keys) {
    //Add Course Code and Time to the keys array
    keys.splice(0, 0, "Course Code");
    keys.splice(5, 0, "Time");

    //Create a table body
    let tbody = table.createTBody();


    for(let value of keys){
        let row = tbody.insertRow();

        let keyCell = row.insertCell();

        let cell = row.insertCell();
        cell.id = value;

        keyCell.appendChild(document.createTextNode(value));
        cell.appendChild(document.createTextNode(""));
    }
}

function replaceDetailsData(passedCourse){
    //Set the details table to visible
    document.getElementById("detailsTable").style = "display: inline-block";

    //For each course in the filtered course list
    for(course in filteredCourses){

        //If the passed in course is equal to the current course of the for loop...
        if(passedCourse == filteredCourses[course].Department){

            //Format the passed in course
            formattedCourse = formatData(courseList[course]);

            //Grab each cell and change its text to correspond to the passed in course's values
            document.getElementById("Course Code").innerHTML = formattedCourse["Course Code"];
            document.getElementById("Title").innerHTML = formattedCourse.Title;
            document.getElementById("Faculty").innerHTML = formattedCourse.Faculty;
            document.getElementById("Openings").innerHTML = formattedCourse.OpeningsAndCapacity;
            document.getElementById("Day").innerHTML = formattedCourse.Day;
            document.getElementById("Time").innerHTML = formattedCourse.Time;
            document.getElementById("Campus").innerHTML = formattedCourse.Campus;
            document.getElementById("Building").innerHTML = formattedCourse.Building;
            document.getElementById("Room").innerHTML = formattedCourse.Room;
            document.getElementById("Credits").innerHTML = formattedCourse.Credits;
            document.getElementById("Start Date").innerHTML = formattedCourse["Start Date"];
            document.getElementById("End Date").innerHTML = formattedCourse["End Date"];
            document.getElementById("Rating").innerHTML = formattedCourse.Rating;
        }
    }
}
//

function colorTable(){
    //Grab all the rows in the main table
    let rows = document.getElementById("courseTable").rows;

    //For each row in the table
    for (let i = 1; i < rows.length; i++) {
        let row = rows[i];

        //If openings is 0...
        if(parseInt(row.lastChild.innerHTML) == 0){
            //Make the opening column red
            rows[i].lastChild.className = 'table-danger';
        }
        //If openings is less than 5...
        else if(parseInt(row.lastChild.innerHTML) < 5){
            //Make the opening column yellow
            rows[i].lastChild.className = 'table-warning';
        }    
    }
}

function hideClasses(){
    //Check if classes are already hidden
    //If they aren't...
    if(classesHidden == false){
        //Grab the body and set the rows
        let tbody = document.getElementById("courseTable");
        let rows = tbody.rows;

        //For each row...
        for (var i=rows.length-1; i >=0; i--) {
            let row = rows[i];

            //If openings is 0...
            if(parseInt(row.lastChild.innerHTML) == 0){
                //Delete the row
                table.deleteRow(i);
            }  
        }

        //Set the button text to Show
        document.getElementById("hideButton").innerHTML = "Show Full Classes";

        //Set classes hidden to true
        classesHidden = true;
    }
    //If classes are hidden
    else{
        //Grab the body and delete it
        let tbody = document.getElementById("classData");
        tbody.remove();

        //Generate the main table again
        generateTable(table, filteredCourses);

        //Set the button text to Hide
        document.getElementById("hideButton").innerHTML = "Hide Full Classes";

        //Set classes hidden to false
        classesHidden = false;
    }
}

//Event listener for search box input
var etarget = "";
searchbox.addEventListener("input", (e) => etarget = e.target.value);

//Call function on input into the searchbox
searchbox.oninput = function () {    
    applySearch();
}

//Apply the search
function applySearch() {
    let tbody = document.getElementById("classData");
    tbody.remove();

    let someClasses = filteredCourses.filter(oneClass => Object.keys(oneClass)
        .some(key => String(oneClass[key]).toLowerCase().includes(etarget.toLowerCase()) ) );
   
    generateTable(table, someClasses);
}
//
