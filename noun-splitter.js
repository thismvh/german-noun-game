function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
    
        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));
                    
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
        
    return array;
}
    
    

// Split CSV into chunks
function sliceIntoChunks(arr, chunkSize = 100) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

function download(data, index) {

	// Creating a Blob for having a csv file format
	// and passing the data with type
	const blob = new Blob([data], { type: 'text/csv' });

	// Creating an object for downloading url
	const url = window.URL.createObjectURL(blob)

	// Creating an anchor(a) tag of HTML
	const a = document.createElement('a')

	// Passing the blob downloading url
	a.setAttribute('href', url)

	// Setting the anchor tag attribute for downloading
	// and passing the download file name
	a.setAttribute('download', `nouns-${index}.csv`);

	// Performing a download with click
    return new Promise(async (resolve) => {
        a.click();
        setTimeout(() => resolve(), 100);
    })
}

// Main function
async function displayNewNoun() {
    // Only fetch new nouns when nounBatchSize is reached
    if (seenNouns.size === 0) {
        // Get random noun file
        // let nounsFilename = `./nouns/nouns-${Math.floor(Math.random() * 912)}.csv`
        currentNouns = await fetchNouns(nounsFilename);

        currentNouns = shuffleArray(currentNouns);

        // Split CSV into chunks of 100
        let nounChunks = sliceIntoChunks(currentNouns)

        // Write chunks into separate CSV files
        var chunksAsStrings = nounChunks.map((chunk) => {
            let nounsAsStrings = chunk.map(noun => Object.values(noun).join());
            // Add headers
            nounsAsStrings.unshift(Object.keys(chunk[0]).join());
            return nounsAsStrings.join(";")
        })

        for (let index = 0; index < chunksAsStrings.length; index++) {
            let downloadProcess = await download(chunksAsStrings[index], index);
            console.log("Downloaded " + index);
        }
    }

    // Get random noun and update DOM content
    let randomNoun = currentNouns.random();
    seenNouns.add(randomNoun.noun);
    randomNounDOM.textContent = randomNoun.noun;

    // Reset seenNouns when we reach nounBatchSize
    if (seenNouns.size === nounBatchSize)
        seenNouns.clear();
}

displayNewNoun()