// old code


function inputnumbers() {
    // Selecteer alle bestelformulieren
    let form_numbers_score = document.querySelectorAll('.score_field_numbers__form_inputfields');

    // Loop door al die formulieren
    form_numbers_score.forEach(function (form) {
        // Luister naar het submit event
        form.addEventListener('submit', function (event) {
            // Het this object refereert hier naar het formulier zelf

            // Lees de data van het formulier in
            // https://developer.mozilla.org/en-US/docs/Web/API/FormData
            let data = new FormData(this);

            // Voeg een extra eigenschap aan de formulierdata toe
            // Deze gaan we server-side gebruiken om iets anders terug te sturen
            data.append('enhanced', true);

            // Toon de laadstatus
            loading_element.classList.add('loader');
            // Gebruik een client-side fetch om een POST te doen naar de server
            // Als URL gebruiken we this.action
            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
            fetch(this.action, {
                // Als method gebruiken we this.method (waarschijnlijk POST)
                method: this.method,

                // Als body geven de data van het formulier mee (inclusief de extra eigenschap)
                // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
                body: new URLSearchParams(data),
            })
                .then(function (response) {
                    // Als de server een antwoord geeft, krijgen we een stream terug
                    // We willen hiervan de text gebruiken, wat in dit geval HTML teruggeeft
                    return response.text();
                })
                .then(function (responseHTML) {
                    // Verberg de laadstatus
                    loading_element.classList.remove('loader');

                    // Update de DOM met de HTML
                    if (document.startViewTransition) {
                        document.startViewTransition(function () {
                            document.querySelector('.div_show_score_house__output_number').innerHTML = responseHTML;
                        });
                    } else {
                        document.querySelector('.div_show_score_house__output_number').innerHTML = responseHTML;
                    }

                    // Scroll naar de bijgewerkte inhoud
                    const scoreNumbersElement = document.querySelector('.div_show_score_house__output_number');
                    scoreNumbersElement.scrollIntoView({behavior: 'smooth'});
                });

            // Voorkom de standaard submit van de browser
            // Stel dat je hierboven een tikfout hebt gemaakt, of de browser ondersteunt
            // een bepaalde feature hierboven niet (bijvoorbeeld FormData), dan krijg je
            // een error en wordt de volgende regel nooit uitgevoerd. De browser valt dan
            // automatisch terug naar de standaard POST, wat prima is.
            event.preventDefault();
        });
    });
}

function inputnotes() {
    // Selecteer alle bestelformulieren
    let form_numbers_score = document.querySelectorAll('.section-give_notes__form');

    // Loop door al die formulieren
    form_numbers_score.forEach(function (form) {
        // Luister naar het submit event
        form.addEventListener('submit', function (event) {
            // Het this object refereert hier naar het formulier zelf

            // Lees de data van het formulier in
            // https://developer.mozilla.org/en-US/docs/Web/API/FormData
            let data = new FormData(this);

            // Voeg een extra eigenschap aan de formulierdata toe
            // Deze gaan we server-side gebruiken om iets anders terug te sturen
            data.append('notesEnhanced', true);

            // Toon de laadstatus
            loading_element.classList.add('loader');
            // Gebruik een client-side fetch om een POST te doen naar de server
            // Als URL gebruiken we this.action
            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
            fetch(this.action, {
                // Als method gebruiken we this.method (waarschijnlijk POST)
                method: this.method,

                // Als body geven de data van het formulier mee (inclusief de extra eigenschap)
                // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
                body: new URLSearchParams(data),
            })
                .then(function (response) {
                    // Als de server een antwoord geeft, krijgen we een stream terug
                    // We willen hiervan de text gebruiken, wat in dit geval HTML teruggeeft
                    return response.text();
                })
                .then(function (responseHTML) {
                    // Verberg de laadstatus
                    loading_element.classList.remove('loader');

                    // Update de DOM met de HTML
                    if (document.startViewTransition) {
                        document.startViewTransition(function () {
                            document.querySelector('.show_notes').innerHTML = responseHTML;
                        });
                    } else {
                        document.querySelector('.show_notes').innerHTML = responseHTML;
                    }

                    // Scroll naar de bijgewerkte inhoud
                    const scoreNumbersElement = document.querySelector('.show_notes');
                    scoreNumbersElement.scrollIntoView({behavior: 'smooth'});
                });

            // Voorkom de standaard submit van de browser
            // Stel dat je hierboven een tikfout hebt gemaakt, of de browser ondersteunt
            // een bepaalde feature hierboven niet (bijvoorbeeld FormData), dan krijg je
            // een error en wordt de volgende regel nooit uitgevoerd. De browser valt dan
            // automatisch terug naar de standaard POST, wat prima is.
            event.preventDefault();
        });
    });
}