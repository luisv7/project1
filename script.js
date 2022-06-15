
const main = document.querySelector("main");
const textInputArtist = document.querySelector("#artist");
const textInputSong = document.querySelector("#song");
const form = document.querySelector("form");
const profileDiv = document.querySelector(".container-profile");
const lyricsContainer = document.querySelector(".container-lyrics");

function errorData(artistName, songName){
    const errorLyricsContainer = document.querySelector(".container-lyrics");
    const errorLyricsTitle = document.createElement("h2");
    const errorLyricsPreEl = document.createElement("pre");

    let errorMsg = `Oh No! We couldn't find\r\n ${songName.toUpperCase()} by ${artistName.toUpperCase()}\r\nPlease check your spelling or try some popular results.`;
    errorLyricsTitle.textContent = "LYRICS NOT FOUND";
    errorLyricsPreEl.textContent = errorMsg;
    errorLyricsContainer.appendChild(errorLyricsTitle);
    errorLyricsContainer.appendChild(errorLyricsPreEl);
}


form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Grab input and set text to lowercase.
    let artistName = event.target[0].value.toLowerCase();
    let songName = event.target[1].value.toLowerCase();

    // Remove any white spaces before or after string.
    artistName = artistName.trim();
    songName = songName.trim();

    let URL1 = `https://genius.p.rapidapi.com/search?q=${artistName}`;
    let URL2 = 'https://api.lyrics.ovh/v1/' + artistName + '/' + songName;
    // let url3 = `https://genius.p.rapidapi.com/artists/690350/songs?per_page=50`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5603513f1emsh43c3e7113066ec3p176351jsn568118181670',
            'X-RapidAPI-Host': 'genius.p.rapidapi.com',
            'mode': 'no-cors'
        },
    };

    function clearData(){
        // if data excists clear the data.
        while (profileDiv.firstChild){
            profileDiv.removeChild(profileDiv.firstChild);
        }
        while(lyricsContainer.firstChild){
            lyricsContainer.removeChild(lyricsContainer.firstChild);
        }
    }

    // Loading Text
    const loadingText = document.createElement("h2");
    loadingText.setAttribute("class","column is-12");
    loadingText.textContent = " loading...";
    main.insertBefore(loadingText, main.firstChild)
    console.dir(profileDiv);

    Promise.all([
        fetch(URL1, options), fetch(URL2),])
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((data) => {
        
        // console.log(data[0]);
        // console.log(data[1]);
        
        // if main container data excists clear the data.
        loadingText.remove();
        clearData();

        // 2 sets of API's main objects.
        const artist = data[0].response.hits;
        const songLyrics = data[1].lyrics; 
    
        // New array containting only the songs from the main artist. No ft. songs.
        const filteredArr = artist.filter((element)=> {
            return element.result.primary_artist.name.toLowerCase() == artistName
        });
    
        // Artist Photo and Name
        // const main = document.querySelector("main");
        const divAvatar = document.createElement("div");
        const profileImg = document.createElement("img");
        const profileName = document.createElement("h2");
    
        divAvatar.setAttribute("class", "profile");
        profileImg.setAttribute("id", "main-profile-img");
        profileImg.setAttribute("src", filteredArr[0].result.primary_artist.image_url);
        profileName.textContent = filteredArr[0].result.primary_artist.name;
    
        divAvatar.appendChild(profileImg);
        divAvatar.appendChild(profileName);
        profileDiv.appendChild(divAvatar);
    
        // Label for Popular Songs and song suggestion list
        const h2TextOtherSongs = document.createElement("h2");
        const divOtherSongs = document.createElement("div");
    
        // Popular Song Label
        h2TextOtherSongs.setAttribute("id","popular-songs-label");
        h2TextOtherSongs.textContent = "Popular Songs";
        profileDiv.appendChild(h2TextOtherSongs);
    
        // Song List Div
        divOtherSongs.setAttribute("class", "song-list");
        profileDiv.appendChild(divOtherSongs);
    
        // Create List of popular songs
        filteredArr.forEach((element)=>{
            const textInpArtist = element.result;
    
            // Create Elements
            const ul = document.createElement("ul");
            const img = document.createElement("img");
            const divInfo = document.createElement("div");
            const h3ArtistName = document.createElement("h3");
            const h4ArtistSongTitle = document.createElement("h4");
            const parDate = document.createElement("p");
            const btnSeeLyrics = document.createElement("button");
    
            // Set Attributes
            img.setAttribute("src", textInpArtist.song_art_image_url);
            btnSeeLyrics.setAttribute("class", "button is-dark is-small");
            btnSeeLyrics.setAttribute("data-song",textInpArtist.title);
            btnSeeLyrics.setAttribute("data-artist",textInpArtist.primary_artist.name);


            h3ArtistName.textContent = textInpArtist.artist_names;
            h4ArtistSongTitle.textContent = textInpArtist.title;
            parDate.textContent = textInpArtist.release_date_for_display;
            btnSeeLyrics.textContent = "See Lyrics";
    
            // Append
            ul.appendChild(img);
            ul.appendChild(divInfo);
            divInfo.appendChild(h3ArtistName);
            divInfo.appendChild(h4ArtistSongTitle);
            divInfo.appendChild(parDate);
            divInfo.appendChild(btnSeeLyrics);
            divOtherSongs.appendChild(ul);
        });
    
        // Lyrics
        const lyricsTitle = document.createElement("h2");
        const lyricsPreEl = document.createElement("pre");

        lyricsTitle.textContent = `${songName.toUpperCase()} BY ${artistName.toUpperCase()}`
        lyricsPreEl.textContent = songLyrics;
        lyricsContainer.appendChild(lyricsTitle);
        lyricsContainer.appendChild(lyricsPreEl);

        if (data[1].error){
            clearData();
            errorData(artistName, songName);
        }
    
        })
        .catch((error) => {
            // if there's an error, log it
            console.log(error)
            clearData();
            errorData(artistName, songName);
        });
        
        // Clear Form
        textInputArtist.value = "";
        textInputSong.value = "";
});

profileDiv.addEventListener("click", (event)=>{
    event.preventDefault();

    let nameOfSong = event.target.dataset.song.toLowerCase();
    let nameOfArtist = event.target.dataset.artist.toLowerCase();

    let newUrlLyrics = 'https://api.lyrics.ovh/v1/' + nameOfArtist + '/' + nameOfSong;

    fetch(newUrlLyrics)
        .then((response) => response.json())
        .then((data) => {

            // Remove old Lyrics
            while(lyricsContainer.firstChild){
                lyricsContainer.removeChild(lyricsContainer.firstChild);
            }

            // Add new lyrics 
            const lyricsTitle = document.createElement("h2");
            const lyricsPreEl = document.createElement("pre");
    
            lyricsTitle.textContent = `${nameOfSong.toUpperCase()} BY ${nameOfArtist.toUpperCase()}`
            lyricsPreEl.textContent = data.lyrics;
            lyricsContainer.appendChild(lyricsTitle);
            lyricsContainer.appendChild(lyricsPreEl);

            if (data.error){
                errorData(nameOfArtist,nameOfSong);
            }
        })
        .catch((error) => {
            console.log(error);
            errorData(nameOfArtist, nameOfSong);
        });

    console.dir(nameOfSong);
})
