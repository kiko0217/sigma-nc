<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" :disabled="loading"  icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedRegions || !selectedRegions.length" />
					</template>

					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
						<Button label="Export" :disabled="loading"  icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="regions" :selection.sync="selectedRegions" :loading="loading" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Manage Regions</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column headerStyle="width: 150px">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editRegion(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteRegion(slotProps.data)" />
						</template>
					</Column>
					<Column v-for="(col, index) of columnRegion" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px"></Column>
				</DataTable>

				<Dialog :visible.sync="regionDialog" :style="{width: '450px'}" header="Region Details" :modal="true" class="p-fluid">
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-field">
						<label for="codeDept">Code Dept</label>
						<InputText id="codeDept" v-model.trim="region.codeDept" required="true" autofocus :class="{'p-invalid': submitted && !region.codeDept}" />
						<small class="p-invalid" v-if="submitted && !region.codeDept">Code Region is required.</small>
					</div>
					<div class="p-field">
						<label for="codeRegion">Code Region</label>
						<InputText id="codeRegion" v-model.trim="region.code" required="true" autofocus :class="{'p-invalid': submitted && !region.code}" />
						<small class="p-invalid" v-if="submitted && !region.code">Code Region is required.</small>
					</div>
					<div class="p-field">
						<label for="regionName">Region Name</label>
						<InputText id="regionName" v-model.trim="region.name" required="true" autofocus :class="{'p-invalid': submitted && !region.name}" />
						<small class="p-invalid" v-if="submitted && !region.name">Region Name is required.</small>
					</div>
					<div class="p-field">
						<label for="Initial">Initial</label>
						<InputText id="Initial" v-model.trim="region.short" required="true" autofocus :class="{'p-invalid': submitted && !region.short}" />
						<small class="p-invalid" v-if="submitted && !region.short">Initial Name is required.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveRegion" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteRegionDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="region">Are you sure you want to delete <b>{{region.name}}</b>?</span>
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
import RegionService from '../service/RegionService';

export default {
	data() {
		return {
			loading: false,
			columnRegion:[],
			regions: null,
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
	regionService: null,
	created() {
		this.columnRegion = [
			{
				field : 'codeDept',
				header : 'Code Dept'
			},
			{
				field : 'code',
				header : 'Code Region'
			},
			{
				field : 'name',
				header : 'Region Name'
			},
			{
				field : 'short',
				header : 'Initial'
			},
		]
		this.regionService = new RegionService();
	},
	mounted() {
		this.loading = true
		this.regionService.getRegions()
		.then(data => {
			this.regions = data
			this.loading = false
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
			// console.log(this.region)
			if (this.region.codeDept.trim() && this.region.name.trim() && this.region.code.trim() && this.region.short.trim()) {
				this.regionService.editRegion(this.region)
				.then(msg => {
					this.loading = true
					this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
					this.region = {};
					this.regionDialog = false;
					this.regionService.getRegions()
					.then(data => {
						this.regions = data
						this.loading = false
					});
				})
				.catch(err => {
					this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
				})
                this.regionDialog = false;
                this.region = {};
			}
        },
        createRegion() {
			this.submitted = true;
			
            if (this.region.codeDept.trim() && this.region.name.trim() && this.region.code.trim() && this.region.short.trim()) {
                this.regionService.createRegion(this.region)
				.then(msg => {
					this.loading = true
					this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
					this.region = {};
					this.regionDialog = false;
					this.createNew = false;
					this.regionService.getRegions()
					.then(data => {
						this.regions = data
						this.loading = false
					});
				})
				.catch(err => {
					this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
					this.regionDialog = false;
					this.region = {};
					this.createNew = false;
				})
                
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
			this.regionService.deleteRegion(this.region)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.region = {};
				this.deleteRegionDialog = false;
				this.regionService.getRegions()
				.then(data => {
					this.regions = data
					this.loading = false
				});
			})
			.catch(err => {
				this.deleteRegionDialog = false;
				this.region = {};
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
			// this.regions = this.regions.filter(val => val.CodeRegion !== this.region.CodeRegion);
			// this.deleteRegionDialog = false;
			// this.region = {};
			// this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Deleted', life: 3000});
		},
		findIndexByCode(code) {
			let index = -1;
			for (let i = 0; i < this.regions.length; i++) {
				if (this.regions[i]._id === code) {
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