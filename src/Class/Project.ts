

// IMPORTS
import{v4 as uuidv4} from 'uuid'; // To use the UUID generator

// Creation of SPECIFIC TYPES.............................................................................
export type ProjectStatus = "Pending" | "Active" | "Finished"
export type UserRole = "Architect" | "Engineer" | "Developer"

// Interface
export interface IProject {
	name: string
	description: string
	status: ProjectStatus
	userRole: UserRole
	finishDate: Date
	id?: string //optional, because it will be generated in the constructor if not provided
	progress?: number // Optional, because it will be added later in the process
}


// The Class itself
export class Project implements IProject {
	//To satisfy IProject
	name: string
	description: string
	status: "Pending" | "Active" | "Finished"
	userRole: "Architect" | "Engineer" | "Developer"
	finishDate: Date
	progress?: number // Optional, because it will be added later in the process
	
	//Class internals
	ui: HTMLDivElement
	cost: number = 10
	id: string

	// Constructor
	constructor(data: IProject) {
	this.name = data.name
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
	
	this.ui = this.setUI();

 	}

	// Creates the Project Card UI
	setUI():HTMLDivElement {
	if (this.ui) {throw new Error("UI already exists")}
	this.ui = document.createElement("div")
	this.ui.className = "project_card"


// 🚀 CÁLCULO DINÁMICO DE INICIALES:
	// Si tiene más de una palabra ("Planta Solar"), toma las dos primeras letras: "PS"
	// Si es una sola palabra ("Casa"), toma sus dos primeras letras en mayúscula: "CA"
	const words = this.name.trim().split(/\s+/);
	const initials = words.length > 1 
		? (words[0][0] + words[1][0]).toUpperCase()
		: this.name.substring(0, 2).toUpperCase();

	this.ui.innerHTML = `
	<div class="card_header">
		<p data-project-info="initials">${initials}</p>
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
}