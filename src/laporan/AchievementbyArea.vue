<template>
    <div class="p-grid crud-demo">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
                    <template slot="left">
                        <b>Area Achievement Report</b>
                    </template>
                    <template slot="right">
                        <span class="p-float-label p-mr-2 p-mt-4">
                            <Calendar id="monthpicker" 
                                v-model="priode" 
                                :manualInput="false"
                                view="month"
                                dateFormat="mm/yy" 
                                :yearNavigator="true" 
                                yearRange="2020:2040"
                            />
                            <label for="monthpicker">Priode</label>
                        </span>
                        <Button label="Export" 
                            icon="pi pi-upload" 
                            class="p-button-help p-mt-4"
                            @click="exportCSV($event)"  />
                    </template>
                </Toolbar>
                <DataTable ref="achievementArea" :value="achievementArea" 
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
import AchievementAreaService from '../service/AchievementAreaService'
export default {
	data() {
		return {
            priode: null,
            loading: false,
            achievementArea: null,
            culomnOutletMapping:[
                {field: 'NO', header: 'No'},
                {field: 'NAME', header: 'Name'},
                {field: 'REGION', header: 'Region'},
                {field: 'AREA', header: 'Area'},
                {field: 'Value Target', header: 'Value Target'},
                {field: 'ONOIWA', header: 'Onoiwa'},
                {field: 'ONOIWA PLUS', header: 'Onoiwa Plus'},
                {field: 'ONOIWA MX', header: 'Onoiwa Mx'},
                {field: 'ONOGATE', header: 'Onogate'},
                {field: 'ONOAKE', header: 'Onoake'},
                {field: 'RAFA KHOMSAH', header: 'Rafa Khomsah'},
                {field: 'Qty Sales', header: 'Qty Sales'},
                {field: 'Value Sales', header: 'Value Sales'},
                {field: 'Achievement', header: 'Achievement'},
            ],
            filters: {},
		}
	},
	achievementAreaService: null,
	// fs: null,
	created() {	
        this.achievementAreaService = new AchievementAreaService()

	},
	mounted() {
        this.loading = true
        this.achievementAreaService.getAchievementArea().then(data => {
            this.achievementArea = data
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