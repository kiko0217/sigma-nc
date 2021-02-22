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
								:disabled="loading"
								@change="change()"
							>
							</Dropdown>
                            <label for="Tahun">Priode</label>
                        </span>
                        <Button label="Export" 
                            icon="pi pi-upload" 
                            class="p-button-help p-mt-4"
                            @click="exportCSV($event)"  
							:disabled="loading"/>
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
					<Column v-for="(col, index) of culomnAchievementQty" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px">
						<template v-if="col.field=='short'" #footer>
							<span><b>TOTAL</b></span>
						</template>
						<template v-else #footer="slotProps">
							<span><b>{{totalValue(slotProps.column.field)}}</b></span>
						</template>
                    </Column>
				</DataTable>
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
							<span> Achievement by Value </span>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column v-for="(col, index) of culomnAchievementQty" :field="(col.field == 'short') ? col.field : col.field+'Val'" :header="col.header" :key="index" headerStyle="width: 150px">
                        <template v-if="col.field!='short'" #body="slotProps">
							<span>{{formatCurrency(slotProps.data[slotProps.column.field])}}</span>
						</template>
						<template v-if="col.field=='short'" #footer>
							<span><b>TOTAL</b></span>
						</template>
						<template v-else #footer="slotProps">
							<span><b>{{formatCurrency(totalValue(slotProps.column.field))}}</b></span>
						</template>
                    </Column>
				</DataTable>
            </div>
        </div>
    </div>
</template>
<script>
import AchievementProductService from '../service/AchievementProductService'
import ProductService from '../service/ProductService'
export default {
	data() {
		return {
			loading: false,
            tahuns: [],
            priode: 2020,
            achievementProducts: null,
            columnBulan: [],
            culomnOutletMapping:[],
            filters: {},
            product: {},
		}
	},
	achievementProductService: null,
	productService: null,
	// fs: null,
	created() {	
        this.tahuns = [...Array(11).keys()].map(x => x+2020)
        this.achievementProductService = new AchievementProductService()
        this.productService = new ProductService()
        this.columnBulan = [
			{
				field: 'January',
				header: 'January'
			},
			{
				field: 'Febuary',
				header: 'Febuary'
			},
			{
				field: 'March',
				header: 'March'
			},
			{
				field: 'April',
				header: 'April'
			},
			{
				field: 'May',
				header: 'May'
			},
			{
				field: 'June',
				header: 'June'
			},
			{
				field: 'July',
				header: 'July'
			},
			{
				field: 'August',
				header: 'August'
			},
			{
				field: 'September',
				header: 'September'
			},
			{
				field: 'October',
				header: 'October'
			},
			{
				field: 'November',
				header: 'November'
			},
			{
				field: 'December',
				header: 'December'
			},
        ]
        this.culomnAchievementQty = [
            {field: 'short', header: 'Product'},
            ...this.columnBulan,
            {field: 'total', header: 'Total'},
        ]

	},
	mounted() {
		this.loading = true
		// console.log('test1')
        this.productService.getProductAchievement({
			year: this.priode
		}).then(data => {
			this.achievementProducts = data
			this.loading = false
		}).catch(err=> {
			console.log(err)
			this.loading = false
		})
	},
	methods: {
		change() {
			this.loading = true
		// console.log('test1')
			this.productService.getProductAchievement({
				year: this.priode
			}).then(data => {
				this.achievementProducts = data
				this.loading = false
			}).catch(err=> {
				console.log(err)
				this.loading = false
			})
		},
		totalValue(field) {
			let total = 0
			if(this.achievementProducts == null) return 0
			this.achievementProducts.forEach(element => {
				total += (element[field] == null) ? 0 : element[field]
			});
				// total += (data[field] == null) ? 0 : data[field]
			return total
		},
		formatCurrency(value) {
			if(typeof value == 'undefined') value = 0
			return value.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'});
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