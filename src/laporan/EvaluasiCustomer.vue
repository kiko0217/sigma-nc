<template>
    <div class="p-grid crud-demo">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <b>Customer Evaluation Report</b>
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
                <DataTable ref="evaluasiCustomer" :value="evaluasiCustomer" 
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
					<Column v-for="(col, index) of culomnOutletMapping" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px">
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
import EvaluasiCustomerService from '../service/EvaluasiCustomerService'
export default {
	data() {
		return {
            tahuns: [],
            priode: null,
            evaluasiCustomer: null,
            culomnOutletMapping:[],
            filters: {},
            product: {},
		}
	},
	evaluasiCustomerService: null,
	// fs: null,
	created() {	
        this.tahuns = [...Array(11).keys()].map(x => x+2020)
        this.evaluasiCustomerService = new EvaluasiCustomerService()
        this.culomnOutletMapping = [
            {field: 'NAMA DOKTER', header: 'NAMA DOKTER'},
            {field: 'SPS', header: 'SPS'},
            {field: 'AREA', header: 'AREA'},
            {field: 'RM/SPV', header: 'RM/SPV'},
            {field: 'KSP', header: 'KSP'},
            {field: 'PERIODE', header: 'PERIODE'},
            {field: 'Tgt Total', header: 'Tgt Total'},
            {field: 'AUG', header: 'AUG'},
            {field: 'SEP', header: 'SEP'},
            {field: 'OCT', header: 'OCT'},
            {field: 'NOV', header: 'NOV'},
            {field: 'DEC', header: 'DEC'},
            {field: 'JAN\'19', header: 'JAN\'19'},
            {field: 'FEB\'19', header: 'FEB\'19'},
            {field: 'Total', header: 'Total'},
            {field: 'Act/bln', header: 'Act/bln'},
            {field: 'BALANCE', header: 'BALANCE'},
            {field: 'VALUE', header: 'VALUE'},
            {field: 'Value Ttl', header: 'Value Ttl'},
            {field: 'Unit Ttl', header: 'Unit Ttl'},
            {field: 'KSO', header: 'KSO'},
        ]

	},
	mounted() {
        this.evaluasiCustomerService.getEvaluasiCustomer().then(data => this.evaluasiCustomer = data)
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