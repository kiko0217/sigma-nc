<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<!-- <h1>Data dari Email</h1> -->
			<div class="card">
				<Toolbar class="p-mb-4">
					<template slot="left">Data dari Email</template>
					<template slot="right">
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>
				<DataTable :value="dataTemp" 
					:scrollable="true"
					:expandedRows.sync="expandedRows"
					scrollHeight="500px" 
					dataKey="_id"
					@row-expand="onRowExpand" 
					@row-collapse="onRowCollapse"
				>
					<Column :expander="true" headerStyle="width: 3rem" />
					<Column v-for="col of culomnTemp" :field="col" :header="col" :key="col" headerStyle="width: 150px"></Column>
					<template #expansion="slotProps">
						<Toolbar class="p-mb-4">
							<template slot="left">{{slotProps.data.subject}}</template>
							<template slot="right">
								<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
								<!-- <Button label="Mapping" icon="pi pi-upload" class="p-button-help" @click="mapping"  /> -->
							</template>
						</Toolbar>
						<DataTable :value="slotProps.data.attachments" :selection.sync="selectedTemp" selectionMode="single" dataKey="name">
							<Column headerStyle="width:120px">
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
			this.productMappingService.postEdit(data).then(() => {
				this.productMappingService.getProductMappings(data).then.then(data3 => this.productMappings = data3)
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
			if(this.expandedRows.length > 2	){
				this.expandedRows[1] = this.expandedRows[2]
				this.expandedRows.pop()
			}
			// console.log(this.expandedRows)
		},
		onRowCollapse() {
			// this.expandedRows
			// console.log(this.expandedRows)
		},
		downloadFile(data) {
			// console.log(this.expandedRows)
			// console.log(data)
			this.productMappingService.downloadFile(data.name, this.expandedRows[1].subject)
			
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