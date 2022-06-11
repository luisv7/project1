
const lyrics = document.querySelector("#lyrics");
const textInputArtist = document.querySelector("#artist");
const textInputSong = document.querySelector("#song");
const searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", () => {
    let textInpArtist = textInputArtist.value.toLowerCase();
    let textInpSong = textInputSong.value.toLowerCase();
    let URL1 = `https://genius.p.rapidapi.com/search?q=${textInpArtist}`;
    let URL2 = 'https://api.lyrics.ovh/v1/' + textInpArtist + '/' + textInpSong;
    // let url3 = `https://genius.p.rapidapi.com/artists/690350/songs?per_page=50`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5603513f1emsh43c3e7113066ec3p176351jsn568118181670',
            'X-RapidAPI-Host': 'genius.p.rapidapi.com'
        }
    };

    Promise.all([
        fetch(URL1, options), fetch(URL2),])
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((data) => {
        console.log("hi");
    	// You would do something with both sets of data here
        const artist = data[0].response.hits;
        const songLyrics = data[1].lyrics; 

        const filteredArr = artist.filter((element)=> {
            return element.result.primary_artist.name.toLowerCase() == textInpArtist
        });

        // Profile
        const profileDiv = document.querySelector(".container");

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
            const divText = document.createElement("div");
            const h3ArtistName = document.createElement("h3");
            const h4ArtistSongTitle = document.createElement("h4");
            const parDate = document.createElement("p");

            // Set Attributes
            img.setAttribute("src", textInpArtist.song_art_image_url);

            h3ArtistName.textContent = textInpArtist.artist_names;
            h4ArtistSongTitle.textContent = textInpArtist.title;
            parDate.textContent = textInpArtist.release_date_for_display;

            // Append
            ul.appendChild(img);
            ul.appendChild(divText);
            divText.appendChild(h3ArtistName);
            divText.appendChild(h4ArtistSongTitle);
            divText.appendChild(parDate);
            divOtherSongs.appendChild(ul);
    
            console.log(textInpArtist);
        });

        // Lyrics
        const lyricsContainer = document.querySelector("#lyrics");
        const lyricsTitle = document.createElement("h2");
        const lyricsPreEl = document.createElement("pre");
        
        lyricsTitle.textContent = `${textInpSong.toUpperCase()} BY ${textInpArtist.toUpperCase()}`
        lyricsPreEl.textContent = songLyrics;

        lyricsContainer.appendChild(lyricsTitle);
        lyricsContainer.appendChild(lyricsPreEl);

        console.log(filteredArr);
        console.log(artist);
        console.log(data[1]);

        if (data.error){
            const main = document.querySelector("main");
            const pErrorMsg = document.createElement("p");
            pErrorMsg.setAttribute("id", "errorMsg");
            pErrorMsg.textContent = "Oh No! We couldn't find a match\r\nAlso, Please check your spelling";
            main.appendChild(pErrorMsg);
        }
    }).catch((error) => {
    	// if there's an error, log it
    	console.log(error);
        });
});

 
