<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" icon="pi pi-plus" :disabled="loading" class="p-button-success p-mr-2" @click="openNew" />
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedRegions || !selectedRegions.length" />
					</template>

					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
						<Button label="Export" icon="pi pi-upload" :disabled="loading" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" 
					:value="distributors" 
					:loading="loading" 
					:scrollable="true" 
					scrollHeight="800px" 
					:selection.sync="selectedRegions" 
					dataKey="_id" 
					:paginator="true" 
					:rows="10" 
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
					:rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Distributors"
				>
					<template #header>
						<div class="table-header">
							<!-- <h5 class="p-m-0">Manage Distributor</h5> -->
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column headerStyle="width: 120px " >
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editDistributor(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteDistributor(slotProps.data)" />
						</template>
					</Column>
					<Column v-for="(col, index) of columnDistributor" :field="col.field" :header="col.header" :key="index" :headerStyle="headerStyle(col.field)"></Column>
				</DataTable>

				<Dialog :visible.sync="distributorDialog"
					:style="{width: '900px'}"
					header="Distributor Details" 
					:modal="true" 
					class="p-fluid"
				>
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Code">Code</label>
							<InputText id="Code" v-model.trim="distributor.nfCode" required="true" autofocus :class="{'p-invalid': submitted && !distributor.nfCode}" />
							<small class="p-invalid" v-if="submitted && !distributor.nfCode">Code is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Code">Nama Distributor</label>
							<InputText id="Code" v-model.trim="distributor.name" required="true" autofocus :class="{'p-invalid': submitted && !distributor.name}" />
							<small class="p-invalid" v-if="submitted && !distributor.name">name is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Initial">Initial</label>
							<InputText id="Initial" v-model.trim="distributor.short" required="true" autofocus :class="{'p-invalid': submitted && !distributor.short}" />
							<small class="p-invalid" v-if="submitted && !distributor.short">Short Name is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="contactPerson">Contact Person</label>
							<InputText id="contactPerson" v-model.trim="distributor.contPerson" required="true" autofocus :class="{'p-invalid': submitted && !distributor.contPerson}" />
							<small class="p-invalid" v-if="submitted && !distributor.contPerson">Contact Person is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="status">Status</label>
							<InputText id="status" v-model.trim="distributor.status" required="true" autofocus :class="{'p-invalid': submitted && !distributor.status}" />
							<small class="p-invalid" v-if="submitted && !distributor.status">Contact Person is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<!-- <span class="p-float-label"> -->
							<label for="type">Type</label>
							<Dropdown inputId="type" v-model.trim="distributor.type" :options="[{name:'Distributor'}]" :filter="true" optionValue="name" optionLabel="name" placeholder="Select Detailer" scrollHeight="100px">
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !distributor.type">Type is required.</small>
							<!-- </span> -->
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="shipForm">Ship Form</label>
							<InputText id="shipForm" v-model.trim="distributor.shipForm" required="true" autofocus :class="{'p-invalid': submitted && !distributor.shipForm}" />
							<small class="p-invalid" v-if="submitted && !distributor.shipForm">Ship Form is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="hp">Hp</label>
							<InputText id="hp" v-model.trim="distributor.hp" required="true" autofocus :class="{'p-invalid': submitted && !distributor.hp}" />
							<small class="p-invalid" v-if="submitted && !distributor.hp">Hp is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="email">Email</label>
							<InputText id="email" v-model.trim="distributor.email" required="true" autofocus :class="{'p-invalid': submitted && !distributor.email}" />
							<small class="p-invalid" v-if="submitted && !distributor.email">Email is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Initial">Kota</label>
							<InputText id="Initial" v-model.trim="distributor.kota" required="true" autofocus :class="{'p-invalid': submitted && !distributor.kota}" />
							<small class="p-invalid" v-if="submitted && !distributor.kota">Kota is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Initial">Propinsi</label>
							<InputText id="Initial" v-model.trim="distributor.propinsi" required="true" autofocus :class="{'p-invalid': submitted && !distributor.telepon}" />
							<small class="p-invalid" v-if="submitted && !distributor.propinsi">Propinsi is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Initial">Telepon</label>
							<InputText id="Initial" v-model.trim="distributor.telepon" required="true" autofocus :class="{'p-invalid': submitted && !distributor.telepon}" />
							<small class="p-invalid" v-if="submitted && !distributor.telepon">Telepon is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-12">
							<label for="Address">Address</label>
							<Textarea id="Address" v-model.trim="distributor.address" required="true" autofocus :class="{'p-invalid': submitted && !distributor.address}" rows="3" />
							<small class="p-invalid" v-if="submitted && !distributor.address">Address is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">

					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveDistributor" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteDistributorDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="distributor">Are you sure you want to delete <b>{{distributor.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDistributorDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDistributor" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteDistributorsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="distributor">Are you sure you want to delete the selected distributors?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDistributorsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedRegions" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import DistributorService from '../service/DistributorService';

export default {
	data() {
		return {
			columnDistributor: [],
			loading: false,
			distributors: null,
			distributorDialog: false,
			deleteDistributorDialog: false,
			deleteDistributorsDialog: false,
			distributor: {},
			selectedRegions: null,
			filters: {},
            submitted: false,
            createNew: false
		}
	},
	distributorService: null,
	created() {
		this.columnDistributor = [
			{
				field : 'nfCode',
				header : 'Code'
			},
			{
				field : 'distName',
				header : 'Distributor Name'
			},
			{
				field : 'address',
				header : 'Address'
			},
			{
				field : 'short',
				header : 'Initial'
			},
			{
				field : 'contPerson',
				header : 'Contact Person'
			},
			{
				field : 'status',
				header : 'Status'
			},
			{
				field : 'type',
				header : 'Type'
			},
		]
		this.distributorService = new DistributorService();
	},
	mounted() {
		this.loading = true
		this.distributorService.getDistributors().then(data => {
			this.loading = false
			this.distributors = data
		});
	},
	methods: {
		headerStyle(field) {
			if(field === 'address'){
				return "width: 300px"
			} else {
				return "width: 150px"
			}
		},
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		},
		openNew() {
			this.distributor = {};
			this.submitted = false;
            this.distributorDialog = true;
            this.createNew = true;
		},
		hideDialog() {
			this.distributorDialog = false;
			this.submitted = false;
		},
		edit() {
			this.distributorService.editDistributor(this.distributor)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.distributorService.getDistributors().then(data => {
					this.loading = false
					this.distributors = data
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		saveDistributor() {
			this.submitted = true;
			if (this.distributor.email &&
				this.distributor.hp && 
				this.distributor.shipForm &&
				this.distributor.type && 
				this.distributor.status &&
				this.distributor.contPerson && 
				this.distributor.address && 
				this.distributor.nfCode && 
				this.distributor.short)
			{
				if(this.createNew){
					this.createDistributor();
					return;
				}
				this.edit()
                this.distributorDialog = false;
                this.distributor = {};
			}
		},
		create() {
			this.distributorService.createDistributor(this.distributor)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.distributorService.getDistributors().then(data => {
					this.loading = false
					this.distributors = data
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
        createDistributor() {
			// this.submitted = true;
			// console.log(this.distributor.address.trim())
			this.create()
			this.distributorDialog = false;
			this.distributor = {};
			this.createNew = false;
        },
		editDistributor(distributor) {
			this.distributor = {...distributor};
			this.distributorDialog = true;
		},
		confirmDeleteDistributor(distributor) {
			this.distributor = distributor;
			this.deleteDistributorDialog = true;
		},
		deleteDistributor() {
			this.distributorService.deleteDistributor(this.distributor)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.distributorService.getDistributors().then(data => {
					this.loading = false
					this.distributors = data
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
			this.deleteDistributorDialog = false;
			this.distributor = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Deleted', life: 3000});
		},
		findIndexByCode(Code) {
			let index = -1;
			for (let i = 0; i < this.distributors.length; i++) {
				if (this.distributors[i].Code === Code) {
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
			this.deleteDistributorsDialog = true;
		},
		deleteSelectedRegions() {
			this.distributors = this.distributors.filter(val => !this.selectedRegions.includes(val));
			this.deleteDistributorsDialog = false;
			this.selectedRegions = null;
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