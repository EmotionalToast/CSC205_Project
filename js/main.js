window.onload = (event) => {
    let table = document.getElementById("course-table")
    let tableHeaders = Object.keys(courseList[0]).
        filter((attribute) =>
            attribute.includes('Title') ||
            attribute.includes('Faculty') ||
            attribute.includes('Openings')
        );
    
    let filteredCourses = courseList.map(a => ({ 
        Title: a.Title, 
        Faculty: a.Faculty, 
        Openings: a.Openings 
    }));

    console.log(filteredCourses)

    generateTableHead(table, tableHeaders);
    generateTable(table, filteredCourses);
}

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

    for (let course of courseList) {
        let row = tbody.insertRow();

        for (value in course) {
            let cell = row.insertCell();
            let text = document.createTextNode(course[value]);

            cell.appendChild(text);
        }
    }
}



let courseList = [
    {
        "Line": 81,
        "Department": "BUS",
        "Number": 344,
        "Section": 1,
        "Title": "MANAGEMENT OF INFORMATION SYSTEMS",
        "Faculty": "Richards, Gordon P.",
        "Openings": 2,
        "Capacity": 30,
        "Status": "Open",
        "Day": "MWF",
        "StartTime": "1:25:00 PM",
        "EndTime": "2:20 PM",
        "Campus": " Main Campus",
        "Building": " Science and Engineering",
        "Room": " SE 341 Computer Science Lab",
        "Credits": 3,
        "Start Date": "8\/30\/2021",
        "End Date": "12\/17\/2021\r\n"
    },
    {
        "Line": 167,
        "Department": "CSC",
        "Number": 133,
        "Section": 2,
        "Title": "SURVEY OF COMPUTER SCIENCE",
        "Faculty": "Madeira, Scott",
        "Openings": 6,
        "Capacity": 15,
        "Status": "Open",
        "Day": "H",
        "StartTime": "2:00:00 PM",
        "EndTime": "4:50 PM",
        "Campus": " Main Campus",
        "Building": " Science and Engineering",
        "Room": " SE 341 Computer Science Lab",
        "Credits": 0,
        "Start Date": "8\/30\/2021",
        "End Date": "12\/17\/2021\r\n"
    },
    {
        "Line": 168, 
        "Department": "CSC", 
        "Number": 133, 
        "Section": 3, 
        "Title": "SURVEY OF COMPUTER SCIENCE", 
        "Faculty": "Madeira, Scott", 
        "Openings": 7, 
        "Capacity": 15, 
        "Status": "Open", 
        "Day": "T", 
        "StartTime": "6:30:00 PM", 
        "EndTime": "9:20 PM", 
        "Campus": " Main Campus", 
        "Building": " Science and Engineering", 
        "Room": " SE 341 Computer Science Lab", 
        "Credits": 0, 
        "Start Date": "8\/30\/2021", 
        "End Date": "12\/17\/2021\r\n"
    }, 
    { 
        "Line": 169, 
        "Department": "CSC", 
        "Number": 133, 
        "Section": "0A", 
        "Title": "SURVEY OF COMPUTER SCIENCE", 
        "Faculty": "Richards, Gordon P.", 
        "Openings": 15, 
        "Capacity": 45, 
        "Status": "Open", 
        "Day": "TH", 
        "StartTime": "8:00:00 AM", 
        "EndTime": "9:20 AM", 
        "Campus": " Main Campus", 
        "Building": " Science and Engineering", 
        "Room": " SE 110 Chemistry room", 
        "Credits": 4, 
        "Start Date": "8\/30\/2021", 
        "End Date": "12\/17\/2021\r\n" 
    }, 
    { "Line": 170, "Department": "CSC", "Number": 190, "Section": 1, "Title": "HTML", "Faculty": "Madeira, Scott", "Openings": 4, "Capacity": 25, "Status": "Open", "Day": "M", "StartTime": "2:30:00 PM", "EndTime": "3:25 PM", "Campus": " Main Campus", "Building": " Science and Engineering", "Room": " SE 312A", "Credits": 1, "Start Date": "8\/30\/2021", "End Date": "12\/17\/2021\r\n" }
    , { "Line": 171, "Department": "CSC", "Number": 205, "Section": 1, "Title": "HCI DESIGN & PROGRAMMING", "Faculty": "Madeira, Scott", "Openings": 10, "Capacity": 25, "Status": "Open", "Day": "MWF", "StartTime": "11:15:00 AM", "EndTime": "12:10 PM", "Campus": " Main Campus", "Building": " Science and Engineering", "Room": " SE 341 Computer Science Lab", "Credits": 3, "Start Date": "8\/30\/2021", "End Date": "12\/17\/2021\r\n" }
    , { "Line": 172, "Department": "CSC", "Number": 344, "Section": 1, "Title": "MANAGEMENT INFORMATION SYSTEM", "Faculty": "Poteete, Paul W. Steffine, Aaron", "Openings": 2, "Capacity": 90, "Status": "Open", "Day": "MWF", "StartTime": "1:25:00 PM", "EndTime": "2:20 PM", "Campus": " Main Campus", "Building": " Science and Engineering", "Room": " SE 341 Computer Science Lab", "Credits": 3, "Start Date": "8\/30\/2021", "End Date": "12\/17\/2021\r\n" }
    , { "Line": 173, "Department": "CSC", "Number": 363, "Section": "E1", "Title": "DATABASE SYSTEMS", "Faculty": "Hinderliter, Jeffery A", "Openings": 4, "Capacity": 30, "Status": "Open", "Day": "T", "StartTime": "6:30:00 PM", "EndTime": "9:20 PM", "Campus": " Main Campus", "Building": " Science and Engineering", "Room": " SE 233 Engineering Lab\/Classroom", "Credits": 3, "Start Date": "8\/30\/2021", "End Date": "12\/17\/2021\r\n" }
    , { "Line": 296, "Department": "HUM", "Number": 103, "Section": "0A", "Title": "INVITATION TO THE HUMANTIES", "Faculty": "Miller, Eric John", "Openings": 12, "Capacity": 180, "Status": "Open", "Day": "W", "StartTime": "11:15:00 AM", "EndTime": "12:10 PM", "Campus": " Main Campus", "Building": " Old Main", "Room": " John White Chapel", "Credits": 0, "Start Date": "8\/30\/2021", "End Date": "12\/17\/2021" }
]
