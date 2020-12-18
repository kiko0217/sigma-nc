<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" icon="pi pi-plus" :disabled="loading" class="p-button-success p-mr-2" @click="openNew" />
						<!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedRegions || !selectedRegions.length" /> -->
					</template>

					<template slot="right">
						<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
						<Button label="Export" icon="pi pi-upload" :disabled="loading" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="salesCovers" :selection.sync="salectedSalesCover" :loading="loading" dataKey="Outlet" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions">
					<template #header>
						<div class="table-header">
							<!-- <h5 class="p-m-0">Manage Seles Cover</h5> -->
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column field="code" header="Code" headerStyle="width: 150px" sortable></Column>
					<Column field="detailer.name" header="Detailer" headerStyle="width: 150px" sortable></Column>
					<Column field="area.name" header="Area" headerStyle="width: 150px" sortable></Column>
					<Column field="outlet.name" header="Outlet" headerStyle="width: 150px" sortable></Column>
					<Column field="customer.name" header="Customer" headerStyle="width: 150px" sortable></Column>
				</DataTable>
				<Dialog :visible.sync="createDialog" :style="{width: '900px'}" header="Create Sales Cover" :modal="true" class="p-fluid">
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-fluid p-grid">
						<div class="p-field p-col-12 p-md-4">
							<!-- <span class="p-float-label"> -->
							<label for="code">Code</label>
							<InputText id="code" v-model.trim="codeNew" required="true" autofocus :class="{'p-invalid': noteCode}" />
						</div>
						<div class="p-field p-col-12 p-md-4">
							<!-- <span class="p-float-label"> -->
							<label for="detailer">Detailer</label>
							<Dropdown inputId="detailer" v-model="detailerNew" :options="detailers" :filter="true" optionValue="code" optionLabel="name" placeholder="Select Detailer" scrollHeight="100px">
							</Dropdown>
							<!-- </span> -->
						</div>
						<div class="p-field p-col-12 p-md-4">
							<!-- <span class="p-float-label"> -->
							<label for="area">Area</label>
							<Dropdown inputId="area" v-model="areaNew" :options="areas" :filter="true" optionValue="code" optionLabel="name" placeholder="Select Detailer" scrollHeight="100px">
							</Dropdown>
							<!-- </span> -->
						</div>
						<div class="p-field p-col-12 p-md-6">
							<!-- <span class="p-float-label"> -->
							<label for="outlet">Outlet</label>
							<Dropdown inputId="outlet" v-model="outletNew" :options="outlets" :filter="true" optionValue="code" optionLabel="code" placeholder="Select Detailer" scrollHeight="100px">
								<!-- <template #option="slotProps">
									<span>{{slotProps.option.code}}</span>
								</template> -->
							</Dropdown>
							<!-- </span> -->
						</div>
						<div class="p-field p-col-12 p-md-6">
							<!-- <span class="p-float-label"> -->
							<label for="outlet">Customer</label>
							<Dropdown inputId="customers" v-model="customerNew" :options="customers" :filter="true" optionValue="code" optionLabel="code" placeholder="Select Customer" scrollHeight="100px">
							</Dropdown>
							<!-- </span> -->
						</div>
						<div class="p-field p-col-12 p-md-12">
							<span class="p-float-label">
								<Textarea id="textarea" v-model="descriptionNew" rows="3" />
								<label for="textarea">Description</label>
							</span>
						</div>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveSalesCover"/>
					</template>
				</Dialog>

			</div>
		</div>
	</div>

</template>

<script>
import SalesCoverService from '../service/SalesCoverService'
import DetailerService from '../service/DetailerService';
// import RegionService from '../service/RegionService';
import AreaService from '../service/AreaService';
import OutletService from '../service/OutletService';
import CustomerService from '../service/Customer1Service';

export default {
	data() {
		return {
			codeNew: null,
			noteCode: true,
			customerNew: null,
			customers: null,
			outlets: null,
			areas: null,
			descriptionNew: null,
			// regions: null,
			detailers: null,
			loading: false,
			salectedSalesCover: null,
			salesCovers: null,
			createDialog: false,
			detailerNew: null,
			areaNew: null,
			outletNew: null,
			filters: {},
		}
	},
	customerService: null,
	outletService: null,
	areaService: null,
	// regionService: null,
	detailerSErvice: null,
	salesCoverService: null,
	created() {
		this.customerService = new CustomerService();
		this.outletService = new OutletService();
		this.areaService = new AreaService();
		// this.regionService = new RegionService();
		this.detailerService = new DetailerService();
		this.salesCoverService = new SalesCoverService();

	},
	mounted() {
		this.loading = true
		this.customerService.getCustomers()
		.then(data => this.customers = data);
		this.outletService.getOutlets()
		.then(data => {
            this.outlets = data;
            // this.loading = false;
        });
		this.areaService.getAreas()
		.then(data => this.areas = data);
		// this.regionService.getRegions()
		// .then(data => this.regions = data);
		this.detailerService.getDetailers()
		.then(data => {
			this.detailers = data
		})
		this.salesCoverService.getSalesCovers().then(data =>{
			this.salesCovers = data
			this.loading = false
		});
		
	},
	methods: {
		openNew() {
			this.descriptionNew = null
			this.customerNew = null
			this.detailerNew = null
			this.areaNew = null
			this.outletNew = null
			// console.log('test')
			this.createNew = {};
			// this.submitted = false;
            this.createDialog = true;
			this.createNew = true;
			this.noteCode = false
		},
		hideDialog() {
			this.createDialog = false
		},
		saveSalesCover() {
			
			if (this.codeNew == null) {
				this.noteCode = true
				this.$toast.add({severity:'error', summary: 'Error Message', detail: 'Code Null', life: 3000});
				return;
			}
			if (this.detailerNew == null) {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: 'Detailer Null', life: 3000});
				return;
			}
			if (this.areaNew == null) {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: 'Area Null', life: 3000});
				return;
			}
			if (this.outletNew == null) {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: 'Outlet Null', life: 3000});
				return;
			}
			if (this.customerNew == null) {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: 'Customer Null', life: 3000});
				return;
			}
			if (typeof this.salesCovers.find(element => element.code == this.codeNew) !== 'undefined'){
				this.$toast.add({severity:'error', summary: 'Error Message', detail: 'Code exist', life: 3000});
				this.noteCode = true
				return;
			}
			this.loading = true
			this.salesCoverService
			.createSalesCover({
				code: this.codeNew,
				areaNew:this.areaNew,
				detailerNew: this.detailerNew,
				outletNew: this.outletNew,
				customerNew: this.customerNew,
				description: this.descriptionNew
			})
			.then(message => {
				this.$toast.add({severity:'success', summary: 'Success Message', detail: message, life: 3000});
				this.salesCoverService.getSalesCovers().then(data =>{
					this.salesCovers = data
					this.loading = false
				})
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000});
				this.loading = false
			})
			this.createDialog = false
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