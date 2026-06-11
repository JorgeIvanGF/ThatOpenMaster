
// IMPORTS
import * as React from "react"; // React

export function Sidebar(){
	return(
		
		<aside id="sidebar">
			<img id="company-logo" src="./Assets/companylogo.svg" alt="Construction Company logo"/>
			<ul id="nav-list"> 
				<li className="nav-item">
					<button type="button" className="nav-button" id="projectsBtn">
						<span className="material-icons-outlined">computer</span>
						<span className="button-text">Projects</span>
					</button>
				</li>
				<li className="nav-item">
					<button type="button" className="nav-button" id="usersBtn">
						<span className="material-icons-outlined">how_to_reg</span>
						<span className="button-text">Users</span>
					</button>
				</li>
			</ul>
		</aside>
	)
}