const CORRECT_GENDER_ATTRIBUTE_NAME = "correct-gender"

const nounBatchSize = 100;
const nounsFilename = "./nouns-with-cases.csv";
var currentNouns = [];
var seenNouns = new Set();

const genderPairings = {
    m: { friendly: "der", regex: "([dD][eE][rR])" },
    f: { friendly: "die", regex: "([dD][iI][eE])" },
    n: { friendly: "das", regex: "([dD][aA][sS])" }
}

const mismatchErrorMsg = "Lo siento, pero no. Es: ";

// Read in csv file
function fetchNouns(filename) {
    // console.log("fetching...")
    return fetch(filename)
        .then(response => response.blob())
        .then(blob => blob.text())
        .then(fileText => csvToArray(fileText))
}

// CSV Parser
function csvToArray(str, delimiter = ",", newline = ";") {
    // slice from start of text to the first newline index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf(newline)).split(delimiter);

    // slice from newline index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf(newline) + 1).split(newline);

    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });

    // return the array
    return arr;
}

// Select next 100 random nouns
// Add these 100 nouns to set of seen nouns

// Get random element from any array
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

// function shuffleArray(array) {
//     for (var i = array.length - 1; i > 0; i--) {
    
//         // Generate random number
//         var j = Math.floor(Math.random() * (i + 1));
                    
//         var temp = array[i];
//         array[i] = array[j];
//         array[j] = temp;
//     }
        
//     return array;
// }
    
    

// // Split CSV into chunks
// function sliceIntoChunks(arr, chunkSize = nounBatchSize) {
//     const res = [];
//     for (let i = 0; i < arr.length; i += chunkSize) {
//         const chunk = arr.slice(i, i + chunkSize);
//         res.push(chunk);
//     }
//     return res;
// }

// function download(data, index) {

// 	// Creating a Blob for having a csv file format
// 	// and passing the data with type
// 	const blob = new Blob([data], { type: 'text/csv' });

// 	// Creating an object for downloading url
// 	const url = window.URL.createObjectURL(blob)

// 	// Creating an anchor(a) tag of HTML
// 	const a = document.createElement('a')

// 	// Passing the blob downloading url
// 	a.setAttribute('href', url)

// 	// Setting the anchor tag attribute for downloading
// 	// and passing the download file name
// 	a.setAttribute('download', `nouns-${index}.csv`);

// 	// Performing a download with click
//     return new Promise(async (resolve) => {
//         a.click();
//         setTimeout(() => resolve(), 100);
//     })
// }

// Main function
async function displayNewNoun() {
    // Only fetch new nouns when nounBatchSize is reached
    if (seenNouns.size === 0) {
        // Get random noun file
        let nounsFilename = `./nouns/nouns-${Math.floor(Math.random() * 893)}.csv`
        currentNouns = await fetchNouns(nounsFilename);


        // Split and download CSV stuff
        // currentNouns = shuffleArray(currentNouns);

        // // Split CSV into chunks of nounBatchSize
        // let nounChunks = sliceIntoChunks(currentNouns)

        // // Write chunks into separate CSV files
        // var chunksAsStrings = nounChunks.map((chunk) => {
        //     let nounsAsStrings = chunk.map(noun => Object.values(noun).join());
        //     // Add headers
        //     nounsAsStrings.unshift(Object.keys(chunk[0]).join());
        //     return nounsAsStrings.join(";")
        // })

        // for (let index = 0; index < chunksAsStrings.length; index++) {
        //     let downloadProcess = await download(chunksAsStrings[index], index);
        //     console.log("Downloaded " + index);
        // }
    }

    // Get random noun and update DOM content
    let randomNoun = currentNouns.random();
    while(seenNouns.has(randomNoun.noun)) {
        randomNoun = currentNouns.random();
    }
    seenNouns.add(randomNoun.noun);
    randomNounDOM.textContent = randomNoun.noun;

    // Attach solution to submit buttons
    document.querySelectorAll(".noun-submit").forEach(btn => {
        btn.setAttribute(CORRECT_GENDER_ATTRIBUTE_NAME, genderPairings[randomNoun.gender].friendly)
    })

    // caseNames.forEach(caseName => {
    //     if(caseName === "gender") {
    //         cases[caseName].pattern = genderPairings[randomNoun.gender].regex;
    //         cases[caseName].dataset.mismatch = mismatchErrorMsg + genderPairings[randomNoun.gender].friendly;
    //         return
    //     }
    //     cases[caseName].pattern = randomNoun[caseName] || randomNoun.noun;
    //     cases[caseName].dataset.mismatch = mismatchErrorMsg + randomNoun[caseName] || randomNoun.noun;
    // });

    // Reset seenNouns when we reach nounBatchSize, this will load a new batch of nouns
    if (seenNouns.size === nounBatchSize)
        seenNouns.clear();

    // set artikel input field to focus to keep playing instantly
    // document.getElementById("gender-input").focus();
}

displayNewNoun()

// DOM elements
const randomNounDOM = document.getElementById("random-noun");
var cases = {
    "gender": undefined,
    "nomsin": undefined,
    "nomplu": undefined,
    "gensin": undefined,
    "genplu": undefined,
    "datsin": undefined,
    "datplu": undefined,
    "akksin": undefined,
    "akkplu": undefined
}
const caseNames = Object.keys(cases);
let getCase = (caseName) => document.querySelector(`.case.${caseName} + input`);
caseNames.forEach(caseName => cases[caseName] = getCase(caseName));