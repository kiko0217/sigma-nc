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
					:value="areas"
					:selection.sync="selectedRegions"
					:loading="loading"
					dataKey="_id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Areas"
				>
					<template #header>
						<div class="table-header">
							<!-- <h5 class="p-m-0">Manage Area</h5> -->
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column headerStyle="width: 150px">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editArea(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteArea(slotProps.data)" />
						</template>
					</Column>
					<Column v-for="(col, index) of columnArea" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px"></Column>
				</DataTable>

				<Dialog :visible.sync="areaDialog" 
					:style="{width: '450px'}" 
					header="Area Details" 
					:modal="true" 
					class="p-fluid"
				>
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-6">
							<label for="Code">Code</label>
							<InputText id="Code" 
								v-model.trim="area.code" 
								required="true" 
								autofocus :class="{'p-invalid': submitted && !area.code}" 
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !area.code">Code is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-6">
							<label for="CodeDept">Code Dept</label>
							<Dropdown inputId="CodeDept" 
								v-model.trim="area.codeDept" 
								:options="depts" :filter="true" 
								optionValue="gh_funccode" 
								optionLabel="gh_funccode"
								placeholder="Select Dept" 
								scrollHeight="100px"
								dataKey="_id"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !area.codeDept">Code Dept is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-6">
							<label for="AreaName">Area Name</label>
							<InputText id="AreaName" v-model.trim="area.name" required="true" autofocus :class="{'p-invalid': submitted && !area.name}" />
							<small class="p-invalid" v-if="submitted && !area.name">Area Name is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-6">
							<!-- <span class="p-float-label"> -->
							<label for="region">Region</label>
							<Dropdown inputId="region" 
								v-model.trim="area.region"
								:options="regions"
								:filter="true"
								optionValue="_id"
								optionLabel="name"
								placeholder="Select Region"
								scrollHeight="100px"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !area.region">Region is required.</small>
							<!-- </span> -->
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-6">
							<label for="Initial">Initial</label>
							<InputText id="Initial" v-model.trim="area.short" required="true" autofocus :class="{'p-invalid': submitted && !area.short}" />
							<small class="p-invalid" v-if="submitted && !area.short">Initial Name is required.</small>
						</div>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveArea" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteAreaDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="area">Are you sure you want to delete <b>{{area.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAreaDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteArea" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteAreasDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="area">Are you sure you want to delete the selected areas?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAreasDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedRegions" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import AreaService from '../service/AreaService'
import RegionService from '../service/RegionService'
import SysFunctService from '../service/SysFunctService'

export default {
	data() {
		return {
			depts: null,
			columnArea:[],
			loading: false,
			areas: null,
			areaDialog: false,
			regions: null,
			deleteAreaDialog: false,
			deleteAreasDialog: false,
			area: {},
			selectedRegions: null,
			filters: {},
            submitted: false,
            createNew: false
		}
	},
	areaService: null,
	regionService: null,
	sysFunctService: null,
	created() {
		this.columnArea = [
			{
				field : 'codeDept',
				header : 'Code Dept'
			},
			{
				field : 'nameRegion',
				header : 'Region'
			},
			{
				field : 'code',
				header : 'Code Area'
			},
			{
				field : 'name',
				header : 'Area'
			},
			{
				field : 'short',
				header : 'Initial'
			},
		]
		this.areaService = new AreaService()
		this.regionService = new RegionService()
		this.sysFunctService = new SysFunctService()
	},
	mounted() {
		this.loading = true
		this.regionService.getRegionMinis()
		.then(data => {
			this.regions = data
			// console.log([...new Set(this.regions.map(({_id:test, ...rest})=> ({test, ...rest})))])
			
		});
		this.sysFunctService.getDepts()
		.then(data => {
			this.depts = data
		})
		this.areaService.getAreas().then(data => {
			this.areas = data
			this.areas = [...new Set(this.areas.map(({region, ...rest})=>({nameRegion:region.name, region:region._id, ...rest})))]
			// console.log(this.areas)
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
			this.area = {};
			this.submitted = false;
            this.areaDialog = true;
            this.createNew = true;
		},
		hideDialog() {
			this.areaDialog = false;
			this.submitted = false;
		},
		edit() {
			this.areaService.editArea(this.area)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.areaService.getAreas().then(data => {
					this.loading = false
					this.areas = data
					this.areas = [...new Set(this.areas.map(({region, ...rest})=>({nameRegion:region.name, region:region._id, ...rest})))]
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		saveArea() {
			this.submitted = true;
			if (this.area.codeDept && 
				this.area.name &&
				this.area.code &&
				this.area.region &&
				this.area.short)
			{
				if(this.createNew){
					this.createArea();
					return;
				}
				// this.submitted = true;
                this.edit()
                this.areaDialog = false;
                this.area = {};
			}
		},
		create() {
			this.areaService.createArea(this.area)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.areaService.getAreas().then(data => {
					this.loading = false
					this.areas = data
					this.areas = [...new Set(this.areas.map(({region, ...rest})=>({nameRegion:region.name, region:region._id, ...rest})))]
					// console.log(this.areas)
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
        createArea() {
			this.create()
			this.areaDialog = false;
			this.area = {};
			this.createNew = false;
        },
		editArea(area) {
			this.createNew = false;
			this.area = {...area};
			this.areaDialog = true;
		},
		confirmDeleteArea(area) {
			this.area = area;
			this.deleteAreaDialog = true;
		},
		deleteArea() {
			this.areaService.deleteArea(this.area)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.areaService.getAreas().then(data => {
					this.loading = false
					this.areas = data
					this.areas = [...new Set(this.areas.map(({region, ...rest})=>({nameRegion:region.name, region:region._id, ...rest})))]
					// console.log(this.areas)
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
			// this.areas = this.areas.filter(val => val.Code !== this.area.Code);
			this.deleteAreaDialog = false;
			this.area = {};
			
		},
		findIndexByCode(Code) {
			let index = -1;
			for (let i = 0; i < this.areas.length; i++) {
				if (this.areas[i].Code === Code) {
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
			this.deleteAreasDialog = true;
		},
		deleteSelectedRegions() {
			this.areas = this.areas.filter(val => !this.selectedRegions.includes(val));
			this.deleteAreasDialog = false;
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