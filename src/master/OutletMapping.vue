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
                <DataTable ref="mapping" :value="outletMapping" :scrollable="true" scrollHeight="500px" dataKey="_id" editMode="cell" class="editable-cells-table" :filters="filters">
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
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteRegion(slotProps.data)" />
						</template>
					</Column>
					<Column v-for="(col, index) of culomnOutletMapping" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Code Outlet Nucleus" headerStyle="width: 150px" :sortable="true">
						<template #editor="slotProps">
							<InputText v-model="slotProps.data['nfCode']" />
						</template>
					</Column>
					<Column field="createdAt" header="Created" headerStyle="width: 150px">
						<template #body="slotProps">
							<span>{{formatDate(slotProps.data.createdAt)}}</span>
						</template>
					</Column>
				</DataTable>

            </div>
        </div>
    </div>
</template>

<script>
import OutletMappingService from '../service/OutletMappingService'
export default {
	data() {
		return {
            outletMapping: null,
            culomnOutletMapping:[
                {field: 'distributor.nfCode', header: 'Distributor'},
                {field: 'code', header: 'Outlet Dist Code'},
                {field: 'name', header: 'Outlet Dist Name'},
            ],
            filters: {},
		}
	},
	outletMappingService: null,
	// fs: null,
	created() {
        this.outletMappingService = new OutletMappingService()

	},
	mounted() {
        this.outletMappingService.getOutletMapping().then(data => this.outletMapping = data)
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