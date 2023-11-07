$(function() {
    let formularz = $('form');
    let tresc = $('form input:text');
    let niezrobione = $('.niezrobione');
    let zrobione = $('.zrobione');

    let zadaniaZro, zadaniaNie;

    const zapiszDoLocalStorage = () => {
        localStorage.setItem('zadaniaZro', JSON.stringify(zadaniaZro));
        localStorage.setItem('zadaniaNie', JSON.stringify(zadaniaNie));
    };

    const odczytajZLocalStorage = () => {
        zadaniaZro = JSON.parse(localStorage.getItem('zadaniaZro')) || [];
        zadaniaNie = JSON.parse(localStorage.getItem('zadaniaNie')) || [];
    };

    const odtworzZadania = () => {
        niezrobione.empty();
        zrobione.empty();

        zadaniaNie.forEach(dodajZadanie);
        zadaniaZro.forEach(dodajZadanieDoZrobionych);
    };

    const dodajZadanie = (obiekt) => {
        const zadanieHTML = $(`<div id="${obiekt.id}" class="niezrobiony item" style="display:none;"><p>${obiekt.tresc}</p><button class="guzikniezrobiony">Oznacz jako wykonane</button></div>`);
        niezrobione.append(zadanieHTML);
    
        zadanieHTML.fadeIn('fast'); 
    };
    

    const dodajZadanieDoZrobionych = (obiekt) => {
        const zadanieHTML = $(`<div id="${obiekt.id}" class="zrobiony item"><p>${obiekt.tresc}</p><button class="guzikzrobiony">Usuń zadanie</button></div>`)

        zrobione.append(zadanieHTML)

        zadanieHTML.fadeIn('fast')
    };

    odczytajZLocalStorage();
    odtworzZadania();

    const handleSubmit = () => {
        if(tresc.val().trim() == '') {
            alert("Nie mogę utworzyć zadania bez treści")
            return
        }

        let generatedId = 'task-' + Math.random().toString(36).substr(2, 9);
        let obiekt = {
            id: generatedId,
            tresc: tresc.val(),
            zrobione: false,
        };

        zadaniaNie.push(obiekt);
        zapiszDoLocalStorage();
        dodajZadanie(obiekt);
        tresc.val('');
    };

    niezrobione.on('click', '.guzikniezrobiony', function() {
        let kliknietyGuzik = $(this);
        let zadanieDiv = kliknietyGuzik.parent();
        let id = zadanieDiv.attr('id');
        let zadanie = zadaniaNie.find(zadanie => zadanie.id === id);

        if(zadanie) {
            zadanie.zrobione = true;
            zadaniaNie = zadaniaNie.filter(z => z.id !== id);
            zadaniaZro.push(zadanie);
            zapiszDoLocalStorage();
        }

        kliknietyGuzik.removeClass('guzikniezrobiony').addClass('guzikzrobiony').text('Usuń zadanie');
        zadanieDiv.detach().appendTo(zrobione).removeClass('niezrobiony').addClass('zrobiony')

    });

    zrobione.on('click', '.guzikzrobiony', function() {
        let zadanieDiv = $(this).parent();
        let id = zadanieDiv.attr('id');

        zadanieDiv.fadeOut('fast', function() {
            $(this).remove();
            zadaniaZro = zadaniaZro.filter(zadanie => zadanie.id !== id);
            zapiszDoLocalStorage();
        });
    });

    formularz.on('submit', function(event) {
        event.preventDefault();
        handleSubmit();
    });
});
