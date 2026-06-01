

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
}


// The Class itself
export class Project implements IProject {
	//To satisfy IProject
	name: string
	description: string
	status: "Pending" | "Active" | "Finished"
	userRole: "Architect" | "Engineer" | "Developer"
	finishDate: Date
	
	//Class internals
	ui: HTMLDivElement
	cost: number = 10
	progress: number = 0
	id: string

	// Constructor
	constructor(data: IProject) {
	this.name = data.name
    this.description = data.description
    this.status = data.status
    this.userRole = data.userRole
    this.finishDate = data.finishDate
	this.id = uuidv4()
	this.ui = this.setUI()
 	}

	//creates the project card UI
	setUI():HTMLDivElement {
	if (this.ui) {throw new Error("UI already exists")}
	this.ui = document.createElement("div")
	this.ui.className = "project_card"
	this.ui.innerHTML = `
	<div class="card_header">
		<p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1;">HC</p>
		<div>
		<h5>${this.name}</h5>
		<p>${this.description}</p>
		</div>
	</div>
	<div class="card-content">
		<div class="card-property">
		<p style="color: #969696;">Status</p>
		<p>${this.status}</p>
		</div>
		<div class="card-property">
		<p style="color: #969696;">Role</p>
		<p>${this.userRole}</p>
		</div>
		<div class="card-property">
		<p style="color: #969696;">Cost</p>
		<p>$${this.cost}</p>
		</div>
		<div class="card-property">
		<p style="color: #969696;">Estimated Progress</p>
		<p>${this.progress * 100}%</p>
		</div>
	</div>`
	return this.ui;
	}
}