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
			<h1>Data PDU dari Email</h1>
			<div class="card" v-for="(data, index) of dataPdu" :key="index" >
				<Toolbar class="p-mb-4">
					<template slot="left">{{ data.name }}</template>
					<template slot="right">
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>
				<DataTable :value="data" :scrollable="true" scrollHeight="500px">
					<Column v-for="col of culomnPdu" :field="col.field" :header="col.field" :key="col.field" headerStyle="width: 150px"></Column>
				</DataTable>
			</div>
		</div>

		<div class="p-col-12">
			<h1>Data PT.Combi Putra dari Email</h1>
			<div class="card" v-for="(data, index) of dataCombiPutra" :key="index" >
				<Toolbar class="p-mb-4">
					<template slot="left">{{ data.name }}</template>
					<template slot="right">
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>
				<DataTable :value="data" :scrollable="true" scrollHeight="500px">
					<Column v-for="col of culomnCombiPutra" :field="col.field" :header="col.field" :key="col.field" headerStyle="width: 150px"></Column>
				</DataTable>
			</div>
		</div>
	</div>
</template>

<script>
import ProductMappingService from '../service/ProductMappingService'
export default {
	data() {
		return {
			filePdu : null,
			culomnPdu: null,
			dataPdu : [],
			fileCombiPutra : null,
			culomnCombiPutra: null,
			dataCombiPutra : [],
			productMappings: null,
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
		this.filePdu = [
			{name: '1605431292552_pduOnogateAkhirBulanOkt20Xls.json'},
			{name: '1605431292566_pduOnoiwaPlusAkhirBulanOkt20Xls.json'},
			{name: '1605431292589_pduOnoiwaAkhirBulanOkt2020Xls.json'}
		]
		this.fileCombiPutra = [
			{name: '1605431292044_ptCombiPutraXls.json'},
		]
		this.culomnPdu = [
			{field: 'TANGGAL'},
            {field: 'NOMOR BUKTI'},
            {field: 'KODE CUSTOMER'},
			{field: 'NAMA CUSTOMER'},
			{field: 'ALAMAT'},
			{field: 'KOTA'},
			{field: 'KODE CABANG'},
			{field: 'KODE SALES'},
			{field: 'KODE BARANG'},
			{field: 'NAMA BARANG'},
			{field: 'SATUAN'},
			{field: 'QTY'},
			// {field: 'H.N.A'},
			// {field: 'DISC.'},
			// {field: 'NILAI'},
			// {field: 'DISC. VALUE'},
			// {field: 'NILAI NETTO'},
			// {field: 'TOTAL'},
			
		]
		this.culomnCombiPutra = [
			{field: 'kd barang"'},
            {field: 'Nama Barang'},
            {field: 'Kd customer'},
			{field: 'Nama'},
			{field: 'Alamat'},
			{field: 'Kota'},
			{field: 'Tanggal Faktur'},
			{field: 'Nomor Faktur'},
			{field: 'ID Cabang'},
			{field: 'Nama Cabang'},
			{field: 'Qty Sales'},
			{field: 'Satuan'},
			{field: 'Harga satuan'},
			
		]
		// this.fs = new FS();
	},
	mounted() {
		this.productMappingService.getProductMappings().then(data => this.productMappings = data)
		this.filePdu.forEach(element=> {
			this.productMappingService.getDataFromPdu(element.name).then(data => {
				data["name"] = element.name
				this.dataPdu.push(data)
			});
			this.$toast.add({severity:'info', summary: 'Data PDU Masuk', detail: '', life: 10000});
		});
		this.fileCombiPutra.forEach(element=> {
			this.productMappingService.getDataFromCombiPutra(element.name).then(data => {
				data["name"] = element.name
				this.dataCombiPutra.push(data)
			});
			this.$toast.add({severity:'info', summary: 'Data PT Combi Putra Masuk', detail: '', life: 10000});
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