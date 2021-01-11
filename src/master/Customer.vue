<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" 
							icon="pi pi-plus" 
							class="p-button-success p-mr-2" 
							@click="openNew"
							:disabled="loading" />
						<Button label="Delete" 
							icon="pi pi-trash" 
							class="p-button-danger" 
							@click="confirmDeleteSelected" 
							:disabled="!selectedCustomers || !selectedCustomers.length" />
					</template>

					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
						<Button label="Export" 
							icon="pi pi-upload" 
							class="p-button-help" 
							@click="exportCSV($event)"
							:disabled="loading"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" 
					:value="customers"
					:scrollable="true"
					scrollHeight="500px"
					:selection.sync="selectedCustomers"
					editMode="cell"
					dataKey="_id"
					:paginator="true"
					:rows="10"
					:loading="loading"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
					:rowsPerPageOptions="[5,10,25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Customer"
				>
					<template #header>
						<div class="table-header">
							<!-- <h5 class="p-m-0">Manage Customer</h5> -->
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column headerStyle="width: 120px">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editCustomer(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteCustomer(slotProps.data)" />
						</template>
					</Column>
					<Column v-for="(col, index) of columnCustomer" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px"></Column>
				</DataTable>

				<Dialog :visible.sync="customerDialog" 
					:style="{width: '900px'}" 
					header="Customer Details" 
					:modal="true" 
					class="p-fluid"
				>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Type">Type</label>
							<Dropdown
								inputId="Type"
								v-model.trim="customer.type"
								:options="customerTypes"
								:filter="true"
								optionValue="gh_funccode"
								optionLabel="gh_funcdescription"
								placeholder="Select Customer Type"
								scrollHeight="100px"
								dataKey="_id"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !customer.type">Type is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Category">Category</label>
							<Dropdown
								inputId="Category"
								v-model.trim="customer.catagory"
								:options="customerCategores"
								:filter="true"
								optionValue="gh_funccode"
								optionLabel="gh_funcdescription"
								placeholder="Select Customer Category"
								scrollHeight="100px"
								dataKey="_id"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !customer.catagory">Category is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="detailer">Detailer</label>
							<Dropdown inputId="detailer" 
								v-model.trim="customer.detailer"
								:options="detailers"
								:filter="true"
								optionValue="_id"
								optionLabel="name"
								placeholder="Select Detailer"
								scrollHeight="100px"
								dataKey="_id"
								:disabled="!createNew"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !customer.detailer">Detailer is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<!-- <span class="p-float-label"> -->
							<label for="area">Area Outlet</label>
							<Dropdown inputId="area" 
								v-model.trim="customer.area" 
								:options="areas"
								:filter="true"
								optionValue="_id" 
								optionLabel="name"
								placeholder="Select Area"
								scrollHeight="100px"
								dataKey="_id"
								:disabled="!createNew"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !customer.area">Area is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<!-- <span class="p-float-label"> -->
							<label for="outlet">Outlet</label>
							<Dropdown inputId="outlet" 
								v-model.trim="customer.outlet"
								:options="outlets"
								:filter="true"
								optionValue="_id"
								optionLabel="name"
								placeholder="Select Outlet"
								scrollHeight="100px"
								dataKey="_id"
								:disabled="!createNew"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !customer.outlet">Outlet is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Class">Class</label>
							<InputText id="Class" v-model.trim="customer.class" required="true" autofocus :class="{'p-invalid': submitted && !customer.class}" />
							<small class="p-invalid" v-if="submitted && !customer.class">Class Name is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Code">Code</label>
							<InputText id="Code" 
								v-model.trim="customer.code"
								required="true" 
								autofocus 
								:class="{'p-invalid': submitted && !customer.code}" 
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !customer.code">Code is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Name">Name</label>
							<InputText id="Name" v-model.trim="customer.name" required="true" autofocus :class="{'p-invalid': submitted && !customer.name}" />
							<small class="p-invalid" v-if="submitted && !customer.name">Name is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Short">Short Name</label>
							<InputText id="Short" v-model.trim="customer.short" required="true" autofocus :class="{'p-invalid': submitted && !customer.short}" />
							<small class="p-invalid" v-if="submitted && !customer.short">Short Name is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Status">Status</label>
							<InputText id="Status" v-model.trim="customer.status" required="true" autofocus :class="{'p-invalid': submitted && !customer.status}" />
							<small class="p-invalid" v-if="submitted && !customer.status">Status is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Sex">Sex</label>
							<InputText id="Sex" v-model.trim="customer.sex" required="true" autofocus :class="{'p-invalid': submitted && !customer.sex}" />
							<small class="p-invalid" v-if="submitted && !customer.sex">Sex is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="KSO">KSO</label>
							<InputText id="KSO" v-model.trim="customer.KSO" required="true" autofocus :class="{'p-invalid': submitted && !customer.KSO}" />
							<small class="p-invalid" v-if="submitted && !customer.KSO">KSO is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Email">Email</label>
							<InputText id="Email" v-model.trim="customer.email" required="true" autofocus :class="{'p-invalid': submitted && !customer.email}" />
							<small class="p-invalid" v-if="submitted && !customer.email">Email is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Target Call">Target Call</label>
							<InputNumber 
								id="Target Call"
								mode="decimal" 
								v-model.trim="customer.targetCall"
								required="true"
								autofocus :class="{'p-invalid': submitted && !customer.targetCall}"
							/>
							<small class="p-invalid" v-if="submitted && !customer.targetCall">Target Call is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Phone">Phone</label>
							<InputText id="Phone" v-model.trim="customer.phone" required="true" autofocus :class="{'p-invalid': submitted && !customer.phone}" />
							<small class="p-invalid" v-if="submitted && !customer.phone">Phone is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-12">
							<label for="Address">Address</label>
							<Textarea id="Address" v-model.trim="customer.address" required="true" autofocus :class="{'p-invalid': submitted && !customer.address}" rows="3" />
							<small class="p-invalid" v-if="submitted && !customer.address">Address is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="City">City</label>
							<InputText id="City" v-model.trim="customer.city" required="true" autofocus :class="{'p-invalid': submitted && !customer.city}" />
							<small class="p-invalid" v-if="submitted && !customer.city">City is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Propinsi">Propinsi</label>
							<InputText id="Propinsi" v-model.trim="customer.propinsi" required="true" autofocus :class="{'p-invalid': submitted && !customer.propinsi}" />
							<small class="p-invalid" v-if="submitted && !customer.propinsi">Propinsi is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Code Pos">Code Pos</label>
							<InputText id="Code Pos" v-model.trim="customer.codePos" required="true" autofocus :class="{'p-invalid': submitted && !customer.codePos}" />
							<small class="p-invalid" v-if="submitted && !customer.codePos">Code Pos is required.</small>
						</div>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveCustomer" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteCustomerDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="customer">Are you sure you want to delete <b>{{customer.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCustomerDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteCustomer" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteCustomersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="customer">Are you sure you want to delete the selected customers?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCustomersDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedCustomers" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import DetailerService from '../service/DetailerService'
import CustomerService from '../service/Customer1Service';
import OutletService from '../service/OutletService'
import SysFunctService from '../service/SysFunctService'
import AreaService from '../service/AreaService'

export default {
	data() {
		return {
			detailers: null,
			areas: null,
			customerCategores: null,
			customerTypes: null,
			loading: false, 
			columnCustomer: [],
			outlets: null,
			customers: null,
			customerDialog: false,
			deleteCustomerDialog: false,
			deleteCustomersDialog: false,
			customer: {},
			selectedCustomers: null,
			filters: {},
            submitted: false,
            createNew: false
		}
	},
	detailerService: null,
	customerService: null,
	areaService: null,
	outletService: null,
	sysFunctService: null,
	created() {
		this.columnCustomer = [
			{
				field : 'type',
				header : 'Type'
			},
			{
				field : 'catagory',
				header : 'Category'
			},
			{
				field : 'class',
				header : 'Class'
			},
			{
				field : 'code',
				header : 'Customer Code'
			},
			{
				field : 'name',
				header : 'Customer Name'
			},
			{
				field : 'short',
				header : 'Short Name'
			},
			{
				field : 'KSO',
				header : 'KSO'
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
				field : 'address',
				header : 'Address'
			},
			{
				field : 'city',
				header : 'City'
			},
			{
				field : 'propinsi',
				header : 'Propinsi'
			},
			{
				field : 'codePos',
				header : 'Code Pos'
			},
			{
				field : 'email',
				header : 'Email'
			},
			{
				field : 'phone',
				header : 'Phone'
			},
			{
				field : 'targetCall',
				header : 'Target Call'
			}
		]
		this.outletService= new OutletService()
		this.customerService = new CustomerService()
		this.sysFunctService = new SysFunctService()
		this.detailerService = new DetailerService()
		this.areaService = new AreaService();
	},
	mounted() {
		this.loading = true
		this.sysFunctService.getCustomerType()
		.then(data => {
			this.customerTypes = data
		})
		this.sysFunctService.getCustomerCategory()
		.then(data => {
			this.customerCategores = data
		})
		this.outletService.getOutlets().then(data => this.outlets = data)
		this.customerService.getCustomers().then(data => {
			this.loading = false
			this.customers = data
			console.log(this.customers)
			this.customers = [...new Set(this.customers.map(({
				// outlets,
				// detailers,
				salesCovers,
				// area,
				...resp
			})=>{
				// console.log(salesCovers)
				return ({
					// detailer: detailers[0],
					detailer: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].detailer : null,
					// outlet: outlets[outlets.length - 1],
					outlet: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].outlet : null,
					area: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].area :  null,
					...resp
				})
			}))]
			delete this.customers.outlets
			delete this.customers.detailers
			delete this.customers.salesCovers
			console.log(this.customers)

		});
		this.detailerService.getDetailerMinis()
		.then(data => {
			this.detailers = data
		})
		this.areaService.getAreaMinis()
		.then(data => this.areas = data);
	},
	methods: {
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

            return day + '-' + month + '-' + date.getFullYear();
        },
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		},
		openNew() {
			this.customer = {};
			this.submitted = false;
            this.customerDialog = true;
            this.createNew = true;
		},
		hideDialog() {
			this.customerDialog = false;
			this.submitted = false;
		},
		edit() {
			this.customerService.editCustomer(this.customer)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.customerService.getCustomers().then(data => {
					this.loading = false
					this.customers = data
					this.customers = [...new Set(this.customers.map(({
						// outlets,
						// detailers,
						salesCovers,
						// area,
						...resp
					})=>({
						// detailer: detailers[0],
						detailer: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].detailer : null,
						// outlet: outlets[outlets.length - 1],
						outlet: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].outlet : null,
						area: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].area :  null,
						...resp
					})))]
					delete this.customers.outlets
					delete this.customers.detailers
					delete this.customers.salesCovers
					
				});
			})
			.catch(err => {
				console.log(err)
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		saveCustomer() {
			this.submitted = true;
			if (this.customer.type &&
				this.customer.catagory &&
				this.customer.class &&
				this.customer.code &&
				this.customer.name &&
				this.customer.short &&
				this.customer.status &&
				this.customer.sex &&
				this.customer.KSO &&
				this.customer.email &&
				this.customer.targetCall &&
				this.customer.phone &&
				this.customer.address &&
				this.customer.city &&
				this.customer.propinsi &&
				this.customer.codePos)
			{
				if(this.createNew){
					this.createCustomer();
					return;
				}
                this.edit()
                this.customerDialog = false;
                this.customer = {};
			}
		},
		create() {
			// console.log('test')
			this.customerService.createCustomer(this.customer)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.customerService.getCustomers().then(data => {
					this.loading = false
					this.customers = data
					this.customers = [...new Set(this.customers.map(({
						// outlets,
						// detailers,
						salesCovers,
						// area,
						...resp
					})=>({
						// detailer: detailers[0],
						detailer: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].detailer : null,
						// outlet: outlets[outlets.length - 1],
						outlet: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].outlet : null,
						area: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].area :  null,
						...resp
					})))]
					delete this.customers.outlets
					delete this.customers.detailers
					delete this.customers.salesCovers
				});
			})
			.catch(err => {
				console.log(err)
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
        createCustomer() {
            this.create()
			this.customerDialog = false;
			this.customer = {};
			this.createNew = false;
        },
		editCustomer(customer) {
			this.createNew = false;
			this.customer = {...customer};
			this.customerDialog = true;
		},
		confirmDeleteCustomer(customer) {
			this.customer = customer;
			this.deleteCustomerDialog = true;
		},
		delete() {
			this.customerService.deleteCustomer(this.customer)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.customerService.getCustomers().then(data => {
					this.loading = false
					this.customers = data
					this.customers = [...new Set(this.customers.map(({
						// outlets,
						// detailers,
						salesCovers,
						// area,
						...resp
					})=>({
						// detailer: detailers[0],
						detailer: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].detailer : null,
						// outlet: outlets[outlets.length - 1],
						outlet: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].outlet : null,
						area: (salesCovers.length !== 0) ? salesCovers[salesCovers.length -1].area :  null,
						...resp
					})))]
				});
				delete this.customers.outlets
				delete this.customers.detailers
				delete this.customers.salesCovers
			})
			.catch(err => {
				console.log(err)
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		deleteCustomer() {
			this.delete()
			this.deleteCustomerDialog = false;
			this.customer = {};
		},
		findIndexByCodeCust(CodeCust) {
			let index = -1;
			for (let i = 0; i < this.customers.length; i++) {
				if (this.customers[i].CodeCust === CodeCust) {
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
			this.deleteCustomersDialog = true;
		},
		deleteSelectedCustomers() {
			this.customers = this.customers.filter(val => !this.selectedCustomers.includes(val));
			this.deleteCustomersDialog = false;
			this.selectedCustomers = null;
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