<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedRegions || !selectedRegions.length" />
					</template>

					<template slot="right">
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="customers" :scrollable="true" scrollHeight="500px" :selection.sync="selectedRegions" editMode="cell" dataKey="CodeCust" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Manage Customer</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column headerStyle="width: 120px">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editRegion(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteRegion(slotProps.data)" />
						</template>
					</Column>
					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<!-- <Column field="Outlet" header="Outlet" headerStyle="width: 100px" sortable></Column> -->
					<Column field="type" header="Type" headerStyle="width: 100px" sortable></Column>
					<Column field="category" header="Category" headerStyle="width: 100px" sortable></Column>
					<Column field="class" header="Class" headerStyle="width: 100px" sortable></Column>
					<Column field="code" header="Code Cust" headerStyle="width: 100px" sortable></Column>
					<Column field="name" header="Customer Name" headerStyle="width: 200px" sortable></Column>
					<Column field="short" header="Shor Name" headerStyle="width: 100px" sortable></Column>
					<Column field="outletCode" header="Code Outlet" headerStyle="width: 200px" sortable>
						<template #editor="slotProps">
							<Dropdown v-model="slotProps.data['outletCode']" :options="outlets" :filter="true" optionLabel="code" optionValue="code" placeholder="Select Outlet" scrollHeight="100px">
								<template #option="slotProps">
									<span>{{slotProps.option.name}}</span>
								</template>
							</Dropdown>
						</template>
					</Column>
					<Column field="KSO" header="KSO" headerStyle="width: 100px" sortable></Column>
					<Column field="status" header="Status" headerStyle="width: 100px" sortable></Column>
					<Column field="sex" header="Sex" headerStyle="width: 100px" sortable></Column>
					<Column field="balance" header="Balance" headerStyle="width: 100px" sortable></Column>
					<Column field="targetCall" header="Target Call" headerStyle="width: 100px" sortable></Column>
					<Column field="address" header="Address" headerStyle="width: 300px" sortable></Column>
					<Column field="codePos" header="Kode POS" headerStyle="width: 100px" sortable></Column>
					<Column field="city" header="City" headerStyle="width: 100px" sortable></Column>
					<Column field="propinsi" header="Propinsi" headerStyle="width: 100px" sortable></Column>
					<Column field="phone" header="Phone" headerStyle="width: 100px" sortable></Column>
					<Column field="email" header="Email" headerStyle="width: 100px" sortable></Column>
					<Column field="createdAt" header="Create Date" sortable headerStyle="width: 150px">
						<template #body="slotProps">
							<span>{{formatDate(slotProps.data.createdAt)}}</span>
						</template>
					</Column>
					<Column field="updatedAt" header="Update Date" sortable headerStyle="width: 150px">
						<template #body="slotProps">
							<span>{{formatDate(slotProps.data.updatedAt)}}</span>
						</template>
					</Column>
					<Column field="updatedBy" header="Update by" sortable headerStyle="width: 150px"></Column>
				</DataTable>

				<Dialog :visible.sync="regionDialog" :style="{width: '450px'}" header="Region Details" :modal="true" class="p-fluid">
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-field">
						<label for="CodeCust">Code Cust</label>
						<InputText id="CodeCust" v-model.trim="region.CodeCust" required="true" autofocus :class="{'p-invalid': submitted && !region.CodeCust}" />
						<small class="p-invalid" v-if="submitted && !region.CodeCust">Code Cust is required.</small>
					</div>
					<div class="p-field">
						<label for="NameCustomer">Customer Name</label>
						<InputText id="NameCustomer" v-model.trim="region.NameCustomer" required="true" autofocus :class="{'p-invalid': submitted && !region.NameCustomer}" />
						<small class="p-invalid" v-if="submitted && !region.NameCustomer">Customer Name is required.</small>
					</div>
					<div class="p-field">
						<label for="Status">Status</label>
						<InputText id="Status" v-model.trim="region.Status" required="true" autofocus :class="{'p-invalid': submitted && !region.Status}" />
						<small class="p-invalid" v-if="submitted && !region.Status">Status Name is required.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveRegion" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteRegionDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="region">Are you sure you want to delete <b>{{region.NameCustomer}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRegionDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteRegion" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteRegionsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="region">Are you sure you want to delete the selected regions?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRegionsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedRegions" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import CustomerService from '../service/Customer1Service';
import OutletService from '../service/OutletService'
export default {
	data() {
		return {
			outles: null,
			customers: null,
			regionDialog: false,
			deleteRegionDialog: false,
			deleteRegionsDialog: false,
			region: {},
			selectedRegions: null,
			filters: {},
            submitted: false,
            createNew: false
		}
	},
	customerService: null,
	outletService: null,
	created() {
		this.outletService= new OutletService()
		this.customerService = new CustomerService();
	},
	mounted() {
		this.outletService.getOutlets().then(data => this.outlets = data)
		this.customerService.getCustomers().then(data => this.customers = data);
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
			this.region = {};
			this.submitted = false;
            this.regionDialog = true;
            this.createNew = true;
		},
		hideDialog() {
			this.regionDialog = false;
			this.submitted = false;
		},
		saveRegion() {
            if(this.createNew){
                this.createRegion();
                return;
            }
			this.submitted = true;

			if (this.region.NameCustomer.trim() && this.region.CodeCust.trim() && this.region.Status.trim()) {
                this.$set(this.regions, this.findIndexByCodeCust(this.region.CodeCust), this.region);
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Updated', life: 3000});
                this.regionDialog = false;
                this.region = {};
			}
        },
        createRegion() {
            this.submitted = true;
            if (this.region.NameCustomer.trim() && this.region.CodeCust.trim() && this.region.Status.trim()) {
                this.regions.push(this.region);
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Created', life: 3000});
                this.regionDialog = false;
                this.region = {};
                this.createNew = false;
            }
        },
		editRegion(region) {
			this.region = {...region};
			this.regionDialog = true;
		},
		confirmDeleteRegion(region) {
			this.region = region;
			this.deleteRegionDialog = true;
		},
		deleteRegion() {
			this.regions = this.regions.filter(val => val.CodeCust !== this.region.CodeCust);
			this.deleteRegionDialog = false;
			this.region = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Deleted', life: 3000});
		},
		findIndexByCodeCust(CodeCust) {
			let index = -1;
			for (let i = 0; i < this.regions.length; i++) {
				if (this.regions[i].CodeCust === CodeCust) {
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
			this.deleteRegionsDialog = true;
		},
		deleteSelectedRegions() {
			this.regions = this.regions.filter(val => !this.selectedRegions.includes(val));
			this.deleteRegionsDialog = false;
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