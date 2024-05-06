inputnumbers();
toggle_show_notes_var()

function inputnumbers() {
    // Selecteer alle bestelformulieren

    let database = document.querySelectorAll('.databse')
    database.forEach(function (database_form) {
        // Luister naar het submit event
        database_form.addEventListener('submit', function (event) {
            event.preventDefault()
            // Het this object refereert hier naar het formulier zelf

            // Lees de data van het formulier in
            // https://developer.mozilla.org/en-US/docs/Web/API/FormData
            let data = new FormData(this)

            // Voeg een extra eigenschap aan de formulierdata toe
            // Deze gaan we server-side gebruiken om iets anders terug te sturen
            data.append('enhanced', true)

            // Waarschijnlijk wil je op deze plek ook een loading state
            // maken, maar daar gaan we volgende week mee aan de slag

            database_form.classList.add('loading');

            // Gebruik een client-side fetch om een POST te doen naar de server
            // Als URL gebruiken we this.action
            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
            fetch(this.action, {

                // Als method gebruiken we this.method (waarschijnlijk POST)
                method: this.method,

                // Als body geven de data van het formulier mee (inclusief de extra eigenschap)
                // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
                body: new URLSearchParams(data)

            }).then(function (response) {
                // Als de server een antwoord geeft, krijgen we een stream terug
                // We willen hiervan de text gebruiken, wat in dit geval HTML teruggeeft
                return response.text()

            }).then(function (responseHTML) {
                // En de HTML kunnen we gebruiken om onze DOM aan te passen

                if(document.startViewTransition) {
                    document.startViewTransition(function () {
                        document.querySelector('.show_data').innerHTML = responseHTML
                    });
                }
                else {
                    document.querySelector('.show_data').innerHTML = responseHTML

                }
                const notes = document.querySelector('.show_notes');
                document.querySelector('.show_data').innerHTML = responseHTML
                notes.scrollIntoView({behavior: 'smooth'});
            });


            // Een eventuele loading state haal je hier ook weer weg
            database_form.classList.remove('loading');
        });

        // Als alles gelukt is, voorkom dan de submit van de browser zelf
        // Stel dat je hierboven een tikfout hebt gemaakt, of de browser ondersteunt
        // een bepaalde feature hierboven niet (bijvoorbeeld FormData), dan krijg je
        // een error en wordt de volgende regel nooit uitgevoerd. De browser valt dan
        // automatisch terug naar de standaard POST, wat prima is.

    })


    let form_numbers_score = document.querySelectorAll('.score_field_numbers__form_inputfields')
// Loop door al die formulieren

    form_numbers_score.forEach(function (form) {
        // Luister naar het submit event
        // const div = document.querySelector(".loader");
        form.addEventListener('submit', function (event) {

            // Het this object refereert hier naar het formulier zelf

            // Lees de data van het formulier in
            // https://developer.mozilla.org/en-US/docs/Web/API/FormData
            let data = new FormData(this)

            // Voeg een extra eigenschap aan de formulierdata toe
            // Deze gaan we server-side gebruiken om iets anders terug te sturen
            data.append('enhanced', true)

            // Waarschijnlijk wil je op deze plek ook een loading state
            // maken, maar daar gaan we volgende week mee aan de slag

            // Gebruik een client-side fetch om een POST te doen naar de server
            // Als URL gebruiken we this.action
            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
            form.classList.add('loading');
            fetch(this.action, {

                // Als method gebruiken we this.method (waarschijnlijk POST)
                method: this.method,

                // Als body geven de data van het formulier mee (inclusief de extra eigenschap)
                // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
                body: new URLSearchParams(data)

            }).then(function (response) {
                // Als de server een antwoord geeft, krijgen we een stream terug
                // We willen hiervan de text gebruiken, wat in dit geval HTML teruggeeft
                return response.text()



            }).then(function (responseHTML) {
                if(document.startViewTransition) {
                    document.startViewTransition(function () {
                        document.querySelector('.show_score_house__output_number').innerHTML = responseHTML
                    });
                }
                else {
                    document.querySelector('.show_score_house__output_number').innerHTML = responseHTML

                }
                const scoreNumbersElement = document.querySelector('.show_score_house__output_number');
                document.querySelector('.show_score_house__output_number').innerHTML = responseHTML
                scoreNumbersElement.scrollIntoView({behavior: 'smooth'});
            });

            form.classList.remove('loading');
            // Als alles gelukt is, voorkom dan de submit van de browser zelf
            // Stel dat je hierboven een tikfout hebt gemaakt, of de browser ondersteunt
            // een bepaalde feature hierboven niet (bijvoorbeeld FormData), dan krijg je
            // een error en wordt de volgende regel nooit uitgevoerd. De browser valt dan
            // automatisch terug naar de standaard POST, wat prima is.
            event.preventDefault()
        })
    })
}



function enhanced() {
    // Selecteer alle bestelformulieren

    let form_numbers_score = document.querySelectorAll('.score_field_numbers__form_inputfields')
// Loop door al die formulieren

    form_numbers_score.forEach(function (form) {
        // Luister naar het submit event
        // const div = document.querySelector(".loader");
        form.addEventListener('submit', function (event) {

            // Het this object refereert hier naar het formulier zelf

            // Lees de data van het formulier in
            // https://developer.mozilla.org/en-US/docs/Web/API/FormData
            let data = new FormData(this)

            // Voeg een extra eigenschap aan de formulierdata toe
            // Deze gaan we server-side gebruiken om iets anders terug te sturen
            data.append('enhanced', true)

            // Waarschijnlijk wil je op deze plek ook een loading state
            // maken, maar daar gaan we volgende week mee aan de slag

            // Gebruik een client-side fetch om een POST te doen naar de server
            // Als URL gebruiken we this.action
            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
            form.classList.add('loading');
            fetch(this.action, {

                // Als method gebruiken we this.method (waarschijnlijk POST)
                method: this.method,

                // Als body geven de data van het formulier mee (inclusief de extra eigenschap)
                // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
                body: new URLSearchParams(data)

            }).then(function (response) {
                // Als de server een antwoord geeft, krijgen we een stream terug
                // We willen hiervan de text gebruiken, wat in dit geval HTML teruggeeft
                return response.text()



            }).then(function (responseHTML) {

                if(document.startViewTransition){
                    document.querySelector('.show_score_house__output_number').innerHTML = responseHTML
                }
                else {
                    document.querySelector('.show_score_house__output_number').innerHTML = responseHTML

                }
                const scoreNumbersElement = document.querySelector('.show_score_house__output_number');
                document.querySelector('.show_score_house__output_number').innerHTML = responseHTML
                scoreNumbersElement.scrollIntoView({behavior: 'smooth'});
            });

            form.classList.remove('loading');
            // Als alles gelukt is, voorkom dan de submit van de browser zelf
            // Stel dat je hierboven een tikfout hebt gemaakt, of de browser ondersteunt
            // een bepaalde feature hierboven niet (bijvoorbeeld FormData), dan krijg je
            // een error en wordt de volgende regel nooit uitgevoerd. De browser valt dan
            // automatisch terug naar de standaard POST, wat prima is.
            event.preventDefault()
        })
    })
}

function toggle_show_notes_var() {

    const navList = document.querySelector('.ul_list_navigation');
    const menuToggle = document.getElementById('menu');
    let isMenuOpen = false;

    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;

        navList.classList.toggle('show');

    });


}

