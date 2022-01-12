import { HTTPManager } from './http_manager.js';


let httpManager = new HTTPManager();
let allItems;

let list = document.getElementById("list");
let selectDelete = document.getElementById("deleteID");
let selectEdit = document.getElementById("editID");
let editFields = document.getElementById("editFields");
let addName = document.getElementById("addName");
let addPrice = document.getElementById("addPrice");

let debug = document.getElementById("debug");

await resetList();
async function resetList() {
    allItems = await httpManager.fetchAllRecipes();
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    while (selectDelete.firstChild) {
        selectDelete.removeChild(selectDelete.firstChild);
    }
    while (selectEdit.firstChild) {
        selectEdit.removeChild(selectEdit.firstChild);
    }
    for (let i = 0; i < allItems.length; i++) {
        let element = document.createElement("div");
        let id = JSON.stringify(allItems[i].id);
        let name = JSON.stringify(allItems[i].name);
        let price = JSON.stringify(allItems[i].price);
        element.innerText = id + " " + name + " " + price;
        list.appendChild(element);
        
        let optionDelete = document.createElement("option");
        optionDelete.innerText = id;
        selectDelete.appendChild(optionDelete);
        
        let optionEdit = document.createElement("option");
        optionEdit.innerText = id;
        selectEdit.appendChild(optionEdit);
    }
}
refreshEdit();
function refreshEdit() {
    while (editFields.firstChild) {
        editFields.removeChild(editFields.firstChild);
    }
    for (let i = 2; i < Object.keys(allItems[selectEdit.selectedIndex]).length; i++) {
        let input = document.createElement("input");
        let index = Object.keys(allItems[selectEdit.selectedIndex])[i];
        input.defaultValue = (allItems[selectEdit.selectedIndex])[index];
        editFields.appendChild(input);
    }
}

async function addNew() {
    let priceNum = parseInt(addPrice.value);
    let item = {
        id : allItems.length + 1,
        name : addName.value,
        price : priceNum
    };
    await httpManager.addNewRecipe(item);
    resetList();
}

debug.innerText = JSON.stringify(addName.value)//JSON.stringify(Object.keys((allItems[selectEdit.options[selectEdit.selectedIndex].value]))[2]);

document.getElementById("deleteButton").onclick = function () { httpManager.deleteRecipe(selectDelete.options[selectDelete.selectedIndex].value); resetList();};

document.getElementById("editID").onclick = function () { refreshEdit(); };

document.getElementById("addButton").onclick = function() { addNew(); };