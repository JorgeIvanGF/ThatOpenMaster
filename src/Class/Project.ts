

// IMPORTS
import{v4 as uuidv4} from 'uuid'; // To use the UUID generator

// Creation of SPECIFIC TYPES.............................................................................
export type ProjectStatus = "Pending" | "Active" | "Finished"
export type UserRole = "Architect" | "Engineer" | "Developer"
export type ToDoStatus = "Pending" | "In Progress" | "Done"

// Interfaces

	// IProject: This interface defines the structure of a Project)_______________________________________
export interface IProject {
	name: string
	description: string
	status: ProjectStatus
	userRole: UserRole
	finishDate: Date
	id?: string //optional, because it will be generated in the constructor if not provided
	progress?: number // Optional, because it will be added later in the process
	toDos?: IToDo[] 
}

	// IToDo: This interface defines the structure of a To-Do item)_______________________________________
export interface IToDo {
	//title: string
	description: string
	status: ToDoStatus
	id?: string //optional, because it will be generated in the constructor if not provided
	todo_Date: Date
}

// Array defining a set of initial colors for project cards, which can be used to style the UI elements dynamically.
const INITIAL_COLORS = [
    "#30e7a1", // Verde brillante (el que ya tenías)
    "#ff6b6b", // Coral / Rojo suave
    "#4ea8de", // Azul cielo
    "#ffb703", // Amarillo / Naranja cálido
    "#9d4edd", // Morado pastel
    "#ff85a1"  // Rosado
];


// The Class itself
export class Project implements IProject {

	// PROPERTIES::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	//To satisfy IProject
	name: string
	description: string
	status: "Pending" | "Active" | "Finished"
	userRole: "Architect" | "Engineer" | "Developer"
	finishDate: Date
	progress?: number // Optional, because it will be added later in the process
	toDos: IToDo[] // To store the list of ToDos related to the project
	
	//Class internals
	ui: HTMLDivElement
	cost: number = 10
	id: string
	color: string


	// METHODS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// Constructor______________________________________________________________
	constructor(data: IProject) {

		// if the name is empty or only spaces or less than 5 characters, assign "Untitled Project" as default name, otherwise use the provided name
		this.name = data.name && data.name.trim().length >= 5 ? data.name : "Untitled Project";
		this.description = data.description
		this.status = data.status
		this.userRole = data.userRole
		this.progress = data.progress
		
		// **PREV: this.finishDate = data.finishDate instanceof Date ? data.finishDate : new Date(data.finishDate);
		
		// Double check for dates come from JSON as strings, so we need to convert them to Date objects
		if (data.finishDate) {
		const parsedDate = new Date(data.finishDate);
		this.finishDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
		}
		else {this.finishDate = new Date()} // Default to current date if not provided

		// **PREV: this.id = uuidv4()
		this.id = data.id || uuidv4(); // Opcional: mantiene el ID original si venía en el JSON
		

		// To assign a random color from the INITIAL_COLORS array to each project card
		// Color assignment based on the project ID to ensure consistent colors for the same project across sessions:
		let charCodeSum = 0;
        for (let i = 0; i < this.id.length; i++) {
            charCodeSum += this.id.charCodeAt(i);
        }
        const colorIndex = charCodeSum % INITIAL_COLORS.length;
        this.color = INITIAL_COLORS[colorIndex]; // Store the assigned color in the project instance

		// If no ToDos are provided, initialize an empty array
		this.toDos = data.toDos || [];

		this.ui = this.setUI();
 	}

	// Creates the Project Card UI___________________________________________________________
	setUI():HTMLDivElement {

		if (this.ui) {throw new Error("UI already exists")}
		this.ui = document.createElement("div")
		this.ui.className = "project_card"


		// Calculate the initials for the project card:
		const words = this.name.trim().split(/\s+/);
		const initials = words.length > 1 
			? (words[0][0] + words[1][0]).toUpperCase()
			: this.name.substring(0, 2).toUpperCase();

		this.ui.innerHTML = `
		<div class="card_header">
			<p data-project-info="initials" 
			style="background-color:${this.color}"> ${initials}
			</p>
			<div>
			<h5>${this.name}</h5>
			<p data-project-info="description-cards">${this.description}</p>
			</div>
		</div>
		<div class="card_content">
			<div class="card_property">
			<p style="color: #b7b7b7;">Status</p>
			<p>${this.status}</p>
			</div>
			<div class="card_property">
			<p style="color: #b7b7b7;">Role</p>
			<p>${this.userRole}</p>
			</div>
			<div class="card_property">
			<p style="color: #b7b7b7;">Cost</p>
			<p>$${this.cost}</p>
			</div>
			<div class="card_property">
			<p style="color: #b7b7b7;">Progress</p>
			<p>${this.progress}%</p>
			</div>
		</div>`
		return this.ui;
	}


	// To update the project with new data and refresh the UI accordingly_________________________________
	refreshUI(): void {

		const title = this.ui.querySelector("h5");
		const description = this.ui.querySelector('[data-project-info="description-cards"]');
		const properties = this.ui.querySelectorAll(".card_property p:last-child");
		const initialsElement = this.ui.querySelector('[data-project-info="initials"]');


		if(title){title.textContent = this.name}
		if(description){description.textContent = this.description}

		if(properties[0]){properties[0].textContent = this.status}

		if(properties[1]){properties[1].textContent = this.userRole}

		if(properties[3]){properties[3].textContent = `${this.progress}%`}

		if(initialsElement){

			const words = this.name.trim().split(/\s+/);

			const initials = words.length > 1
				? (words[0][0] + words[1][0]).toUpperCase()
				: this.name.substring(0, 2).toUpperCase();

			initialsElement.textContent = initials;
		}
	}


	// ToDos Management Methods ---------------------------------------------------------

	// To add a new ToDo to the project____________________________________________________
	addToDo(todo: IToDo): void {

		// To Sanitize and handle To-Do Dates(from JSON files)
		let processedDate = new Date();
		if (todo.todo_Date) {
			const parsedDate = new Date(todo.todo_Date);
			processedDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
		}

		this.toDos.push({

			...todo,
			id: todo.id || uuidv4(),
			todo_Date: processedDate,

			/* ----NOTE----:its the SAME as:
			description: todo.description,
			status: todo.status,
			id: todo.id || uuidv4()
			todo_Date: todo.todo_Date */
		
		});
	}

	// To Get a specific ToDo by its ID__________________________________________________
	getToDo(id: string): IToDo | undefined {

		return this.toDos.find(todo => todo.id === id);
	}

}