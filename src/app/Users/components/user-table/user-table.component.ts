import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LoadingBarService } from '@ngx-loading-bar/core'
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state'
import { QueryService } from 'src/app/Core/services/query/query.service'
import {
	UserList,
	UserListSearch,
	UserService,
} from 'src/app/Core/services/user/user.service'
@Component({
	selector: 'app-user-table',
	templateUrl: './user-table.component.html',
	styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent {
	loader: LoadingBarState

	pagnationForm: FormGroup
	searchForm: FormGroup<UserListSearch>
	results: UserList[] = []
	loaded = false

	filter = ''
	max = 10
	size = 0
	page = 1
	pages = 0
	pageSizes = [10, 25, 50, 100]
	// Exmpty for a reason
	search: UserListSearch = {
		id: new FormControl(null),
		username: new FormControl(null),
	}

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private loadingBarService: LoadingBarService,
		private queryService: QueryService,
		private userService: UserService
	) {
		this.loader = this.loadingBarService.useRef()
	}

	ngOnInit(): void {
		this.pagnationForm = this.fb.group({
			max: 10,
			page: 1,
		})
		this.searchForm = this.fb.group(this.search)
		// this.searchForm.setValidators(this.atLeastOneValidator()) // ToDo - Make it that something insearch must be filled in to search
		this.getResults()
		this.pagnationForm.get('max')?.valueChanges.subscribe((max) => {
			this.updateMax(max)
		})
	}

	ngOnDestroy() {
		this.loader.complete()
	}

	getResults() {
		// ToDo - filter should get passed into here instead of pulling from class
		this.loader.start()
		this.userService
			.getResults(this.page, this.max, this.filter)
			.then((records) => {
				if (records) {
					this.size = records.totalItems
					this.pages = records.totalPages
					this.results = records.items
				}
				this.loaded = true
				this.loader.complete()
			})
	}

	updateMax(max: number) {
		this.max = max
		this.pagnationForm.value.max = max
		this.getResults()
	}

	updatePage(page: number) {
		if (this.page != page) {
			this.pagnationForm.value.page = page
			this.page = page
			this.getResults()
		}
	}

	getPages(): number[] {
		const pages = []
		for (let x = 1; x <= this.pages; x++) {
			pages.push(x)
		}
		return pages
	}

	submit() {}

	searchSubmit() {
		console.log(this.searchForm.value)
		this.filter = this.queryService.formatQueryAnd(this.searchForm.value)
		this.getResults()
	}

	searchReset() {
		this.filter = ''
		this.searchForm.reset()
		this.getResults()
	}

	viewUser(id: string) {
		this.router.navigate(['users/', id])
	}

	createUser() {
		this.router.navigate(['users/', '0'])
	}
}
