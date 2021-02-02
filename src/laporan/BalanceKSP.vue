<template>
    <div class="p-grid crud-demo">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <b>KSP Monitoring Report</b>
                    </template>
                    <template slot="right">
                        <span class="p-float-label p-mr-2 p-mt-4">
                            <Dropdown inputId="Value"
								v-model.trim="priode"
								:options="valueSelect"
							>
							</Dropdown>
                            <label for="Value">KSP</label>
                        </span>
                        <span class="p-float-label p-mr-2 p-mt-4">
                            <Dropdown inputId="Year"
								v-model.trim="priode"
								:options="tahuns"
							>
							</Dropdown>
                            <label for="Tahun">Year</label>
                        </span>
                        <Button label="Export" 
                            icon="pi pi-upload" 
                            class="p-button-help p-mt-4"
                            @click="exportCSV($event)"  />
                    </template>
                </Toolbar>
                <DataTable ref="detailSalesInfo" :value="detailSalesInfo" 
                    :scrollable="true" 
                    scrollHeight="500px" 
                    dataKey="_id" 
                    editMode="cell" 
                    :paginator="true" 
                    :rows="10" 
                    class="editable-cells-table" 
                    :filters="filters"
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
                            <Column header="Nama Dokter" headerStyle="width: 150px" :rowspan="2" />
                            <Column header="Spesialis" headerStyle="width: 150px" :rowspan="2" />
                            <Column header="BALANCE KSP" :colspan="12" headerStyle="width: 1800px"/>
                            <Column header="Total" :rowspan="2" headerStyle="width: 150px"/>
                        </Row>
                        <Row>
                            <Column v-for="(col, index) of columnBulan" 
                                :key="index"
                                :header="col.header" 
                                headerStyle="width: 150px"/>
                        </Row>
                    </ColumnGroup>
                    <Column field="nama" headerStyle="width: 150px" :rowspan="2" />
                    <Column field="spesialis" headerStyle="width: 150px" :rowspan="2" />
                    <Column v-for="(col, index) of columnBulan" 
                        :key="index"
                        :field="col.field" 
                        headerStyle="width: 150px"/>
                    <Column field="total" headerStyle="width: 150px"/>
					<!-- <Column v-for="(col, index) of culomnOutletMapping" :field="col.field" :key="index" headerStyle="width: 150px">
                    </Column> -->
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
            tahuns: [],
            priode: null,
            detailSalesInfo: null,
            culomnOutletMapping:[],
            columnBulan: [],
            filters: {},
            product: {},
		}
	},
	detailSalesInfoService: null,
	// fs: null,
	created() {	
        this.tahuns = [...Array(11).keys()].map(x => x+2020)
        this.detailSalesInfoService = new DetailSalesInfoService()
        this.columnBulan = [
			{
				field: 'january',
				header: 'January'
			},
			{
				field: 'febuary',
				header: 'Febuary'
			},
			{
				field: 'maret',
				header: 'Maret'
			},
			{
				field: 'april',
				header: 'April'
			},
			{
				field: 'may',
				header: 'May'
			},
			{
				field: 'june',
				header: 'June'
			},
			{
				field: 'july',
				header: 'July'
			},
			{
				field: 'august',
				header: 'August'
			},
			{
				field: 'september',
				header: 'September'
			},
			{
				field: 'october',
				header: 'October'
			},
			{
				field: 'november',
				header: 'November'
			},
			{
				field: 'december',
				header: 'December'
			},
        ]
        this.culomnOutletMapping = [
            {field: '1', header: 'No'},
            {field: '2', header: 'Nama Apotik / Rs.'},
            {field: '3', header: 'Unit'},
            {field: '4', header: 'Value Sales'},
            {field: '5', header: 'Value After COR'},
            {field: '6', header: 'DISC NF OUTLET'},
            {field: '7', header: 'DISC USER'},
            {field: '8', header: 'DISC KPDM'},
            {field: '9', header: 'GARANSI'},
            {field: '10', header: 'TOTAL DISC'},
            {field: '11', header: 'Pencapaian'},
            {field: '12', header: 'Incentive By Outlet'},
        ]

	},
	mounted() {
        // this.detailSalesInfoService.getDetailSalesInfo().then(data => this.detailSalesInfo = data)
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