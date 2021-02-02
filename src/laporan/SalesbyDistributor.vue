<template>
    <div class="p-grid crud-demo">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
                    <template slot="left">Sales Distributor</template>
                    <template slot="right">
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
                    </template>
                </Toolbar>
                <DataTable ref="detailSalesInfo"
					:value="detailSalesInfo" 
					:scrollable="true" 
					scrollHeight="500px" 
					dataKey="_id" 
					editMode="cell" 
					:paginator="true" 
					:loading="loading"
					:rows="10"
					class="editable-cells-table" 
					:filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} outlet mapping">
					<template #empty>
                        No Sales Distributor found.
                    </template>
                    <template #loading>
                        Loading Sales Distributor data. Please wait.
                    </template>
                    <template #header>
						<div class="table-header">
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column v-for="(col, index) of culomnOutletMapping" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px">
                        <template v-if="col.field=='tglFacture'" #body="slotProps">
							<span>{{formatDate(slotProps.data.tglFacture)}}</span>
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
import DetailSalesInfoService from '../service/DetailSalesInfoService'
export default {
	data() {
		return {
			detailSalesInfo: null,
			loading: false,
            culomnOutletMapping:[
                {field: 'distributor.nfCode', header: 'Dis ID'},
                {field: 'distributor.distName', header: 'Distributor'},
                {field: 'productMap.name', header: 'Product'},
                {field: 'outletMap.name', header: 'Outlet'},
                {field: 'noFacture', header: 'Faktur No'},
                {field: 'tglFacture', header: 'Tanggal Faktur'},
                {field: 'qty', header: 'Sales Qty'},
            ],
            filters: {},
		}
	},
	detailSalesInfoService: null,
	// fs: null,
	created() {	
        this.detailSalesInfoService = new DetailSalesInfoService()

	},
	mounted() {
		this.loading = true
        this.detailSalesInfoService.getDetailSalesInfo().then(data => {
			this.detailSalesInfo = data
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