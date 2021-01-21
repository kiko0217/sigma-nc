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
						<template #body="slotProps" v-if="col.field === 'detailer'">
								{{showDetailer(slotProps.data['detailer'])}}
							</template>
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
						<div class="p-field p-col-12 p-md-3" v-if="!createNew">
                            <!-- <span class="p-float-label"> -->
                            <label for="revisi">Revisi</label>
							<InputText v-model.trim="targetSaleData.codeRevisi"
								:disabled="true"
							/>
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
							<template #editor="slotProps" v-if="createNew">
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
							<template #editor="slotProps" v-if="createNew">
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
							<template #editor="slotProps" v-if="createNew">
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
							<template #editor="slotProps" v-if="createNew">
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
							<template #editor="slotProps" v-if="createNew">
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
							<template #editor="slotProps" v-if="createNew">
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
						<span v-if="targetSale.detailer">Are you sure you want to delete <b>{{showDetailer(targetSale.detailer)}}</b>'s Target?</span>
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
		this.columnTargetSales = [
			{
				field : 'tahun',
				header : 'Tahun'
			},
			{
				field : 'detailer',
				header : 'Detailer'
			},
			{
				field : 'codeRevisi',
				header : 'Revisi'
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
		.then(dat => {
			this.detailers = dat
		})
		this.targetSaleService.getTargetSales()
		.then(dt => {
			this.targetSales = dt
			// this.targetSales = [...new Set(this.targetSales.map(({
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
			// console.log(this.targetSales)
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
			this.targetSaleVal[index].targetBulan = valPerBulan
			for (let bulan in this.columnBulan) {
				// console.log(bulan)
				if (targetTahun > 0) {
					if (bulan == 11) {
						// console.log('bulan terakhir')
						this.targetSaleVal[index][this.columnBulan[bulan].field] = targetTahun
						targetTahun = 0
					} else {
						if( targetTahun > valPerBulan) {
							this.targetSaleVal[index][this.columnBulan[bulan].field] = valPerBulan
							targetTahun -= valPerBulan
						} else {
							console.log('target bulan :' +targetTahun)
							
							this.targetSaleVal[index][this.columnBulan[bulan].field] = targetTahun
							targetTahun = 0
						}
					}
					
				} else {
					this.targetSaleVal[index][this.columnBulan[bulan].field] = 0
				}
				// console.log(targetTahun)
				// console.log('bulan '+ bulan + ' :' + this.targetSaleVal[index][this.columnBulan[bulan].field])
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
			this.targetSaleQty[index].targetBulan = qtyPerBulan
			for (let bulan in this.columnBulan) {
				// console.log(bulan)
				if (targetTahun > 0) {
					if (bulan == 11) {
						// console.log('bulan terakhir')
						this.targetSaleQty[index][this.columnBulan[bulan].field] = targetTahun
						targetTahun = 0
					} else {
						if( targetTahun > qtyPerBulan) {
							this.targetSaleQty[index][this.columnBulan[bulan].field] = qtyPerBulan
							targetTahun -= qtyPerBulan
						} else {
							console.log('target bulan :' +targetTahun)
							
							this.targetSaleQty[index][this.columnBulan[bulan].field] = targetTahun
							targetTahun = 0
						}
					}
					
				} else {
					this.targetSaleQty[index][this.columnBulan[bulan].field] = 0
				}
				// console.log(targetTahun)
				// console.log('bulan '+ bulan + ' :' + this.targetSaleVal[index][this.columnBulan[bulan].field])
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
			this.targetSaleData = {}
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
			// console.log(targetSale)
			this.targetSaleData = {
				detailer : targetSale.detailer,
				tahun: targetSale.tahun,
				codeRevisi: targetSale.codeRevisi
			},
			this.targetSaleQty = targetSale.targetSaleQtys
			// console.log(this.targetSaleQty)
			this.targetSaleVal = targetSale.targetSaleVals
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
				this.targetSalesNewDialog = false
				this.targetSaleService.getTargetSales()
				.then(data => {
					this.targetSales = data
					this.loading = false
				})

			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
				this.targetSalesNewDialog = false
			})

		},
		createTargetSale() {
			this.createNew = false
			this.create()
			this.targetSale = {}
			this.submitted = false
		},
		delete() {
			console.log(this.targetSale)
			this.targetSaleService.deleteTargetSale(this.targetSale)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.targetSaleService.getTargetSales()
				.then(data => {
					this.targetSales = data
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