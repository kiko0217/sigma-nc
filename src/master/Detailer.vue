<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button 
							label="New"
							icon="pi pi-plus"
							:disabled="loading"
							class="p-button-success p-mr-2"
							@click="openNew"
						/>
						<Button 
							label="Delete"
							icon="pi pi-trash"
							class="p-button-danger"
							@click="confirmDeleteSelected"
							:disabled="!selectedDetailers || !selectedDetailers.length"
						/>
					</template>

					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
						<Button label="Export" icon="pi pi-upload" :disabled="loading" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable 
					ref="dt"
					:value="detailers"
					:scrollable="true"
					scrollHeight="500px"
					:loading="loading"
					:selection.sync="selectedDetailers"
					dataKey="_id"
					:paginator="true" 
					:rows="10"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
					:rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions"
				>
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Manage Detailer</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column headerStyle="width: 120px">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editDetailer(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteDetailer(slotProps.data)" />
						</template>
					</Column>
					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column v-for="(col, index) of columnDetailer" :field="col.field" :header="col.header" :key="index" :headerStyle="headerStyle(col.field)">
						<template v-if="col.field=='joinDate'" #body="slotProps">
							<span>{{formatDate(slotProps.data.joinDate)}}</span>
						</template>
					</Column>
				</DataTable>

				<Dialog 
					:visible.sync="detailerDialog"
					:style="{width: '900px'}" 
					header="Region Details" 
					:modal="true" 
					class="p-fluid"
				>
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Code">Code</label>
							<InputText id="Code" v-model.trim="detailer.code" required="true" autofocus :class="{'p-invalid': submitted && !detailer.code}" />
							<small class="p-invalid" v-if="submitted && !detailer.code">Code is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="DetailerName">Detailer Name</label>
							<InputText id="DetailerName" v-model.trim="detailer.name" required="true" autofocus :class="{'p-invalid': submitted && !detailer.name}" />
							<small class="p-invalid" v-if="submitted && !detailer.name">Detailer Name is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Short">Short</label>
							<InputText id="Short" v-model.trim="detailer.short" required="true" autofocus :class="{'p-invalid': submitted && !detailer.short}" />
							<small class="p-invalid" v-if="submitted && !detailer.short">Short Name is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Level">Level</label>
							<InputText
								id="Level" 
								v-model.trim="detailer.level"
								required="true"
								autofocus :class="{'p-invalid': submitted && !detailer.level}" 
							/>
							<small
								class="p-invalid"
								v-if="submitted && !detailer.level"
							>Level is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Status">Status</label>
							<InputText
								id="Status"
								v-model.trim="detailer.status"
								required="true"
								autofocus :class="{'p-invalid': submitted && !detailer.status}"
							/>
							<small class="p-invalid" v-if="submitted && !detailer.status">Status is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Upper">Upper</label>
							<Dropdown
								inputId="Upper"
								v-model.trim="detailer.upper"
								:options="detailers"
								:filter="true"
								optionValue="code"
								optionLabel="name"
								placeholder="Select Upper"
								scrollHeight="100px"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !detailer.upper">Upper is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Sex">Sex</label>
							<Dropdown inputId="Sex" v-model.trim="detailer.sex" :options="[{name:'M', label:'Male'},{name: 'F', label: 'Female'}]" :filter="true" optionValue="name" optionLabel="label" placeholder="Select Sex" scrollHeight="100px">
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !detailer.sex">Sex is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="JoinDate">Join Date</label>
							 <Calendar
							 	id="JoinDate"
								v-model.trim="detailer.joinDate"
								:manualInput="false"
								required="true"
								autofocus
								:class="{'p-invalid': submitted && !detailer.joinDate}"
								placeholder="Select Join Date"
								dateFormat="yy-mm-dd"
							></Calendar>
							<small class="p-invalid" v-if="submitted && !detailer.joinDate">Status is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Phone">Phone</label>
							<InputText
								id="Phone"
								v-model.trim="detailer.phone"
								required="true"
								autofocus :class="{'p-invalid': submitted && !detailer.phone}"
							/>
							<small class="p-invalid" v-if="submitted && !detailer.status">Status is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Email">Email</label>
							<InputText
								id="Email"
								v-model.trim="detailer.email"
								required="true"
								autofocus :class="{'p-invalid': submitted && !detailer.email}"
							/>
							<small class="p-invalid" v-if="submitted && !detailer.email">Email is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="BugetExpense">Budget Expense</label>
							<InputNumber 
								id="BugetExpense"
								mode="currency"
								currency="IDR"
								locale="id-ID"
								v-model.trim="detailer.budgetExpense"
								required="true"
								autofocus :class="{'p-invalid': submitted && !detailer.budgetExpense}"
							/>
							<small class="p-invalid" v-if="submitted && !detailer.budgetExpense">Status is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-12">
							<label for="Address">Address</label>
							<Textarea id="Address" v-model.trim="detailer.address" required="true" autofocus :class="{'p-invalid': submitted && !detailer.address}" rows="3" />
							<small class="p-invalid" v-if="submitted && !detailer.address">Address is required.</small>
						</div>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveDetailer" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteDetailerDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="detailer">Are you sure you want to delete <b>{{detailer.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDetailerDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDetailer" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteDetailersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="detailer">Are you sure you want to delete the selected detailers?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDetailersDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedRegions" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import DetailerService from '../service/DetailerService';

export default {
	data() {
		return {
			columnDetailer:[],
            loading: false,
			detailers: null,
			detailerDialog: false,
			deleteDetailerDialog: false,
			deleteDetailersDialog: false,
			detailer: {},
			selectedDetailers: null,
			filters: {},
            submitted: false,
            createNew: false
		}
	},
	detailerService: null,
	created() {
		this.columnDetailer = [
			{
				field : 'code',
				header : 'Code'
			},
			{
				field : 'name',
				header : 'Detailer Name'
			},
			{
				field : 'short',
				header : 'Short'
			},
			{
				field : 'level',
				header : 'Level'
			},
			{
				field : 'upper',
				header : 'Upper'
			},
			{
				field : 'status',
				header : 'Status'
			},
			{
				field : 'sex',
				header : 'Sex'
			},
			{
				field : 'joinDate',
				header : 'Join Date'
			},
			{
				field : 'address',
				header : 'Address'
			},
			{
				field : 'phone',
				header : 'Phone'
			},
			{
				field : 'email',
				header : 'Email'
			},
			{
				field : 'budgetExpense',
				header : 'Budget Expense'
			},
			{
				field : 'balance',
				header : 'Balance'
			},
		]
		this.detailerService = new DetailerService();
	},
	mounted() {
        this.loading = true;
		this.detailerService.getDetailers().then(data => {
            this.detailers = data
            this.loading = false;
        });
	},
	computed: {
		changeDateFormta: {
			get() {
				// console.log(date)
				// console.log(this.detailer.joinDate)
				// let test = (this.detailer.joinDate != null ) ? this.formatDate(this.detailer.joinDate) : this.detailer.joinDate
				// console.log(test)
				return this.formatDate(this.detailer.joinDate) 
			},
			set(date) {
				this.detailer.joinDate = date
				// console.log(this.detailer.joinDate)
			}
		}
	},
	methods: {
		headerStyle(field) {
			if((field === 'address') || (field === 'email')){
				return "width: 300px"
			} else {
				return "width: 150px"
			}
		},
		formatDate(dat) {
			let date = new Date(dat)
			// console.log(date)
            let month = date.getMonth() + 1;
            let day = date.getDate();

            if (month < 10) {
                month = '0' + month;
            }

            if (day < 10) {
                day = '0' + day;
            }

            return (dat != null ) ? day + '-' + month + '-' + date.getFullYear() : dat
        },
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		},
		openNew() {
			this.detailer = {};
			this.submitted = false;
            this.detailerDialog = true;
            this.createNew = true;
		},
		hideDialog() {
			this.detailerDialog = false;
			this.submitted = false;
		},
		create() {
			this.detailer.balance = this.detailer.budgetExpense
			this.detailerService.createDetailer(this.detailer)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.detailerService.getDetailers().then(data => {
					this.detailers = data
					this.loading = false;
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		edit() {
			this.detailerService.editDetailer(this.detailer)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.detailerService.getDetailers().then(data => {
					this.detailers = data
					this.loading = false;
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		delete() {
			this.detailerService.deleteDetailer(this.detailer)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.detailerService.getDetailers().then(data => {
					this.detailers = data
					this.loading = false;
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		saveDetailer() {
			if (this.detailer.code && 
				this.detailer.name &&
				this.detailer.short &&
				this.detailer.level &&
				this.detailer.upper &&
				this.detailer.status &&
				this.detailer.sex &&
				this.detailer.joinDate &&
				this.detailer.address &&
				this.detailer.phone &&
				this.detailer.email &&
				this.detailer.budgetExpense)
			{
				if(this.createNew){
					this.createDetailer();
					return;
				}
				this.submitted = true;
				this.edit()
                this.detailerDialog = false;
                this.detailer = {};
			}
        },
        createDetailer() {
            this.submitted = true;
			this.create()
			this.detailerDialog = false;
			this.detailer = {};
			this.createNew = false;
        },
		editDetailer(detailer) {
			this.detailer = {...detailer};
			this.detailerDialog = true;
		},
		confirmDeleteDetailer(detailer) {
			this.detailer = detailer;
			this.deleteDetailerDialog = true;
		},
		deleteDetailer() {
			this.delete()
			this.deleteDetailerDialog = false;
			this.detailer = {};
		},
		findIndexByCode(Code) {
			let index = -1;
			for (let i = 0; i < this.detailers.length; i++) {
				if (this.detailers[i].Code === Code) {
					index = i;
					break;
				}
			}

			return index;
		},
		createId() {
			let id = '';
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for ( var i = 0; i < 5; i++ ) {
				id += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return id;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteDetailersDialog = true;
		},
		deleteSelectedRegions() {
			this.detailers = this.detailers.filter(val => !this.selectedDetailers.includes(val));
			this.deleteDetailersDialog = false;
			this.selectedDetailers = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Regions Deleted', life: 3000});
		}
	}
}
</script>

<style scoped lang="scss">
.table-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.product-image {
	width: 100px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
	width: 150px;
	margin: 0 auto 2rem auto;
	display: block;
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.product-badge {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: .3px;

	&.status-instock {
		background: #C8E6C9;
		color: #256029;
	}

	&.status-outofstock {
		background: #FFCDD2;
		color: #C63737;
	}

	&.status-lowstock {
		background: #FEEDAF;
		color: #8A5340;
	}
}
</style>