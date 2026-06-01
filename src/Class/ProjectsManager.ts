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
			finishDate: new Date()
		}
		this.newProject(projecDefData);
	}

		// New Project
	newProject(data : IProject) : Project {
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
				this.setUserDetailsPage(user); // To fill the info with the Details of the selected user
				this.onProjectClickCallback!(project); // the "!" to assure the FN exists. To execute the page change
			})
		}

	};
