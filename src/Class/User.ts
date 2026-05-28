
// IMPORTS
import{v4 as uuidv4} from 'uuid'; // To use the UUID generator


// Creation of SPECIFIC TYPES.............................................................................
export type roleType = "Architect" | "Engineer" | "Teacher"
export type statusType = "Active" | "Inactive"


// THE INTERFACE........................................................................................
// 		To create the Interface for the datatypes of the properties of the class:
//		Interfaces describe Objects Datatypes.

export interface IUser{
	
	// in Typescript the dataType of args must be explicit.
	role: roleType
	status: statusType
	name: string
	username: string
	email: string
	telephone: number
}


// THE CLASS ............................................................................................ 
//		To be able to use the class in another file, it must have the "export" word before the definition
//		A Class could be seen as an Object Template.
//		Adding the "implements" it ensures the class MUST HAVE ALL the data created in the Interface

export class User implements IUser{

	// In Typescript the dataType of args must be explicit.

	// PROPERTIES................................................
	// Properties to satisfy the Iuser Interface:
	role: roleType
	status: statusType
	name: string
	username: string
	email: string
	telephone: number

	// Properties internals (created within the Class):
	ui: HTMLDivElement | null = null; // for the container Div of the UI, let it to be initially assigned null
	id: string;


	// CONSTRUCTOR................................................
	constructor(data:IUser) { 
		this.role = data.role
		this.status = data.status
		this.name = data.name
		this.username = data.username
		this.email = data.email
		this.telephone = data.telephone
		this.id = uuidv4() // To create the UUID
		this.setUI() // To call the Method and create the UI Card		
	}

	// constructor(data: IUser) { 
    // Object.assign(this, data); // 🚀 Limpio, rápido y sin errores de 'never'
	// }


	// To define a METHOD to create the UI.............................................................................
	//           NOTE: without using the keyword "function" bc is inside the Class 
	//                (it already knows is a function)
	setUI() {
			// To check if UI is already define:
			if(this.ui) {return}

			// To create DivElement through DOM:
			this.ui = document.createElement("div") 
			// To define the Class of the element:
			this.ui.className = "info_users_card"
			// To define the structure of the content of the element:
			this.ui.innerHTML= `		
			<div><p>${this.role}</p></div>
			<div><p>${this.status}</p></div>
			<div><p>${this.name}</p></div>
			<div><p>${this.username}</p></div>
			<div><p>${this.email}</p></div>
			<div><p>${this.telephone}</p></div>
			`
		}


// *************************************The SETUP the CARDS OF PROJECTS *****************************************************
/* 	setUI() {
		// To check if UI is already define:
		if(this.ui) {return}

		// To create DivElement through DOM:
		this.ui = document.createElement("div") 
		// To define the Class of the element:
		this.ui.className = "project_card"
		// To define the structure of the content of the element:
		this.ui.innerHTML= `
		<div class="card_header"> <!-- for header card -->
			<p style="background-color: #c86918;padding: 10px;border-radius: 6px;aspect-ratio: 1;">HC</p> <!-- for the Initials -->
			<div> <!-- for name and role -->
				<h5>${this.name}</h5>
				<p style="font-size: 12px;">${this.username}</p>
			</div>
		</div>
		<div class="card_content"> <!-- for Content Card -->
			<div class="card_property">
				<p style="color: gray;">Role</p>
				<p>${this.role}</p>
			</div>
			<div class="card_property"> 
				<p style="color: gray;">Status</p>
				<p>${this.status}</p>
			</div>
			<div class="card_property">
				<p style="color: gray;">Email</p>
				<p>${this.email}</p>
			</div>
			<div class="card_property">
				<p style="color: gray;">Telephone</p>
				<p>${this.telephone}</p>
			</div>
		</div>
		`
	} */
// ***********************************************************************************************************************
	
}