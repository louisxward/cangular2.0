import { Injectable } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Store } from '@ngxs/store'
import PocketBase from 'pocketbase'
import { ApiService } from 'src/app/Core/services/api/api.service'

export interface User {
	id: string
	username: string
	email: string | null
	lastLoggedIn: string | null
}

export interface UserList {
	id: string
	username: string
	email: string | null
}

export interface UserListSearch {
	id: FormControl<string | null>
	username: FormControl<string | null>
}

@Injectable()
export class UserService {
	pb: PocketBase

	constructor(private store: Store, private apiService: ApiService) {
		this.pb = apiService.pb
	}

	getUser(id: string) {
		return this.pb
			.collection('users')
			.getOne<User>(id, {})
			.catch((error) => {
				console.error(error)
				return null
			})
	}

	getResults(page: number, max: number, filter: string) {
		return this.pb
			.collection('users')
			.getList<UserList>(page, max, { filter: filter })
			.catch((error) => {
				console.error(error)
				return null
			})
	}
}
