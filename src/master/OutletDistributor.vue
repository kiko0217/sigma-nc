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

				<DataTable ref="dt" :value="outletDistributors" :loading="loading" :selection.sync="selectedRegions" dataKey="Distributor" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Manage Outlet Distributor</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column field="Distributor" header="Distributor" sortable></Column>
					<Column field="KodeOutlet" header="Kode Outlet" sortable></Column>
					<Column field="KodeOutletNF" header="Kode Outlet NF" sortable></Column>
					<Column field="NamaOutlet" header="Nama Outlet" sortable></Column>
					<Column field="Createby" header="Create by" sortable></Column>
					<Column field="Createdate" header="Create Date" sortable></Column>
					<Column field="Updateby" header="Update by" sortable></Column>
					<Column field="Updatedate" header="Update Date" sortable></Column>
					<Column>
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editRegion(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteRegion(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog :visible.sync="regionDialog" :style="{width: '450px'}" header="Region Details" :modal="true" class="p-fluid">
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-field">
						<label for="Distributor">Distributor</label>
						<InputText id="Distributor" v-model.trim="region.Distributor" required="true" autofocus :class="{'p-invalid': submitted && !region.Distributor}" />
						<small class="p-invalid" v-if="submitted && !region.Distributor">Distributor is required.</small>
					</div>
					<div class="p-field">
						<label for="NamaOutlet">Nama Outlet</label>
						<InputText id="NamaOutlet" v-model.trim="region.NamaOutlet" required="true" autofocus :class="{'p-invalid': submitted && !region.NamaOutlet}" />
						<small class="p-invalid" v-if="submitted && !region.NamaOutlet">Nama Outlet is required.</small>
					</div>
					<div class="p-field">
						<label for="KodeOutletNF">Kode Outlet NF</label>
						<InputText id="KodeOutletNF" v-model.trim="region.KodeOutletNF" required="true" autofocus :class="{'p-invalid': submitted && !region.KodeOutletNF}" />
						<small class="p-invalid" v-if="submitted && !region.KodeOutletNF">Kode Outlet NF Name is required.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveRegion" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteRegionDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="region">Are you sure you want to delete <b>{{region.NamaOutlet}}</b>?</span>
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
import OutletDistributorService from '../service/OutletDistributorService';

export default {
	data() {
		return {
            loading: false,
			outletDistributors: null,
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
	outletDistributorService: null,
	created() {
		this.outletDistributorService = new OutletDistributorService();
	},
	mounted() {
        this.loading = true,
		this.outletDistributorService.getOutletDistributors().then(data => {
            this.outletDistributors = data
            this.loading = false
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

			if (this.region.NamaOutlet.trim() && this.region.Distributor.trim() && this.region.KodeOutletNF.trim()) {
                this.$set(this.regions, this.findIndexByDistributor(this.region.Distributor), this.region);
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Updated', life: 3000});
                this.regionDialog = false;
                this.region = {};
			}
        },
        createRegion() {
            this.submitted = true;
            if (this.region.NamaOutlet.trim() && this.region.Distributor.trim() && this.region.KodeOutletNF.trim()) {
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
			this.regions = this.regions.filter(val => val.Distributor !== this.region.Distributor);
			this.deleteRegionDialog = false;
			this.region = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Deleted', life: 3000});
		},
		findIndexByDistributor(Distributor) {
			let index = -1;
			for (let i = 0; i < this.regions.length; i++) {
				if (this.regions[i].Distributor === Distributor) {
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