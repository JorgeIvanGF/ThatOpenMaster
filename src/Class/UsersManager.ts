
// IMPORTS___________________________________________________________
import { User, IUser, roleType, statusType } from "./User";



// CLASS____________________________________________________________
export class UsersManager{

	//	PROPERTIES................................

	list: User[] = [];	//	Define the Property List of users
	ui: HTMLElement; 	// The container to storage all the users cards created
	private onUserClickCallback?: (user: User) => void; // To save the action in a centralized way

	//	METHODS...................................

	// Constructor:
	constructor(container:HTMLElement, onUserClick?: (user: User) => void){
		this.ui = container;
		this.onUserClickCallback = onUserClick; // Guardamos la acción
		this.createDefUser();
	}

	// To Create the Default User
	private createDefUser():void{
		const userDefData:IUser = {
			name:"Default",
			username:"Default",
			role:"Architect",
			status:"Active",
			email:"Default",
			telephone:0
		}
		this.newUser(userDefData);
	}

	//	To create a new user, push it to the List and append it to the container of the browser.
	newUser(data: IUser):User{
		// To create a list with the names of the users using "map"
		const usersNames = this.list.map((userIterated)=>{
			return userIterated.name
		})
		// To check if  the name of the new User exists in List of Names.
		const nameInUse = usersNames.includes(data.name)
		// If Exisst => Throw new Error
		if(nameInUse) {throw new Error(`An user with the name "${data.name}" already exists`)}
 
		// Create a new const to storage the new User
		const user = new User(data)
		// Guard clause to protect the DOM from null values of the UI Container
		if (!user.ui) {throw new Error("Cannot append a user card that has no UI defined.")}
		// Now we know 100% that user.ui is NOT null

		// ONLY works If the USER clicks on an user
		if(this.onUserClickCallback){
			user.ui.addEventListener("click", () => {
				this.setUserDetailsPage(user); // To fill the info with the Details of the selected user
				this.onUserClickCallback!(user); // the "!" to assure the FN exists. To execute the page change
			})
		}

		this.ui.append(user.ui) // To place and Show it in the Browser Container
		this.list.push(user); // "push" to insert a new object in the List (array)
		return user;
	}


	// To get a specific User from the List:
	//		ALL Array Iterator Methods (like Find) require a CALLBACK function as an arg.
	getUser(id:string){
		const userFound = this.list.find((userIterated)=>{
			return userIterated.id === id // To see if Match teh ID or not
		})
		return userFound;
	}

	
	getUserByName(name:string){
		const userFound = this.list.find((userIterated)=>{
			return userIterated.name === name;
		})
		return userFound;
	}

	deleteUser(id:string){
		// To delete the UI (render) in the Browser
		const user = this.getUser(id);
		if(!user){return}
		user.ui?.remove()
		
		// To update the list with the remining Users
		const remaining = this.list.filter((userIterated)=>{
			return userIterated.id !== id;
		})
		this.list = remaining;
	}

	// To Export as JSON file
	exportToJSON(fileName:string = "users"){  // Note: the "=" in the arg refers as a Default value if None is provided.
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
			const users:IUser[] = JSON.parse(json as string)
			for (const user of users){ // Note: it uses "OF" bc is iterating through an ARRAY
				try{
					this.newUser(user);
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


	// To show the selected user details info
	private setUserDetailsPage(user : User){
		// get the Reference of the Master Element that contains the element targeted
		const userDetailsPage = document.getElementById("user_details_page");
		if(!userDetailsPage) {return}

		// Select the custom attribute created in the HTML
		const name = userDetailsPage.querySelector("[data-user-info='name']")
		if(name) {name.textContent = user.name }

		// Change the Info
		this.changeDetails(user)


	}

	// Helper
	private changeDetails(user:User){
		// Get Details:
		const userTitle = document.querySelector('[data-title-user="title"]')
		const userSubtitle = document.querySelector('[data-subtitle-user="subtitle"]')
		const role = document.querySelector('[data-field="role"]')
		const status = document.querySelector('[data-field="status"]')
		const email = document.querySelector('[data-field="email"]')
		const telephone = document.querySelector('[data-field="telephone"]')

		// Changes
		if(userTitle){userTitle.textContent = user.name}
		if(userSubtitle){userSubtitle.textContent = user.username}
		if(role) {role.textContent = user.role};
		if(status) {status.textContent = user.status};
		if(email) {email.textContent = user.email};
		if(telephone) {telephone.textContent = String(user.telephone)};
		
	}


}
