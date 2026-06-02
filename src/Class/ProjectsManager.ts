// IMPORTS___________________________________________________________
import { Project, IProject, UserRole, ProjectStatus } from "./Project";

// CLASS____________________________________________________________
export class ProjectsManager{

	//	PROPERTIES................................

	list: Project[] = [];	//	Define the Property List of users
	ui: HTMLElement; 	// The container to storage all the users cards created
	private onProjectClickCallback?: (project: Project) => void; // To save the action in a centralized way
	

	//	METHODS...................................
	
		// Constructor:
	constructor(container:HTMLElement, onProjectClick?: (project: Project) => void){
		this.ui = container;
		this.onProjectClickCallback = onProjectClick; // Guardamos la acción
		this.createDefProject();
	}

		// To Create the Default Project
	private createDefProject():void{
		const projecDefData:IProject = {
			name:"Default",
			description:"Default",
			userRole:"Architect",
			status:"Active",
			finishDate: new Date(),
			progress: 10
		}
		this.newProject(projecDefData);
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
		const nameInUse = projectsNames.includes(data.name)
		// If Exisst => Throw new Error
		if(nameInUse) {throw new Error(`A project with the name "${data.name}" already exists`)}

		// Create a new const to storage the new User
		const project = new Project(data)
		// Guard clause to protect the DOM from null values of the UI Container
		if (!project.ui) {throw new Error("Cannot append a project card that has no UI defined.")}
		// Now we know 100% that project.ui is NOT null

		// ONLY works If the USER clicks on an Project
		if(this.onProjectClickCallback){
			project.ui.addEventListener("click", () => {
				this.setProjectDetailsPage(project); // To fill the info with the Details of the selected user
				this.onProjectClickCallback!(project); // the "!" to assure the FN exists. To execute the page change
			})
		}

		this.ui.append(project.ui) // To place and Show it in the Browser Container
		this.list.push(project); // "push" to insert a new object in the List (array)
		return project;
	};

	// To show the selected user details info
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

	// Helper
		private changeProjectDetails(project : Project){
			
			// To select the custom attributes created in the HTML

			// For Header details page:
			const title = document.querySelector('[data-project-info="title"]')
			const description = document.querySelector('[data-project-info="description"]')

			// For the color of the initials in the details page:
			// 🚀 NUEVO: Seleccionar el contenedor de iniciales de la PÁGINA DE DETALLES
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
			a.download = fileName;

			// To SIMULATE the click on the btn to start the download
			a.click();

			// To Clean Up the URL (previously created) afer used (when "click" and download)
			URL.revokeObjectURL(url);

		}


		importFromJSON(){
			const input = document.createElement("input");
			input.type='file';
			input.accept='application/json';
			const reader = new FileReader();
	
	
			// Register the Event when reader finishes the reading of the file
			reader.addEventListener('load', () =>{
				const json = reader.result;
				if(!json) {return}
				const projects:IProject[] = JSON.parse(json as string)
				for (const project of projects){ // Note: it uses "OF" bc is iterating through an ARRAY
					try{
						this.newProject(project);
					} catch(error){
	
					}
				}
			})
	
			// Register when the user have selected a file to upload.
			input.addEventListener('change', () =>{
				const filesList = input.files
				if(!filesList){return}
				reader.readAsText(filesList[0])
			})
	
			// When the real "action" begins
			input.click();		 
		}

	}