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
						<!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedPemeliharaanHargas || !selectedPemeliharaanHargas.length" /> -->
					</template>

					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
						<Button label="Export" 
							icon="pi pi-upload" 
							class="p-button-help" 
							@click="exportCSV($event)"
							:disabled="loading"
						/>
					</template>
				</Toolbar>

				<DataTable ref="dt" 
					:value="pemeliharaanHargas"
					:selection.sync="selectedPemeliharaanHargas"
					dataKey="_id"
					:paginator="true"
					:rows="10"
					:loading="loading"
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Pemeliharaan Harga"
				>
					<template #header>
						<div class="table-header">
							<!-- <h5 class="p-m-0">Manage Area</h5> -->
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column headerStyle="width: 150px">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editPemeliharaanHarga(slotProps.data)" />
							<!-- <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeletePemeliharaanHarga(slotProps.data)" /> -->
						</template>
					</Column>
					<Column v-for="(col, index) of columnPemeliharaanHarga" 
						:field="col.field" 
						:header="col.header" 
						:key="index" 
						headerStyle="width: 150px"
					>
						<template v-if="((col.field=='validtyFrom') || (col.field=='validtyTo'))" #body="slotProps">
							<span>{{formatDate(slotProps.data[col.field])}}</span>
						</template>

					</Column>
				</DataTable>

				<Dialog :visible.sync="pemeliharaanHargaDialog"
					:style="{width: '900px'}"
					header="Region Details"
					:modal="true"
					class="p-fluid"
				>
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-fluid p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Validity From">Validity From</label>
							<Calendar id="Validity From"
								v-model.trim="pemeliharaanHarga.validtyFrom"
								:manualInput="false"
								required="true"
								:class="{'p-invalid': submitted && !pemeliharaanHarga.validtyFrom}"
								placeholder="Select Validity From"
								dateFormat="yy-mm-dd"
							></Calendar>
							<small class="p-invalid" v-if="submitted && !pemeliharaanHarga.validtyFrom">Validity From is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Validity To">Validity To</label>
							<Calendar id="Validity To"
								v-model.trim="pemeliharaanHarga.validtyTo"
								:manualInput="false"
								required="true"
								:class="{'p-invalid': submitted && !pemeliharaanHarga.validtyTo}"
								placeholder="Select Validity To"
								dateFormat="yy-mm-dd"
							></Calendar>
							<small class="p-invalid" v-if="submitted && !pemeliharaanHarga.validtyTo">Validity To is required.</small>
						</div>
					</div>
					<div class="p-fluid p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Product">Product</label>
							<Dropdown inputId="customers" 
								v-model.trim="pemeliharaanHarga.product"
								:options="products" 
								:filter="true" 
								optionValue="_id" 
								optionLabel="short" 
								placeholder="Select Product" 
								scrollHeight="100px"
								dataKey="_id" 
								:disabled="!createNew"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !pemeliharaanHarga.product">Product is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="Price">Price</label>
							<InputNumber id="Price"
								v-model="pemeliharaanHarga.price"
								mode="currency"
								currency="IDR"
								locale="id-ID"
							/>
							<small class="p-invalid" v-if="submitted && !pemeliharaanHarga.price">Price is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<label for="HNA">HNA</label>
							<InputNumber id="HNA"
								v-model="pemeliharaanHarga.HNA"
								mode="currency"
								currency="IDR"
								locale="id-ID"
							/>
							<small class="p-invalid" v-if="submitted && !pemeliharaanHarga.HNA">HNA is required.</small>
						</div>
					</div>
					<div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-12">
							<label for="Description">Description</label>
							<Textarea id="Description" 
								v-model.trim="pemeliharaanHarga.description" 
								required="true" 
								autofocus 
								rows="3" 
							/>
						</div>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePemeliharaanHarga" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deletePemeliharaanHargaDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="pemeliharaanHarga">Are you sure you want to delete <b>{{pemeliharaanHarga.Prince}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePemeliharaanHargaDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePemeliharaanHarga" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deletePemeliharaanHargasDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="pemeliharaanHarga">Are you sure you want to delete the selected pemeliharaanHargas?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePemeliharaanHargasDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedPemeliharaanHargas" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import PemeliharaanHargaService from '../service/PemeliharaanHargaService';
import ProductService from '../service/ProductService'
export default {
	data() {
		return {
			products: null,
			loading: false,
			columnPemeliharaanHarga: [],
			pemeliharaanHargas: null,
			pemeliharaanHargaDialog: false,
			deletePemeliharaanHargaDialog: false,
			deletePemeliharaanHargasDialog: false,
			pemeliharaanHarga: {},
			selectedPemeliharaanHargas: null,
			filters: {},
            submitted: false,
            createNew: false
		}
	},
	productServer: null,
	pemeliharaanHargaService: null,
	created() {
		this.columnPemeliharaanHarga = [
			{
				field : 'codeProduct',
				header : 'Product Code'
			},
			{
				field : 'namaProduct',
				header : 'Product Name'
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
				field : 'validtyFrom',
				header : 'Validity From'
			},
			{
				field : 'validtyTo',
				header : 'Validity To'
			},
		]
		this.pemeliharaanHargaService = new PemeliharaanHargaService()
		this.productServer = new ProductService()
	},
	mounted() {
		this.loading = true
		this.productServer.getProductMinis()
		.then(data => {
			this.products = data
		})
		this.pemeliharaanHargaService.getPemeliharaanHargas().then(data => {
			this.pemeliharaanHargas = data
			this.pemeliharaanHargas = [...new Set(this.pemeliharaanHargas.map(({
				product, 
				...rest
			}) => ({
				product: product._id,
				codeProduct : product.code,
				namaProduct : product.short,
				...rest
			})))]
			this.loading = false
		});
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
            return (dat != null ) ? day + '-' + month + '-' + date.getFullYear() : dat
        },
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		},
		openNew() {
			this.pemeliharaanHarga = {};
			this.submitted = false;
            this.pemeliharaanHargaDialog = true;
            this.createNew = true;
		},
		hideDialog() {
			this.pemeliharaanHargaDialog = false;
			this.submitted = false;
		},
		savePemeliharaanHarga() {
			this.submitted = true
			if (this.pemeliharaanHarga.product &&
				this.pemeliharaanHarga.price &&
				this.pemeliharaanHarga.HNA &&
				this.pemeliharaanHarga.validtyFrom &&
				this.pemeliharaanHarga.validtyTo)
			{
				if(this.createNew){
					this.createPemeliharaanHarga();
					return;
				}
                this.edit()
                this.pemeliharaanHargaDialog = false;
                this.pemeliharaanHarga = {};
			}
		},
		create() {
			this.pemeliharaanHargaService.createPemeliharaanHarga(this.pemeliharaanHarga)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.pemeliharaanHargaService.getPemeliharaanHargas().then(data => {
					this.pemeliharaanHargas = data
					this.pemeliharaanHargas = [...new Set(this.pemeliharaanHargas.map(({
						product, 
						...rest
					}) => ({
						product: product._id,
						codeProduct : product.code,
						namaProduct : product.short,
						...rest
					})))]
					this.loading = false
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		edit() {
			this.pemeliharaanHargaService.editPemeliharaanHarga(this.pemeliharaanHarga)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.pemeliharaanHargaService.getPemeliharaanHargas().then(data => {
					this.pemeliharaanHargas = data
					this.pemeliharaanHargas = [...new Set(this.pemeliharaanHargas.map(({
						product, 
						...rest
					}) => ({
						product: product._id,
						codeProduct : product.code,
						namaProduct : product.short,
						...rest
					})))]
					this.loading = false
				});
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
		},
		
        createPemeliharaanHarga() {
			this.create()
			this.pemeliharaanHargaDialog = false
			this.pemeliharaanHarga = {}
			this.createNew = false
        },
		editPemeliharaanHarga(pemeliharaanHarga) {
			this.createNew = false
			this.pemeliharaanHarga = {...pemeliharaanHarga};
			this.pemeliharaanHargaDialog = true;
		},
		confirmDeletePemeliharaanHarga(pemeliharaanHarga) {
			this.pemeliharaanHarga = pemeliharaanHarga;
			this.deletePemeliharaanHargaDialog = true;
		},
		deletePemeliharaanHarga() {
			this.pemeliharaanHargas = this.pemeliharaanHargas.filter(val => val.Pcode !== this.pemeliharaanHarga.Pcode);
			this.deletePemeliharaanHargaDialog = false;
			this.pemeliharaanHarga = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Deleted', life: 3000});
		},
		findIndexByPcode(Pcode) {
			let index = -1;
			for (let i = 0; i < this.pemeliharaanHargas.length; i++) {
				if (this.pemeliharaanHargas[i].Pcode === Pcode) {
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
			this.deletePemeliharaanHargasDialog = true;
		},
		deleteSelectedPemeliharaanHargas() {
			this.pemeliharaanHargas = this.pemeliharaanHargas.filter(val => !this.selectedPemeliharaanHargas.includes(val));
			this.deletePemeliharaanHargasDialog = false;
			this.selectedPemeliharaanHargas = null;
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