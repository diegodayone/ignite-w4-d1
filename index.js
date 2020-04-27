const pageSize = 50;
let page = 0;

const loadPreviousBooks = async () =>{
    if (page === 1)
        document.querySelector("#prevLink").classList.add("disabled")

    if (page > 0)  {
        page = page -1 // page--
        await search()
    }
    else{
        console.log("Cannot find page -1")
    }
}

const loadNextBooks = async () =>{
    if (page === 0)
        document.querySelector("#prevLink").classList.remove("disabled")

    page = page + 1 //page++;
    await search()
}

let fetchBooks = async () => {
    let response = await fetch("https://striveschool.herokuapp.com/books") //GET is the default HTTP method
    if (response.ok){
        let ajaxBooks = await response.json()

        loadBooks(ajaxBooks)
    }
    else {
        console.log(response)
        alert("Something went wrong!")
    }
}


function searchKey() {
    //1) get a reference to the search input
    let searchBox = document.querySelector("[type=search]");
    //2) get the value of the search thingy
    let searchValue = searchBox.value
    if (searchValue.length >= 3)
        search()
    else{
        let list = document.querySelector("#suggestion-list")
        list.innerHTML = "";
        list.style.display = "none"
    }
}

// Show a loader when loading
// Show an empty

const search = async () => {
    //1) get a reference to the search input
    let searchBox = document.querySelector("[type=search]");
    //2) get the value of the search thingy
    let searchValue = searchBox.value.toLowerCase()
    //3) filter the books
    
    // get the category from the select
    let category = document.querySelector("select").value;
    let url = "https://striveschool.herokuapp.com/books?" //create the base url
    if (searchValue) //if search in place add search to the value
        url += "&title=" + searchValue;
    if (category != "all") //if category selected, add category
        url += "&category=" + category

    url += `&limit=${pageSize}&offset=${page * pageSize}`

    //show loader
    document.querySelector(".spinner-border").style.display = "block";

    let response = await fetch(url) //fetch books
    if (response.ok){ //if response is 2**
        let ajaxBooks = await response.json() //read the books as JSON
        if (ajaxBooks.length === 0){ //if there are no books

            //remove previous books
            let library = document.querySelector("#library"); //getting a reference to the library
            library.innerHTML = ""  

            //show alert
            let alert = document.querySelector(".alert");
            alert.innerText = `Cannot find any book that match "${searchValue}"`
            if (category != "all")
                alert.innerText += " in " + category;

            alert.style.display = "block"
        }
        else {
            //hide alert and load books
            document.querySelector(".alert").style.display = "none"
            loadBooks(ajaxBooks)
        }
    }
    else{
        alert("Something went wrong")
    }
    document.querySelector(".spinner-border").style.display = "none"
}

function loadSuggestions(result) {
    let list = document.querySelector("#suggestion-list")
    list.innerHTML = "";
    list.style.display = "block"

    for (let i = 0; i < result.length; i ++) {
        list.innerHTML += "<p>" + result[i].title + "</p>"
    }
}

function loadBooks(bookList) {
    let library = document.querySelector("#library"); //getting a reference to the library
    library.innerHTML = "" //clearing the previous search result

    for (let i = 0; i < Math.min(bookList.length, 100); i++) { //searching a maximum of 100 elements
        //console.log(books[i])
        let child = document.createElement("div") //creating the parent div
        child.className = "col-sm-6 col-md-4 col-lg-3 col-xl-2 card"; //assigning class
        child.innerHTML =   `<img class="card-img-top" src="${bookList[i].img}" />
                                     <div class="card-body">
                                      <p>${bookList[i].title} </p>
                                      <span class="badge badge-primary">${bookList[i].category}</span>
                                      <span class="badge badge-danger">${bookList[i].price} €</span>
                                 </div>` //assign the content
        child.addEventListener("click", (e) => { //assign the event handler for click
            e.currentTarget.classList.toggle("selected")
            selectBooks(); 
        })
        library.appendChild(child) //adding it to the parent
    }
}

function selectBooks() { 
    let myUl = document.querySelector("#selected-books") //search for the list
    myUl.innerHTML = ""; //reset the list 
    let selected = document.querySelectorAll(".card.selected") //get all the selected books

    for (let i = 0; i < selected.length; i ++){ //for each one of them
        myUl.innerHTML += "<li>"  + selected[i].querySelector("p").innerText + "</li>" //create a new paragraph in the bottom
    }

}

window.onload = async () => {
    console.log("the page has loaded")
    await fetchBooks()
}
