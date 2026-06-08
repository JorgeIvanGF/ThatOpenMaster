// IMPORTS___________________________________________________________
import { Project, IProject, UserRole, ProjectStatus, IToDo, ToDoStatus } from "./Project";

// CLASS____________________________________________________________
export class ProjectsManager{

	//	PROPERTIES................................

	list: Project[] = [];	//	Define the Property List of users
	ui: HTMLElement; 	// The container to storage all the users cards created
	private onProjectClickCallback?: (project: Project) => void; // To save the action in a centralized way
	currentProject: Project | null = null; // To keep track of the currently selected project (if any)


	//	METHODS...................................
	
	// Constructor with initialization and dynamic auto-click 🚀
	constructor(container: HTMLElement, onProjectClick?: (project: Project) => void) {
		this.ui = container;
		this.onProjectClickCallback = onProjectClick; // 1. Save the callback action first

		// 2. Create the default project 
		const project = this.newProject({
			name: "Default Project",
			description: "This is just a default app project",
			status: "Pending",
			userRole: "Architect", 
			finishDate: new Date(),
			progress: 10,
			toDos: []
		});

		// 3. Simulate an immediate click to synchronize UI and app state
		if (project && project.ui) {
			project.ui.click();
		}
	}

		// New Project
	newProject(data : IProject) : Project {

		// To validate that the name is not empty or has at least 5 characters, otherwise assign "Untitled Project" as default name
		if (!data.name || data.name.trim().length < 5) {
			throw new Error("Project name must be at least 5 characters long.");
		}

		// To create a list with the names of the projects using "map"
		const projectsNames = this.list.map((projectIterated)=>{
			return projectIterated.name
		})
		// To check if  the name of the new User exists in List of Names.
		// If Exist => Throw new Error
		const nameInUse = projectsNames.includes(data.name)
		if(nameInUse) {throw new Error(`A project with the name "${data.name}" already exists`)}

		// Create a new const to storage the new Project
		const project = new Project(data)
		// Guard clause to protect the DOM from null values of the UI Container
		if (!project.ui) {throw new Error("Cannot append a project card that has no UI defined.")}
		// Now we know 100% that project.ui is NOT null

		// ONLY works If the USER clicks on an Project
		if(this.onProjectClickCallback){
			project.ui.addEventListener("click", () => {
				this.currentProject = project;
				this.setProjectDetailsPage(project); // To fill the info with the Details of the selected user
				this.onProjectClickCallback!(project); // the "!" to assure the FN exists. To execute the page change
			})
		}

		this.ui.append(project.ui) // To place and Show it in the Browser Container (in DOM)
		this.list.push(project); // "push" to insert a new object in the List(array) (in MEMORY)
		return project;
	};

		// To show the selected Project details info
	private setProjectDetailsPage(project : Project){

		// get the Reference of the Master Element that contains the element targeted
		const projectDetailsPage = document.getElementById("project_details_page");
		if(!projectDetailsPage) {return}

		// Select the custom attribute created in the HTML
		const name = projectDetailsPage.querySelector("[data-project-info='name']")
		if(name) {name.textContent = project.name }

		// Change the Info
		this.changeProjectDetails(project)
	}


		// Update the project details page with the info of the modified project
	updateProject(project: Project, data: IProject): void {

		project.name = data.name;
		project.description = data.description;
		project.userRole = data.userRole;
		project.status = data.status;		
		project.progress = data.progress;

		// To force finishDate becomes Date Obj
		if (data.finishDate) {
			const parsedDate = new Date(data.finishDate);
			// If its Not valid => new date.
			project.finishDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
		} else {
			project.finishDate = new Date();
		}


		// if data comes from a Project or JSON file
		if (data.toDos && Array.isArray(data.toDos)) {
			if (data === project) {
				// Do Nothing
			} else {
				// from JSON file (iterating)
				data.toDos.forEach(newTodo => {
					// Check if already exists
					const existingTodo = project.toDos.find(t => t.description.toLowerCase() === newTodo.description.toLowerCase());
					
					if (existingTodo) {
						//Update teh info
						existingTodo.status = newTodo.status;
						existingTodo.todo_Date = newTodo.todo_Date;
					} else {
						// If its new
						project.addToDo(newTodo);
					}
				});
			}
		}

		// Update UI card Info
		project.refreshUI();

		// Refresh details page if this is the selected project
		if(this.currentProject === project){
			this.setProjectDetailsPage(project);
		}
	}

		// Helper
	private changeProjectDetails(project : Project){

		// Select the custom attributes created in the HTML:

			// For Header details page:
		const title = document.querySelector('[data-project-info="title"]')
		const description = document.querySelector('[data-project-info="description"]')

			// For the color of the initials in the details page:
			// Get the container initials
		const pageInitials = document.querySelector('#project_details_page [data-project-info="initials"]') as HTMLElement | null;

			// For the rest of details:
		const projectTitle = document.querySelector('[data-title-project="title"]')
		const projectSubtitle = document.querySelector('[data-subtitle-project="subtitle"]')
		const cost = document.querySelector('[data-field-project="cost"]')
		const role = document.querySelector('[data-field-project="role"]')
		const status = document.querySelector('[data-field-project="status"]')
		const finishDate = document.querySelector('[data-field-project="finish-date"]')

			// For the Progress Bar
		const progressBar = document.querySelector('[data-field-project="progress-bar"]') as HTMLElement | null
		const progressText = document.querySelector('[data-field-project="progress-text"]')
		
			// Changes
		if(title){title.textContent = project.name}
		if(description){description.textContent = project.description}
		
		if(projectTitle){projectTitle.textContent = project.name}
		if(projectSubtitle){projectSubtitle.textContent = project.description}
		if(cost) {cost.textContent = `$${project.cost}`};
		if(role) {role.textContent = project.userRole};
		if(status) {status.textContent = project.status};
		if(finishDate) {finishDate.textContent = project.finishDate.toLocaleDateString()};
		
			// For Initials and color in the details page:
		if (pageInitials) {
			// Calculate the initials (same as in project card):
			const words = project.name.trim().split(/\s+/);
			const initials = words.length > 1 
				? (words[0][0] + words[1][0]).toUpperCase()
				: project.name.substring(0, 2).toUpperCase();

			pageInitials.textContent = initials; // Pone las letras correctas
			pageInitials.style.backgroundColor = project.color; // 🚀 Aplica exactamente el mismo color guardado
		}


		// For the Progress Bar (if exist, because is optional in the HTML)
		const percentage = project.progress !== undefined && project.progress !== null ? project.progress : 0;
		const percentageString = `${percentage}%`;
		// Change the style of the progress bar and the text that shows the percentage
		if (progressBar) {progressBar.style.width = percentageString};
		if (progressText) {progressText.textContent = percentageString};

		// To RENDER the TO-DOs of the Project
		this.renderToDos(project);

	}


	// To render and update the DOM of the containers
	private renderToDos(project: Project): void {
		const todoContainer = document.getElementById("todo_list_container"); 
		if (!todoContainer) {
			console.warn("Todo container element ('#todo_list_container') was not found in the DOM.");
			return;
		}

		// Limpiar el HTML residual de tareas anteriores
		todoContainer.innerHTML = "";

		if (project.toDos.length === 0) {
			todoContainer.innerHTML = `<p style="color: #b7b7b7; font-style: italic; padding: 10px;">No tasks assigned yet.</p>`;
			return;
		}

		project.toDos.forEach(todo => {
			const todoItem = document.createElement("div");
			todoItem.className = "to-do_Item"; // Hereda tus clases y reglas CSS
			let color = "#b7b7b7";
			if (todo.status==="Pending") {color="#ff6b6b"}
			if (todo.status==="In Progress") {color="#ffb703"}
			if (todo.status==="Done") {color="#30e7a1"}
			
			todoItem.innerHTML = `
			  	<div data-todo-view="general" style="display: flex; justify-content: space-between; align-items: center;">
					<div>
						<p style="font-weight: bold; color: white; margin: 0;">${todo.description}</p>
						<p style="font-size: 13px; color: #999797; margin: 4px 0 0 0;">Due: ${new Date(todo.todo_Date).toLocaleDateString()}</p>
					</div>
					<span class="todo-status-badge" style="cursor: pointer; padding: 2px 8px; border-radius: 20px; font-size: 11px; background-color:${color}">
						${todo.status}
					</span>
				</div>
			`;

			// Event Listener dinámico para alternar y actualizar estados
			const badge = todoItem.querySelector(".todo-status-badge");
			if (badge) {
				badge.addEventListener("click", () => {
					// Ciclo de estados dinámicos: Pending -> In Progress -> Done -> Pending
					if (todo.status === "Pending") { todo.status = "In Progress"; }
					else if (todo.status === "In Progress") { todo.status = "Done"; }
					else { todo.status = "Pending"; }
					
					// Forzar el redibujado completo para que cambie el color de fondo e info en tiempo real
					this.updateProject(project, project);
				});
			}
			todoContainer.append(todoItem);
		});
	}


		// To Export as JSON file
	exportToJSON(fileName:string = "projects"){  // Note: the "=" in the arg refers as a Default value if None is provided.
		// To convert into JSON format
		const json = JSON.stringify(this.list, null, 2)
		
		// To be able to download the JSON file created is needed to use a BLOB (container of binary data)
		const blob = new Blob([json], {type:'application/json'})

		// To create the temporary URL to download the file
		const url = 	URL.createObjectURL(blob);

		// To create a temporary "GHOST" HTML element when click => download the file
		const a = document.createElement('a');

		// To set the url previously created
		a.href = url;

		// To set the name of the file to be downloaded (comes from the arg)
		a.download = fileName.endsWith(".json") ? fileName : `${fileName}.json`;

		// To SIMULATE the click on the btn to start the download
		a.click();

		// To Clean Up the URL (previously created) afer used (when "click" and download)
		URL.revokeObjectURL(url);

	}

		// To Import from JSON file
	importFromJSON(){
		const input = document.createElement("input");
		input.type='file';
		input.accept='application/json';
		const reader = new FileReader();


		// Register the Event when reader finishes the reading of the file
		reader.addEventListener('load', () =>{
			const json = reader.result;
			if(!json) {return}

			try {
				const projects: IProject[] = JSON.parse(json as string)
				
				for (const projectData of projects){ 

					// Verificar si el proyecto ya existe por su nombre en la lista en memoria
					const existingProject = this.list.find(p => p.name.toLowerCase() === projectData.name.toLowerCase());
					
					if (existingProject) {
						// Si ya existe, se sobreescribe/actualiza con la nueva información del JSON
						console.log(`El proyecto "${projectData.name}" ya existe. Actualizando datos e incluyendo To-Dos...`);
						this.updateProject(existingProject, projectData);
					} else {
						// Si es nuevo, se crea normalmente
						this.newProject(projectData);
					}
				}
			} catch (error) {
				console.error("Error while processing the JSON file:", error);
			}
		})


		// Register when the user have selected a file to upload.
		input.addEventListener('change', () =>{
			const filesList = input.files
			if(!filesList || filesList.length === 0){return}
			reader.readAsText(filesList[0])
		})


		// When the real "action" begins
		input.click();       
	}

}