<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
						<!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedRegions || !selectedRegions.length" /> -->
					</template>

					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  /> -->
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="targetSales" scrollHeight="500px" :scrollable="true"  dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions">
					<Column field="nfCode" header="Tahun" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Detailer" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Product" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Target/Tahun" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Target/Bulan" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Januari" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Febuari" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Maret" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="April" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Mei" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Juni" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Juli" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Agustus" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="September" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Oktober" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="November" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Desember" headerStyle="width: 150px"></Column>
				</DataTable>

				<Dialog :visible.sync="targetSalesNewDialog" :style="{width: '600px'}" header="Target Sales" :modal="true" class="p-fluid">
					<!-- ini bisa diisi dengan peta nantinya -->
                    <div class="p-fluid p-grid">
                        <div class="p-field p-col-12 p-md-6">
                            <!-- <span class="p-float-label"> -->
                            <label for="detailer">Detailer</label>
                            <Dropdown inputId="detailer" v-model="detailerNew" :options="detailers" :filter="true" optionValue="code" optionLabel="name" placeholder="Select Detailer" scrollHeight="100px">
                            </Dropdown>
                            <!-- </span> -->
                        </div>
                        <div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Product</label>
                            <Dropdown inputId="detailer" v-model="productNew" :options="products" :filter="true" optionValue="code" optionLabel="name" placeholder="Select Detailer" scrollHeight="100px">
                            </Dropdown>
                        </div>
                        <div class="p-field p-col-12 p-md-6">
                            <label for="monthpicker">Tahun</label>
                            <Calendar id="monthpicker" v-model="yearNew" view="year" dateFormat="yy" :yearNavigator="true" yearRange="2000:2030" />
                        </div>
                        <div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Target Tahunan</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Januari</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Febuari</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Maret</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">April</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Mei</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Juni</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Juli</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Agustus</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">September</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Oktober</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">November</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Desember</label>
                            <InputNumber id="currency-id" v-model="targetTahunNew" mode="currency" currency="IDR" locale="id-ID" />
                        </div>
						<div class="p-field p-col-12 p-md-12">
							<span class="p-float-label">
								<Textarea id="textarea" v-model="descriptionNew" rows="3" />
								<label for="textarea">Keterangan</label>
							</span>
						</div>
                    </div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import DetailerService from '../service/DetailerService'
import ProductService from '../service/ProductService'

export default {
	data() {
		return {
            products: null,
            productNew: null,
            yearNew: null,
            targetTahunNew: 0,
            filters: {},
            detailers: null,
            detailerNew: null,
			targetSales: null,
            targetSalesNewDialog: false,
            
		}
    },
    productService: null,
	detailerSErvice: null,
	created() {
        this.productService = new ProductService();
        this.detailerService = new DetailerService();
	},
	mounted() {
        this.productService.getProducts()
        .then(data => this.products = data)
        this.detailerService.getDetailers()
		.then(data => {
			this.detailers = data
		})

	},
	methods: {
		hideDialog() {
			this.createDialog = false
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
        },
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		},
		openNew() {
			this.region = {};
			this.targetSalesNewDialog = true;
		},
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