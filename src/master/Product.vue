<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" icon="pi pi-plus" :disabled="loading" class="p-button-success p-mr-2" @click="openNew" />
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selecteds || !selecteds.length" />
					</template>

					<template slot="right">
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" 
					:value="products"
					:scrollable="true"
					scrollHeight="500px"
					:selection.sync="selecteds"
					dataKey="_id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					:loading="loading"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
					:rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Products"
				>
					<template #header>
						<div class="table-header">
							<!-- <h5 class="p-m-0">Manage Product</h5> -->
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column headerStyle="width:120px" >
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editProduct(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>
					<Column v-for="(col, index) of columnProduct" 
						:field="col.field" 
						:header="col.header"
						:key="index"
						headerStyle="width: 150px"
					>
						<template v-if="(col.field=='price') || (col.field=='HNA')" #body="slotProps">
							<span>{{formatCurrency(slotProps.data[col.field])}}</span>
						</template>
					</Column>
				</DataTable>

				<Dialog :visible.sync="productDialog" 
					:style="{width: '900px'}"
					header="Product Details"
					:modal="true" 
					class="p-fluid"
				>
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Code">Code</label>
							<InputText id="Code" 
								v-model.trim="product.code" 
								required="true" 
								autofocus
								:class="{'p-invalid': submitted && !product.code}" 
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !product.code">Code is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Barcode">Barcode</label>
							<InputText id="Barcode" 
								v-model.trim="product.barcode"
								required="true"
								autofocus
								:class="{'p-invalid': submitted && !product.barcode}"
							/>
							<small class="p-invalid" v-if="submitted && !product.barcode">Barcode is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Name">Name</label>
							<InputText id="Name"
								v-model.trim="product.name"
								required="true"
								autofocus
								:class="{'p-invalid': submitted && !product.name}"
							/>
							<small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Short">Short</label>
							<InputText id="Short"
								v-model.trim="product.short"
								required="true"
								autofocus
								:class="{'p-invalid': submitted && !product.short}"
							/>
							<small class="p-invalid" v-if="submitted && !product.short">Short Name is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Type">Type</label>
							<InputText id="Type" 
								v-model.trim="product.type" 
								required="true" 
								autofocus
								:class="{'p-invalid': submitted && !product.type}" />
							<small class="p-invalid" v-if="submitted && !product.type">Type is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="PPN">PPN</label>
							<InputNumber id="PPN"
								v-model.trim="product.ppn"
								:min="0"
								:max="100"
								suffix=" %"
							/>
							<small class="p-invalid" v-if="submitted && !product.ppn">PPN is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Disc">Disc</label>
							<InputNumber id="Disc"
								v-model.trim="product.disc"
								:min="0"
								:max="100"
								suffix=" %"
							/>
							<small class="p-invalid" v-if="submitted && !product.disc">Disc is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Unit of Measure">Unit of Measure</label>
							<InputText id="Unit of Measure" 
								v-model.trim="product.UoM" 
								required="true" 
								autofocus
								:class="{'p-invalid': submitted && !product.UoM}" />
							<small class="p-invalid" v-if="submitted && !product.UoM">Unit of Measure is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Conversion">Conversion</label>
							<InputNumber id="Conversion" v-model.trim="product.conversion" />	
							<small class="p-invalid" v-if="submitted && !product.conversion">Conversion is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Weight">Weight</label>
							<InputNumber id="Weight"
								v-model.trim="product.weight"
								suffix=" gram"
							/>
							<small class="p-invalid" v-if="submitted && !product.weight">Weight is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Volume">Volume</label>
							<InputNumber id="Volume"
								v-model.trim="product.volume"
								suffix=" mm3"
							/>
							<small class="p-invalid" v-if="submitted && !product.volume">Volume is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Price">Price</label>
							<InputNumber id="Price"
								v-model="product.price"
								mode="currency"
								currency="IDR"
								locale="id-ID"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !product.price">Price is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="HNA">HNA</label>
							<InputNumber id="HNA"
								v-model="product.HNA"
								mode="currency"
								currency="IDR"
								locale="id-ID"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !product.HNA">HNA is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Status">Status</label>
							<InputText id="Status" 
								v-model.trim="product.status" 
								required="true" 
								autofocus
								:class="{'p-invalid': submitted && !product.status}"
							/>
							<small class="p-invalid" v-if="submitted && !product.status">Status is required.</small>
						</div>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteProductDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete <b>{{product.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteProductsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedRegions" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import ProductService from '../service/ProductService';

export default {
	data() {
		return {
			columnProduct: [],
			loading: false,
			products: null,
			productDialog: false,
			deleteProductDialog: false,
			deleteProductsDialog: false,
			product: {},
			selecteds: null,
			filters: {},
            submitted: false,
            createNew: false
		}
	},
	productService: null,
	created() {
		this.columnProduct = [
			{
				field : 'code',
				header : 'Code'
			},
			{
				field : 'barcode',
				header : 'Barcode'
			},
			{
				field : 'name',
				header : 'Name'
			},
			{
				field : 'short',
				header : 'Short'
			},
			{
				field : 'type',
				header : 'Type'
			},
			{
				field : 'ppn',
				header : 'PPN'
			},
			{
				field : 'disc',
				header : 'Disc'
			},
			{
				field : 'UoM',
				header : 'Unit of Measure'
			},
			{
				field : 'conversion',
				header : 'Conversion'
			},
			{
				field : 'weight',
				header : 'Weight'
			},
			{
				field : 'volume',
				header : 'Volume'
			},
			{
				field : 'price',
				header : 'Price'
			},
			{
				field : 'HNA',
				header : 'HNA'
			},
			{
				field : 'status',
				header : 'Status'
			},
		]
		this.productService = new ProductService();
	},
	mounted() {
		this.loading= true
		this.productService.getProducts().then(data => {
			this.products = data
			this.loading = false
		})
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
			return value.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'});
		},
		openNew() {
			this.product = {};
			this.submitted = false;
            this.productDialog = true;
            this.createNew = true;
		},
		hideDialog() {
			this.productDialog = false;
			this.submitted = false;
		},
		saveProduct() {
			this.submitted = true;
			if (this.product.name &&
				this.product.barcode &&
				this.product.code &&
				this.product.short &&
				this.product.type &&
				this.product.ppn &&
				this.product.disc &&
				this.product.UoM &&
				this.product.conversion &&
				this.product.weight &&
				this.product.volume &&
				this.product.HNA &&
				this.product.status) 
			{
				if(this.createNew){
					this.createProduct();
					return;
				}
				this.edit()
                this.productDialog = false;
                this.product = {};
			}
		},
		create() {
			this.productService.createProduct(this.product)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000})
				this.productService.getProducts().then(data => {
					this.products = data
					this.loading = false
				})
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
        createProduct() {
            this.create()
			this.productDialog = false;
			this.product = {};
			this.createNew = false;
		},
		edit() {
			this.productService.editProduct(this.product)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000})
				this.productService.getProducts().then(data => {
					this.products = data
					this.loading = false
				})
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		editProduct(product) {
			this.createNew= false
			this.product = {...product}
			this.productDialog = true
			this.submitted = false
		},
		confirmDeleteProduct(product) {
			this.product = product;
			this.deleteProductDialog = true;
		},
		delete() {
			this.productService.deleteProduct(this.product)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000})
				this.productService.getProducts().then(data => {
					this.products = data
					this.loading = false
				})
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		deleteProduct() {
			// this.products = this.products.filter(val => val.Code !== this.product.Code);
			// this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Deleted', life: 3000});
			this.delete()
			this.deleteProductDialog = false;
			this.product = {};
		},
		findIndexByCode(Code) {
			let index = -1;
			for (let i = 0; i < this.products.length; i++) {
				if (this.products[i].Code === Code) {
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
			this.deleteProductsDialog = true;
		},
		deleteSelectedRegions() {
			this.products = this.products.filter(val => !this.selecteds.includes(val));
			this.deleteProductsDialog = false;
			this.selecteds = null;
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