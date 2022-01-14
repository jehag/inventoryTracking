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

async function findItemWithId(id) {
    return await httpManager.getItemByID(id);
}

await resetList();
async function resetList() {
    allItems = await httpManager.fetchAllItems();
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
        for (let j = 0; j < Object.keys(allItems[i]).length; j++) {
            if (Object.keys(allItems[i])[j] != "_id") {
                element.innerText = element.innerText + (Object.keys(allItems[i])[j]) + " : " + allItems[i][Object.keys(allItems[i])[j]] + ", ";
            }
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
await refreshEdit();
async function refreshEdit() {
    while (editFields.firstChild) {
        editFields.removeChild(editFields.firstChild);
    }
    if (allItems.length == 0)
        return;
    for (let i = 0; i < Object.keys(allItems[selectEdit.selectedIndex]).length; i++) {
        if (Object.keys(allItems[0])[i] != "id" && Object.keys(allItems[0])[i] != "_id") {
            let input = document.createElement("input");
            let index = Object.keys(allItems[selectEdit.selectedIndex])[i];
            let item = await findItemWithId(selectEdit.options[selectEdit.selectedIndex].value)
            input.defaultValue = item[index];
            editFields.appendChild(input);
        }
    }
}

function checkId(id) {
    while (allItems.some((element) => element.id === id)) {
        return false;
    }
    return true;
}

async function addNew() {
    if ((automaticToggle.checked && addFields.children.length < 2*SIZE_OF_ROW) || (!automaticToggle.checked && addFields.children.length < 3*SIZE_OF_ROW)) {
        alert("Your item must have at least three propreties (including the ID)");
        return;
    }
    let item = {};
    if (!automaticToggle.checked) {
        if (isNaN(addFields.children[1].value) || parseInt(addFields.children[1].value) < 1) {
            alert("The ID must be a number greater than 0")
            return;
        }
        if (!checkId(addFields.children[1].value)) {
            alert("This ID already exists");
            return;
        }
        item = {
            id : parseInt(addFields.children[1].value),
        };
    }
    
    let i = automaticToggle.checked ? 0 : SIZE_OF_ROW;
    for (i; i < addFields.children.length - 1; i = i+2) {
        if (addFields.children[i].value.length == 0 || addFields.children[i+1].value.length == 0) {
            alert("Your item has empty fields");
            return;
        }
        if (item[addFields.children[i].value] != undefined) {
            alert("You have the same field twice");
            return;
        }
        item[addFields.children[i++].value] = addFields.children[i].value;
    }
    await httpManager.addNewItem(item);
    await resetList();
    await refreshEdit();
    addIdField();
}

function refreshEditIndex() {
    if (allItems.length == 0)
        return;
    selectEdit.value = allItems[0].id;
}

async function deleteItem() {
    await httpManager.deleteItem(selectDelete.options[selectDelete.selectedIndex].value);
    await resetList();
    refreshEditIndex();
    await refreshEdit();
    addIdField();
}

async function editItem() {
    const item = {
        id: allItems[selectEdit.selectedIndex].id
    };
    let itemToMod = await findItemWithId(selectEdit.options[selectEdit.selectedIndex].value);
    let j = 0;
    for (let i = 0; i < Object.keys(itemToMod).length; i++) {
        if (Object.keys(itemToMod)[i] != "id" && Object.keys(itemToMod)[i] != "_id"){
            item[Object.keys(itemToMod)[i]] = editFields.childNodes[j++].value;
        }
    }
    await httpManager.editItem(item);
    await resetList();
    await refreshEdit();
}

function addIdField() {
    if (!automaticToggle.checked) {
        let breakLine = document.createElement("br");
        clearAllAddFields();
        let idTxt = document.createElement("input");
        idTxt.readOnly = true;
        idTxt.value = "id";
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
    if (allItems.length == 0) {
        for (let i = 0; i < 2; i++) {
            let breakLine = document.createElement("br");
            let inputName = document.createElement("input");
            inputName.placeholder = "Column Name";
            addFields.appendChild(inputName);
            let inputColumn = document.createElement("input");
            inputColumn.placeholder = "Column Value";
            addFields.appendChild(inputColumn);
            addFields.appendChild(breakLine);
        }
        return;
    }
    for (let i = 0; i < Object.keys(allItems[0]).length; i++) {
        if (Object.keys(allItems[0])[i] != "id" && Object.keys(allItems[0])[i] != "_id") {
            let breakLine = document.createElement("br");
            let inputName = document.createElement("input");
            inputName.defaultValue = Object.keys(allItems[0])[i];
            addFields.appendChild(inputName);
            let inputColumn = document.createElement("input");
            addFields.appendChild(inputColumn);
            addFields.appendChild(breakLine);
        }
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
    else {
        alert("Your item must have at least three propreties (including the ID)");
    }
}

async function createCSV() {
    await resetList();
    let csvData = "data:text/csv;charset=utf-8,";
    for (let i = 0; i < allItems.length; i++) {
        for (let j = 0; j < Object.keys(allItems[i]).length; j++) {
            let key = Object.keys(allItems[i])[j];
            csvData = csvData + key + ":" + allItems[i][key] + ",";
        }
        csvData = csvData.substring(0, csvData.length - 1);
        csvData = csvData+"\n";
    }
    let uri = encodeURI(csvData);
    let csvCreation = document.createElement("a");
    csvCreation.setAttribute("href", uri);
    csvCreation.setAttribute("download", "inventoryItems.csv");
    document.body.appendChild(csvCreation);

    csvCreation.click();
}

document.getElementById("deleteButton").onclick = function () { deleteItem(); };

document.getElementById("editButton").onclick = function () { editItem(); };

document.getElementById("editID").onclick = function () { refreshEdit(); };

document.getElementById("addButton").onclick = function() { addNew(); };

document.getElementById("addNewField").onclick = function() { addNewField(); };

document.getElementById("deleteLastField").onclick = function() { deleteLastField(); };

document.getElementById("exportCSV").onclick = function() {createCSV();}

automaticToggle.onclick = function() { addIdField(); };

