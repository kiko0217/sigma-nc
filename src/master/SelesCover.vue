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

				<DataTable ref="dt" 
					:value="salesCovers" 
					:selection.sync="salectedSalesCover" 
					:loading="loading" 
					dataKey="_id" 
					:paginator="true" 
					:rows="10" 
					:filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
					:rowsPerPageOptions="[5,10,25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Sales Cover"
				>
					<template #header>
						<div class="table-header">
							<!-- <h5 class="p-m-0">Manage Seles Cover</h5> -->
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column headerStyle="width: 120px">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editSalesCover(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteSalesCover(slotProps.data)" />
						</template>
					</Column>
					<Column v-for="(col, index) of columnSalesCover" 
						:field="col.field" 
						:header="col.header"
						:key="index"
						headerStyle="width: 150px"
					>
					</Column>
				</DataTable>
				<Dialog :visible.sync="createDialog" 
					:style="{width: '900px'}" 
					header="Create Sales Cover" 
					:modal="true" 
					class="p-fluid"
				>
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-fluid p-grid">
						<div class="p-field p-col-12 p-md-4">
							<!-- <span class="p-float-label"> -->
							<label for="code">Code</label>
							<InputText id="code" 
								v-model.trim="salesCover.code"
								required="true" 
								autofocus 
								:class="{'p-invalid': noteCode}"
								@change="changeCode"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !salesCover.code">Code is required.</small>
							<small class="p-invalid" v-if="submitted && noteCode"> Code Exist</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<!-- <span class="p-float-label"> -->
							<label for="detailer">Detailer</label>
							<Dropdown inputId="detailer" 
								v-model.trim="salesCover.detailer"
								:options="detailers"
								:filter="true"
								optionValue="code"
								optionLabel="name"
								placeholder="Select Detailer"
								scrollHeight="100px"
								dataKey="_id"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !salesCover.detailer">Detailer is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-4">
							<!-- <span class="p-float-label"> -->
							<label for="area">Area</label>
							<Dropdown inputId="area" 
								v-model.trim="salesCover.area" 
								:options="areas"
								:filter="true"
								optionValue="code" 
								optionLabel="name"
								placeholder="Select Area"
								scrollHeight="100px"
								dataKey="_id"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !salesCover.area">Area is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-6">
							<!-- <span class="p-float-label"> -->
							<label for="outlet">Outlet</label>
							<Dropdown inputId="outlet" 
								v-model.trim="salesCover.outlet"
								:options="outlets"
								:filter="true"
								optionValue="code"
								optionLabel="name"
								placeholder="Select Outlet"
								scrollHeight="100px"
								dataKey="_id"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !salesCover.outlet">Outlet is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-6">
							<!-- <span class="p-float-label"> -->
							<label for="customers">Customer</label>
							<Dropdown inputId="customers" 
								v-model.trim="salesCover.customer"
								:options="customers" 
								:filter="true" 
								optionValue="code" 
								optionLabel="name" 
								placeholder="Select Customer" 
								scrollHeight="100px"
								dataKey="_id" 
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !salesCover.customer">Customer is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-12">
							<span class="p-float-label">
								<Textarea id="textarea" v-model.trim="salesCover.description" rows="3" />
								<label for="textarea">Description</label>
							</span>
						</div>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveSalesCover"/>
					</template>
				</Dialog>
				<Dialog :visible.sync="deleteSalesCoverDialog" 
					:style="{width: '450px'}" 
					header="Confirm" 
					:modal="true"
				>
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="salesCover">Are you sure you want to delete <b>{{salesCover.code}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteSalesCoverDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSalesCover" />
					</template>
				</Dialog>

			</div>
		</div>
	</div>

</template>

<script>
import SalesCoverService from '../service/SalesCoverService'
import DetailerService from '../service/DetailerService'
import AreaService from '../service/AreaService'
import OutletService from '../service/OutletService'
import CustomerService from '../service/Customer1Service'

export default {
	data() {
		return {
			columnSalesCover: [],
			submitted: false,
			salesCover: {},
			noteCode: true,
			customers: null,
			outlets: null,
			areas: null,
			detailers: null,
			loading: false,
			salectedSalesCover: null,
			salesCovers: null,
			createDialog: false,
			filters: {},
			createNew: false,
			deleteSalesCoverDialog: false
		}
	},
	customerService: null,
	outletService: null,
	areaService: null,
	detailerSErvice: null,
	salesCoverService: null,
	created() {
		this.columnSalesCover = [
			{
				field : 'code',
				header : 'Code'
			},
			{
				field : 'detailerName',
				header : 'Detailer'
			},
			{
				field : 'areaName',
				header : 'Area'
			},
			{
				field : 'outletName',
				header : 'Outlet'
			},
			{
				field : 'customerName',
				header : 'Customer'
			},
		]
		this.customerService = new CustomerService();
		this.outletService = new OutletService();
		this.areaService = new AreaService();
		this.detailerService = new DetailerService();
		this.salesCoverService = new SalesCoverService();

	},
	mounted() {
		this.loading = true
		this.customerService.getCustomerMinis()
		.then(data => {
			this.customers = data
		})
		this.outletService.getOutletMinis()
		.then(data => {
            this.outlets = data;
            // this.loading = false;
        })
		this.areaService.getAreaMinis()
		.then(data => this.areas = data);
		this.detailerService.getDetailerMinis()
		.then(data => {
			this.detailers = data
		})
		this.salesCoverService.getSalesCovers()
		.then(data =>{
			this.salesCovers = data
			this.salesCovers = [...new Set(this.salesCovers.map(({
				customer,
				outlet,
				area,
				detailer,
				...rest
			})=>({
				customerName: customer.name,
				customer: customer.code,
				outletName: outlet.name,	
				outlet: outlet.code,
				areaName: area.name,
				area: area.code,
				detailerName: detailer.name,
				detailer: detailer.code,
				...rest
			})))]
			this.loading = false
		});
		
	},
	methods: {
		changeCode() {
			// console.log('test')
			this.noteCode = false
		},
		openNew() {
			this.salesCover = {}
			this.submitted = false;
            this.createDialog = true;
			this.createNew = true;
			this.noteCode = false
		},
		hideDialog() {
			this.createDialog = false
		},
		create() {
			this.salesCoverService
			.createSalesCover({
				code: this.salesCover.code,
				areaNew:this.salesCover.area,
				detailerNew: this.salesCover.detailer,
				outletNew: this.salesCover.outlet,
				customerNew: this.salesCover.customer,
				description: this.salesCover.description
			})
			.then(message => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Success Message', detail: message, life: 3000});
				this.salesCoverService.getSalesCovers().then(data =>{
					this.salesCovers = data
					this.salesCovers = [...new Set(this.salesCovers.map(({
						customer,
						outlet,
						area,
						detailer,
						...rest
					})=>({
						customerName: customer.name,
						customer: customer.code,
						outletName: outlet.name,	
						outlet: outlet.code,
						areaName: area.name,
						area: area.code,
						detailerName: detailer.name,
						detailer: detailer.code,
						...rest
					})))]
					this.loading = false
				})
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000});
			})
		},
		saveSalesCover() {
			this.submitted = true
			if (this.salesCover.code &&
				this.salesCover.detailer &&
				this.salesCover.area &&
				this.salesCover.outlet &&
				this.salesCover.customer)
			{
				if (this.createNew) {
					if (typeof this.findSalesCover(this.salesCover.code) !== 'undefined'){
						this.$toast.add({severity:'error', summary: 'Error Message', detail: 'Code exist', life: 3000});
						this.noteCode = true
						return;
					}
					this.createSalesCover()
					return
				}
				this.edit()
				this.createDialog = false
				this.SalesCover = {}
			}
		},
		createSalesCover() {
			this.create()
			this.createDialog = false
			this.salesCover = {}
			this.createNew = false
		},
		edit() {
			this.salesCoverService
			.editSalesCover({
				_id: this.salesCover._id,
				code: this.salesCover.code,
				areaNew:this.salesCover.area,
				detailerNew: this.salesCover.detailer,
				outletNew: this.salesCover.outlet,
				customerNew: this.salesCover.customer,
				description: this.salesCover.description
			})
			.then(message => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Success Message', detail: message, life: 3000});
				this.salesCoverService.getSalesCovers().then(data =>{
					this.salesCovers = data
					this.salesCovers = [...new Set(this.salesCovers.map(({
						customer,
						outlet,
						area,
						detailer,
						...rest
					})=>({
						customerName: customer.name,
						customer: customer.code,
						outletName: outlet.name,	
						outlet: outlet.code,
						areaName: area.name,
						area: area.code,
						detailerName: detailer.name,
						detailer: detailer.code,
						...rest
					})))]
					this.loading = false
				})
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000});
			})
		},
		editSalesCover(salesCover) {
			this.createNew = false;
			this.salesCover = {...salesCover},
			this.createDialog = true
			this.noteCode = false

		},
		delete() {
			this.salesCoverService
			.deleteSalesCover({
				_id: this.salesCover._id,
				code: this.salesCover.code,
				areaNew:this.salesCover.area,
				detailerNew: this.salesCover.detailer,
				outletNew: this.salesCover.outlet,
				customerNew: this.salesCover.customer,
				description: this.salesCover.description
			})
			.then(message => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Success Message', detail: message, life: 3000});
				this.salesCoverService.getSalesCovers().then(data =>{
					this.salesCovers = data
					this.salesCovers = [...new Set(this.salesCovers.map(({
						customer,
						outlet,
						area,
						detailer,
						...rest
					})=>({
						customerName: customer.name,
						customer: customer.code,
						outletName: outlet.name,	
						outlet: outlet.code,
						areaName: area.name,
						area: area.code,
						detailerName: detailer.name,
						detailer: detailer.code,
						...rest
					})))]
					this.loading = false
				})
			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000});
			})
		},
		deleteSalesCover() {
			this.delete()
			this.deleteSalesCoverDialog = false
			this.salesCover = {}
		},
		confirmDeleteSalesCover(salesCover) {
			this.salesCover = {...salesCover}
			this.deleteSalesCoverDialog = true;
		},
		findSalesCover(code) {
			return this.salesCovers.find(element => element.code == code)
			
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