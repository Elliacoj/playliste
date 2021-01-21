let genre = $('#type');
let listPlaylist = $('#listPlaylist');
let newPlaylist = $('#newPlaylist');
let deletePlaylist = $('#deletePlaylist');
let newSong = $('#newSong');
let deleteSong = $('#deleteSong');
let table = $('table');

//listPlaylist.text( listPlaylist.text() + storage.getItem('playList'));

//console.log(storage.getItem('playList'));

getPlaylistsOptions();

/**
 * Function for creat a window for add a playlist
 */
function windowPlaylist() {
    windows();

    $('#window').append('<h2>Nouvelle playlist</h2>',
        '<label for="newType">Genre: </label>', '<input type="text" id="newType"><br>',
        '<label for="newName">Nom de la playlist: </label>', '<input type="text" id="newName"><br>',
        '<button id="confirm">Confirmer</button>', '<button id="cancel">Annuler</button>');

    $('#cancel').click(function () {
        $('#window').remove();
        table.css('display', 'table');
    });

    $('#confirm').click(function () {
        let name = $('#newName').val();
        let type = $('#newType').val();
        if(!playlistExists(name)) {
            listPlaylist.append(createPlaylist(name, type));
            $('#window').remove();
            table.css('display', 'table');
        }
        else {
            alert();
        }
    });

}

newPlaylist.click(function () {
    windowPlaylist();
});

deletePlaylist.click(function () {
    supPlaylist();
});

deleteSong.click(function () {
    supSong();
})

/**
 * Create a new playlist
 * @param name The playlist name.
 * @param type The playlist type
 * @returns {HTMLOptionElement} The playlist HTMLOptionElement.
 */
function createPlaylist(name, type) {
    let playlist = {
        name: name,
        type: type,
        songs: []
    }

    let playlists = JSON.parse(localStorage.getItem('playlists')) ?? [];
    playlists.push(playlist);

    localStorage.setItem('playlists', JSON.stringify(playlists));
    let option = document.createElement('option');
    option.innerHTML = name + '<span class="typeList"> (' + type + ')</span>';
    option.id = name;
    return option;
}

/**
 * Create a new song !
 * @param playlist
 * @param artist
 * @param title
 * @param link
 * @param youtubeUrl
 */
function createSong(playlist, artist, title, link, youtubeUrl) {
    let song = {
        artist: artist,
        title: title,
        link: link,
        youtubeUrl: youtubeUrl
    }
    playlist.songs.push(song);

    saveSong(playlist);
}

/**
 * Return and display all playlists.
 */
function getPlaylistsOptions() {
    let playlists = getPlaylists();
    for(let playlist of playlists) {
        let option = document.createElement('option');
        option.id = playlist.name;
        option.innerHTML = playlist.name + '<span class="typeList"> (' + playlist.type + ')</span>';
        listPlaylist.get(0).appendChild(option);
    }
}

/**
 * Return true is playlist already exists.
 * @param name
 * @return boolean True if exists, false otherwise.
 */
function playlistExists(name) {
    return  getPlaylists().reduce((accu, playlist) =>{ return accu + (playlist.name === name) ? 1 : 0;}, 0) > 0;
}

/**
 * Return true is song already exists
 * @param songName
 * @param playlist
 * @returns boolean True if exists, false otherwise
 */
function songExists(songName, playlist) {
    if(playlist.songs.length > 0) {
        return playlist.songs.reduce((accu, song) =>{ return accu + (song.title === songName) ? 1 : 0;}, 0) > 0
    }
    else {
        return false
    }
}

/**
 * Return the asked playlist.
 * @param name
 */
function loadPlaylist(name) {
    return getPlaylists().filter(item => {
        return item.name === name;
    })[0];
}

/**
 * Return all playlists
 * @returns {{}|*[]}
 */
function getPlaylists() {
    return JSON.parse(localStorage.getItem('playlists')) ?? [];
}

/**
 * Function for delete a playlist
 */
function supPlaylist() {
    windows();

    $('#window').append('<h2>Supprimer playlist</h2>',
        '<label for="newName">Nom de la playlist: </label>', '<input type="text" id="newName"><br>',
        '<button id="confirm">Confirmer</button>', '<button id="cancel">Annuler</button>');

    $('#cancel').click(function () {
        $('#window').remove();
        table.css('display', 'table');
    });

    $('#confirm').click(function () {
        let name = $('#newName').val();
        let playlists = getPlaylists();

        if(playlistExists(name)) {
            for(let playlist of playlists) {
                if(playlist.name === name) {
                    let index = playlists.indexOf(playlist);
                    playlists.splice(index, 1);

                    localStorage.removeItem('playlists');
                    localStorage.setItem('playlists', JSON.stringify(playlists));
                }
            }

            $('#' + name + '').remove();
            $('#window').remove();
            table.css('display', 'table');
        }
        else {
            alert();
        }

    });
}

/**
 * Function for delete a song
 */
function supSong() {
    windows();

    $('#window').append('<h2>Supprimer playlist</h2>',
        '<label for="newName">Titre de la musique: </label>', '<input type="text" id="newName"><br>',
        '<button id="confirm">Confirmer</button>', '<button id="cancel">Annuler</button>');

    $('#cancel').click(function () {
        $('#window').remove();
        table.css('display', 'table');
    });

    $('#confirm').click(function () {
        let name = $('#newName').val();
        let check = $('#listPlaylist option:selected').attr('id');
        let playlist = loadPlaylist(check);
        let songs = playlist.songs;

        if(songExists(name, playlist)) {
            for(let song of songs) {
                if(song.title === name) {
                    let index = songs.indexOf(song);
                    songs.splice(index, 1);

                    saveSong(playlist);
                }
            }

            $('#' + name + '').remove();
            $('#window').remove();
            table.css('display', 'table');
        }
        else {
            alert();
        }

    });
}

/**
 * Function for add a window empty
 */
function windows() {
    table.css('display', 'none');
    $('section').append('<div id="window" class="window"></div>');
}

/**
 * Function for creat a window for creat and save a new song
 */
function newSongs() {
    windows();

    $('#window').append('<h2>Nouvelle musique</h2>',
        '<label for="newArtiste">Artiste: </label>', '<input type="text" id="newArtiste"><br>',
        '<label for="newTitle">Titre: </label>', '<input type="text" id="newTitle"><br>',
        '<label for="newLink">Lien de la musique: </label>', '<input type="text" id="newLink"><br>',
        '<label for="newYoutube">Lien Youtube: </label>', '<input type="text" id="newYoutube"><br>',
        '<button id="confirm">Confirmer</button>', '<button id="cancel">Annuler</button>');

    $('#cancel').click(function () {
        $('#window').remove();
        table.css('display', 'table');
    });

    $('#confirm').click(function () {
        let artiste = $('#newArtiste').val();
        let title = $('#newTitle').val();
        let link = $('#newLink').val();
        let youtube = $('#newYoutube').val();
        let check = $('#listPlaylist option:selected').attr('id');

        if($('#listPlaylist #listOfPlaylist').attr('id') !== check) {
            let playlist = loadPlaylist(check);

            if(!songExists(title, playlist)) {
                createSong(playlist, artiste, title, link, youtube);
                $('#window').remove();
                table.css('display', 'table');
                creatTableLine(artiste,title,youtube);
            }
            else {
                alert();
            }
        }
        else {
            alert();
        }
    });
}

newSong.click(function () {
    newSongs();
})

/**
 * Function for creat a new line for the new song in the visual playlist
 * @param artiste
 * @param title
 * @param youtube
 */
function creatTableLine(artiste, title, youtube) {
    $('table tbody').append('<tr id="' + title + '"><td>' + title+ '</td><td>' + artiste + '</td><td></td><td>' + youtube + '</td></tr>');
}

/**
 * Function for save changes of playlist in the localStorage
 * @param playlistSave
 */
function saveSong(playlistSave) {
    let playlists = getPlaylists()

    for(let playlist of playlists) {
        if(playlist.name === playlistSave.name) {
            let index = playlists.indexOf(playlist);
            playlists.splice(index, 1, playlistSave);
        }
    }

    localStorage.removeItem('playlists');
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

