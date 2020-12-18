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

				<DataTable ref="dt" :value="outlets" :scrollable="true" scrollHeight="500px" :loading="loading" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Manage Outlet</h5>
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
					<Column field="code" header="Code" headerStyle="width: 100px" sortable></Column>
					<Column field="name" header="Name Outlet" headerStyle="width: 300px" sortable></Column>
					<!-- <Column field="Area" header="Area" headerStyle="width: 100px" sortable></Column>
					<Column field="Detailer" header="Detailer" headerStyle="width: 100px" sortable></Column>
					<Column field="Type" header="Type" headerStyle="width: 100px" sortable></Column>
					<Column field="Catagory" header="Catagory" headerStyle="width: 100px" sortable></Column>
					<Column field="CodeOutlet" header="Code Outlet" headerStyle="width: 100px" sortable></Column>
					<Column field="ShortName" header="Short Name" headerStyle="width: 100px" sortable></Column>
					<Column field="Status" header="Status" headerStyle="width: 100px" sortable></Column>
					<Column field="Address" header="Address" headerStyle="width: 300px" sortable></Column>
					<Column field="City" header="City" headerStyle="width: 100px" sortable></Column>
					<Column field="Propinsi" header="Propinsi" headerStyle="width: 100px" sortable></Column>
					<Column field="Phone" header="Phone" headerStyle="width: 100px" sortable></Column>
					<Column field="ContactPerson" header="Contact Person" headerStyle="width: 100px" sortable></Column>
					<Column field="Email" header="Email" headerStyle="width: 100px" sortable></Column>
					<Column field="NPWP" header="NPWP" headerStyle="width: 100px" sortable></Column>
					<Column field="NPPKP" header="NPPKP" headerStyle="width: 100px" sortable></Column>
					<Column field="TglPengukuhan" header="Tgl Pengukuhan" headerStyle="width: 100px" sortable></Column>
					<Column field="Createby" header="Create by" headerStyle="width: 100px" sortable></Column>
					<Column field="Createdate" header="Create Date" headerStyle="width: 100px" sortable></Column>
					<Column field="Updateby" header="Update by" headerStyle="width: 100px" sortable></Column>
					<Column field="Updatedate" header="Update Date" headerStyle="width: 100px" sortable></Column> -->
				</DataTable>

				<Dialog :visible.sync="regionDialog" :style="{width: '450px'}" header="Region Details" :modal="true" class="p-fluid">
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-field">
						<label for="CodeOutlet">Code Outlet</label>
						<InputText id="CodeOutlet" v-model.trim="region.CodeOutlet" required="true" autofocus :class="{'p-invalid': submitted && !region.CodeOutlet}" />
						<small class="p-invalid" v-if="submitted && !region.CodeOutlet">Code Outlet is required.</small>
					</div>
					<div class="p-field">
						<label for="NameOutlet">Region Name</label>
						<InputText id="NameOutlet" v-model.trim="region.NameOutlet" required="true" autofocus :class="{'p-invalid': submitted && !region.NameOutlet}" />
						<small class="p-invalid" v-if="submitted && !region.NameOutlet">Region Name is required.</small>
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
						<span v-if="region">Are you sure you want to delete <b>{{region.NameOutlet}}</b>?</span>
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
import OutletService from '../service/OutletService';

export default {
	data() {
		return {
            loading: false,
			outlets: null,
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
	outletService: null,
	created() {
		this.outletService = new OutletService();
	},
	mounted() {
        this.loading = true,
		this.outletService.getOutlets().then(data => {
			console.log(data)
            this.outlets = data;
            this.loading = false;    
        });
	},
	methods: {
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

			if (this.region.NameOutlet.trim() && this.region.CodeOutlet.trim() && this.region.Status.trim()) {
                this.$set(this.regions, this.findIndexByCodeOutlet(this.region.CodeOutlet), this.region);
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Updated', life: 3000});
                this.regionDialog = false;
                this.region = {};
			}
        },
        createRegion() {
            this.submitted = true;
            if (this.region.NameOutlet.trim() && this.region.CodeOutlet.trim() && this.region.Status.trim()) {
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
			this.regions = this.regions.filter(val => val.CodeOutlet !== this.region.CodeOutlet);
			this.deleteRegionDialog = false;
			this.region = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Deleted', life: 3000});
		},
		findIndexByCodeOutlet(CodeOutlet) {
			let index = -1;
			for (let i = 0; i < this.regions.length; i++) {
				if (this.regions[i].CodeOutlet === CodeOutlet) {
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