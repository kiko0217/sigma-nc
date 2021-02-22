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
import AreaService from '../service/AreaService'
import ProductService from '../service/ProductService'
export default {
	data() {
		return {
            tahuns: [],
            priode: 2020,
            products: null,
            loading: false,
            achievementArea: null,
            culomnOutletMapping:[],
            filters: {},
		}
	},
	areaService: null,
    productService: null,
	// fs: null,
	created() {	
        this.tahuns = [...Array(11).keys()].map(x => x+2020)
        this.areaService = new AreaService()
        this.productService = new ProductService()
        this.productService.getProductMinis()
        .then(dt=> {
            // console.log(dt)
            this.products=dt
            this.culomnOutletMapping = [
                {field: 'region', header: 'Region'},
                {field: 'area', header: 'Area'},
            ]
            this.products.forEach(element => {
                this.culomnOutletMapping.push({
                    field: element.short,
                    header: element.short
                })
            })
            this.culomnOutletMapping.push({
                field: 'total',
                header: 'total'
            })
        })
        
        // 
        // console.log(this.culomnOutletMapping)
	},
	mounted() {
        this.loading = true
        this.areaService.getAreaAchievement({year: this.priode})
        .then(data => {
            this.achievementArea = data
            this.loading = false
        })
        .catch(err=> {
			console.log(err)
             this.loading = false
		})
	},
	methods: {
        change() {
            this.loading = true
            this.areaService.getAreaAchievement({year: this.priode})
            .then(data => {
                this.achievementArea = data
                this.loading = false
            })
            .catch(err=> {
                console.log(err)
                this.loading = false
            })
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