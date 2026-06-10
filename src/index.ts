

// _____________________________1. IMPORTS_____________________________________________________________________________________
import { User, IUser, roleType, statusType } from "./Class/User"
import { UsersManager } from "./Class/UsersManager"

import { Project, IProject, UserRole, ProjectStatus, IToDo, ToDoStatus } from "./Class/Project"
import { ProjectsManager } from "./Class/ProjectsManager"

// For 3D
import * as THREE from "three"; // For 3D: Threejs
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"; // For simple Controls Interface in the scene
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"; // For the OBJ Loader
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"; // For the MTL file for where to apply the Materials (in the OBJ file)
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Fot GLTF files


// This "document" is provided by the Browser, the main purpose is to help us to interact with the DOM
// DOM = Bridge between the HTML structure and programming languages like JavaScript. It gives super power to webpages to interact with the user and other apps.




// _____________________________2. UTILITY FUNCTIONS__________________________________________________

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



// _______________________________3. DOM REFERENCES__________________________________________

// FORMS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// Get the forms by ID:
const userForm = document.getElementById("new_user_form")
const projectForm = document.getElementById("new_project_form")

const todoForm = document.getElementById("new_todo_form");



// BUTTONS :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// SIDEBAR__________________________________________________________
const btnUsers = document.getElementById("usersBtn");
const btnProjects = document.getElementById("projectsBtn");


	// NEW USER / PROJECT BUTTONS________________________________________
const btnCreateUser = document.getElementById("btn_create_user")
const btnCreateProject = document.getElementById("btn_create_project")


	// ERRORS___________________________________________________________________-
		// Get the Button Close Error Modal
const closeErrorModal = document.getElementById("close_error_modal")
		// Get the Elements for Errors:
const errorModal = document.getElementById("error_modal") // The Modal
const errorMessage = document.getElementById("error_message") // The Message


	// CANCEL BUTTONS IN FORMS_____________________________________________________
		// Get the Cancel button
const cancelUserBtn = document.getElementById("cancel_user")
const cancelProjectBtn = document.getElementById("cancel_project")

const cancelTodoBtn = document.getElementById("cancel_todo");


	// EDIT PRJ DETAILS BTN_____________________________________________________
const editProjectBtn = document.getElementById("btn_prj_details")

	// ADD TO-DO BTN__________________________________________________________
const btnCreateTodo = document.getElementById("btn_create_todo");


// CONTAINERS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// Get the Users list UI from the HTML file and check if exists
const usersListUI = document.getElementById("users_list")
if(!usersListUI) {throw new Error("userListUI does not exists")}

	// Get the Projects list UI from the HTML file and check if exists
const projectsListUI = document.getElementById("projects_list")
if(!projectsListUI) {throw new Error("projectListUI does not exists")}




// ____________________________________4. MANAGERS/ INSTANCES______________________________________________

	// Define the global action to change to Details page only ONCE
	const changeToUserDetailsPage = (selectedUser: User) => {
		navigateToPage("user_details_page"); 
		console.log(`Cambiando a la página de detalles de: ${selectedUser.name}`);
	};

	const changeToProjectDetailsPage = (selectedProject: Project) => {
		navigateToPage("project_details_page"); 
		console.log(`Cambiando a la página de detalles de: ${selectedProject.name}`);
	};
	
	// Create an Instance of UsersManager and ProjectsManager
const usersManager = new UsersManager(usersListUI, changeToUserDetailsPage);
const projectsManager = new ProjectsManager(projectsListUI, changeToProjectDetailsPage);

	// To know if is Edit or New Project in the Modal Form
let projectFormMode: "create" | "edit" = "create";

	// To storage the current project selected to edit
let editingProject: Project | null = null;


// ____________________________________5. EVENT LISTENERS______________________________________________

	// NEW USER / PROJECT TRIGGER BUTTONS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

		// For NEWUSER Button________________________________________________________________________
if(btnCreateUser){
	//	It "listens" the Event when Cliks the btn:
	//	Notice: the function passed is called automatiacally, 
	//		    therefore, it needs to create an ANONIMOUS FUNCTION to call the function previously created and be called after the Event
	btnCreateUser.addEventListener("click", () => {toggleForm("new_user_modal","open")}) 
}
else {console.warn("Button Create User is null")}



		// For NEWPROJECT Button ___________________________________________________________________
if(btnCreateProject){btnCreateProject.addEventListener("click", () => {

	// To provide the vars if is Edit or Create a new Project, to use the same form for both actions
	projectFormMode = "create";
	editingProject = null;
	toggleForm("new_project_modal","open")
})}
else{console.warn("Button Create Project is null")}



	// FOR USER FORM:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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
	})

	if(cancelUserBtn){
		cancelUserBtn.addEventListener("click", () => {
			userForm.reset();
			toggleForm("new_user_modal", "close");
			console.log("Form closed by the user. Data discarted")
		})
	}
	else{console.warn("Button Cancel was not found in the structure")};
}
else{console.warn("Form Id was not found. Check the ID form!")};



	// FOR PROJECT FORM:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		// Check if the Form exists and is an "HTMLFormElement:"
if (projectForm && projectForm instanceof HTMLFormElement){
	
		// Forms have an Event called "SUBMIT" when the project clicks one of the designated buttons
		//	also it passes data through the fn, to catch it is used the arg "e"
	projectForm.addEventListener("submit", (e) => {
		// To prevent the Default behavior which is to reload the page:
		e.preventDefault()
		
		// To create a new Instance of the Class FormData based on the element form previuosly found
		const formData = new FormData(projectForm)
		
		// NOTES: * To get any value of the Formdata element (it has to be named in the INPUT/SELECT container of the HTML file):
		//        * The fn .get() returns generally "string" type, no matter if you define the type in the HTML file
		
				
		// Definition of an Object based on the info from formData:
		//		NOTE: Using the word "as" is ONLY recommended when is 100% confirmed the dataype of the "conversion"
		//		
		//		**** to Use the LocalTimeZone of the USER ***
		const dateRaw = formData.get("finishDate") as string; // it comes "2026-03-30"
				// Check if is Null and To change the format To "2026/03/30"		
		const finishDateObj = dateRaw ? new Date(dateRaw.replace(/-/g, '\/')) : new Date();


		const projectObj: IProject = {

			name: formData.get("name") as string,
			description: formData.get("description") as string,
			userRole: formData.get("role") as UserRole,
			status: formData.get("status") as ProjectStatus,
			finishDate: new Date(finishDateObj), // Casted to Date type
			progress: Number(formData.get("progress")) // Casted to Number type
		}
		
		// To intercept the ERRORS:
		try{
				console.log("Mode:", projectFormMode);
				console.log("Project being edited:", editingProject);

				// Create a new User using the "usersManager" with the info of the userObject got from the Form
				// As usersManager already has the given FN to chg the pages, we can call it clean here
				//const project = projectsManager.newProject(projectObj)

				if(projectFormMode === "create"){

					console.log("Creating project...");

					const project = projectsManager.newProject(projectObj);

					console.log(project);
				}
				else if(editingProject){

					console.log("Editing project...");
					console.log("Project before edit:", editingProject); 
	/* 				console.log("El Projecto Que llega al ser EDITADO") // DEBUG
					console.log(projectObj); // DEBUG */	

					projectsManager.updateProject(
						editingProject,
						projectObj
					);
					console.log("Project After edit:", editingProject); 
				}

				projectFormMode = "create";
				editingProject = null;
				
				// To Clean up the Form after submitted
				projectForm.reset();
				
				// To close the Modal (Form)
				toggleForm("new_project_modal","close")
				
				// to print out in Console
				//console.log(project)
			
		}catch(error){
			// window.alert(error)

			if (error instanceof Error) {
				showError(error.message)
			} else {
				showError("Unknown error occurred")
			}
		}
	})

	if(cancelProjectBtn){
		cancelProjectBtn.addEventListener("click", () => {
			projectForm.reset();
			toggleForm("new_project_modal", "close");
			console.log("Form closed by the user. Data discarted")
		})
	}
	else{console.warn("Button Cancel was not found in the structure")};
}
else{console.warn("Form Id was not found. Check the ID form!")};



	// TO OPEN EDIT PRJCT/ USER MODAL:::::::::::::::::::::::::::::::::::::::::::::::::::::

		// For Edit Project Details Button
if(editProjectBtn){
	editProjectBtn.addEventListener("click", () => {

		console.log("Edit Project Button Clicked");
		// To change the mode of the Form to Edit
		projectFormMode = "edit";
		
		// To get the current selected project from the PM and check if exists
		const project = projectsManager.currentProject;
        if(!project){
            console.warn("No project selected");
            return;
        }

/* 		// TEMP__________________________________________
		project.addToDo({
			description: "My First Task",
			status: "Pending"
		}); */

		console.log("Project with new ToDo added:");
		console.log(project.toDos);
		// ______________________________________________


		// To storage the current project in a var to use it in the form
		editingProject = project;

		// To fill the form with the current project info:
		if(projectForm instanceof HTMLFormElement){

			(projectForm.elements.namedItem("name") as HTMLInputElement).value = project.name;

			(projectForm.elements.namedItem("description") as HTMLTextAreaElement).value = project.description;

			(projectForm.elements.namedItem("role") as HTMLSelectElement).value = project.userRole;

			(projectForm.elements.namedItem("status") as HTMLSelectElement).value =	project.status;

			(projectForm.elements.namedItem("progress") as HTMLInputElement).value = String(project.progress ?? 0);
		}

		console.log(project); // to DEBUG

		const modal = document.getElementById("new_project_modal");
        toggleForm("new_project_modal", "open");

	})
}
else{console.warn("Button Edit Project Details was not found in the structure")};



	// TO OPEN ADD TO-DO MODAL___________________________________________________________________
if(btnCreateTodo){
	btnCreateTodo.addEventListener("click", () => {

		const currentProject = projectsManager.currentProject;

		if(!currentProject){
			showError("Please select a project first");
			return;
		}

		toggleForm("new_todo_modal", "open");
	});
}


	// The SUBMIT of To-Do ______________________________________________________________________
if (todoForm && todoForm instanceof HTMLFormElement){

	todoForm.addEventListener("submit", (e) => {
		
		e.preventDefault() // To prevent the Default behavior which is to reload the page:


		const currentProject = projectsManager.currentProject;
        if (!currentProject) {
            showError("No active project found to add this task.");
            return;
        }

		const formData = new FormData(todoForm)
		// NOTES: * To get any value of the Formdata element (it has to be named in the INPUT/SELECT container of the HTML file):
		//        * The fn .get() returns generally "string" type, no matter if you define the type in the HTML file
		
				
		// Definition of an Object based on the info from formData:

				//NOTE: Using the word "as" is ONLY recommended when is 100% confirmed the dataype of the "conversion"

				//**** to Use the LocalTimeZone of the USER ***
				// Check if is Exists and To change the format To "2026/03/30"		
		const dateRaw = formData.get("todo_Date") as string; // it comes "2026-03-30"
		const todoDateObj = dateRaw ? new Date(dateRaw.replace(/-/g, '\/')) : new Date();


		const todoObj: IToDo = {

			description: formData.get("description") as string,
			status: formData.get("status") as ToDoStatus,
			todo_Date: todoDateObj // Casted to Date type BEFORE
		}
		
		// To intercept the ERRORS:
		try{
				
				console.log("To-Do being added:", todoObj); // To DEBUG

				// Agregamos el To-Do directamente a la instancia del proyecto seleccionado
            	currentProject.addToDo(todoObj);

				// Forzamos al manager a refrescar visualmente la vista de detalles del proyecto y sus tareas
           		 projectsManager.updateProject(currentProject, currentProject);

				
				
				// To Clean up the Form after submitted
				todoForm.reset();
				
				// To close the Modal (Form)
				toggleForm("new_todo_modal","close")

				console.log(`To-Do succesfully added to the Project: ${currentProject.name}`); // To DEBUG	
				console.log("Project afetr adding the To-Do:", currentProject); // To DEBUG
			
		}catch(error){
			if (error instanceof Error) {showError(error.message)}
			else {showError("Unknown error occurred")}
		}
	})
	
	// To Catch the Cancel Event
	if(cancelProjectBtn){
		cancelProjectBtn.addEventListener("click", () => {
			if(projectForm instanceof HTMLFormElement){
				projectForm.reset();
				toggleForm("new_project_modal", "close");
				console.log("Form closed by the user. Data discarted")
			}
		})
	}else{console.warn("Button Cancel was not found in the structure")};
}
else{console.warn("To-Do Form Id was not found. Check the ID form!")}



	// GLOBAL ERROR MODAL CLOSURE LISTENER:::::::::::::::::::::::::::::::::::::::::::::::::::::
	// to close the Error Dialog in the browser only ONCE for ALL Forms

if(closeErrorModal && errorModal instanceof HTMLDialogElement){
	closeErrorModal.addEventListener("click", () => {
		errorModal.close()
	})
}		


	// FOR JSON FILES :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

		// To Export JSON files USER_________________________________________
const exportUsersBtn = document.getElementById("export_users_btn");
if(!exportUsersBtn) {throw new Error("Export button does not exists")}
else{
		exportUsersBtn.addEventListener("click", () =>{
			usersManager.exportToJSON()
		})
	}

	// To Export JSON files PROJECT________________________________________
const exportProjectsBtn = document.getElementById("export_projects_btn");
if(!exportProjectsBtn) {throw new Error("Export button does not exists")}
else{
		exportProjectsBtn.addEventListener("click", () =>{
			projectsManager.exportToJSON()
		})
	}

	// To import JSON files USER____________________________________________
const importUsersBtn = document.getElementById("import_users_btn");
if(!importUsersBtn) {throw new Error("Import button does not exist")}
else{
		importUsersBtn.addEventListener("click", () =>{
			usersManager.importFromJSON();
		})
	}

	// To import JSON files PROJECT__________________________________________
const importProjectsBtn = document.getElementById("import_projects_btn");
if(!importProjectsBtn) {throw new Error("Import button does not exist")}
else{
		importProjectsBtn.addEventListener("click", () =>{
			projectsManager.importFromJSON();
		})
	}


	// SIDEBAR NAVIGATION: To Change Page from Buttons::::::::::::::::::::::::::::::::::::

		// For Users Btn____________________________________________________
if(!btnUsers) { throw new Error("Users Btn (sidebar) does not exist") }
else{
	btnUsers.addEventListener("click", () => {
		navigateToPage("users_list_page");
	})
}

		// For Projects Btn__________________________________________________
if(!btnProjects) { console.warn("Projects Btn (sidebar) does not exist") }
else{
	btnProjects.addEventListener("click", () => {
		navigateToPage("projects_list_page");
	})
}


// APP INITIAL PAGE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// To start by Default the page in the Projects List Page:
navigateToPage("projects_list_page");






// ________________________________ 3D VIEWER ________________________________________


/* const scene = new THREE.Scene(); // Creates a Scene

// Setting the camera:
const viewerContainer = document.getElementById("viewer_container") as HTMLElement; // Get the Viewer Container
(!viewerContainer)? console.log("Viewer container not found") : console.log("Viewer container obtained")
const containerDimensions = viewerContainer.getBoundingClientRect(); // Get the Size-info of the Container
const aspectRatio = containerDimensions.width / containerDimensions.height;
const camera = new THREE.PerspectiveCamera(75,aspectRatio);  // fov=75 the greater the angle the wider the camera show
camera.position.z = 5; // Changing camera position

// Fix: Force the camera to look at the center of the scene where the cube is
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer(); // The Cameraman = renderer

// The be able to see wath camera is "recording" in the ViewerContainer
viewerContainer.append(renderer.domElement) //renderer.domElement = its like a Monitor
renderer.setSize(containerDimensions.width, containerDimensions.height) // To match the size of the ViewerContainer

// Creating Objects to place in the scene
const boxGeometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial();

const cube = new THREE.Mesh(boxGeometry, material);

// Lightining
const directionalLight = new THREE.DirectionalLight(); // Acts like the sun (far distance light)
const ambientLight = new THREE.AmbientLight(); // Acts like the Indirect light of the world

// Adding to Scene
scene.add(cube, directionalLight, ambientLight) // Adding the Object and lights to the Scene

// Rendering
renderer.render(scene, camera); */


// ---------------------------------- OPCION 3 -----------------------------------------

// To WAIT until everything is "LOAD" 
window.addEventListener("load", () => {
    const viewerContainer = document.getElementById("viewer_container") as HTMLElement; 
    if (!viewerContainer) return;

    // 1. INITIALIZE THREE.JS CORE SCENE______________________________________________
    const scene = new THREE.Scene(); 
    const camera = new THREE.PerspectiveCamera(75);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true}); 
    viewerContainer.append(renderer.domElement);

    // Create scene actors using strictly your elements
    const boxGeometry = new THREE.BoxGeometry(); 
    const basicMaterial = new THREE.MeshStandardMaterial();
    const cube = new THREE.Mesh(boxGeometry, basicMaterial);
    
	
	const axes = new THREE.AxesHelper(); // Axes
	
	// Grid
	const grid = new THREE.GridHelper();
	grid.material.transparent = true;
	grid.material.opacity = 0.4;
	grid.material.color = new THREE.Color("#f1f1f1");
	
	// Controls Simple Interface:
	const gui = new GUI()
	
	// Cube
	const cubeControls = gui.addFolder("Cube"); // Create a place passing the folder's name to add the controls
	cubeControls.add(cube, "visible");
	cubeControls.addColor(cube.material, "color");
	cubeControls.add(cube.position, "x", -10,10,0.5); // Only add ONE property at a time
	cubeControls.add(cube.position, "y", -10,10,0.5); // Only add ONE property at a time
	cubeControls.add(cube.position, "z", -10,10,0.5); // Only add ONE property at a time

	
	// ...............................   LIGHTS   .........................................................
    
		// Ambient Light
	const ambientLight = new THREE.AmbientLight();
	ambientLight.intensity = 0.6;
	
		// Directional Light
    const directionalLight = new THREE.DirectionalLight(); 
	const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.5,"#a6ff00");

	const directionalLightControls = gui.addFolder("Directional Light");
	directionalLightControls.add(directionalLightHelper, "visible")
	directionalLightControls.addColor(directionalLightHelper, "color")
	directionalLightControls.add(directionalLight, "intensity", 0,5,0.1)
	directionalLightControls.add(directionalLight.position, "x", -20,20,0.5)
	directionalLightControls.add(directionalLight.position, "y", -20,20,0.5)
	directionalLightControls.add(directionalLight.position, "z", -20,20,0.5)

		// Spot Lighht
	const spotLight = new THREE.SpotLight();
	const spotLightHelper = new THREE.SpotLightHelper(spotLight);

	const spotLightControls = gui.addFolder("SpotLight");
	spotLightControls.add(spotLightHelper, "visible");
	spotLightControls.addColor(spotLight, "color");
	spotLightControls.add(spotLight.position, "x", -20,20,0.5)
	spotLightControls.add(spotLight.position, "y", -20,20,0.5)
	spotLightControls.add(spotLight.position, "z", -20,20,0.5)
	spotLightControls.add(spotLight, "intensity", 0,10,0.1);
	spotLightControls.add(spotLight, "distance", 0,100,0.1);
	spotLightControls.add(spotLight, "angle", 0,Math.PI/2,0.1);
	spotLightControls.add(spotLight, "penumbra", 0,1,0.1);
	spotLightControls.add(spotLight, "decay", 1,2,0.1);
    
	
		// ...........................Adding to the Scene..................................................
    scene.add(cube, directionalLight, ambientLight, axes, grid, directionalLightHelper, spotLight, spotLightHelper );
	
	
		// OBJ file
	const objLoader = new OBJLoader();
	const mtlLoader = new MTLLoader();

		// First Set the Materials and then Apply them to the obj
	mtlLoader.load("../Assets/Gear/Gear1.mtl", (materials) =>{
		materials.preload();
		objLoader.setMaterials(materials);
		objLoader.load("../Assets/Gear/Gear1.obj", (mesh) =>{
			// scene.add(mesh); // to Add the "group" of meshes of the file
		})
	})


		// GLTF File
	const gltfLoader = new GLTFLoader();
	gltfLoader.load("../Assets/Fosil/scene.gltf", (gltf) => {
		scene.remove(cube);
		const model = gltf.scene;
		scene.add(model);
	})



    // 2. INITIALIZE ORBIT CONTROLS _________________________________________________
    const cameraControls = new OrbitControls(camera, viewerContainer);

    // 3. DYNAMIC VIEWPORT RESIZE ENGINE ____________________________________________
    // This function now ONLY handles layout measurements
    function resizeViewer() {
        const width = viewerContainer.clientWidth;
        const height = viewerContainer.clientHeight;

        if (width === 0 || height === 0) return;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix(); 
    }

    // 4. INFINITE ANIMATION LOOP_____________________________________________________
    // This loops independently at 60fps to redraw the frame when the mouse moves
    function renderScene() {
        window.requestAnimationFrame(renderScene);

        // Required to tell the controls to evaluate mouse/touch dragging
        cameraControls.update();

		// For Lights Helpers Updates
		directionalLightHelper.update();
		spotLightHelper.update();

        // Take the snapshot of the scene
        renderer.render(scene, camera);
    }

    // 5. OBSERVERS & TRIGGERS __________________________________________________________
    const resizeObserver = new ResizeObserver(() => {
        resizeViewer();
    });
    resizeObserver.observe(viewerContainer);
    
    // Initial triggers to start the app
    resizeViewer();
    
    // Start the animation engine!
    renderScene();
});