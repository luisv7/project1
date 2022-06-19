
const main = document.querySelector("main");
const textInputArtist = document.querySelector("#artist");
// const textInputSong = document.querySelector("#song");
const form = document.querySelector("form");
const profileContainer = document.querySelector(".container-profile");
const songContainer = document.querySelector(".container-list-of-songs");

function clearAllData(){
    // if data excists clear the data.
    while (profileContainer.firstChild){
        profileContainer.removeChild(profileContainer.firstChild);
    }
    while(songContainer.firstChild){
        songContainer.removeChild(songContainer.firstChild);
    }
}

function clearLyricsData(container){
    while(container.firstChild){
        container.removeChild(songContainer.firstChild);
    }
}

function loadingLyrics(){
    const pre = document.querySelector("#lyrics");
    pre.setAttribute("class", "loading");
    pre.textContent = "loading...";
}

function errorData(artistName, songName){
    const errorsongContainer = document.querySelector(".container-list-of-songs");
    const errorLyricsTitle = document.createElement("h2");
    const errorLyricsPreEl = document.createElement("pre");

    let errorMsg = `Oh No! We couldn't find\r\n ${songName.toUpperCase()} by ${artistName.toUpperCase()}\r\nPlease check your spelling or try some popular results.`;
    errorLyricsTitle.textContent = "LYRICS NOT FOUND";
    errorLyricsPreEl.textContent = errorMsg;
    errorsongContainer.appendChild(errorLyricsTitle);
    errorsongContainer.appendChild(errorLyricsPreEl);
}

function getId(artistName){
    const options2 = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5603513f1emsh43c3e7113066ec3p176351jsn568118181670',
            'X-RapidAPI-Host': 'genius.p.rapidapi.com'
        }
    };

    let response = fetch(`https://genius.p.rapidapi.com/search?q=${artistName}`, options2)
    .then(response => response.json())
    .then(data => {
        return data.response.hits[0].result.primary_artist.id
    })
    .catch(err => console.error(err));

    return response
}

function getArtistInfo(id){

    let artistProfile = `https://genius.p.rapidapi.com/artists/${id}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5603513f1emsh43c3e7113066ec3p176351jsn568118181670',
            'X-RapidAPI-Host': 'genius.p.rapidapi.com'
        }
    };
    
     return fetch(artistProfile, options)
        .then(response => response.json())
        .then(data => {

            // Add nickname to artist profile
            let otherName = data.response.artist.alternate_names[0];
            const otherNameH3 = document.createElement("h3");
            const profileNickname = document.querySelector(".artist-name");
            otherNameH3.textContent = otherName;
            if (otherName !== undefined){
                profileNickname.appendChild(otherNameH3)
            }

            // Profile Artist Info
            let artistInfo = data.response.artist.description.dom.children[0].children;
            const infoPar = document.createElement("p");
            infoPar.setAttribute("class","about-artist");
            artistInfo.forEach((element) => {
                if (typeof element === "string"){
                    infoPar.textContent += element;
                }else if(typeof element.children[0] === "object"){
                    infoPar.textContent += element.children[0].children[0];

                }else{
                    infoPar.textContent += element.children[0];
                }
            });
            profileContainer.appendChild(infoPar);
        })
        .catch(err => console.error(err));

    
}

function getLyrics(artist, song){

    let URL = `https://api.lyrics.ovh/v1/${artist.toLowerCase()}/${song.toLowerCase()}`;

    // Loading Text
    loadingLyrics();

    fetch(URL)
    .then(response => response.json())
    .then(data => {

        // target tags
        const h2 = document.querySelector("#lyric-title");
        const pre = document.querySelector("#lyrics");

        // Song title
        h2.textContent = `${song.toUpperCase()} BY ${artist.toUpperCase()}`;
        
        // lyrics data
        pre.textContent = data.lyrics;

    })
    .catch(err => console.error(err));
}

function getYoutubeVideo(songId, insertContainer){

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5603513f1emsh43c3e7113066ec3p176351jsn568118181670',
            'X-RapidAPI-Host': 'genius.p.rapidapi.com'
        }
    };
    
    fetch(`https://genius.p.rapidapi.com/songs/${songId}`, options)
        .then(response => response.json())
        .then(data => {
            let media = data.response.song.media;

            media = media.filter((element) => {
                return element.provider === "youtube";
            });

            let youtubeLink = media[0].url;
            let youtubeId = youtubeLink.slice(youtubeLink.search("=") + 1);

            let frame = document.createElement("iframe");
            frame.setAttribute("src", `https://www.youtube.com/embed/${youtubeId}`);
            frame.setAttribute("id", "player");
            
            insertContainer.insertBefore(frame, document.querySelector("#lyric-title"));
        })
        .catch(err => console.error(err));
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // clear data before displaying new artist
    clearAllData();

    // Grab input name of artist from form
    let artistName = event.target[0].value.toLowerCase();
    artistName = artistName.trim();

    // fetch artist ID 
    let artistId = await this.getId(artistName);

    // Setting up the URL's
    let URL = `https://genius.p.rapidapi.com/search?q=${artistName}`;

    const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '5603513f1emsh43c3e7113066ec3p176351jsn568118181670',
        'X-RapidAPI-Host': 'genius.p.rapidapi.com',
        'mode': 'no-cors'
        },
    };

    fetch(URL, options)
    .then((response) => response.json())
    .then(async (data) => {

        const artistArrHits = data.response.hits;
        
        // New array containting only the songs from the main artist. No ft. songs.
        const filteredArrHits = artistArrHits.filter((element)=> {
            return element.result.primary_artist.name.toLowerCase() == artistName
        });

        // I knew you where not a lazy coder mike. you're even reading my comments.
        const primaryArtist = filteredArrHits[0].result.primary_artist;
        
        // Artist Photo and Name
        const profileArtistDiv = document.createElement("div");
        const profileImg = document.createElement("img");
        const profileArtistNamesDiv = document.createElement("div");
        const profileNameH2 = document.createElement("h2");
    
        // Set Attributes
        profileArtistDiv.setAttribute("class", "profile");
        profileArtistNamesDiv.setAttribute("class", "artist-name");
        profileImg.setAttribute("id", "main-profile-img");
        profileImg.setAttribute("src", primaryArtist.image_url);

        profileNameH2.textContent = primaryArtist.name;
    
        // Append
        profileArtistDiv.appendChild(profileImg);
        profileArtistDiv.appendChild(profileArtistNamesDiv);
        profileArtistNamesDiv.appendChild(profileNameH2);
        profileContainer.appendChild(profileArtistDiv);

        // Artist Info
        await getArtistInfo(artistId);

        // Label for Popular Songs and song suggestion list
        const divSongList = document.createElement("div");
        const h2PopularSongLabel = document.createElement("h2");
    
        // Popular Song Label
        h2PopularSongLabel.textContent = "Popular Songs";
        profileContainer.appendChild(h2PopularSongLabel);
    
        // Song List Div
        divSongList.setAttribute("class", "song-list");
        profileContainer.appendChild(divSongList);
    
        // Create List of popular songs
        filteredArrHits.forEach((element)=>{
            const artist = element.result;
    
            // Create Elements
            const ul = document.createElement("ul");
            const img = document.createElement("img");
            const divInfo = document.createElement("div");
            const h4ArtistSongTitle = document.createElement("h4");
            const DateOfSong = document.createElement("p");
            const btnSeeLyrics = document.createElement("button");
    
            // Set Attributes
            img.setAttribute("src", artist.song_art_image_url);
            btnSeeLyrics.setAttribute("class", "button is-dark is-small");
            btnSeeLyrics.setAttribute("data-song", artist.title);
            btnSeeLyrics.setAttribute("data-artist-name", artist.primary_artist.name);
            btnSeeLyrics.setAttribute("data-song-id", artist.id);
            divInfo.setAttribute("class", "song-info");

            h4ArtistSongTitle.textContent = artist.title;
            DateOfSong.textContent = artist.release_date_for_display;
            btnSeeLyrics.textContent = "See Lyrics";
    
            // Append
            ul.appendChild(img);
            ul.appendChild(divInfo);
            ul.appendChild(btnSeeLyrics);
            divInfo.appendChild(h4ArtistSongTitle);
            divInfo.appendChild(DateOfSong);
            divSongList.appendChild(ul);
        });

        // Lyrics
        const lyricsDiv = document.createElement("div");
        const lyricsTitle = document.createElement("h2");
        const lyricsPreEl = document.createElement("pre");

        lyricsDiv.setAttribute("class", "lyrics-container");
        lyricsTitle.setAttribute("id", "lyric-title");
        lyricsPreEl.setAttribute("id", "lyrics");

        let songName = filteredArrHits[0].result.title;

        lyricsTitle.textContent = `${songName.toUpperCase()} BY ${artistName.toUpperCase()}`;
        lyricsDiv.appendChild(lyricsTitle);
        lyricsDiv.appendChild(lyricsPreEl);
        songContainer.appendChild(lyricsDiv);

        // Fetch first Lyrics
        getLyrics(artistName, songName);

        console.log(filteredArrHits);

        // fetch youtube video
        getYoutubeVideo(filteredArrHits[0].result.id, lyricsDiv);

        console.log(data);

    })
    .catch((error) => {
        console.log(error)
    })

});

profileContainer.addEventListener("click", (event) => {
    event.preventDefault();

    console.log(event);

    let artist = event.target.dataset.artistName;
    let song = event.target.dataset.song;
    let songId = event.target.dataset.songId;

    let videoContainer = document.querySelector(".lyrics-container");
    let player = document.querySelector("#player");

    // update new lyrics
    getLyrics(artist, song);

    // remove current video player
    player.remove();

    // update new video
    getYoutubeVideo(songId, videoContainer);
});
