<template>
    <div class="p-grid crud-demo">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <b>Incentive</b>
                    </template>
                    <template slot="right">
                        <span class="p-float-label p-mr-2 p-mt-4">
                            <Dropdown inputId="Tahun"
								v-model.trim="priode"
								:options="tahuns"
							>
							</Dropdown>
                            <label for="Tahun">Priode</label>
                        </span>
                        <Button label="Export" 
                            icon="pi pi-upload" 
                            class="p-button-help p-mt-4"
                            @click="exportCSV($event)"  />
                    </template>
                </Toolbar>
                <DataTable ref="laporanIncentive" :value="laporanIncentive" 
                    :scrollable="true" 
                    scrollHeight="500px" 
                    dataKey="_id" 
                    editMode="cell" 
                    :paginator="true" 
                    :rows="10" 
                    class="editable-cells-table" 
                    :filters="filters"
                    :loading="loading"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    :rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} outlet mapping">
                    <template #header>
						<div class="table-header">
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
                    <ColumnGroup type="header">
                        <Row>
                            <Column header="No" headerStyle="width: 150px" :rowspan="2" />
                            <Column header="Nama Apotik / Rs." headerStyle="width: 150px" :rowspan="2" />
                            <Column header="July" :colspan="3" headerStyle="width: 450px"/>
                            <Column header="DISC NF OUTLET" headerStyle="width: 150px" rowspan="2"/>
                            <Column header="DISC USER" headerStyle="width: 150px" rowspan="2"/>
                            <Column header="DISC KPDM" headerStyle="width: 150px" rowspan="2"/>
                            <Column header="GRANSI" headerStyle="width: 150px" rowspan="2"/>
                            <Column header="TOTAL DISC" headerStyle="width: 150px" rowspan="2"/>
                            <Column header="Pencapaian" headerStyle="width: 150px" rowspan="2"/>
                            <Column header="Incentive By Outlet" headerStyle="width: 150px" rowspan="2"/>
                        </Row>
                        <Row>
                            <Column header="Unit" headerStyle="width: 150px" field="3"/>
                            <Column header="Value Sales" headerStyle="width: 150px" field="4"/>
                            <Column header="Value After COR" headerStyle="width: 150px" field="5"/>
                        </Row>
                    </ColumnGroup>
					<Column v-for="(col, index) of culomnOutletMapping" :field="col.field" :key="index" headerStyle="width: 150px">
                        <!-- <template v-if="col.field=='tglFacture'" #body="slotProps">
							<span>{{formatDate(slotProps.data.tglFacture)}}</span>
						</template> -->
                    </Column>
				</DataTable>
            </div>
        </div>
    </div>
</template>
<script>
import LaporanIncentiveService from '../service/LaporanIncentiveService'
export default {
	data() {
		return {
            tahuns: [],
            loading: false,
            priode: null,
            laporanIncentive: null,
            culomnOutletMapping:[],
            filters: {},
            product: {},
		}
	},
	laporanIncentiveService: null,
	// fs: null,
	created() {	
        this.tahuns = [...Array(11).keys()].map(x => x+2020)
        this.laporanIncentiveService = new LaporanIncentiveService()
        this.culomnOutletMapping = [
            {field: 'NO', header: 'No'},
            {field: 'Nama', header: 'Nama Apotik / Rs.'},
            {field: 'Unit', header: 'Unit'},
            {field: 'Value Sales', header: 'Value Sales'},
            {field: 'Value Sales', header: 'Value After COR'},
            {field: 'DISC NF OUTLET', header: 'DISC NF OUTLET'},
            {field: 'DISC USER', header: 'DISC USER'},
            {field: 'DISC KPDM', header: 'DISC KPDM'},
            {field: 'GARANSI', header: 'GARANSI'},
            {field: 'TOTAL DISC', header: 'TOTAL DISC'},
            {field: 'Pencapaian', header: 'Pencapaian'},
            {field: 'Incentive By Outlet', header: 'Incentive By Outlet'},
        ]

	},
	mounted() {
        this.loading = true
        this.laporanIncentiveService.getLaporanIncentive().then(data => {
            this.laporanIncentive = data
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