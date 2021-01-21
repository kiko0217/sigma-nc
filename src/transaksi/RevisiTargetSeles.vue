<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<!-- <Button label="New" 
							icon="pi pi-plus"
							class="p-button-success p-mr-2"
							:disabled="loading"
							@click="openNew"
						/> -->
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
					:value="revisiTargetSales"
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
							<!-- <Button type="button" 
								icon="pi pi-trash"
								class="p-button-danger"
								style="margin-right: .5em"
								@click="confirmDeleteTargetSale(slotProps.data)"
							></Button> -->
							<Button type="button" 
								icon="pi pi-pencil"
								class="p-button-success"
								style="margin-right: .5em"
								@click="openView(slotProps.data)"
							></Button>
						</template>
					</Column>
					<Column v-for="(col, index) of columnRevisiTargetSales"
						:field="col.field" 
						:header="col.header"
						:key="index"
						headerStyle="width: 150px"
					>
						<template #body="slotProps" v-if="col.field === 'detailer'">
								{{showDetailer(slotProps.data['detailer'])}}
							</template>
					</Column>
				</DataTable>

				<Dialog :visible.sync="revisiTargetSalesNewDialog" 
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
								v-model.trim="revisiTargetSaleData.detailer"
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
								v-if="submitted && !revisiTargetSale.detailer"
							>Detailer is required.</small>
                            <!-- </span> -->
                        </div>
                        <div class="p-field p-col-12 p-md-3">
                            <label for="Tahun">Tahun</label>
                            <Dropdown inputId="Tahun"
								v-model.trim="revisiTargetSaleData.tahun"
								:options="tahuns"
								placeholder="Select Tahun"
								:disabled="!createNew"
								@change="tahunChange()"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.tahun">Tahun is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-3" v-if="!createNew">
                            <!-- <span class="p-float-label"> -->
                            <label for="revisi">Revisi</label>
							<InputText v-model.trim="revisiTargetSaleData.code"
								:disabled="true"
							/>
						</div>
					</div>
					<!-- <div class="p-fluid p-grid">
						
					</div> -->
					<DataTable :value="revisiTargetSaleQty"
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
							<template #editor="slotProps" v-if="!createNew">
								<InputNumber v-model="slotProps.data['targetTahun']" @input="changeTahunQty($event, slotProps.index)"/>
							</template>
							<template #body="slotProps">
								{{editTarget("Qty",slotProps.data['targetTahun'])}}
							</template>
						</Column>
						<Column field="targetBulan" 
							header="Target per Bulan"
							headerStyle="width: 150px"
						>
							<template #editor="slotProps" v-if="!createNew">
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
							<template #editor="slotProps" v-if="!createNew">
								<InputNumber v-model="slotProps.data[col.field]"/>
							</template>
							<template #body="slotProps">
								{{editTarget("Qty", slotProps.data[col.field])}}
							</template>
						</Column>
					</DataTable>
					<DataTable :value="revisiTargetSaleVal"
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
							<template #body="slotProps" >
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
							<template #editor="slotProps" v-if="!createNew">
								<InputNumber v-model="slotProps.data['targetTahun']" @input="changeTahunVal($event, slotProps.index)"/>
							</template>
							<template #body="slotProps">
								{{editTarget("Val",slotProps.data['targetTahun'])}}
							</template>
						</Column>
						<Column field="targetBulan" 
							header="Target per Bulan"
							headerStyle="width: 150px"
						>
							<template #editor="slotProps" v-if="!createNew">
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
							<template #editor="slotProps" v-if="!createNew">
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
							@click="saveRevisiTargetSale"
							:disabled="createNew"
						/>
					</template>
				</Dialog>
				<Dialog :visible.sync="deleteRevisiTargetSaleDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="revisiTargetSale.detailer">Are you sure you want to delete <b>{{showDetailer(revisiTargetSale.detailer)}}</b>'s Target?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRevisiTargetSaleDialog = false"/>
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
import RevisiTargetSaleService from '../service/RevisiTargetSaleService'

export default {
	data() {
		return {
			loading: false,
			tahuns: [],
			revisiTargetSaleQty: [],
			revisiTargetSaleVal: [],
			columnBulan: [],
			columnRevisiTargetSales: [],
            products: null,
            filters: {},
            detailers: null,
			revisiTargetSales: null,
			revisiTargetSale: {},
			revisiTargetSaleData: {},
            revisiTargetSalesNewDialog: false,
			submitted: false,
			createNew: false,
			deleteRevisiTargetSaleDialog: false,
		}
	},
	revisiTargetSaleService: null,
	productService: null,
	detailerService: null,
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
		this.columnRevisiTargetSales = [
			{
				field : 'tahun',
				header : 'Tahun'
			},
			{
				field : 'detailer',
				header : 'Detailer'
			},
			{
				field : 'code',
				header : 'Revisi'
			},
		]
        this.productService = new ProductService();
		this.detailerService = new DetailerService();
		this.revisiTargetSaleService = new RevisiTargetSaleService();
		this.revisiTargetSaleQty = new Array()
		this.revisiTargetSaleVal = new Array()
	},
	mounted() {
		this.loading = true
        this.productService.getProducts()
        .then(data => this.products = data)
        this.detailerService.getDetailers()
		.then(data => {
			this.detailers = data
		})
		this.revisiTargetSaleService.getRevisiTargetSales()
		.then(dt => {
			this.revisiTargetSales = dt
			// this.revisiTargetSales = [...new Set(this.revisiTargetSales.map(({
			// 	product,
			// 	detailer,
			// 	...rest
			// }) => ({
			// 	product: product._id,
			// 	productName: product.name,
			// 	detailer: detailer._id,
			// 	detailerName: detailer.name,
			// 	...rest
			// })))]
			// console.log(this.revisiTargetSales)
			this.loading = false
		})
	},
	methods: {
		changeTahunVal(val, index){
			// let lenProducts = this.products.length
			let targetTahun = val
			let valPerBulan = val/12
			if ((valPerBulan > 0) && (valPerBulan < 1)) {
                    valPerBulan = 1
			} else {
				// qty = Math.round(this.breakdown.products[key]/len)
				valPerBulan = Math.round(valPerBulan)
			}
			// console.log(valPerBulan)
			// console.log(val)
			this.revisiTargetSaleVal[index].targetBulan = valPerBulan
			for (let bulan in this.columnBulan) {
				// console.log(bulan)
				if (targetTahun > 0) {
					if (bulan == 11) {
						// console.log('bulan terakhir')
						this.revisiTargetSaleVal[index][this.columnBulan[bulan].field] = targetTahun
						targetTahun = 0
					} else {
						if( targetTahun > valPerBulan) {
							this.revisiTargetSaleVal[index][this.columnBulan[bulan].field] = valPerBulan
							targetTahun -= valPerBulan
						} else {
							console.log('target bulan :' +targetTahun)
							
							this.revisiTargetSaleVal[index][this.columnBulan[bulan].field] = targetTahun
							targetTahun = 0
						}
					}
					
				} else {
					this.revisiTargetSaleVal[index][this.columnBulan[bulan].field] = 0
				}
				// console.log(targetTahun)
				// console.log('bulan '+ bulan + ' :' + this.revisiTargetSaleVal[index][this.columnBulan[bulan].field])
			}
		},
		changeTahunQty(qty, index){
			// let lenProducts = this.products.length
			let targetTahun = qty
			let qtyPerBulan = qty/12
			if ((qtyPerBulan > 0) && (qtyPerBulan < 1)) {
                    qtyPerBulan = 1
			} else {
				// qty = Math.round(this.breakdown.products[key]/len)
				qtyPerBulan = Math.round(qtyPerBulan)
			}
			// console.log(qtyPerBulan)
			// console.log(qty)
			this.revisiTargetSaleQty[index].targetBulan = qtyPerBulan
			for (let bulan in this.columnBulan) {
				// console.log(bulan)
				if (targetTahun > 0) {
					if (bulan == 11) {
						// console.log('bulan terakhir')
						this.revisiTargetSaleQty[index][this.columnBulan[bulan].field] = targetTahun
						targetTahun = 0
					} else {
						if( targetTahun > qtyPerBulan) {
							this.revisiTargetSaleQty[index][this.columnBulan[bulan].field] = qtyPerBulan
							targetTahun -= qtyPerBulan
						} else {
							console.log('target bulan :' +targetTahun)
							
							this.revisiTargetSaleQty[index][this.columnBulan[bulan].field] = targetTahun
							targetTahun = 0
						}
					}
					
				} else {
					this.revisiTargetSaleQty[index][this.columnBulan[bulan].field] = 0
				}
				// console.log(targetTahun)
				// console.log('bulan '+ bulan + ' :' + this.revisiTargetSaleVal[index][this.columnBulan[bulan].field])
			}
		},
		showDetailer (idDetailer) {
			return this.detailers[this.findIndexByCode(idDetailer, '_id', this.detailers)].name
		},
		showTargetProduct(idProduct) {
			return this.products[this.findIndexByCode(idProduct, '_id', this.products)].short
		},
		detailerChange() {
			for (let i in this.products) {
				this.revisiTargetSaleQty[i].detailer = this.revisiTargetSaleData.detailer
				this.revisiTargetSaleVal[i].detailer = this.revisiTargetSaleData.detailer
			}
		},
		tahunChange() {
			for (let i in this.products) {
				this.revisiTargetSaleQty[i].tahun = this.revisiTargetSaleData.tahun
				this.revisiTargetSaleVal[i].tahun = this.revisiTargetSaleData.tahun
			}
		},
		hideDialog() {
			this.revisiTargetSalesNewDialog = false
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
			this.revisiTargetSaleData = {}
			this.revisiTargetSaleQty = new Array()
			this.revisiTargetSaleVal = new Array()
			this.products.forEach( elm => {
				this.revisiTargetSaleQty.push({
					product: elm._id
				})
				this.revisiTargetSaleVal.push({
					product: elm._id
				})
			})
			this.submitted = false
			this.revisiTargetSalesNewDialog = true
			this.createNew = true
		},
		openView(revisiTargetSale) {
			// console.log(revisiTargetSale)
			this.revisiTargetSaleData = {
				detailer : revisiTargetSale.detailer,
				tahun: revisiTargetSale.tahun,
				code: revisiTargetSale.code,
				targetSale: revisiTargetSale.targetSale
			},
			this.revisiTargetSaleQty = revisiTargetSale.revisiTargetSaleQtys
			// console.log(this.revisiTargetSaleQty)
			this.revisiTargetSaleVal = revisiTargetSale.revisiTargetSaleVals
			this.createNew = false
			// this.revisiTargetSale = {...revisiTargetSale};
			this.revisiTargetSalesNewDialog = true;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		saveRevisiTargetSale() {
			this.submitted = true;
			// console.log(this.revisiTargetSale)
			// console.log(this.revisiTargetSaleData)
			// console.log(this.revisiTargetSaleQty)
			// console.log(this.revisiTargetSaleVal)
			if (this.revisiTargetSaleData.detailer &&
				this.revisiTargetSaleData.tahun) {
					this.createTargetSale()	

				}
		},
		create() {
			this.revisiTargetSaleService.createRevisiTargetSale({
				revisiTargetSale: this.revisiTargetSaleData,
				revisiTargetSaleQty: this.revisiTargetSaleQty,
				revisiTargetSaleVal: this.revisiTargetSaleVal
			})
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.revisiTargetSalesNewDialog = false
				this.revisiTargetSaleService.getRevisiTargetSales()
				.then(data => {
					this.revisiTargetSales = data
					this.loading = false
				})

			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
				this.revisiTargetSalesNewDialog = false
			})

		},
		createTargetSale() {
			this.createNew = false
			this.create()
			this.revisiTargetSale = {}
			this.submitted = false
		},
		delete() {
			console.log(this.revisiTargetSale)
			this.revisiTargetSaleService.deleteTargetSale(this.revisiTargetSale)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.revisiTargetSaleService.getTargetSales()
				.then(data => {
					this.revisiTargetSales = data
					this.loading = false
				})

			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		confirmDeleteTargetSale(revisiTargetSale) {
			this.revisiTargetSale =  {...revisiTargetSale}
			this.deleteRevisiTargetSaleDialog = true
		},
		deleteTargetSale() {
			this.delete()
			this.revisiTargetSale =  {}
			this.deleteRevisiTargetSaleDialog = false
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