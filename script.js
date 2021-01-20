let genre = $('#type');
let listPlaylist = $('#listPlaylist');
let newPlaylist = $('#newPlaylist');
let deletePlaylist = $('#deletePlaylist');
let newSong = $('#newSong');
let deleteSong = $('#deleteSong');
let table = $('table');

document.cookie = "list=all;path=/; samesite=strict";

function windowPlaylist() {
    table.css('display', 'none');
    $('section').append('<div id="window" class="window"></div>');
    $('#window').append('<h2>Nouvelle playlist</h2>',
                        '<label for="newType">Genre: </label>', '<input type="text" id="newType"><br>',
                        '<label for="newName">Nom de la playlist: </label>', '<input type="text" id="newName"><br>',
                        '<button id="confirm">Confirmer</button>', '<button id="cancel">Annuler</button>')

    $('#cancel').click(function () {
        $('#window').remove();
        table.css('display', 'table');
    })

    $('#confirm').click(function () {
        listPlaylist.append('<option>' + $('#newName').val() + '</option>')
        $('#window').remove();
        table.css('display', 'table');
    })

}

newPlaylist.click(function () {
    windowPlaylist();
});