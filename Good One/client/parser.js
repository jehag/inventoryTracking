import { HTTPManager } from './http_manager.js';

const SIZE_OF_ROW = 3;

let httpManager = new HTTPManager();
let allItems;

let list = document.getElementById("list");
let selectDelete = document.getElementById("deleteID");
let selectEdit = document.getElementById("editID");
let editFields = document.getElementById("editFields");
let addFields = document.getElementById("addFields");
let automaticToggle = document.getElementById("automaticToggle");

let debug = document.getElementById("debug");

async function findItemWithId(id) {
    return await httpManager.getRecipeByID(id);
}

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
        for (let j = 1; j < Object.keys(allItems[i]).length; j++) {
            element.innerText = element.innerText + (Object.keys(allItems[i])[j]) + " : " + allItems[i][Object.keys(allItems[i])[j]] + ", ";
        }
        element.innerText = element.innerText.substring(0, element.innerText.length - 2);
        list.appendChild(element);
        
        let optionDelete = document.createElement("option");
        optionDelete.innerText = allItems[i].id;
        selectDelete.appendChild(optionDelete);
        
        let optionEdit = document.createElement("option");
        optionEdit.innerText = allItems[i].id;
        selectEdit.appendChild(optionEdit);
    }
}
refreshEdit();
async function refreshEdit() {
    while (editFields.firstChild) {
        editFields.removeChild(editFields.firstChild);
    }
    if (allItems.length == 0)
        return;
    for (let i = 2; i < Object.keys(allItems[selectEdit.selectedIndex]).length; i++) {
        let input = document.createElement("input");
        let index = Object.keys(allItems[selectEdit.selectedIndex])[i];
        let item = await findItemWithId(selectEdit.options[selectEdit.selectedIndex].value)
        input.defaultValue = item[index];
        editFields.appendChild(input);
    }
}

async function findIndex() {
    let potentialId = allItems.length + 1;
    // Loop to avoid duplicating an ID if a recipe was deleted
    while (allItems.some((element) => element.id === potentialId)) {
      potentialId--;
    }
    return potentialId;
}

async function addNew() {
    console.log(addFields);
    let index = automaticToggle.checked ? await findIndex() : addFields[1].value;
    let item = {
        id : index,
    };
    for (let i = 0; i < addFields.children.length - 1; i = i+2) {
        item[addFields.children[i++].value] = addFields.children[i].value;
    }
    await httpManager.addNewRecipe(item);
    await resetList();
    refreshEdit();
    addIdField();
}

function refreshEditIndex() {
    if (allItems.length == 0)
        return;
    selectEdit.value = allItems[0].id;
}

async function deleteItem() {
    await httpManager.deleteRecipe(selectDelete.options[selectDelete.selectedIndex].value);
    await resetList();
    refreshEditIndex();
    refreshEdit();
}

async function editItem() {
    const item = {
        id: allItems[selectEdit.selectedIndex].id
    };
    let itemToMod = await findItemWithId(selectEdit.options[selectEdit.selectedIndex].value);
    for (let i = 2; i < Object.keys(itemToMod).length; i++) {
        item[Object.keys(itemToMod)[i]] = editFields.childNodes[i-2].value;
    }
    await httpManager.editItem(item);
    await resetList();
    refreshEdit();
}

function addIdField() {
    if (!automaticToggle.checked) {
        let breakLine = document.createElement("br");
        clearAllAddFields();
        let idTxt = document.createElement("input");
        idTxt.readOnly = true;
        idTxt.value = "Id";
        addFields.appendChild(idTxt);
        let id = document.createElement("input");
        addFields.appendChild(id);
        addFields.appendChild(breakLine);
        addAllFields();
        return;
    }
    clearAllAddFields();
    addAllFields();
}
addIdField();
function addAllFields() {
    for (let i = 2; i < Object.keys(allItems[0]).length; i++) {
        let breakLine = document.createElement("br");
        let inputName = document.createElement("input");
        inputName.defaultValue = Object.keys(allItems[0])[i];
        addFields.appendChild(inputName);
        let inputColumn = document.createElement("input");
        addFields.appendChild(inputColumn);
        addFields.appendChild(breakLine);
    }
}
function clearAllAddFields() {
    while (addFields.firstChild) {
        addFields.removeChild(addFields.firstChild);
    }
}
function addNewField() {
    let breakLine = document.createElement("br");
    let inputName = document.createElement("input");
    addFields.appendChild(inputName);
    let inputColumn = document.createElement("input");
    addFields.appendChild(inputColumn);
    addFields.appendChild(breakLine);
}

function deleteLastField() {
    if ((addFields.children.length > 2*SIZE_OF_ROW && automaticToggle.checked) || (addFields.children.length > 3*SIZE_OF_ROW && !automaticToggle.checked)) {
        for (let i = 0; i < SIZE_OF_ROW; i++) {
            addFields.removeChild(addFields.lastChild);
        }
    }
}

debug.innerText = JSON.stringify(allItems[0][Object.keys(allItems[0])[0]])//JSON.stringify(Object.keys((allItems[selectEdit.options[selectEdit.selectedIndex].value]))[2]);

document.getElementById("deleteButton").onclick = function () { deleteItem(); };

document.getElementById("editButton").onclick = function () { editItem(); };

document.getElementById("editID").onclick = function () { refreshEdit(); };

document.getElementById("addButton").onclick = function() { addNew(); };

document.getElementById("addNewField").onclick = function() { addNewField(); };

document.getElementById("deleteLastField").onclick = function() { deleteLastField(); };

automaticToggle.onclick = function() { addIdField(); };

console.log(addFields);