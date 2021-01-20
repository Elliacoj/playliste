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
        if(!playlistExists(name)) {
            listPlaylist.append(createPlaylist(name));
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

/**
 * Create a new playlist
 * @param name The playlist name.
 * @returns {HTMLOptionElement} The playlist HTMLOptionElement.
 */
function createPlaylist(name) {
    let playlist = {
        name: name,
        songs: []
    }

    let playlists = JSON.parse(localStorage.getItem('playlists')) ?? [];
    playlists.push(playlist);

    localStorage.setItem('playlists', JSON.stringify(playlists));
    let option = document.createElement('option');
    option.innerHTML = name;
    option.id = name;
    return option;
}

/**
 * Create a new song !
 * @param playlist
 * @param artist
 * @param title
 * @param duration
 * @param youtubeUrl
 */
function createSong(playlist, artist, title, duration, youtubeUrl) {
    let song = {
        artist: artist,
        title: title,
        duration: duration,
        youtubeUrl: youtubeUrl
    }

    playlist = loadPlaylist(playlist);

}

/**
 * Return and display all playlists.
 */
function getPlaylistsOptions() {
    let playlists = getPlaylists();
    for(let playlist of playlists) {
        let option = document.createElement('option');
        option.id = playlist.name;
        option.innerHTML = playlist.name;
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


function windows() {
    table.css('display', 'none');
    $('section').append('<div id="window" class="window"></div>');
}