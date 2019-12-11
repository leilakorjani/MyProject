// Initialize Firebase
let config = {
  apiKey: "AIzaSyCDkLcXXfgAvzJ8MGrqwKTVp3eQP77RUTg",
  authDomain: "myproject-d4704.firebaseapp.com",
  databaseURL: "https://myproject-d4704.firebaseio.com",
  projectId: "myproject-d4704",
  storageBucket: "myproject-d4704.appspot.com",
  messagingSenderId: "519309165334",
  appId: "1:519309165334:web:683c9c94d82f4787fe0637"
};

firebase.initializeApp(config);

// Firebase Database Reference and the child
const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users1');

debugger;
readUserData(); 
	

// --------------------------
// READ
// --------------------------
function readUserData() {

	const userListUI = document.getElementById("user-list");
    if (userListUI != null) {
        usersRef.on("value", snap => {

            userListUI.innerHTML = ""
            let i = 1;
            snap.forEach(childSnap => {

                let key = childSnap.key,
                    value = childSnap.val()

                let $li = document.createElement("tr");
                //***************************************************
                let $th4 = document.createElement("td");
                // edit icon
                $th4.innerHTML = i + "";
                $li.append($th4);
                i++;
                //***************************************************
                let $th1 = document.createElement("td");
                // edit icon
                $th1.innerHTML = value.name;
                $li.append($th1);
                //***************************************************
                let $th2 = document.createElement("td");
                // edit icon
                $th2.innerHTML = value.email;
                $li.append($th2);
                //***************************************************
                let $th3 = document.createElement("td");
                // edit icon
                $th3.innerHTML = value.phone;
                $li.append($th3);
                //***************************************************
                let $thDetail = document.createElement("td");
                let DetailIconUI = document.createElement("button");
                DetailIconUI.class = "btn btn-outline-info";
                DetailIconUI.type = "button";
                DetailIconUI.innerHTML = "Details";
                DetailIconUI.setAttribute("user-key", key);
                DetailIconUI.addEventListener("click", userClicked)
                $thDetail.append(DetailIconUI);
                $li.append($thDetail);
                /////////////////
                let deleteIconUI = document.createElement("button");
                deleteIconUI.class = "btn btn-outline-danger";
                deleteIconUI.innerHTML = "Delete";
                deleteIconUI.setAttribute("userid", key);
                deleteIconUI.addEventListener("click", deleteButtonClicked)
                $thDetail.append(deleteIconUI);


                //***************************************************


                // edit icon
                let editIconUI = document.createElement("button");
                editIconUI.class = "btn btn-outline-primary";
                editIconUI.innerHTML = " Edit";
                editIconUI.setAttribute("userid", key);             
                editIconUI.addEventListener("click", editButtonClicked)
                $thDetail.append(editIconUI);
                // delete icon
                $li.append($thDetail);

                userListUI.append($li);

            });


        })
    }
}

function userClicked(e) {

    debugger;
    ListForm.style.display = 'none';
    NewForm.style.display = "none";
    EditForm.style.display = "none";
    DetailForm.style.display = "block";

    let userID = e.target.getAttribute("user-key");

    const userRef = dbRef.child('users1/' + userID);
   
    //********************
    document.querySelector(".edit-userid").value = userID;

  

    // set data to the user field
    const editUserInputsUI = document.querySelectorAll(".edit-user-input-detail");


    userRef.on("value", snap => {

        for (let i = 0, len = editUserInputsUI.length; i < len; i++) {

            let key = editUserInputsUI[i].getAttribute("data-key");
            editUserInputsUI[i].value = snap.val()[key];
        }

    });
    //******************
    const showEditeBtn = document.querySelector("#showEdite");
    showEditeBtn.addEventListener("click", editButtonClicked);
    showEditeBtn.setAttribute("userid", userID);             
    
    const deleteBtn = document.querySelector("#delete");

    deleteBtn.setAttribute("userid", userID);
    deleteBtn.addEventListener("click", deleteButtonClicked1);

    return true;


}


// --------------------------
// DELETE
// --------------------------
function deleteButtonClicked(e) {
    debugger;

    let choice = confirm('Do you really want to delete this record?');
    if (choice === true) {

        e.stopPropagation();

        let userID = e.target.getAttribute("userid");

        const userRef = dbRef.child('users1/' + userID);

        userRef.remove();
        return true;
    }

    return false;	

}


// --------------------------
// EDIT
// --------------------------
function editButtonClicked(e) {
    debugger;
    ListForm.style.display = 'none';
    NewForm.style.display = "none";
    EditForm.style.display = "block";
    DetailForm.style.display = "none";


	//set user id to the hidden input field
	document.querySelector(".edit-userid").value = e.target.getAttribute("userid");

	const userRef = dbRef.child('users1/' + e.target.getAttribute("userid"));

	// set data to the user field
    const editUserInputsUI = document.querySelectorAll(".edit-user-input-edit");


	userRef.on("value", snap => {

		for(let i = 0, len = editUserInputsUI.length; i < len; i++) {

			let key = editUserInputsUI[i].getAttribute("data-key");
					editUserInputsUI[i].value = snap.val()[key];
		}

	});


    const saveBtn = document.querySelector("#edit-user-btn");
    saveBtn.addEventListener("click", saveUserBtnClicked);
    debugger;
}


function saveUserBtnClicked(e) {

    if (document.getElementById("name-edit").value == "") {
        alert("Name is required")
        return false;
    }
    else if (document.getElementById("email-edit").value == "") {

        alert("Email is required");
        return false;

    }
    else if (document.getElementById("phone-edit").value == "") {
        alert("Phone is required");
        return false;

    }
    else if (!validateEmail(document.getElementById("email-edit").value)) {
        alert("email is not correct!");
        return false;
    }
    else if (!validatePhone(document.getElementById("phone-edit").value)) {
        alert("phone is not correct!");
        return false;

    }
    else {

        const userID = document.querySelector(".edit-userid").value;
        const userRef = dbRef.child('users1/' + userID);

        let editedUserObject = {}

        const editUserInputsUI = document.querySelectorAll(".edit-user-input-edit");

        editUserInputsUI.forEach(function (textField) {
            let key = textField.getAttribute("data-key");
            let value = textField.value;
            editedUserObject[textField.getAttribute("data-key")] = textField.value
        });



        userRef.update(editedUserObject)
        ListForm.style.display = 'block';
        NewForm.style.display = "none";
        EditForm.style.display = "none";
        DetailForm.style.display = "none";
        alert('Succes');
        return true;
    }
}

$('#confirm-delete').on('show.bs.modal', function (e) {
    $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
});


//*************************************************new

let NewForm = document.getElementById('divNew');
let ListForm = document.getElementById('divList');
let EditForm = document.getElementById('divEdit');
let DetailForm = document.getElementById('DivDetail');

let newBut = document.getElementById('showNew');
newBut.addEventListener('click', keyHandler);

let showList = document.getElementById('showList');
showList.addEventListener('click', showListDisplay)


function ShowEditForm(event) {
    debugger;
    ListForm.style.display = 'none';
    NewForm.style.display = "none";
    EditForm.style.display = "block";

    event.preventDefault();
}


function keyHandler(event) {
    debugger;
    ListForm.style.display = 'none';
    NewForm.style.display = "block";
    EditForm.style.display = "none";
    DetailForm.style.display = "none";   
    event.preventDefault();
}

function showListDisplay(event) {

    ListForm.style.display = 'block';
    NewForm.style.display = "none";
    EditForm.style.display = "none";
    DetailForm.style.display = "none";   
}

function formcheck() {
 
    if (document.getElementById("name").value == "") {
        alert("Name is required")
        return false;
    }
    if (document.getElementById("email").value == "") {

        alert("Email is required");
        return false;
    }
    if (document.getElementById("phone").value == "") {
        alert("Phone is required");
        return false;
    }
    if (!validateEmail(document.getElementById("email").value)) {
        alert("email is not correct!");
        return false;
    }
    if (!validatePhone(document.getElementById("phone").value)) {
        alert("phone is not correct!");
        return false;
    }

    return true;
}
function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validatePhone(phone) {
    let phoneno = /^\(?([2-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneno.test(phone)
}

let submitBut = document.getElementById('add-user-btn');

submitBut.addEventListener('click', addUserBtnClicked);


function addUserBtnClicked() {
 
    if (document.getElementById("name").value == "") {
        alert("Name is required")
        return false;
    }
    else    if (document.getElementById("email").value == "") {

        alert("Email is required");
        return false;

    }
   else if (document.getElementById("phone").value == "") {
        alert("Phone is required");
        return false;

    }
   else if (!validateEmail(document.getElementById("email").value)) {
        alert("email is not correct!");
        return false;
    }
    else if (!validatePhone(document.getElementById("phone").value)) {
        alert("phone is not correct!");
        return false;

    }
    else
{        
       
        const usersRef = dbRef.child('users1');

        const addUserInputsUI = document.getElementsByClassName("user-input");

        // this object will hold the new user information
        let newUser = {};
        debugger;
        // loop through View to get the data for the model 
        for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

            let key = addUserInputsUI[i].getAttribute('data-key');
            let value = addUserInputsUI[i].value;
            newUser[key] = value;
        }

        usersRef.push(newUser, function () {
            console.log("data has been inserted");
        });
       
        showListDisplay();
        return true;
    }

    
}


function deleteButtonClicked1(e) {

    debugger;
    let choice = confirm('Do you really want to delete this record?');
    if (choice === true) {

        e.stopPropagation();

        let userID = e.target.getAttribute("userid");

        const userRef = dbRef.child('users1/' + userID);

        userRef.remove();
        ListForm.style.display = 'block';
        NewForm.style.display = "none";
        EditForm.style.display = "none";
        DetailForm.style.display = "none";
       
        return true;
    }

    return false;

}

