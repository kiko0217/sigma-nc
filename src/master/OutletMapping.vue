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
                <DataTable ref="mapping" :value="outletMapping" :scrollable="true" :loading="loading" scrollHeight="500px" :paginator="true" dataKey="_id"  :rows="10" editMode="cell" :filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} outlet mapping">
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
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editOutletMapping(slotProps)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProductMapping(slotProps)" />
						</template>
					</Column>
					<Column v-for="(col, index) of culomnOutletMapping" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Code Outlet Nucleus" headerStyle="width: 150px" :sortable="true">
						<template #editor="slotProps">
							<Dropdown v-model="slotProps.data['nfCode']" :options="outlets" :filter="true" optionLabel="name" dataKey="_id" optionValue="code" placeholder="Select Outlet" scrollHeight="100px">
								<template #option="slotProps">
									<span>{{slotProps.option.name}}</span>
								</template>
							</Dropdown>
						</template>
					</Column>
					<Column field="createdAt" header="Created" headerStyle="width: 150px">
						<template #body="slotProps">
							<span>{{formatDate(slotProps.data.createdAt)}}</span>
						</template>
					</Column>
					<!-- <Column :rowEditor="true" headerStyle="width:7rem" bodyStyle="text-align:center"></Column> -->
				</DataTable>
				<Dialog :visible.sync="deleteDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span>Are you sure you want to delete the selected Outlet Mapping?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteOutletMapping" />
					</template>
				</Dialog>

            </div>
        </div>
    </div>
</template>

<script>
import OutletMappingService from '../service/OutletMappingService'
import OutletService from '../service/OutletService'
export default {
	data() {
		return {
			selectOutletMapId: null,
			deleteDialog: false,
			loading: false,
			outlets: null,
            outletMapping: null,
            culomnOutletMapping:[
                {field: 'distributor.name', header: 'Distributor'},
                {field: 'code', header: 'Outlet Dist Code'},
                {field: 'name', header: 'Outlet Dist Name'},
            ],
            filters: {},
		}
	},
	originalRows: null,
	outletMappingService: null,
	outletService: null,
	// fs: null,
	created() {
		this.outletService= new OutletService()
		this.outletMappingService = new OutletMappingService()
		this.originalRows = {};
	},
	mounted() {
		this.loading = true
		this.outletService.getOutlets().then(data => this.outlets = data)
        this.outletMappingService.getOutletMapping().then(data => {
			this.outletMapping = data
			this.loading = false
		})
	},
	methods: {
		confirmDeleteProductMapping(data){
			
			this.selectOutletMapId = data.data._id
			this.deleteDialog = true
		},
		deleteOutletMapping() {
			// console.log(this.selectOutletMapId)
			this.outletMappingService.deleteOutletMapping(this.selectOutletMapId)
			.then(message => {
				this.$toast.add({severity:'success', summary: 'Success Message', detail: message, life: 3000});
				this.loading = true
				this.outletMappingService.getOutletMapping().then(data => {
					this.outletMapping = data
					this.loading = false
				})
			})
			.catch(err =>{
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000});
			})
			this.deleteDialog = false
		},
		editOutletMapping(data){
			// console.log(data)
			if(data.data.nfCode == null){
				this.$toast.add({severity:'error', summary: 'Error Message', detail: 'Code Nucleus Null', life: 3000});
			} else {
				this.outletMappingService.editcodeNf(data.data)
				.then(message =>{
					
					this.$toast.add({severity:'success', summary: 'Success Message', detail: message, life: 3000});
				})
				.catch(err => {
					this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000});
				})
			}
			
		},
		onRowEditInit(event) {
			this.originalRows[event.index] = {...this.outletMapping[event.index]};
			console.log(this.editingRows)
        },
        onRowEditCancel(event) {
			console.log(event.index)
            this.outletMapping[event.index] = this.originalRows[event.index];
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