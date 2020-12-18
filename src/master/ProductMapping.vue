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
				<DataTable ref="mapping" :value="productMappings" :scrollable="true" :loading="loading" :paginator="true" :rows="10" scrollHeight="500px" dataKey="_id" editMode="cell" class="editable-cells-table" :filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} product mapping">
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
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProductMapping(slotProps)" />
						</template>
					</Column>
					<Column v-for="(col, index) of culomnProductUnmapping" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Code Prod Nucleus" headerStyle="width: 150px" :sortable="true">
						<!-- <template #editor="slotProps">
							<InputText v-model="slotProps.data['nfCode']" />
						</template> -->
						<template #editor="slotProps">
							<Dropdown v-model="slotProps.data['nfCode']" :options="products" optionLabel="short" :filter="true" optionValue="code" placeholder="Select Product" scrollHeight="100px">
								<!-- <template #option="slotProps">
									<span :class="'product-badge'">{{slotProps.option.code}}</span>
								</template> -->
							</Dropdown>
						</template>
					</Column>
					<Column field="createdAt" header="Created" headerStyle="width: 150px">
						<template #body="slotProps">
							<span>{{formatDate(slotProps.data.createdAt)}}</span>
						</template>
					</Column>
				</DataTable>
				<Dialog :visible.sync="deleteDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span>Are you sure you want to delete the selected product Mapping?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProductMapping" />
					</template>
				</Dialog>
			</div>
		</div>

	</div>
</template>

<script>
import ProductMappingService from '../service/ProductMappingService'
import ProductService from '../service/ProductService'
export default {
	data() {
		return {
			loading: false,
			products: null,
			selectProductMapping: null,
			culomnProductUnmapping: [
				{field: 'distributor.nfCode', header: 'Distributor'},
				{field: 'code', header: 'Product Dist Code'},
				{field: 'name', header: 'Product Dist Name'},
				// {field: 'nfCode', header: 'Code Prod Nucleus'},
			],
			productMappings: null,
			deleteDialog: false,
			filters: {},
		}
	},
	productMappingService: null,
	productService: null,
	created() {
		this.productService = new ProductService();
		this.productMappingService = new ProductMappingService();
		this.culomnTemp = ['from', 'subject', 'status', 'createdAt']
	},
	mounted() {
		this.loading = true
		this.productService.getProducts().then(data => this.products = data)
		this.productMappingService.getProductMapping().then(data =>{
			this.productMappings = data
			this.loading = false
		})
	},
	methods: {
		editProductMapping(data){
			// console.log(data)
			// this.productMappingService.postEdit(data)
			// .then(() => {
			// 	// this.productMappingService.getProductMappings(data).then.then(data3 => this.productMappings = data3)
			// 	this.$toast.add({severity:'success', summary: 'Successful', detail: 'Edit Success', life: 3000});
			// })
			if(data.nfCode == null){
				this.$toast.add({severity:'error', summary: 'Error Message', detail: 'Code Nucleus Null', life: 3000});
			} else {
				this.productMappingService.postEdit(data)
				.then(message =>{
					
					this.$toast.add({severity:'success', summary: 'Success Message', detail: message, life: 3000});
				})
				.catch(err => {
					this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000});
				})
			}
		},
		confirmDeleteProductMapping(data)
		{
			// console.log(data)
			this.selectProductMapping = data.data._id
			// console.log(this.selectProductMapping)
			this.deleteDialog = true
		},
		deleteProductMapping() {
			this.productMappingService.deleteProductMapping(this.selectProductMapping)
			.then((message) => {
				this.$toast.add({severity:'success', summary: 'Success Message', detail: message, life: 3000});
				this.loading = true
				this.productMappingService.getProductMapping().then(data => {
					this.productMapping = data
					this.loading = false
				})

			}).
			catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000});
			})
			this.deleteDialog = false
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
		exportCSV() {
			this.$refs.mapping.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteDialog = true;
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