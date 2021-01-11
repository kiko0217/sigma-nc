<template>
    <div class="p-grid crud-demo">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
                    <template slot="left">Detail Sales Info</template>
                    <template slot="right">
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
                    </template>
                </Toolbar>
                <DataTable ref="df" 
                    :value="detailSalesInfos" 
                    :scrollable="true" scrollHeight="500px" 
                    dataKey="_id" 
                    :paginator="true"
                    :loading="loading"
                    :rows="10" class="editable-cells-table" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Detail Sales Info">
                    <template #header>
						<div class="table-header">
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column v-for="(col, index) of culomnDetailSalesInfo" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px">
                        <template v-if="col.field=='date'" #body="slotProps">
							<span>{{formatDate(slotProps.data[col.field])}}</span>
						</template>
                    </Column>
					<!-- <Column field="createdAt" header="Created" headerStyle="width: 150px">
						<template #body="slotProps">
							<span>{{formatDate(slotProps.data.createdAt)}}</span>
						</template>
					</Column> -->
				</DataTable>
            </div>
        </div>
    </div>
</template>
<script>
import SaveBreakDownService from '../service/SaveBreakDownService'
export default {
	data() {
		return {
            loading: false,
            saveBreakdowns: null,
            detailSalesInfos: null,
            culomnDetailSalesInfo:[
                {field: 'productId', header: 'Product ID'},
                {field: 'productName', header: 'Product Name'},
                {field: 'outletId', header: 'Outlet ID'},
                {field: 'city', header: 'City'},
                {field: 'dept', header: 'Dept'},
                {field: 'region', header: 'Region'},
                {field: 'area', header: 'Area'},
                {field: 'typeOutlet', header: 'Type Outlet'},
                {field: 'outletName', header: 'Outlet'},
                {field: 'detailerName', header: 'Detailer'},
                {field: 'customerName', header: 'Customer'},
                {field: 'customerCode', header: 'Customer Code'},
                {field: 'date', header: 'Bulan'},
                {field: 'salesQty', header: 'Sales Qty'},
                {field: 'HNA', header: 'HNA'},
                {field: 'disc', header: 'Disc'},
                {field: 'price', header: 'Price'},
                {field: 'ppn', header: 'PPN'},
            ],
            filters: {},
		}
	},
    saveBreakDownService: null,
	// fs: null,
	created() {	
        this.saveBreakDownService = new SaveBreakDownService()
        this.detailSalesInfos = new Array()

    },
    watch: {
        detailSalesInfos: {
            handler: function (newData) {
                console.log(newData)
            }
        }
    },
	mounted() {
        this.loading = true,
        this.saveBreakDownService.getSaveBreadowns()
        .then(data => {
            this.saveBreakdowns = data
            console.log(this.saveBreakdowns)
            let i = 0
            for (let j in this.saveBreakdowns) {
                for(let k in this.saveBreakdowns[j].customers) {
                    for (let l in this.saveBreakdowns[j].customers[k].products){
                        this.detailSalesInfos.push({
                            _id: i,
                            productId: this.saveBreakdowns[j].customers[k].products[l].code,
                            productName: this.saveBreakdowns[j].customers[k].products[l].name,
                            outletId: this.saveBreakdowns[j].outlet.code,
                            outletName: this.saveBreakdowns[j].outlet.name,
                            city: this.saveBreakdowns[j].outlet.city,
                            dept: this.saveBreakdowns[j].outlet.area.codeDept,
                            region: this.saveBreakdowns[j].outlet.area.region.name,
                            area: this.saveBreakdowns[j].outlet.area.name,
                            typeOutlet: this.saveBreakdowns[j].outlet.type.gh_funcdescription,
                            detailerName: this.saveBreakdowns[j].detailer.name,
                            customerName: this.saveBreakdowns[j].customers[k].name,
                            customerCode: this.saveBreakdowns[j].customers[k].code,
                            date: this.saveBreakdowns[j].date,
                            salesQty: this.saveBreakdowns[j].customers[k].products[l].qty,
                            HNA: this.saveBreakdowns[j].customers[k].products[l].HNA,
                            price: this.saveBreakdowns[j].customers[k].products[l].price,
                            disc: this.saveBreakdowns[j].customers[k].products[l].disc,
                            ppn: this.saveBreakdowns[j].customers[k].products[l].ppn,
                        })
                        // console.log(l)
                        i++
                    }
                }
            }
            this.loading = false
            console.log(typeof this.detailSalesInfos)

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
            return month + '-' + date.getFullYear();
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