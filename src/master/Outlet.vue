<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" :disabled="loading" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedOutlets || !selectedOutlets.length" />
					</template>

					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
						<Button label="Export" icon="pi pi-upload" :disabled="loading" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" 
					:value="outlets"
					:scrollable="true"
					scrollHeight="500px"
					:loading="loading"
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
							<!-- <h5 class="p-m-0">Manage Outlet</h5> -->
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column headerStyle="width: 120px">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editOutlet(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteOutlet(slotProps.data)" />
						</template>
					</Column>
					<Column v-for="(col, index) of columnOutlet" 
						:field="col.field" 
						:header="col.header"
						:key="index"
						headerStyle="width: 150px"
					>
						<template v-if="col.field=='tglPengukuhan'" #body="slotProps">
							<span>{{formatDate(slotProps.data.tglPengukuhan)}}</span>
						</template>
					</Column>
				</DataTable>

				<Dialog :visible.sync="outletDialog"
					:style="{width: '900px'}" 
					header="Outlet Details"
					:modal="true"
					class="p-fluid"
				>
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-3">
							<label for="Code">Code</label>
							<InputText id="Code" v-model.trim="outlet.code" required="true" autofocus :class="{'p-invalid': submitted && !outlet.code}" />
							<small class="p-invalid" v-if="submitted && !outlet.code">Code is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-3">
							<label for="DetailerName">Detailer Name</label>
							<InputText id="DetailerName" v-model.trim="outlet.name" required="true" autofocus :class="{'p-invalid': submitted && !outlet.name}" />
							<small class="p-invalid" v-if="submitted && !outlet.name">Detailer Name is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-3">
							<label for="Short">Short</label>
							<InputText id="Short" v-model.trim="outlet.short" required="true" autofocus :class="{'p-invalid': submitted && !outlet.short}" />
							<small class="p-invalid" v-if="submitted && !outlet.short">Short Name is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-3">
							<label for="type">type</label>
							<Dropdown inputId="type" 
								v-model.trim="outlet.type" 
								:options="outletTypes" 
								:filter="true" 
								optionValue="gh_funccode" 
								optionLabel="gh_funcdescription"
								placeholder="Select Outlet Type" 
								scrollHeight="100px"
								dataKey="_id"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !outlet.type">type Name is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Status">Status</label>
							<InputText id="Status" v-model.trim="outlet.status" required="true" autofocus :class="{'p-invalid': submitted && !outlet.status}" />
							<small class="p-invalid" v-if="submitted && !outlet.status">Status is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="city">City</label>
							<InputText id="city" v-model.trim="outlet.city" required="true" autofocus :class="{'p-invalid': submitted && !outlet.city}" />
							<small class="p-invalid" v-if="submitted && !outlet.city">City is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Propinsi">Propinsi</label>
							<InputText id="Propinsi" v-model.trim="outlet.propinsi" required="true" autofocus :class="{'p-invalid': submitted && !outlet.propinsi}" />
							<small class="p-invalid" v-if="submitted && !outlet.propinsi">Propinsi is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-12">
							<label for="Address">Address</label>
							<Textarea id="Address" v-model.trim="outlet.address" required="true" autofocus :class="{'p-invalid': submitted && !outlet.address}" rows="3" />
							<small class="p-invalid" v-if="submitted && !outlet.address">Address is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Phone">Phone</label>
							<InputText id="Phone" v-model.trim="outlet.phone" required="true" autofocus :class="{'p-invalid': submitted && !outlet.phone}" />
							<small class="p-invalid" v-if="submitted && !outlet.phone">Phone is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="ContactPerson">Contact Person</label>
							<InputText id="ContactPerson" v-model.trim="outlet.contactPerson" required="true" autofocus :class="{'p-invalid': submitted && !outlet.contactPerson}" />
							<small class="p-invalid" v-if="submitted && !outlet.contactPerson">Contact Person is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="email">Email</label>
							<InputText id="email" v-model.trim="outlet.email" required="true" autofocus :class="{'p-invalid': submitted && !outlet.email}" />
							<small class="p-invalid" v-if="submitted && !outlet.email">Email is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="NPPKP">NPPKP</label>
							<InputText id="NPPKP" v-model.trim="outlet.nppkp" required="true" autofocus :class="{'p-invalid': submitted && !outlet.nppkp}" />
							<small class="p-invalid" v-if="submitted && !outlet.nppkp">NPPKP is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="JoinDate">Tanggal Pengukuhan</label>
							<Calendar id="JoinDate"
								v-model.trim="outlet.tglPengukuhan"
								:manualInput="false"
								required="true"
								autofocus
								:class="{'p-invalid': submitted && !outlet.tglPengukuhan}"
								placeholder="Select Join Date"
								dateFormat="yy-mm-dd"
							></Calendar>
							<small class="p-invalid" v-if="submitted && !outlet.tglPengukuhan">Tanggal Pengukuhan is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="npwp">NPWP</label>
							<InputText id="npwp" v-model.trim="outlet.npwp" required="true" autofocus :class="{'p-invalid': submitted && !outlet.npwp}" />
							<small class="p-invalid" v-if="submitted && !outlet.npwp">NPWP is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="DefaultDist">Default Dist</label>
							<InputText id="DefaultDist" v-model.trim="outlet.defaultDisc" required="true" autofocus :class="{'p-invalid': submitted && !outlet.defaultDisc}" />
							<small class="p-invalid" v-if="submitted && !outlet.defaultDisc">Default Dist is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="distDiscOn">Dist Disc On</label>
							<InputText id="distDiscOn" v-model.trim="outlet.distDiscOn" required="true" autofocus :class="{'p-invalid': submitted && !outlet.distDiscOn}" />
							<small class="p-invalid" v-if="submitted && !outlet.distDiscOn">Dist Disc On is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="distDiscOff">Dist Disc Off</label>
							<InputText id="distDiscOff" v-model.trim="outlet.distDiscOff" required="true" autofocus :class="{'p-invalid': submitted && !outlet.distDiscOff}" />
							<small class="p-invalid" v-if="submitted && !outlet.distDiscOff">Dist Disc Off is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="NFDiscOn">NF Disc On</label>
							<InputText id="NFDiscOn" v-model.trim="outlet.nfDiscOn" required="true" autofocus :class="{'p-invalid': submitted && !outlet.nfDiscOn}" />
							<small class="p-invalid" v-if="submitted && !outlet.nfDiscOn">NF Disc On is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="NFDiscOff">NF Disc Off</label>
							<InputText id="NFDiscOff" v-model.trim="outlet.nfDiscOff" required="true" autofocus :class="{'p-invalid': submitted && !outlet.nfDiscOff}" />
							<small class="p-invalid" v-if="submitted && !outlet.nfDiscOff">NF Disc Off is required.</small>
						</div>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveOutlet" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteOutletDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="outlet">Are you sure you want to delete <b>{{outlet.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteOutletDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteOutlet" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteOutletsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="outlet">Are you sure you want to delete the selected outlets?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteOutletsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedRegions" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import OutletService from '../service/OutletService'
import SysFunctService from '../service/SysFunctService'

export default {
	data() {
		return {
			outletTypes: null,
			loading: false,
			columnOutlet: [],
			outlets: null,
			outletDialog: false,
			deleteOutletDialog: false,
			deleteOutletsDialog: false,
			outlet: {},
			selectedOutlets: null,
			filters: {},
            submitted: false,
            createNew: false
		}
	},
	outletService: null,
	sysFunctService: null,
	created() {
		this.columnOutlet = [
			{
				field : 'code',
				header : 'Code Outlet'
			},
			{
				field : 'name',
				header : 'Name Outlet'
			},
			{
				field : 'short',
				header : 'Short Name'
			},
			{
				field : 'status',
				header : 'Status'
			},
			{
				field : 'type',
				header : 'Type'
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
				field : 'phone',
				header : 'Phone'
			},
			{
				field : 'contactPerson',
				header : 'Contact Person'
			},
			{
				field : 'email',
				header : 'Email'
			},
			{
				field : 'npwp',
				header : 'NPWP'
			},
			{
				field : 'nppkp',
				header : 'NPPKP'
			},
			{
				field : 'tglPengukuhan',
				header : 'Tanggal Pengukuhan'
			},
			{
				field : 'defaultDisc',
				header : 'Default Disc'
			},
			{
				field : 'distDiscOn',
				header : 'Dist Disc On'
			},
			{
				field : 'distDiscOff',
				header : 'Dist Disc Off'
			},
			{
				field : 'nfDiscOn',
				header : 'NF Disc On'
			},
			{
				field : 'nfDiscOff',
				header : 'NF Disc Off'
			},
		]
		this.outletService = new OutletService()
		this.sysFunctService = new SysFunctService()
	},
	mounted() {
		this.loading = true,
		this.sysFunctService.getOutletType()
		.then(data => {
			this.outletTypes = data
		})
		this.outletService.getOutlets().then(data => {
			// console.log(data)
            this.outlets = data;
            this.loading = false;    
        });
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

            return (dat != null ) ? day + '-' + month + '-' + date.getFullYear() : dat
        },
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		},
		openNew() {
			this.outlet = {};
			this.submitted = false;
            this.outletDialog = true;
            this.createNew = true;
		},
		hideDialog() {
			this.outletDialog = false;
			this.submitted = false;
		},
		edit() {
			this.outletService.editOutlet(this.outlet)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.outletService.getOutlets().then(data => {
					// console.log(data)
					this.outlets = data;
					this.loading = false;    
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		saveOutlet() {
			this.submitted = true;
			if (this.outlet.code && 
				this.outlet.name && 
				this.outlet.short &&
				this.outlet.status &&
				this.outlet.city &&
				this.outlet.propinsi &&
				this.outlet.address &&
				this.outlet.phone &&
				this.outlet.contactPerson &&
				this.outlet.email &&
				this.outlet.nppkp &&
				this.outlet.npwp &&
				this.outlet.tglPengukuhan &&
				this.outlet.defaultDisc &&
				this.outlet.distDiscOn &&
				this.outlet.distDiscOff &&
				this.outlet.nfDiscOn &&
				this.outlet.nfDiscOff)
			{
				// console.log("test")
				if(this.createNew){
					this.createOutlet();
					return;
				}
				// this.submitted = true;
                this.edit()
                // this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Updated', life: 3000});
                this.outletDialog = false;
                this.outlet = {};
			}
		},
		create() {
			this.outletService.createOutlet(this.outlet)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.outletService.getOutlets().then(data => {
					// console.log(data)
					this.outlets = data;
					this.loading = false;    
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
        createOutlet() {
			// this.submitted = true;
			this.create()
			this.outletDialog = false;
			this.outlet = {};
			this.createNew = false;
        },
		editOutlet(outlet) {
			this.outlet = {...outlet};
			this.outletDialog = true;
		},
		confirmDeleteOutlet(outlet) {
			this.outlet = outlet;
			this.deleteOutletDialog = true;
		},
		delete() {
			this.outletService.deleteOutlet(this.outlet)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.outletService.getOutlets().then(data => {
					// console.log(data)
					this.outlets = data;
					this.loading = false;    
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		deleteOutlet() {
			this.delete()
			this.deleteOutletDialog = false;
			this.outlet = {};
			
		},
		findIndexByCodeOutlet(CodeOutlet) {
			let index = -1;
			for (let i = 0; i < this.outlets.length; i++) {
				if (this.outlets[i].CodeOutlet === CodeOutlet) {
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
			this.deleteOutletsDialog = true;
		},
		deleteSelectedRegions() {
			this.outlets = this.outlets.filter(val => !this.selectedOutlets.includes(val));
			this.deleteOutletsDialog = false;
			this.selectedOutlets = null;
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