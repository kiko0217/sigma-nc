<template>
    <div class="p-grid crud-demo">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
					<template slot="left">
                        <div class="p-field p-col-12 p-md-6">
                            <span class="p-float-label">
                                <Calendar id="monthpicker" v-model="dateBreakDown" selectionMode="range" :manualInput="false" />
                                <label for="monthpicker">Generate Data</label>
                            </span>
                        </div>
                        <div class="p-field p-col-12 p-md-6">
                            <Button label="Generate" :disabled="(dateBreakDown==null) || dateBreakDown==''" icon="pi pi-play" class="p-button-success p-mr-2" @click="generateData"/>
                        </div>
                    </template>
					<template slot="right">
					</template>
				</Toolbar>
                <DataTable v-if="breakDowns" ref="dt" :expandedRows.sync="expandedRows" :value="breakDowns" dataKey="l" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions">
					<template #header>
						<div class="table-header">
							<!-- <h5 class="p-m-0">Manage Seles Cover</h5> -->
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
                    <Column :expander="true" headerStyle="width: 3rem" />
                    <Column field="outlet.name" header="Outlet" headerStyle="width: 150px"></Column>
                    <Column v-for="(col, index) of products" :field="col.short" :header="col.short" :key="index" headerStyle="width: 150px"></Column>
                    <template #expansion="slotProps">
                        <DataTable :value="slotProps.data.customers" dataKey="_id">
							<Column field="name" header="Customer" headerStyle="width: 150px"></Column>
						</DataTable>
                    </template>
				</DataTable>
            </div>
        </div>
    </div>
</template>


<script>
import BreakDownService from '../service/BreakDownService'
import ProductService from '../service/ProductService'
export default {
    data() {
        return {
            expandedRows: [],
            products: null,
            filters:{},
            breakDowns: null,
            dateBreakDown: null,
        }
    },
    productService: null,
    breakdownService : null,
    created() {
        this.productService = new ProductService()
        this.breakdownService = new BreakDownService()
        // let today = new Date()
        // let month = today.getMonth()
    },
    mounted() {
        this.productService.getProducts()
        .then(data => {
            this.products = data
        })

    },
    methods: {
        generateData() {
            console.log(this.products)
            this.breakdownService.postBreakDownTanggal(this.dateBreakDown)
            .then(data => {
                this.breakDowns = data
                console.log(data)
            })
            .catch(err => {
                this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000});
            })
            // console.log(this.dateBreakDown)
        }
    }

}
</script>

<style>

</style>