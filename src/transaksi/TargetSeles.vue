<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" 
							icon="pi pi-plus"
							class="p-button-success p-mr-2"
							:disabled="loading"
							@click="openNew"
						/>
						<!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedRegions || !selectedRegions.length" /> -->
					</template>

					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
						<Button label="Export"
							icon="pi pi-upload"
							class="p-button-help"
							:disabled="loading"
							@click="exportCSV($event)"
						/>
					</template>
				</Toolbar>

				<DataTable ref="dt" 
					:value="targetSales"
					scrollHeight="500px"
					:scrollable="true" 
					dataKey="_id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					:loading="loading"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Target Sales"
				>
					<Column headerStyle="width: 6em" 
						headerClass="p-text-center" bodyClass="p-text-center">
						<template #body="slotProps">
							<Button type="button" 
								icon="pi pi-trash"
								class="p-button-danger"
								style="margin-right: .5em"
								@click="confirmDeleteTargetSale(slotProps.data)"
							></Button>
							<Button type="button" 
								icon="pi pi-search"
								class="p-button-success"
								style="margin-right: .5em"
								@click="openView(slotProps.data)"
							></Button>
						</template>
					</Column>
					<Column v-for="(col, index) of columnTargetSales"
						:field="col.field" 
						:header="col.header"
						:key="index"
						headerStyle="width: 150px"
					>
					</Column>
				</DataTable>

				<Dialog :visible.sync="targetSalesNewDialog" 
					:style="{width: '1000px'}" 
					header="Target Sales" 
					:modal="true" 
					class="p-fluid"
					:maximizable="true"
				>
					<!-- ini bisa diisi dengan peta nantinya -->
                    <div class="p-fluid p-grid">
                        <div class="p-field p-col-12 p-md-3">
                            <!-- <span class="p-float-label"> -->
                            <label for="detailer">Detailer</label>
                            <Dropdown inputId="detailer" 
								v-model.trim="targetSaleData.detailer"
								:options="detailers"
								:filter="true"
								optionValue="_id"
								optionLabel="name"
								placeholder="Select Detailer"
								scrollHeight="100px"
								:disabled="!createNew"
								@change="detailerChange()"
							>
                            </Dropdown>
							<small class="p-invalid" 
								v-if="submitted && !targetSale.detailer"
							>Detailer is required.</small>
                            <!-- </span> -->
                        </div>
                        <div class="p-field p-col-12 p-md-3">
                            <label for="Tahun">Tahun</label>
                            <Dropdown inputId="Tahun"
								v-model.trim="targetSaleData.tahun"
								:options="tahuns"
								placeholder="Select Tahun"
								:disabled="!createNew"
								@change="tahunChange()"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !targetSale.tahun">Tahun is required.</small>
                        </div>
					</div>
					<!-- <div class="p-fluid p-grid">
						
					</div> -->
					<DataTable :value="targetSaleQty"
						editMode="cell"
						:scrollable="true"
						scrollHeight="500px"
						dataKey="product"
					>
						<template #header>
							<div class="table-header">
								<h5 class="p-m-0">Target Qty</h5>
							</div>
						</template>
						<Column field="product" 
							header="Product"
							headerStyle="width: 150px"
						>
							<template #body="slotProps">
								{{showTargetProduct(slotProps.data['product'])}}
							</template>
							<template #footer>
								Total
							</template>
						</Column>
						<Column field="targetTahun" 
							header="Target per Tahun"
							headerStyle="width: 150px"
						>
							<template #editor="slotProps">
								<InputNumber v-model="slotProps.data['targetTahun']"/>
							</template>
							<template #body="slotProps">
								{{editTarget("Qty",slotProps.data['targetTahun'])}}
							</template>
						</Column>
						<Column field="targetBulan" 
							header="Target per Bulan"
							headerStyle="width: 150px"
						>
							<template #editor="slotProps">
								<InputNumber v-model="slotProps.data['targetBulan']"/>
							</template>
							<template #body="slotProps">
								{{editTarget("Qty", slotProps.data['targetBulan'])}}
							</template>
						</Column>
						<Column v-for="(col, index) of columnBulan"
							:field="col.field" 
							:header="col.header"
							:key="index"
							headerStyle="width: 150px"
						>
							<template #editor="slotProps">
								<InputNumber v-model="slotProps.data[col.field]"/>
							</template>
							<template #body="slotProps">
								{{editTarget("Qty", slotProps.data[col.field])}}
							</template>
						</Column>
					</DataTable>
					<DataTable :value="targetSaleVal"
						editMode="cell"
						:scrollable="true"
						scrollHeight="500px"
						dataKey="product"
					>
						<template #header>
							<div class="table-header">
								<h5 class="p-m-0">Target Val</h5>
							</div>
						</template>
						<Column field="product" 
							header="Product"
							headerStyle="width: 150px"
						>
							<template #body="slotProps">
								{{showTargetProduct(slotProps.data['product'])}}
							</template>
							<template #footer>
								Total
							</template>
						</Column>
						<Column field="targetTahun" 
							header="Target per Tahun"
							headerStyle="width: 150px"
						>
							<template #editor="slotProps">
								<InputNumber v-model="slotProps.data['targetTahun']"/>
							</template>
							<template #body="slotProps">
								{{editTarget("Val",slotProps.data['targetTahun'])}}
							</template>
						</Column>
						<Column field="targetBulan" 
							header="Target per Bulan"
							headerStyle="width: 150px"
						>
							<template #editor="slotProps">
								<InputNumber v-model="slotProps.data['targetBulan']"/>
							</template>
							<template #body="slotProps">
								{{editTarget("Val", slotProps.data['targetBulan'])}}
							</template>
						</Column>
						<Column v-for="(col, index) of columnBulan"
							:field="col.field" 
							:header="col.header"
							:key="index"
							headerStyle="width: 150px"
						>
							<template #editor="slotProps">
								<InputNumber v-model="slotProps.data[col.field]"/>
							</template>
							<template #body="slotProps">
								{{editTarget("Val", slotProps.data[col.field])}}
							</template>
						</Column>
					</DataTable>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" 
							icon="pi pi-check"
							class="p-button-text"
							@click="saveTargetSale"
							:disabled="!createNew"
						/>
					</template>
				</Dialog>
				<Dialog :visible.sync="deleteTargetSaleDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="targetSale.detailer">Are you sure you want to delete <b>{{targetSale.detailer.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteTargetSaleDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteTargetSale" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import DetailerService from '../service/DetailerService'
import ProductService from '../service/ProductService'
import TargetSaleService from '../service/TargetSaleService'

export default {
	data() {
		return {
			loading: false,
			tahuns: [],
			targetSaleQty: [],
			targetSaleVal: [],
			columnBulan: [],
			columnTargetSales: [],
            products: null,
            filters: {},
            detailers: null,
            detailerNew: null,
			targetSales: null,
			targetSale: {},
			targetSaleData: {},
            targetSalesNewDialog: false,
			submitted: false,
			createNew: false,
			deleteTargetSaleDialog: false,
		}
	},
	targetSaleService: null,
    productService: null,
	detailerSErvice: null,
	created() {
		this.typeTarget = [
			{
				type: 'Qty',
				suffix: ' Qty',
				mode: 'decimal'
			},
			{
				type: 'Val',
				mode: 'currency'
			}
		]
		this.tahuns = [...Array(11).keys()].map(x => x+2020)
		this.columnBulan = [
			{
				field: 'january',
				header: 'January'
			},
			{
				field: 'febuary',
				header: 'Febuary'
			},
			{
				field: 'maret',
				header: 'Maret'
			},
			{
				field: 'april',
				header: 'April'
			},
			{
				field: 'may',
				header: 'May'
			},
			{
				field: 'june',
				header: 'June'
			},
			{
				field: 'july',
				header: 'July'
			},
			{
				field: 'august',
				header: 'August'
			},
			{
				field: 'september',
				header: 'September'
			},
			{
				field: 'october',
				header: 'October'
			},
			{
				field: 'november',
				header: 'November'
			},
			{
				field: 'december',
				header: 'December'
			},

		]
		this.columnTargetSales = [
			{
				field : 'code',
				header : 'Code'
			},
			{
				field : 'tahun',
				header : 'Tahun'
			},
			{
				field : 'detailerName',
				header : 'Detailer'
			},
			{
				field : 'productName',
				header : 'Product'
			},
			{
				field : 'targetPerTahun',
				header : 'Target Per Tahun (Qty)'
			},
		]
        this.productService = new ProductService();
		this.detailerService = new DetailerService();
		this.targetSaleService = new TargetSaleService();
		this.targetSaleQty = new Array()
		this.targetSaleVal = new Array()
	},
	mounted() {
		this.loading = true
        this.productService.getProducts()
        .then(data => this.products = data)
        this.detailerService.getDetailers()
		.then(data => {
			this.detailers = data
		})
		this.targetSaleService.getTargetSales()
		.then(data => {
			this.targetSales = data
			this.targetSales = [...new Set(this.targetSales.map(({
				product,
				detailer,
				...rest
			}) => ({
				product: product._id,
				productName: product.name,
				detailer: detailer._id,
				detailerName: detailer.name,
				...rest
			})))]
			this.loading = false
		})
	},
	methods: {
		showTargetProduct(idProduct) {
			return this.products[this.findIndexByCode(idProduct, '_id', this.products)].short
		},
		detailerChange() {
			for (let i in this.products) {
				this.targetSaleQty[i].detailer = this.targetSaleData.detailer
				this.targetSaleVal[i].detailer = this.targetSaleData.detailer
			}
		},
		tahunChange() {
			for (let i in this.products) {
				this.targetSaleQty[i].tahun = this.targetSaleData.tahun
				this.targetSaleVal[i].tahun = this.targetSaleData.tahun
			}
		},
		hideDialog() {
			this.targetSalesNewDialog = false
			this.submitted = false
		},
		editTarget(type, value) {
			// console.log(type)
			if(!value) {
				value = 0
			}
			if(type === 'Qty'){
				return value + ' Qty'
			} else {
				return this.formatCurrency(value)
			}
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
			return value.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'});
		},
		openNew() {
			this.targetSaleData.type = {}
			this.targetSaleQty = new Array()
			this.targetSaleVal = new Array()
			this.products.forEach( elm => {
				this.targetSaleQty.push({
					product: elm._id
				})
				this.targetSaleVal.push({
					product: elm._id
				})
			})
			this.submitted = false
			this.targetSalesNewDialog = true
			this.createNew = true
		},
		openView(targetSale) {
			console.log(targetSale)
			this.createNew = false
			// this.targetSale = {...targetSale};
			this.targetSalesNewDialog = true;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		saveTargetSale() {
			this.submitted = true;
			// console.log(this.targetSale)
			// console.log(this.targetSaleData)
			// console.log(this.targetSaleQty)
			// console.log(this.targetSaleVal)
			if (this.targetSaleData.detailer &&
				this.targetSaleData.tahun) {
					this.createTargetSale()	

				}
		},
		create() {
			this.targetSaleService.createTargetSale({
				targetSale: this.targetSaleData,
				targetSaleQty: this.targetSaleQty,
				targetSaleVal: this.targetSaleVal
			})
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				// this.targetSaleService.getTargetSales()
				// .then(data => {
				// 	this.targetSales = data
				// 	this.targetSales = [...new Set(this.targetSales.map(({
				// 		product,
				// 		detailer,
				// 		...rest
				// 	}) => ({
				// 		product: product._id,
				// 		productName: product.name,
				// 		detailer: detailer._id,
				// 		detailerName: detailer.name,
				// 		...rest
				// 	})))]
				// 	this.loading = false
				// })

			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})

		},
		createTargetSale() {
			this.create()
			this.targetSalesNewDialog = false
			this.targetSale = {}
			this.createNew = false
		},
		delete() {
			this.targetSaleService.deleteTargetSale(this.targetSale)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.targetSaleService.getTargetSales()
				.then(data => {
					this.targetSales = data
					this.targetSales = [...new Set(this.targetSales.map(({
						product,
						detailer,
						...rest
					}) => ({
						product: product._id,
						productName: product.name,
						detailer: detailer._id,
						detailerName: detailer.name,
						...rest
					})))]
					this.loading = false
				})

			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		confirmDeleteTargetSale(targetSale) {
			this.targetSale =  {...targetSale}
			this.deleteTargetSaleDialog = true
		},
		deleteTargetSale() {
			this.delete()
			this.targetSale =  {}
			this.deleteTargetSaleDialog = false
		},
		findIndexByCode(id, key, data) {
			let index = -1;
			for (let i = 0; i < data.length; i++) {
				if (data[i][key] === id) {
					index = i;
					break;
				}
			}
			return index;
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