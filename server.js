// Importeer het npm pakket express uit de node_modules map
import express, {json} from 'express'
// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'


const app = express()

// sprint7/lesmatariaal/S07W2-02-Filteren-sorteren.pdf  use this for     filter and sort a manuel
// make variable to use
const users = await fetchJson(`https://fdnd-agency.directus.app/items/f_users/?fields=*.*`)
const baseUlr = fetchJson('https://fdnd-agency.directus.app/items/')


// here making arrays because i don't undersstand how to push data to the databse
const general = []
const kitchen = []
const bathroom = []
const garden = []
// this is the array for the notes
const message_score_page_data = [];


// this is neccessary for getting the users images
// const users_image = users.data.map(avatar => {
//     console.log(avatar.avatar.id);
//     return {
//         id_avatar: avatar.avatar.id,
//         width: avatar.avatar.width,
//         height: avatar.avatar.height,
//         name: avatar.name
//
//     };
// });
// use ejs as view engine
app.set('view engine', 'ejs')

// use this directory for the ejs files
app.set('views', './views')

// use public directry for  the stylesheets and javascript and images
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));//deze regel code gebruiken vanwege middelware zodat de data leesbaar gemaakt word
// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8005)


// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})


// setups of the routes
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
                        firsthouse: house.f_houses_id.poster_image.id,
                        hooge: house.f_houses_id.poster_image.width,
                        breedte: house.f_houses_id.poster_image.height
                    }))
                }));

                // house.f_houses_id.poster_image.id
                // console.log(JSON.stringify(house.f_houses_id.poster_image.id))
                // houses_list.data["0"].houses["0"].f_houses_id.poster_image.width
                response.render('index', {lists: housedetails});//Render the EJS template using the object's key-value pairs
            } else {
                console.error('No favorite houses data found');
            }
        })
// backup ophalen images dit was het eerst
//
//           <picture>
//
//
//                             <source srcset="https://fdnd-agency.directus.app/assets/<%= list.houses_array[0].image.id %>?width=400&height=300&fit=cover&format=avif"
//                                     type="image/avif">
//
//                             <source srcset="https://fdnd-agency.directus.app/assets/<%= list.houses_array[0].image.id %>?width=400&height=300&fit=cover&format=webp"
//                                     type="image/webp">
//
//
//                             <img src="https://fdnd-agency.directus.app/assets/<%= list.houses_array[0].image.id %>?width=400&height=300&fit=cover"
//                                  alt="Image of the house" width="<%= list.houses_array[0].image.width %>"
//                                  height=" <%= list.houses_array[0].image.height %>" class="names-of-houses__img"
//                             >
//                         </picture>
});


app.get('/lijsten/:id', async function (request, response) {
    fetchJson(`https://fdnd-agency.directus.app/items/f_list/${request.params.id}?fields=*.*.*.*`)
        // .then is used after the fetchjosn is succesful
        .then(lists => {
            if (lists.data) {//check if data exist
                response.render('lijst.ejs', //render the ejs file in your views directory
                    {
                        //     here i give the object with the varaible
                        list: lists.data,
                        users: users.data,
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

        .then(async ({data}) => {

            // render the data with the arrays
            response.render('score', {
                house: data,
                algemeen: general,
                keuken: kitchen,
                badkamer: bathroom,
                tuin: garden,
                notities: message_score_page_data,
                users: users.data


            })
        })
})

// post data in the array
app.post('/score/:id', async function (request, response) {

    //add data to the array
    general.push(request.body.algemeenNumber);
    kitchen.push(request.body.keukenNumber);
    bathroom.push(request.body.badkamerNumber);
    garden.push(request.body.tuinNumber);
    // message is the notes
    message_score_page_data.push(request.body.notes_shown);


    //get the data and fix duplciate code for notes
    fetchJson(`https://fdnd-agency.directus.app/items/f_houses/${request.params.id}/?fields=*.*.*`)
        .then(async (apiResponse) => {
            // if the enhanced is true do this en the render is the partial
            if (request.body.enhanced) {
                response.render('partials/showScore', {
                        result: apiResponse,
                        algemeen: general,
                        keuken: kitchen,
                        badkamer: bathroom,
                        tuin: garden,


                        //     todo hier nog een repsonse.bdy met tekst 'uw huis is tegevoegd'
                    }
                )
            }
            // the else is commented because if it is not working the full page is show in the beoordeling

            // else {
            //     response.redirect(303, '/score/' + request.params.id)
            // }

        })

    // the if enhaced can not in the oter fetch so it needs to be seperated
    fetchJson(`https://fdnd-agency.directus.app/items/f_houses/${request.params.id}/?fields=*.*.*`)
        .then(async (apiResponse) => {
            // if the enhanced is true do this
            if (request.body.notesEnhanced) {
                response.render('partials/showNotes', {
                        result: apiResponse,
                        notities: message_score_page_data,

                        //     todo hier nog een repsonse.bdy met tekst 'uw huis is tegevoegd'
                    }
                )
            }
            // the else is commented because if it is not working the full page is show in the notities
            // else {
            //     response.redirect(303, '/score/' + request.params.id)
            // }

        })
})





// http://localhost:8000/test/35
// this route is a test route so that i can figure out how i can post data to the databse and show the data
// it is not finished
app.get('/test/:id', function (request, response) {
    const feedback = fetchJson(`https://fdnd-agency.directus.app/items/f_feedback/?fields=*.*.*.*`)

    const feedbackUrl = `https://fdnd-agency.directus.app/items/f_feedback/?fields=`;
    const houseUrl = `https://fdnd-agency.directus.app/items/f_houses/${request.params.id}/?fields=*.*`;

    // use a promise.all because the tables are not connected to each other
    Promise.all([
        fetchJson(feedbackUrl),
        fetchJson(houseUrl)
    ])
        .then(async (feedback) => {
            const feedbackdetails = feedback[0]; // Assuming feedback is directly an array of objects
            const house = feedback[1]; // Assuming house data is in the second response

            //
            // console.log(JSON.stringify(feedbackdetails))
            // console.log(JSON.stringify(house))
            //
            // // console.log(feedback);
            //
            //
            // console.log(feedback[0].data[0].id+'dit is het id');
            // console.log(feedback[0].data[0].note+'dit is de notitie');
            // console.log(feedback[0].data[0].rating.ligging+'dit is de beoordeling en house is een object met daarin weer keys en values')
            // console.log(feedback[0].data[0].rating.algemeen+'dit is de beoordeling en house is een object met daarin weer keys en values')
            //
            // // feedback["1"].data.id
            // // Render the data with the arrays
            // console.log(JSON.stringify(feedback[0]))
            response.render('test', {
                house: feedback[1].data,
                feedback: feedback[0],
                rating: feedback[0].data[2].rating,//de rating klopt bij het huis maar is nu handmatig gedaan
                users_image: users_image,
                notities: feedback[0].data[2].note
            });
        })
})

// this route is a test route so that i can figure out how i can post data to the databse and show the data
// it is not finished
app.post('/test/:id', async function (request, response) {
//this is the empty object

    const newScore = {
        general: request.body.algemeenNumber,
        kitchen: request.body.keukenNumber,
        bathroom: request.body.badkamerNumber,
        garden: request.body.tuinNumber,
        new: request.body.new,
    };
    const note = {note: request.body.note}
// make the post route
    fetch(`https://fdnd-agency.directus.app/items/f_feedback/?fields=*.*.*.*`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set appropriate header
        },
        body: JSON.stringify({
            rating: newScore,
            note: note,
        }),
    })
        .then(response => {
            // Handle the response from the server
            console.log('POST request response:', response);
        })
        .catch(error => {
            console.error('Error making POST request:', error);
        });
})

//