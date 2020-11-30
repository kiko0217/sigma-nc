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

				<DataTable ref="dt" :value="productMappings" :selection.sync="selectedRegions" dataKey="Distributor" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Manage Product Mapping</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column field="Distributor" header="Distributor" sortable></Column>
					<Column field="ProductDist" header="Product Dist" sortable></Column>
					<Column field="ProductCodeNF" header="Product Code NF" sortable></Column>
					<Column field="ProductDistName" header="Area Name" sortable></Column>
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
						<label for="ProductCodeNF">Product Code NF</label>
						<InputText id="ProductCodeNF" v-model.trim="region.ProductCodeNF" required="true" autofocus :class="{'p-invalid': submitted && !region.ProductCodeNF}" />
						<small class="p-invalid" v-if="submitted && !region.ProductCodeNF">Product Code NF is required.</small>
					</div>
					<div class="p-field">
						<label for="ProductDistName">Product Dist Name</label>
						<InputText id="ProductDistName" v-model.trim="region.ProductDistName" required="true" autofocus :class="{'p-invalid': submitted && !region.ProductDistName}" />
						<small class="p-invalid" v-if="submitted && !region.ProductDistName">Product Dist Name is required.</small>
					</div>
					<div class="p-field">
						<label for="Distributor">Distributor</label>
						<InputText id="Distributor" v-model.trim="region.Distributor" required="true" autofocus :class="{'p-invalid': submitted && !region.Distributor}" />
						<small class="p-invalid" v-if="submitted && !region.Distributor">Distributor Name is required.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveRegion" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteRegionDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="region">Are you sure you want to delete <b>{{region.ProductDistName}}</b>?</span>
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

		<div class="p-col-12">
			<div class="card">
				<Toolbar class="p-mb-4">
					<template slot="left">Unmapping</template>
					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
						<!-- <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  /> -->
					</template>
				</Toolbar>
				<DataTable :value="productUnmapping" :scrollable="true" scrollHeight="500px" dataKey="_id">
					<Column v-for="col of culomnProductUnmapping" :field="col.field" :header="col.header" :key="col" headerStyle="width: 150px"></Column>
				</DataTable>
			</div>
		</div>

		<div class="p-col-12">
			<!-- <h1>Data dari Email</h1> -->
			<div class="card">
				<Toolbar class="p-mb-4">
					<template slot="left">Data dari Email</template>
					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
						<!-- <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  /> -->
					</template>
				</Toolbar>
				<DataTable :value="dataTemp" :scrollable="true" :expandedRows.sync="expandedRows" scrollHeight="500px" dataKey="_id"
				@row-expand="onRowExpand" @row-collapse="onRowCollapse">
					<Column :expander="true" headerStyle="width: 3rem" />
					<Column v-for="col of culomnTemp" :field="col" :header="col" :key="col" headerStyle="width: 150px"></Column>
					<template #expansion="slotProps">
						<Toolbar class="p-mb-4">
							<template slot="left">{{slotProps.data.subject}}</template>
							<template slot="right">
								<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
								<Button label="Mapping" icon="pi pi-upload" class="p-button-help" @click="mapping"  />
							</template>
						</Toolbar>
						<DataTable :value="slotProps.data.attachments" :selection.sync="selectedTemp" selectionMode="single" dataKey="name">
							<Column headerStyle="width:120px" >
								<template #body="slotProps">
									<Button icon="pi pi-arrow-down" class="p-button-rounded p-button-success p-mr-2" @click="downloadFile(slotProps.data)" />
								</template>
							</Column>
							<Column v-for="col of culomnAttachment" :field="col" :header="col" :key="col" headerStyle="width: 150px"></Column>
						</DataTable>
					</template>
				</DataTable>

				<Dialog :visible.sync="unmappingDialog" :style="{width: '900px'}" :modal="true" class="p-fluid">
					<!-- <h1>Test</h1> -->
					<Toolbar>
						<template slot="left">
							{{expandedRows[0].subject}}
						</template>
						<template #right>
							<Button label="Mapping" @click="pushMapping()" class="p-mr-2" />
							<Button label="Unmapping" class="p-button-danger" />
						</template>
					</Toolbar>
					<DataTable v-for="(data, index) of dataTempJson.data" :key="index" :value="data" :scrollable="true" scrollHeight="500px" dataKey="index">
						<Column v-for="col of dataTempJson.headers[index]" :field="col" :header="col" :key="col" headerStyle="width: 175px"></Column>
					</DataTable>
				</Dialog>
			</div>
		</div>

	</div>
</template>

<script>
import ProductMappingService from '../service/ProductMappingService'
export default {
	data() {
		return {
			productUnmapping: null,
			culomnProductUnmapping: [
				{field: 'name', header: 'Product Dist Name'},
				{field: 'code', header: 'Product Dist Code'},
			],
			dataTempJson : {
				headers : [],
				data : []
			},
			selectedTemp : null,
			expandedRows : [{
				subject: null,
			}],
			dataTemp : null,
			filePdu : null,
			culomnTemp: [],
			culomnAttachment: ['name' , 'type'],
			productMappings: null,
			unmappingDialog: false,
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
	productMappingService: null,
	// fs: null,
	created() {
		this.productMappingService = new ProductMappingService();
		this.culomnTemp = ['from', 'subject', 'status', 'createdAt']
		// this.fs = new FS();
	},
	mounted() {
		this.productMappingService.getUnmapping().then(data => this.productUnmapping = data)
		this.productMappingService.getDataFromEmail().then(data=> {
			this.dataTemp = data
			// for (let k in data[0]) {
			// 	this.culomnTemp.push(k)
			// }
			// console.log(this.culomnTemp)
		})
		this.productMappingService.getProductMappings().then(data => this.productMappings = data)
	},
	methods: {
		pushMapping(){
			console.log()
			this.productMappingService.mapping(this.expandedRows[0]._id).then(data => {
				console.log(data)
				this.productMappingService.getUnmapping().then(data => this.productUnmapping = data)
				this.unmappingDialog = false
			})
		},
		mapping() {

			this.productMappingService.getJsonMapping(this.expandedRows[0]._id).then(data => {
				this.dataTempJson = data
				console.log(this.dataTempJson)
			})
			this.unmappingDialog = true
		},
		onRowExpand() {
			if(this.expandedRows.length > 1)this.expandedRows.shift()
			// console.log(this.expandedRows)
		},
		onRowCollapse() {

		},
		downloadFile(data) {
			// console.log(this.expandedRows)
			// console.log(data)
			this.productMappingService.downloadFile(data.name, this.expandedRows[0].subject)
			
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

			if (this.region.ProductDistName.trim() && this.region.ProductCodeNF.trim() && this.region.Distributor.trim()) {
                this.$set(this.regions, this.findIndexByProductCodeNF(this.region.ProductCodeNF), this.region);
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Updated', life: 3000});
                this.regionDialog = false;
                this.region = {};
			}
        },
        createRegion() {
            this.submitted = true;
            if (this.region.ProductDistName.trim() && this.region.ProductCodeNF.trim() && this.region.Distributor.trim()) {
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
			this.regions = this.regions.filter(val => val.ProductCodeNF !== this.region.ProductCodeNF);
			this.deleteRegionDialog = false;
			this.region = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Deleted', life: 3000});
		},
		findIndexByProductCodeNF(ProductCodeNF) {
			let index = -1;
			for (let i = 0; i < this.regions.length; i++) {
				if (this.regions[i].ProductCodeNF === ProductCodeNF) {
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
			this.$rethis.fs.dt.exportCSV();
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