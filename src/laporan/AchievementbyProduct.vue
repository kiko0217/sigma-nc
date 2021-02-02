<template>
    <div class="p-grid crud-demo">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <b>Product Achievement Report</b>
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
                <DataTable ref="achievementProducts" :value="achievementProducts" 
                    :scrollable="true" scrollHeight="500px" 
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
							<span> Achievement by Quantity </span>
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
				</DataTable>
                <DataTable ref="achievementProducts" :value="achievementProducts2" 
                    :scrollable="true" scrollHeight="500px" 
                    dataKey="_id" 
                    editMode="cell" 
                    :paginator="true" 
                    :rows="10" 
                    class="editable-cells-table" 
                    :filters="filters"
					:loading="loading2"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    :rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} outlet mapping">
                    <template #header>
						<div class="table-header">
							<span> Achievement by Value </span>
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
				</DataTable>
            </div>
        </div>
    </div>
</template>
<script>
import AchievementProductService from '../service/AchievementProductService'
export default {
	data() {
		return {
			loading: false,
			loading2: false,
            tahuns: [],
            priode: 2020,
            achievementProducts: null,
            achievementProducts2: null,
            columnBulan: [],
            culomnOutletMapping:[],
            filters: {},
            product: {},
		}
	},
	achievementProductService: null,
	// fs: null,
	created() {	
        this.tahuns = [...Array(11).keys()].map(x => x+2020)
        this.achievementProductService = new AchievementProductService()
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
            {field: 'product', header: 'Product'},
            ...this.columnBulan,
            {field: 'total', header: 'Total'},
        ]

	},
	mounted() {
		this.loading = true
		this.loading2 = true
        this.achievementProductService.getAchievementProduct().then(data => {
			this.achievementProducts2 = data
			this.loading = false
		})
        this.achievementProductService.getAchievementProductVal().then(dt => {
			this.achievementProducts = dt
			this.loading2 = false
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