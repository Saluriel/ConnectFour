

// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;
const gameTable = document.querySelector('#jeopardy')


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const link = "http://jservice.io/api/categories/?count=100"
    const res = await axios.get(link);

    let categoriesArray = res.data.map(function(result){
        return (result.id)
    })
    // https://www.geeksforgeeks.org/lodash-_-samplesize-method/
    return _.sampleSize(categoriesArray, NUM_CATEGORIES)
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const link = `http://jservice.io/api/category/?id=${catId}`
    const res = await axios.get(link);
    const allClues = res.data.clues
    // console.log(allClues)
    const randomClues = _.sampleSize(allClues, NUM_QUESTIONS_PER_CAT)
    // console.log(randomClues)

    let clueArr = randomClues.map(function(result){
        // console.log(result.question)
        return {
            question: result.question,
            answer: result.answer,
            showing: null,
        }
       
        
    })
    // console.log(clueArr)
    return {title: res.data.title, clues: clueArr}
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    $('#thead').empty();
    $('#tbody').empty();

    const newTr = document.createElement('tr');
    //loop 6 times, createa  new header every time 
    for(let i=0; i<NUM_CATEGORIES; i++){
        let newTh = document.createElement('th');
        //append a new header with the inner text of the title for each category (up to index 5)
        newTh.innerText = categories[i].title
        // console.log(newTh)
        newTr.append(newTh);   
    }

    //append the new row to the jeopardy table
    document.querySelector('#thead').append(newTr);

    for(let i=0; i<NUM_QUESTIONS_PER_CAT; i++){
       const newTr = document.createElement('tr');
       for(let j=0; j<NUM_CATEGORIES; j++){
           let newTd = document.createElement('td');
           newTd.id = `${i},${j}`
           newTd.innerText = '?'
        //    console.log(newTd.id)
           newTr.append(newTd) 
       }
       document.querySelector('#tbody').append(newTr);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
//    console.log(evt.target.id);
    let [questionId, categoryId] = evt.target.id.split(',')
    // console.log(categoryId)
    // console.log(questionId)
    let entireClue = categories[categoryId].clues[questionId]
    // console.log(categoryId)
    // console.log(categories[categoryId].clues)
    let clueText;
    
    if(entireClue.showing === null){
        clueText = entireClue.question
        entireClue.showing = "question"
    }
    else if(entireClue.showing === "question"){
        clueText = entireClue.answer
        entireClue.showing = "answer"
    }
    else {return};

    evt.target.innerHTML = clueText;
    
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

 function showLoadingView() {
  const loader = document.createElement('div');
  const div = document.querySelector('#loaderDiv');
       loader.id = 'loader'
       div.append(loader);

    setTimeout( function(){
        hideLoadingView();} , 1000);

    
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    setupAndStart();
    $('#loaderDiv').empty();
    
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    categories = [];
    let categoryIds = await getCategoryIds();

    for(let ids of categoryIds){
        categories.push(await getCategory(ids))
    }
    fillTable();
}

/** On click of start / restart button, set up game. */
// const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
resetBtn.addEventListener('click', showLoadingView);


$( document ).ready(function() {
    setupAndStart();
    const tBody = document.querySelector('#tbody');
    tBody.addEventListener('click', handleClick)
});