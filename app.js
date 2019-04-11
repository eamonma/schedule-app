const weekdays = [
    // "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    // "Saturday"
];

const months = [
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
    "December"
];

const schedule = {
    utility: {
        // returns the days since the unix epoch
        daysSince(ms) {
            return Math.floor(ms / 8.64e7);
        },
        // returns the day no, being 1 or 2, depending on the day
        dayNo(days) {
            return (days % 2 === 1) ? (1) : (2);
        },
        // return the weekday, 0 being Sunday
        weekday(days) {
            return (days + 4) % 7;
        },
        // returns the week no, being 1 or 2, depending on the week
        weekNo(days) {
            return (((days + 4) % 14) < 7) ? (1) : (2);
        },
        gmtToLocal(time) {
            return time - (new Date().getTimezoneOffset()) * 60 * 1000;
        },
        localToGmt(time) {
            return time + (new Date().getTimezoneOffset()) * 60 * 1000;
        },
        queue(array) {
            const last = array.shift();
            array.push(last);
            return array;
        },
        unqueue(array) {
            const first = array.pop();
            array.unshift(first);
            return array;
        },
        getFourthBlock(day, courses) {
            return (day === 1) ? (courses[3]) : (courses[7]);
        },
        setCourses(courses, name = "courses") {
            return localStorage.setItem(name, JSON.stringify(courses));
        },
        getCourses(name = "courses") {
            return JSON.parse(localStorage.getItem(name));
        },
        promptCourses(length, list) {
            //list of items with input fields
            length = length ? length : 8;
            let result = [];
            for (let i = 0; i < 8; i++) {
                let course = list[i].value;
                // let course = prompt("What is your block " + (i + 1) + " ?");
                result.push({
                    name: course
                });
            }
            return result;
        },
        deleteCourses() {
            localStorage.removeItem("courses");
        },
        coursesToArray(list) {
            let arr = [];
            list.forEach(function (course) {
                arr.push(course.name);
            });
            return arr;
        }
    },
    generate(courses = [1,2,3,4,5,6,7,8]) {
        let weeks = [];
        let weekOne = [];
        let weekTwo = [];
        const one = courses.slice(0, 4);
        const oneMorning = one.slice(0, 3);
        const two = courses.slice(4);
        const twoMorning = two.slice(0, 3);
        const _ = this.utility;

        const returnedOne = oneMorning.slice(0);

        const returnedTwo = twoMorning.slice(0);

        for (let i = 0; i < 10; i++) {
            if (i % 2 === 0) {
                // if day 1
                if (i === 0) {
                    // if monday of 1
                    weeks.push(oneMorning);
                    continue;
                }
                let tempArr = returnedOne;                
                tempArr = _.queue(returnedOne);
                weeks.push(tempArr.slice(0));
            } else {
                // if day 2
                if (i === 1) {
                    // if tuesday of 1
                    weeks.push(twoMorning);
                    continue;
                }
                let tempArr = returnedTwo;
                tempArr = _.queue(returnedTwo);
                weeks.push(tempArr.slice(0));
            }
        }
        let j = 0;
        weeks.forEach((day) => {
            let finalBlock = j % 2 === 0 ? courses[3] : courses[7]
            j++
            day.push(finalBlock)
        })

        weekOne = weeks.slice(0, 5);
        weekTwo = weeks.slice(5);
        
        return {
            weekOne,
            weekTwo,
        }
    }
};

const _ = schedule.utility

let myCourses = _.getCourses()
if(!myCourses[0]) {
    myCourses = []
    for(let i = 0; i < 8; i++) {
        myCourses.push(prompt(`What is your block ${i + 1}?`))
    }
    _.setCourses(myCourses)
}

const mySchedule = schedule.generate(myCourses)
let tableOne = document.createElement("table")
let tableTwo = document.createElement("table")
let tables = []

let mutatedSchedule = []

for(let j = 0; j < 2; j++) {
    let week = (j === 0) ? mySchedule.weekOne : mySchedule.weekTwo;
    let table = (j === 0) ? tableOne : tableTwo;

    for(let i = 0; i < 4; i++) {
        let tempArr = []
        week.forEach((day) => {
            tempArr.push(day[i])
        })
        mutatedSchedule.push(tempArr)
    }

    for(let i = 0; i < mutatedSchedule.length; i++) { // the row
        let row = table.insertRow(i)
        for(let j = 0; j < mutatedSchedule[i].length; j++) {
            let cell = row.insertCell(j)
            cell.innerHTML = mutatedSchedule[i][j]
        }
    }

    let row = table.insertRow(0)
    row.classList.add("weekdays")
    for(let i = 0; i < weekdays.length; i++) {
        let cell = row.insertCell(i)
        cell.classList.add(weekdays[i].toLowerCase())
        cell.innerHTML = weekdays[i]
    }
    tables.push(table)

    mutatedSchedule = []
}

m.get(".week-one").appendChild(tables[0])
m.get(".week-two").appendChild(tables[1])

const day = new Date().getDay()
const week = _.weekNo(_.daysSince(_.gmtToLocal(Date.now())))

try {
    const weekElement = m.get(week === 1 ? (".week-one") : (".week-two"))
    const dayElement = weekElement.getElementsByClassName(`${weekdays[day - 1]}`)[0];

    dayElement.style.background = "rgb(192,57,43)"
    dayElement.style.color = "#fff"

    const td = m.getS("td")

    for(element of td) {
        element.setAttribute("tabindex", 0)
    }
} catch(e) {
    console.log(e);
}