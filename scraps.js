// profileImg.setAttribute("src", data.artists.hits[0].artist.avatar)
// console.log(data.artists.hits[0].artist.avatar)
        
// lyrics.textContent = data.lyrics;
// profileImg.setAttribute("src", data.response.hits[2].result.header_image_url);

// data.response.hits.filter((el) => {
//     console.log(el.result.title.toLowerCase())
// });



//     Promise.all([
//      fetch('https://genius.p.rapidapi.com/search?q=${artist}', options),
//     	fetch('https://api.lyrics.ovh/v1/' + artist + '/' + song),
//     ]).then((responses) => {
//     	// Get a JSON object from each of the responses
//     	return Promise.all(responses.map(function (response) {
//     		return response.json();
//     	}));
//     }).then((data) => {
//     	// Log the data to the console
//     	// You would do something with both sets of data here
//     	console.log(data[0].response.hits);
//     }).catch((error) => {
//     	// if there's an error, log it
//     	console.log(error);
//     });


// let shazamURL = `https://shazam.p.rapidapi.com/search?term=${song}&locale=en-US&offset=0&limit=5`


// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
// 		'X-RapidAPI-Key': '5603513f1emsh43c3e7113066ec3p176351jsn568118181670'
// 	}
// };

// let url = "https://musicbrainz.org/ws/2/genre/all?limit=20&fmt=json"

// fetch(url, {
//     method: "GET",
//     mode: "no-cors",
//     headers: {
//         "accept": "application/json",
//         "Access-Control-Allow-Origin": "*",
//         "Content-Type": "application/json",
//     }
// })
//   .then(response => response.json())
//   .then((data) => {
//     // lyrics.textContent = data.lyrics;
//     console.dir(data)
//   })


// const getData = async () => {
//     const response = await fetch(url, {
//         method: "GET",
//         mode: "no-cors",
//         headers: {
//             Accept: "application/json, text/plain, */*",
//         }
//     })
//     const data = await response.json()
//     console.dir(data);
// }
// getData();