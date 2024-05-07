hamburger_menu()


// user parameters for the forms that the code is dry
// using this is neccessary because the 2 forms must have the exact same function
FormsEnhanced('.score_field_numbers__form_inputfields', '.div_show_score_house__output_number', 'enhanced', '.loading-state');
FormsEnhanced('.section-give_notes__form', '.show_notes', 'notesEnhanced', '.loading-state');

// here i define that this is the laoding state
let loading_element = document.querySelector('.loading-state');

// todo uitzoeken waarom de loading state met parameters niet werkt


function FormsEnhanced(specificForm, ShowResultsData, enhancedName, loadingState) {
    // Selecteer alle formulieren
    let forms = document.querySelectorAll(specificForm);

    // Loop door al die formulieren
    forms.forEach(function (form) {
        // Luister naar het submit event
        form.addEventListener('submit', function (event) {
            // Het this object refereert hier naar het formulier zelf

            // Lees de data van het formulier in
            // https://developer.mozilla.org/en-US/docs/Web/API/FormData
            let data = new FormData(this);

            // Voeg een extra eigenschap aan de formulierdata toe
            // Deze gaan we server-side gebruiken om iets anders terug te sturen
            data.append(enhancedName, true);

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
                    //haal de laoder weg
                    loading_element.classList.remove('loader');

                    // Update de DOM met de HTML
                    if (document.startViewTransition) {
                        document.startViewTransition(function () {
                            document.querySelector(ShowResultsData).innerHTML = responseHTML;
                        });
                    } else {
                        document.querySelector(ShowResultsData).innerHTML = responseHTML;
                    }

                    // Scroll naar de bijgewerkte pagina
                    const scoreNumbersElement = document.querySelector(ShowResultsData);
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

function hamburger_menu() {

    const navList = document.querySelector('.ul_list_navigation');
    const menuToggle = document.getElementById('menu');
    let isMenuOpen = false;

    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        navList.classList.toggle('show');

    });


}



