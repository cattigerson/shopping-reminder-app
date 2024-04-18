import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js'

const appSetting = {
    databaseURL: 'https://reminder-app-7102a-default-rtdb.asia-southeast1.firebasedatabase.app/'
}
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const app = initializeApp(appSetting)
const db = getDatabase(app)
const shoppingListInDB = ref(db, 'shopping_list')

const body_ele = document.getElementsByTagName('body')[0]
const ul_ele = document.getElementsByTagName('ul')[0]
const list_area_ele = document.getElementById('list')

onValue(shoppingListInDB, function (snapshot) {
    clearListArea()
    if (snapshot.exists()) {
        removeEmptyMessage()
        // document.getElementsByTagName('p')[0].remove()
        let list_items = Object.entries(snapshot.val())
        for (let i= 0; i < list_items.length; ++i) {
            appendToListArea(list_items[i])
        }
    } else {
        const new_p_ele = document.createElement('p')
        new_p_ele.classList.add('empty')
        new_p_ele.innerText = 'Nothing yet...'
        body_ele.append(new_p_ele)
    }

})

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue) {
        push(shoppingListInDB, inputValue)
        console.log(`${inputValue} is successfully saved in database!`)
        // appendToListArea(inputValue)
        inputFieldEl.value = ''
    }
})

function appendToListArea(value) {
    // list_area_ele.innerHTML += `<li>${value}</li>`
    let new_ele = document.createElement('li')
    new_ele.innerText = value[1]
    ul_ele.appendChild(new_ele)
    new_ele.addEventListener('dblclick', () => {
        const item_locationInDB = ref(db, `shopping_list/${value[0]}`)
        remove(item_locationInDB)
    })
}


function  clearListArea() {
    list_area_ele.innerHTML = ''
}

function removeEmptyMessage() {
    const empty_p_ele = document.querySelector('.empty')
    if (empty_p_ele) {
        empty_p_ele.remove()
    }
}