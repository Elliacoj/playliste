let listPlaylist = $('#listPlaylist');
let newPlaylist = $('#newPlaylist');
let deletePlaylist = $('#deletePlaylist');
let newSong = $('#newSong');
let deleteSong = $('#deleteSong');
let table = $('table');
let divSong = $('#song');

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
        reactButton();
    });

    $('#confirm').click(function () {
        let name = $('#newName').val();
        let type = $('#newType').val();
        if(!playlistExists(name)) {
            listPlaylist.append(createPlaylist(name, type));
            $('#window').remove();
            table.css('display', 'table');
            reactButton();
        }
        else {
            alert("Nom de playlist déjà utilisé!");
        }
    });
}

reactButton();

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
 * Return the asked song.
 * @param name
 * @param title
 * @returns {*}
 */
function loadSong(name, title) {
    let playlist = loadPlaylist(name);
    return playlist.songs.filter(item => {
        return item.title === title;
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
        reactButton();
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
            reactButton();
        }
        else {
            alert("Nom de playlist inexistante");
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
        reactButton();
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
                    console.log(index +1);
                    songs.splice(index, 1);
                    $('tbody tr')[index].remove();
                    saveSong(playlist);
                }
            }

            $('#window').remove();
            table.css('display', 'table');
            reactButton();
        }
        else {
            alert("Titre de musique inexistante");
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
        '<label for="newLink">Lien iframe de la musique: </label>', '<input type="text" id="newLink"><br>',
        '<label for="newYoutube">Lien Youtube: </label>', '<input type="text" id="newYoutube"><br>',
        '<button id="confirm">Confirmer</button>', '<button id="cancel">Annuler</button>');

    $('#cancel').click(function () {
        $('#window').remove();
        table.css('display', 'table');
        reactButton();
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
                let index = playlist.songs.length;
                $('#window').remove();
                table.css('display', 'table');
                creatTableLine(artiste,title,youtube, index);
                reactButton();
                play();
            }
            else {
                alert("Cette musique n'existe pas!");
            }
        }
        else {
            alert("Vous n'êtes pas dans une playlist!");
        }
    });

}

/**
 * Function for creat a new line for the new song in the visual playlist
 * @param artiste
 * @param title
 * @param youtube
 * @param index
 */
function creatTableLine(artiste, title, youtube, index) {
    $('table tbody').append(`
        <tr id="${title}">
            <td>${title}</td>
            <td>${artiste}</td>
            <td class="play"><i class="far fa-play-circle"></i></td>
            <td><a href="${youtube}" target="_blank">Lien</a></td>
        </tr>
    `);

    //$(`#${title}`).show(1500, 'linear');
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

/**
 * Function for enable buttons
 */
function blockButton() {
    newSong.off("click");
    deleteSong.off('click');
    newPlaylist.off("click");
    deletePlaylist.off('click');
}

/**
 * Function for activate buttons
 */
function reactButton() {
    newPlaylist.click(function () {
        blockButton();
        windowPlaylist();
    });

    deletePlaylist.click(function () {
        blockButton();
        supPlaylist();
    });

    deleteSong.click(function () {
        blockButton();
        supSong();
    })

    newSong.click(function () {
        blockButton();
        newSongs();
    })
}

listPlaylist.change(function () {
    let check = $('#listPlaylist option:selected').attr('id');
    let bodyTr = $('table tbody tr');

    if(bodyTr.length > 0) {
        $.each(bodyTr, function () {
            $(this).remove();
        });
    }

    if($('#listPlaylist #listOfPlaylist').attr('id') !== check) {
        let playlist = loadPlaylist(check);
        let songs = playlist.songs;
        $.each(bodyTr, function () {
            $(this).remove();
        });

        for(let song of songs) {
            creatTableLine(song.artist, song.title, song.youtubeUrl)
        }
    }
    play();
});


/**
 * Function for playing a song
 */
function play() {
    let check = $('#listPlaylist option:selected').attr('id');
    let play = $('.play');

    $.each(play, function () {
        $(this).click(function () {
            let iframe = $('#iframe');
            let child = $('i');
            if($(this).children(child).attr('class') === 'far fa-play-circle') {
                if(iframe.length === 1) {
                    iframe.remove();
                }

                let title = $(this).parent().attr('id');
                let song = loadSong(check, title);
                $('#container').after('<div id="iframe">' + song.link + '</div>');
                allPlay();
                $(this).children(child).remove();
                $(this).append('<i class="far fa-pause-circle"></i>');
                divSong.text(song.title + ' - ' + song.artist);
            }
            else {
                divSong.text("Lancer la lecteur d'une chanson");
                iframe.remove()
                allPlay();
            }
        });
    })
}

/**
 * Function for change the text into "Play"
 */
function allPlay() {
    let play = document.getElementsByClassName('play');
    for(let x = 0; x < play.length; x++) {
        if(play[x].lastElementChild.className !== "<i class=\"far fa-play-circle\"></i>") {
            play[x].innerHTML = "<i class=\"far fa-play-circle\"></i>";
        }
    }
}