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
					<Column headerStyle="width: 6em" headerClass="p-text-center" bodyClass="p-text-center">
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
					:style="{width: '900px'}" 
					header="Target Sales" 
					:modal="true" 
					class="p-fluid"
				>
					<!-- ini bisa diisi dengan peta nantinya -->
                    <div class="p-fluid p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Code">Code</label>
							<InputText id="Code" 
								v-model.trim="targetSale.code"
								required="true"
								autofocus 
								:class="{'p-invalid': submitted && !targetSale.code}" 
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.code">Code is required.</small>
						</div>
                        <div class="p-field p-col-12 p-md-4">
                            <!-- <span class="p-float-label"> -->
                            <label for="detailer">Detailer</label>
                            <Dropdown inputId="detailer" 
								v-model.trim="targetSale.detailer"
								:options="detailers"
								:filter="true"
								optionValue="_id"
								optionLabel="name"
								placeholder="Select Detailer"
								scrollHeight="100px"
								:disabled="!createNew"
							>
                            </Dropdown>
							<small class="p-invalid" v-if="submitted && !targetSale.detailer">Detailer is required.</small>
                            <!-- </span> -->
                        </div>
                        <div class="p-field p-col-12 p-md-4">
                            <label for="Product">Product</label>
                            <Dropdown inputId="Product" 
								v-model.trim="targetSale.product"
								:options="products"
								:filter="true"
								optionValue="_id"
								optionLabel="name"
								placeholder="Select Product"
								scrollHeight="100px"
								:disabled="!createNew"
							>
                            </Dropdown>
							<small class="p-invalid" v-if="submitted && !targetSale.product">Product is required.</small>
                        </div>
                        <div class="p-field p-col-12 p-md-4">
                            <label for="Tahun">Tahun</label>
                            <Dropdown inputId="Tahun"
								v-model.trim="targetSale.tahun"
								:options="tahuns"
								placeholder="Select Tahun"
								:disabled="!createNew"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !targetSale.tahun">Tahun is required.</small>
                        </div>
                        <div class="p-field p-col-12 p-md-4">
                            <label for="Target Per Tahun">Target Per Tahun</label>
                            <InputNumber id="Target Per Tahun"
								v-model.trim="targetSale.targetPerTahun"
								suffix=" Qty"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.targetPerTahun">Target Per Tahun is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Januari">Januari</label>
                            <InputNumber id="Januari"
								v-model.trim="targetSale.january"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.january">Target Januari is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Febuari">Febuari</label>
                            <InputNumber id="Febuari"
								v-model.trim="targetSale.febuary"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.febuary">Target Febuari is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Maret">Maret</label>
                            <InputNumber id="Maret"
								v-model.trim="targetSale.maret"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.maret">Target Maret is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="April">April</label>
                            <InputNumber id="April"
								v-model.trim="targetSale.april"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.april">Target April is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Mei">Mei</label>
                            <InputNumber id="Mei"
								v-model.trim="targetSale.may"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.may">Target Mei is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Juni">Juni</label>
                            <InputNumber id="Juni"
								v-model.trim="targetSale.june"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.june">Target Juni is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Juli">Juli</label>
                            <InputNumber id="Juli"
								v-model.trim="targetSale.july"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.july">Target Juli is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Agustus">Agustus</label>
                            <InputNumber id="Agustus"
								v-model.trim="targetSale.august"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.august">Target Agustus is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="September">September</label>
                            <InputNumber id="September"
								v-model.trim="targetSale.september"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.september">Target September is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Oktober">Oktober</label>
                            <InputNumber id="Oktober"
								v-model.trim="targetSale.october"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.october">Target Oktober is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="November">November</label>
                            <InputNumber id="November"
								v-model.trim="targetSale.november"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.november">Target November is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Desember">Desember</label>
                            <InputNumber id="Desember"
								v-model.trim="targetSale.december"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !targetSale.december">Target Desember is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-12">
							<span class="p-float-label">
								<Textarea id="textarea" 
									v-model="targetSale.description" 
									rows="3" 
									:disabled="!createNew"
								/>
								<label for="textarea">Keterangan</label>
							</span>
						</div>
                    </div>
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
						<span v-if="targetSale">Are you sure you want to delete <b>{{targetSale.code}}</b>?</span>
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
			columnBulan: [],
			columnTargetSales: [],
            products: null,
            filters: {},
            detailers: null,
            detailerNew: null,
			targetSales: null,
			targetSale: {},
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
		this.tahuns = [...Array(11).keys()].map(x => x+2020)
		this.columnBulan = [
			{
				field: 'january',
				header: 'January'
			}
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
		hideDialog() {
			this.targetSalesNewDialog = false
			this.submitted = false
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
			this.targetSale = {}
			this.submitted = false
			this.targetSalesNewDialog = true
			this.createNew = true
		},
		openView(targetSale) {
			this.createNew = false
			this.targetSale = {...targetSale};
			this.targetSalesNewDialog = true;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		saveTargetSale() {
			this.submitted = true;
			// console.log(this.targetSale)
			if (this.targetSale.code && 
				this.targetSale.detailer &&
				this.targetSale.product &&
				this.targetSale.tahun &&
				this.targetSale.targetPerTahun &&
				this.targetSale.january &&
				this.targetSale.febuary &&
				this.targetSale.maret &&
				this.targetSale.april &&
				this.targetSale.may &&
				this.targetSale.june &&
				this.targetSale.july &&
				this.targetSale.august &&
				this.targetSale.september &&
				this.targetSale.october &&
				this.targetSale.november &&
				this.targetSale.december)
			{
				if(this.createNew) {
					this.createTargetSale()
					return;
				}

			}
		},
		create() {
			this.targetSaleService.createTargetSale(this.targetSale)
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