

// 1. IMPORTS_____________________________________________________________________________________
import { User, IUser, roleType, statusType } from "./Class/User"
import { UsersManager } from "./Class/UsersManager"


// This "document" is provided by the Browser, the main purpose is to help us to interact with the DOM
// DOM = Bridge between the HTML structure and programming languages like JavaScript. It gives super power to webpages to interact with the user and other apps.


// DEFINE a function to be used when the btn "new user" is Clicked.................................................

//		Note:In Typescript is needed to define the exact datatype for the args and its Returns. ex:  "id: string"

/* // Function to Show the Form:
function showForm (id:string):void {
	// Get the element by the ID passed
	const modal = document.getElementById(id)
	// the showModal() method belongs particulary to the sub-element "HTMLDialogElement", so is needed to check it in the IF statement
	if (modal && modal instanceof HTMLDialogElement){
		modal.showModal()
	}
	else{
		console.warn("ID passed was not found. ID: ", id)
	}
}

// Function to Close the Form:
function closeForm (id:string):void {
	// Get the element by the ID passed
	const modal = document.getElementById(id)
	// the showModal() method belongs particulary to the sub-element "HTMLDialogElement", so is needed to check it in the IF statement
	if (modal && modal instanceof HTMLDialogElement){
		modal.close()
	}
	else{
		console.warn("ID passed was not found. ID: ", id)
	}
} */


// 2. UTILITY FUNCTIONS___________________________________________________________________________________

// Function Toggle to OPEN or CLOSE the Modal (Form)...............................
function toggleForm(id: string, action: "open" | "close"): void {
	// Get the element by the ID passed
	const modal = document.getElementById(id)

	// Check if element exists and is a dialog element
	if (modal && modal instanceof HTMLDialogElement) {
		if (action === "open") {modal.showModal()}
		else {modal.close()}
	}
	else {console.warn("ID passed was not found. ID:", id)}
}


// Function to show the Error PopUp ...............................................
function showError(message: string): void {
	if (errorModal instanceof HTMLDialogElement && errorMessage) {
		errorMessage.textContent = message
		errorModal.showModal()
	}
}


// FN to change to target Page...................................................
function navigateToPage(targetPageId: string): void {

	// 1. Get ALL the pages using the class "page" inside "content" element
	const allPages = document.querySelectorAll("#content .page");

	// 2. Switch off ALL the pages 
	allPages.forEach(page => {   
		// Check if is HTMLELement
		if (page instanceof HTMLElement) {
			page.classList.add("hidden"); // Add the hidden class to the page
		}
	});

	// 3. Switch ON only the targetpage using the ID and removing the "hidden" class
	const targetPage = document.getElementById(targetPageId);
	if (targetPage && targetPage instanceof HTMLElement) {
		targetPage.classList.remove("hidden");
		console.log(`Navegando exitosamente a: ${targetPageId}`);
	} else {
		console.warn(`La página con ID: ${targetPageId} no existe en el DOM.`);
	}
}



// 3. DOM REFERENCES________________________________________________________________________________

// FORMS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// Get the forms by ID:
const userForm = document.getElementById("new_user_form")
const projectForm = document.getElementById("new_project_form")



// BUTTONS :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// SIDEBAR----------------------------------------------------------
	// Get the btns of Projects and Users:
const btnUsers = document.getElementById("usersBtn");
const btnProjects = document.getElementById("projectsBtn");


	// NEW USER / PROJECT BUTTONS---------------------------------------
	// To get the buttons to create a new User/Project:
const btnCreateUser = document.getElementById("btn_create_user")
const btnCreateProject = document.getElementById("btn_create_project")

		// For USER
if(btnCreateUser){
	//	It "listens" the Event when Cliks the btn:
	//	Notice: the function passed is called automatiacally, 
	//		    therefore, it needs to create an ANONIMOUS FUNCTION to call the function previously created and be called after the Event
	btnCreateUser.addEventListener("click", () => {toggleForm("new_user_modal","open")}) 
}
else {console.warn("Button Create User is null")}
	// Get the Cancel button
const cancelUserBtn = document.getElementById("cancel_user")


		// For PROJECT
if(btnCreateProject){btnCreateProject.addEventListener("click", () => {toggleForm("new_project_modal","open")})}
else{console.warn("Button Create Project is null")}
const cancelProjectBtn = document.getElementById("cancel_project")


// ERRORS-------------------------------------------------------------

	// Get the Button Close Error Modal
const closeErrorModal = document.getElementById("close_error_modal")

	// Get the Elements for Errors:
const errorModal = document.getElementById("error_modal") // The Modal
const errorMessage = document.getElementById("error_message") // The Message



// CONTAINERS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// Get the Users list UI from the HTML file and check if exists
const usersListUI = document.getElementById("users_list")
if(!usersListUI) {throw new Error("userListUI does not exists")}

	// Get the Projects list UI from the HTML file and check if exists
const projectsListUI = document.getElementById("projects_list")
if(!projectsListUI) {throw new Error("projectListUI does not exists")}




// 4. MANAGERS/ INSTANCES_____________________________________________________________________

	// Define the global action to change to Details page only ONCE
const changeToUserDetailsPage = (selectedUser: User) => {
	navigateToPage("user_details_page"); 
	console.log(`Cambiando a la página de detalles de: ${selectedUser.name}`);
};

	// Create an Instance of UsersManager
const usersManager = new UsersManager(usersListUI, changeToUserDetailsPage);



// 5. EVENT LISTENERS_________________________________________________________________________

	// Check if the Form exists and is an "HTMLFormElement:"
if (userForm && userForm instanceof HTMLFormElement){
	
	// Forms have an Event called "SUBMIT" when the user clicks one of the designated buttons
	//	also it passes data through the fn, to catch it is used the arg "e"
	userForm.addEventListener("submit", (e) => {
		// To prevent the Default behavior which is to reload the page:
		e.preventDefault()
		
		// To create a new Instance of the Class FormData based on the element form previuosly found
		const formData = new FormData(userForm)
		
		// NOTES: * To get any value of the Formdata element (it has to be named in the INPUT/SELECT container of the HTML file):
		//        * The fn .get() returns generally "string" type, no matter if you define the type in the HTML file
		
		// To CAST from "string" of the .get() to "number"
		const telephoneRaw = formData.get("telephone")
		
		// Definition of an Object based on the info from formData:
		//		NOTE: Using the word "as" is ONLY recommended when is 100% confirmed the dataype of the "conversion"
		//			  
		const userObj: IUser = {
			role: formData.get("role") as roleType,
			status: formData.get("status") as statusType,
			name: formData.get("name") as string,
			username:formData.get("username") as string,
			email: formData.get("email") as string,
			telephone: Number(telephoneRaw) // casted from above
			//telephone: Number(formData.get("telephone")) // Also could be casted like this
		}
		
		// To intercept the ERRORS:
		try{
			// Create a new User using the "usersManager" with the info of the userObject got from the Form
			// As usersManager already has the given FN to chg the pages, we can call it clean here
			const user = usersManager.newUser(userObj)
			
			// To Clean up the Form after submitted
			userForm.reset();
			
			// To close the Modal (Form)
			toggleForm("new_user_modal","close")
			
			// to print out in Console
			console.log(user)
			
		}catch(error){
			// window.alert(error)

			if (error instanceof Error) {
				showError(error.message)
			} else {
				showError("Unknown error occurred")
			}
		}

		// To Listen the Btn to close the Error Dialog in the browser
		if(closeErrorModal && errorModal instanceof HTMLDialogElement){
			closeErrorModal.addEventListener("click", () => {
				errorModal.close()
			})
		}
		
	})

	if(cancelUserBtn){
		cancelUserBtn.addEventListener("click", () => {
			userForm.reset();
			toggleForm("new_user_modal", "close");
			console.log("Form closed by the user. Data discarted")
		})
	}
	else{
		console.warn("Button Cancel was not found in the structure");
	}


}
else{
	console.warn("Form Id was not found. Check the ID form!")
}


// To Export JSON files
const exportUsersBtn = document.getElementById("export_users_btn");
if(!exportUsersBtn) {throw new Error("Export button does not exists")}
else{
		exportUsersBtn.addEventListener("click", () =>{
			usersManager.exportToJSON()
		})
	}

// To import JSON files
const importUsersBtn = document.getElementById("import_users_btn");
if(!importUsersBtn) {throw new Error("Import button does not exist")}
else{
		importUsersBtn.addEventListener("click", () =>{
			usersManager.importFromJSON();
		})
	}


// To Change Page from Side bar Buttons:
if(!btnUsers) { throw new Error("Users Btn (sidebar) does not exist") }
else{
	btnUsers.addEventListener("click", () => {
		navigateToPage("users_list_page");
	})
}

if(!btnProjects) { console.warn("Projects Btn (sidebar) does not exist") }
else{
	btnProjects.addEventListener("click", () => {
		navigateToPage("projects_list_page");
	})
}

// To start by Default the page in the Projects List Page:
navigateToPage("projects_list_page");