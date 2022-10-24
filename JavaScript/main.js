async function theoriePage() {

    var links = $('.theorie');
    for (const link of links) {
        $(link).on('click', () => {
            var opened = window.open("./theorie.html");
            var lesson = link.classList[2];
            console.log(link.classList[2]);
            opened.sessionStorage.setItem('name', lesson);
        });

    }
}

$(function () {
    theoriePage();
    setDeleteBtn();
    deletePane();
    addLesson();
});

function deletePane() {
    const deleteBtns = $('.delete');
    for (const deleteBtn of deleteBtns) {
        $(deleteBtn).on('click', () => {
            const lesson = $(deleteBtn).parent().parent();
            $(lesson).remove();
        });
    }
}

function setDeleteBtn() {
    $('.subLinks').append('<button class="delete">');
    $('.delete').append('<i class="fa-solid fa-trash">');
}

function addLesson() {
    $('.addLesson').on('click', () => {
        $('.modal').css('display', 'block');
    });
    $('.closeModal').on('click', () => {
        $('.modal').css('display', 'none');

    });
    $('#create').on('click', () => {
        if ($('#lessonName').val() != "" && $('#repoName').val() != "") {
            const name = $('#lessonName').val();
            const repoName = $('#repoName').val();
            const theo = $('#theo_check').is(':checked');
            const pra = $('#pra_check').is(':checked');

            const mainDiv = '<div class="lesson class">';

            $('.container').append(mainDiv);
            $('.lesson').last().append(`<div class="classTitle">${name}</div>`);
            $('.lesson').last().append(`<div class="classImage"></div>`);
            const subDiv = `<div class="subLinks">`;
            $('.lesson').last().append(subDiv);
            if (theo) {
                $('.subLinks').last().append(`<a href="#" class="sublink theorie ${repoName}">theorie</a>`)
            }
            if (pra) {
                $('.subLinks').last().append(`<a href="#" class="sublink pratique ${repoName}">Pratique</a>`)
            }
            $('.subLinks').last().append('<button class="delete">');
            $('.delete').last().append('<i class="fa-solid fa-trash">');
            deletePane();
            theoriePage();
        }
    });
}
