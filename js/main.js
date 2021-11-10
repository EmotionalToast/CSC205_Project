//
//
//Initial variable and functions
    //Declare main table
    let table = document.getElementById("courseTable");
    //Declare details table
    let detailsTable = document.getElementById("detailsTable");

    //Variable to check if classes are hidden
    let classesHidden = false;

    //When the page fully loads
    window.onload = (event) => {
        //Call build function
        build();
    }

    //Declare course list variable so I can store the response from the fetch later
    let courseList;

    //Function to fetch the data
    async function fetchData () {
        //Fetch from the url
        await fetch('https://csc205.cscprof.com/courses')
            //JSONify the respone
            .then(response => response.json())
            //Set courseList equal to the response, so I can use the variable globally
            .then(data => courseList = data);
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
                attribute.includes('Email') ||
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
//
//
//
//Functions for the main table
    //Function to generate main table head
    function generateTableHead(table, tableHeaders) {
        //Add a table head
        let thead = table.createTHead();

        //Add a row
        let row = thead.insertRow();

        //For each table header
        for (let key of tableHeaders) {
            //Create table header
            let th = document.createElement("th");
            //Create text equal to the key
            let text = document.createTextNode(key);

            //Add the text to the table header
            th.appendChild(text);

            //Add the table header to the row
            row.appendChild(th);
        }
    }

    //Function to generate main table body
    function generateTable(table, courseList) {
        //Create a table body
        let tbody = table.createTBody();

        //Add id to the table body for when searching
        tbody.setAttribute("id","classData");

        for (let course of courseList) {
            //Create row
            let row = tbody.insertRow();

            //Add id to each course row for styling
            row.setAttribute("id", "courseRow");

            //Add an onclick event to the row passing the course code of the selected course
            row.setAttribute("onclick", "replaceDetailsData(\"" + course.Department + "\")");

            //For each value thats in the course
            for (value in course) {
                //Create cell
                let cell = row.insertCell();

                //Create text equal to the value
                let text = document.createTextNode(course[value]);

                //Add the text to the cell
                cell.appendChild(text);
            }
        }
        
        //Color the tables 
        colorTable();
    }

    //Function to color the table depending on openings
    function colorTable(){
        //Grab all the rows in the main table
        let rows = document.getElementById("courseTable").rows;

        //For each row in the table
        for (let i = 1; i < rows.length; i++) {
            let row = rows[i];

            //If openings is 0...
            if(parseInt(row.lastChild.innerHTML) == 0){
                //Make the opening text red
                rows[i].lastChild.className = "classFull";
            }
            //If openings is less than 5...
            else if(parseInt(row.lastChild.innerHTML) <= 5){
                //Make the opening text yellow
                rows[i].lastChild.className = "classLow";
            }    
        }
    }
//
//
//
//Functions for the details table

    //Function to generate the details table
    function generateDetails(table, keys) {
        //Add Course Code and Time to the keys array
        keys.splice(0, 0, "Course Code");
        keys.splice(5, 0, "Time");

        //Create a table body
        let tbody = table.createTBody();

        //Loop through keys array
        for(let value of keys){
            //Add a row
            let row = tbody.insertRow();

            //Add a cell for the key
            let keyCell = row.insertCell();

            //Add a cell for the value
            let cell = row.insertCell();

            //Add an id to the cell equal to the value it represents
            cell.id = value;

            //Put the key into key cell
            keyCell.appendChild(document.createTextNode(value));
        }
    }

    //Function that replaces the data in the details table
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
                document.getElementById("Email").innerHTML = formattedCourse.Email.link("mailto:" + formattedCourse.Email);
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

        colorDetailsTable();
    }

    //Function to format the data of a course to be more readable
    function formatData(course){

        //If there is no start and end time...
        if(course.StartTime == null && course.EndTime == null){
            course["Time"] = "Check with Faculty";
        }
        //Else...
        else{
            //Convert both start and end time to standard time and set it as Time
            course["Time"] = convertMilitary(course.StartTime) + " - " + convertMilitary(course.EndTime);
        }

        //Check if there is a building and room
        if(course.Room == null && course.Building == null){
            course.Room = "No Room";
            course.Building = "No Building";
        }

        //Set course code and openings
        course["Course Code"] = course.Department + " " + course.Number + " " + course.Section;
        course["OpeningsAndCapacity"] = course.Openings + "/" + course.Capacity;
        
        //Return the completely formatted course
        return course;
    }

    //Function for format data to convert military time to standard time
    function convertMilitary(time){
        //Split passed in time into array
        time = time.split(':');

        //Set the hours and minutes of the split array
        let hours = Number(time[0]);
        let minutes = Number(time[1]);

        let timeValue;

        //If the time is before noon
        if (hours > 0 && hours <= 12) {
            timeValue= "" + hours;
        }
        //If the time is in the afternoon
        else if (hours > 12) {
            timeValue= "" + (hours - 12);
        }
        //If the time is at midnight
        //(This shouldnt ever be hit in our case but added in case some class starts or ends at midnight)
        else if (hours == 0) {
            timeValue= "12";
        }
        
        //Append the minutes
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;
        //Append PM or AM
        timeValue += (hours >= 12) ? " PM" : " AM";

        return timeValue;
    }

    //Function to color the detail table
    function colorDetailsTable() {
        //Grab the opening and rating cells
        let opening = document.getElementById("Openings");
        let rating = document.getElementById("Rating");

        //If there are no openings...
        if(parseInt(opening.innerHTML) == 0){
            //Make the opening text red
            opening.className = "classFull";
        }
        //Else if there is less than 5 openings...
        else if(parseInt(opening.innerHTML) <= 5){
            //Make the opening text yellow
            opening.className = "classLow";
        }

        //If the rating is less and or equal to 2...
        if(rating.innerHTML <= 2){
            //Make the rating text red
            rating.className = "ratingLow";
        }
        //Else if its equal to 3...
        else if(rating.innerHTML == 3){
            //Make the rating text yellow
            rating.className = "ratingAverage";
        }
        //Else if its is greater than or equal to 4...
        else if(rating.innerHTML >= 4){
            //Make the rating text green
            rating.className = "ratingHigh";
        }
    }
//
//
//
//Functions for the button
    //Function to hide the full classes
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
//
//
//
//Functions for the search box
    //Declaring etarget variable
    var etarget = "";
    //Event listener that puts the input into the etarget variable
    searchbox.addEventListener("input", (e) => etarget = e.target.value);

    //Call function on input into the searchbox
    searchbox.oninput = function () {    
        applySearch();
    }

    //Function to apply the search
    function applySearch() {
        //Get the main table body
        let tbody = document.getElementById("classData");
        //Remove the body
        tbody.remove();

        //Filter to classes that include the inputted string, after putting both to lowercase so case sensitivity doesnt matter
        let someClasses = filteredCourses.filter(oneClass => Object.keys(oneClass)
            .some(key => String(oneClass[key]).toLowerCase().includes(etarget.toLowerCase()) ) );
    
        //Generate main table again from the filtered out classes
        generateTable(table, someClasses);
    }
//