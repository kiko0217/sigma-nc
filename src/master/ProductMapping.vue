<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">Mapping</template>
					<template slot="right">
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>

				</Toolbar>
				<DataTable ref="mapping" :value="productUnmapping" :scrollable="true" scrollHeight="500px" dataKey="_id" editMode="cell" class="editable-cells-table" :filters="filters">
					<template #header>
						<div class="table-header">
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column headerStyle="width: 100px">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editProductMapping(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteRegion(slotProps.data)" />
						</template>
					</Column>
					<Column v-for="(col, index) of culomnProductUnmapping" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Code Prod Nucleus" headerStyle="width: 150px" :sortable="true">
						<template #editor="slotProps">
							<InputText v-model="slotProps.data['nfCode']" />
						</template>
					</Column>
					<Column field="createdAt" header="Created" headerStyle="width: 150px">
						<template #body="slotProps">
							<span>{{formatDate(slotProps.data.createdAt)}}</span>
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

	</div>
</template>

<script>
import ProductMappingService from '../service/ProductMappingService'
export default {
	data() {
		return {
			productUnmapping: null,
			culomnProductUnmapping: [
				{field: 'distributor.nfCode', header: 'Distributor'},
				{field: 'code', header: 'Product Dist Code'},
				{field: 'name', header: 'Product Dist Name'},
				// {field: 'nfCode', header: 'Code Prod Nucleus'},
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
		editProductMapping(data){
			// console.log(data)
			this.productMappingService.postEdit(data)
			.then(() => {
				// this.productMappingService.getProductMappings(data).then.then(data3 => this.productMappings = data3)
				this.$toast.add({severity:'success', summary: 'Successful', detail: 'Edit Success', life: 3000});
			})
		},
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
			console.log(this.expandedRows)
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
			this.$refs.mapping.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteRegionsDialog = true;
		},
		deleteSelectedRegions() {
			this.regions = this.regions.filter(val => !this.selectedRegions.includes(val));
			this.deleteRegionsDialog = false;
			this.selectedRegions = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Regions Deleted', life: 3000});
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

            return day + '-' + month + '-' + date.getFullYear();
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