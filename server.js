// Importeer het npm pakket express uit de node_modules map
import express, {json} from 'express'
// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'


const app = express()

// sprint7/lesmatariaal/S07W2-02-Filteren-sorteren.pdf  use this for     filter and sort a manuel
// make variable to use
const users = await fetchJson(`https://fdnd-agency.directus.app/items/f_users/?fields=*.*.`)
const baseUlr = fetchJson('https://fdnd-agency.directus.app/items/')


// here making arrays because i don't undersstand how to push data to the databse
const algemeen = []
const keuken = []
const badkamer = []
const tuin = []
const prijs = []
const ligging = []
const oppervlakte = []
// this is the array for the notes
const message_score_page_data = [];

// dit staat hier om de gebruikers op te halen
const users_image = users.data.map(avatar => {
    console.log(avatar.avatar.id);
    return {
        id_avatar: avatar.avatar.id,
        width: avatar.avatar.width,
        height: avatar.avatar.height,
        name: avatar.name

    };
});
// Stel ejs in als template engine
app.set('view engine', 'ejs')
// use ejs as view engine
// Stel de map met ejs templates in
app.set('views', './views')
// use this directory for the ejs files

// use public directry for  the stylesheets and javascript and images
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));//deze regel code gebruiken vanwege middelware zodat de data leesbaar gemaakt word

app.get('/', async function (request, response) {
    fetchJson(`https://fdnd-agency.directus.app/items/f_list/?fields=*.*.*.*`)
        // fetchJson(`${baseUlr}f_list/?fields=*.*.*.*`)
        // when the fetchjson is succeful execute the .then
        .then(houses_list => {
            if (houses_list.data) {//check if the data exist
                // the data of the houses is in 1 nested array so you need to use array.map
                const housedetails = houses_list.data.map(listItem => ({
                    id: listItem.id,
                    title: listItem.title,
                    houses_array: listItem.houses.map(house => ({
                        id: house.id,
                        image: house.f_houses_id.poster_image
                    }))
                }));
                response.render('index', {lists: housedetails});//Render the EJS template using the object's key-value pairs
            } else {
                console.error('No favorite houses data found');
            }
        })
});


app.get('/lijsten/:id', async function (request, response) {
    fetchJson(`https://fdnd-agency.directus.app/items/f_list/${request.params.id}?fields=*.*.*.*`)
        // hier moet apidata.data wel staan vanwege de lijst ejs de huizen zijn een array met daarin objecten en die word ook zo
        //aangeroepen in de ejs dus dit kan niet hetzelfde als bij de score route score

        // .then is used after the fetchjosn is succesful
        .then(lists => {
            if (lists.data) {//check if data exist
                response.render('lijst.ejs', //render the ejs file in your views directory
                    {
                        //     here i give the object with the varaible
                        list: lists.data,
                        users: users_image
                    });
            } else {
                // if not found
                console.error('No list data found');

            }
        })
});

// this is the score route
app.get('/score/:id', function (request, response) {
    // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
    fetchJson(`https://fdnd-agency.directus.app/items/f_houses/${request.params.id}/?fields=*.*,image.id,image.height,image.width`)

        .then(async ({ data }) => {

            // render the data with the arrays
            response.render('score', {
                house: data,
                algemeen: algemeen,
                keuken: keuken,
                badkamer: badkamer,
                tuin: tuin,
                prijs: prijs,
                ligging: ligging,
                oppervlakte: oppervlakte,
                notities: message_score_page_data,
                users:users_image


            })
        })
})

// post data in the array
app.post('/score/:id', async function (request, response) {

    //add data to the array
    algemeen.push( request.body.algemeenNumber);
    keuken.push(request.body.keukenNumber);
    badkamer.push( request.body.badkamerNumber);
    tuin.push(request.body.tuinNumber);
    message_score_page_data.push( request.body.notes_shown);


    //get the data
    fetchJson(`https://fdnd-agency.directus.app/items/f_houses/${request.params.id}/?fields=*.*.*`)
        .then(async (apiResponse) => {
            // if the enhanced is true do this
            if (request.body.enhanced) {
                response.render('partials/showScore', {result: apiResponse,


                        algemeen: algemeen,
                        keuken: keuken,
                        badkamer: badkamer,
                        tuin: tuin,
                        prijs: prijs,
                        ligging: ligging,
                        oppervlakte: oppervlakte,
                        notities: message_score_page_data,
                        usres:users_image,

                        //     todo hier nog een repsonse.bdy met tekst 'uw huis is tegevoegd'
                    }
                )
            } else {
                response.redirect(303, '/score/' + request.params.id)
            }

        })
})


//

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// todo de style en navbar en deetailpage moeten angelopen worden op onnodige code en in 1 volgorde gezet worden


// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})

