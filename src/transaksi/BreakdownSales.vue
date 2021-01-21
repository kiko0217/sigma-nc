<template>
    <div class="p-grid crud-demo">
        <div class="p-col-12">
            <div class="card">
                <Toast/>
                <Toolbar class="p-mb-4">
					<template slot="left">
                        <!--  -->
                        <Button label="Breakdown" 
                            icon="pi pi-plus" 
                            :disabled="loading"
                            class="p-button-success p-mr-2" 
                            @click="openNew" 
                        />
                    </template>
					<template slot="right">
					</template>
				</Toolbar>
                <DataTable
                    ref="dt" 
                    :expandedRows.sync="expandedRows" 
                    :scrollable="true"
					scrollHeight="500px"
                    :value="saveBreakdowns"
                    dataKey="_id" 
                    :paginator="true" 
                    :rows="10" 
                    :filters="filters"
                    :loading="loading"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    :rowsPerPageOptions="[5,10,25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions"
                >
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
                    <!-- <Column field="name" header="Outlet" headerStyle="width: 150px"></Column> -->
                    <Column v-for="(col, index) of columnSaveBreakdown"
						:field="col.field" 
						:header="col.header"
						:key="index"
						headerStyle="width: 150px"
					>
                        <template v-if="col.field=='date'" #body="slotProps">
							<span>{{formatDate(slotProps.data[col.field])}}</span>
						</template>
                    </Column>
                    <Column v-for="(col2) of products" :field="col2.short" :header="col2.short" :key="col2._id" headerStyle="width: 150px"></Column>
                    <template #expansion="slotProps">
                        <DataTable :value="slotProps.data.customers" :scrollable="true" scrollHeight="200px" dataKey="_id">
							<Column field="name" header="Customer" headerStyle="width: 150px"></Column>
                            <Column v-for="(col3, index3) of products" :field="col3.short" :header="col3.short" :key="index3" headerStyle="width: 150px"></Column>
						</DataTable>
                    </template>
				</DataTable>
                <Dialog :visible.sync="breakDownDialog" 
					:style="{width: '900px'}" 
					header="Break Down" 
					:modal="true" 
					class="p-fluid"
				>
                    <template #header>
                        <div class="p-field p-grid">
                            <div class="p-field p-col-12 p-md-6">
                                <span class="p-float-label">
                                    <Calendar id="monthpicker" 
                                        v-model="dateBreakDown" 
                                        :manualInput="false"
                                        view="month"
                                        dateFormat="mm/yy" 
                                        :yearNavigator="true" 
                                        yearRange="2020:2040"
                                    />
                                    <label for="monthpicker">Generate Data</label>
                                </span>
                            </div>
                            <div class="p-field p-col-12 p-md-6">
                                <Button label="Generate" :disabled="(dateBreakDown==null) || dateBreakDown==''" icon="pi pi-play" class="p-button-success p-mr-2" @click="generateData"/>
                            </div>
                        </div>
                    </template>
                    <div class="p-field p-grid">
						<div class="p-field p-col-12 p-md-3">
							<label for="breakdown">Break Down</label>
							<Dropdown inputId="breakdown"
								v-model.trim="breakdown"
								:options="breakDowns"
								placeholder="Select Break Down"
								dataKey="code"
                                optionLabel="name"
                                :filter="true"
                                @change="changeBreakdown()"
							>
							</Dropdown>
							<small class="p-invalid" v-if="submitted && !breakdown.code">Break Down is required.</small>
						</div>
                        <div class="p-field p-col-12 p-md-3">
                            <label for="date">Detailer</label>
                            <Dropdown inputId="detailer" 
								v-model.trim="breakdown.detailer" 
								:options="detailers"
								:filter="true"
								optionValue="_id" 
								optionLabel="name"
								placeholder="Select Detailer"
								scrollHeight="100px"
								dataKey="_id"
							>
							</Dropdown>
                            <small class="p-invalid" v-if="submitted && !breakdown.detailer">Detailer is required.</small>
						</div>
						<div class="p-field p-col-12 p-md-3">
							<label for="date">Priode</label>
							<InputText id="date"
                                v-model.trim="breakdown.date"
                                required="true" 
                                autofocus 
                                :class="{'p-invalid': submitted && !breakdown.date}" 
                                :disabled="true"
                            />
							<!-- <small class="p-invalid" v-if="submitted && !detailer.name">Detailer Name is required.</small> -->
						</div>
						<div class="p-field p-col-12 p-md-3">
							<label for="Name">Outlet Name</label>
							<InputText id="Name"
                                v-model.trim="breakdown.name"
                                required="true" 
                                autofocus 
                                :class="{'p-invalid': submitted && !breakdown.name}" 
                                :disabled="true"
                            />
							<!-- <small class="p-invalid" v-if="submitted && !detailer.name">Detailer Name is required.</small> -->
						</div>
						<div class="p-field p-col-12 p-md-3">
							<label for="code">Code</label>
							<InputText id="code"
                                v-model.trim="breakdown.code"
                                required="true" 
                                autofocus 
                                :class="{'p-invalid': submitted && !breakdown.code}"
                                :disabled="true"
                            />
							<!-- <small class="p-invalid" v-if="submitted && !detailer.short">Short Name is required.</small> -->
						</div>
					</div>
                    <div class="p-field p-grid" v-if="breakdown.products != null">
                        <div class="p-field p-col-12 p-md-3"
                            v-for="(col, index) of products"
                            :key="index"
                        >
                            <div v-if="breakdown.products[col.short] != null">
                                <label :for="index">{{col.short}}</label>
                                <InputNumber  :id="index" 
                                    v-model.trim="breakdown.products[col.short]"
                                    required="true"
                                    :disabled="true"
                                />
                            </div>
                        </div>
                    </div>
                    <div v-if="breakdown.customers">
                        <div v-for="(col, index) of breakdown.customers"
                            :key="index"
                        >
                            <h5>{{col.name}}</h5>
                            <div class="p-field p-grid" v-if="breakdown.products != null">
                                <div class="p-field p-col-12 p-md-3"
                                    v-for="(col2, i) of products"
                                    :key="i"
                                >
                                    <div v-if="breakdown.products[col2.short] != null">
                                        <label :for="index">{{col2.short}}</label>
                                        <!-- <Dropdown v-model="breakdown.customers[index].products[i]" 
                                            :options="products"
                                            optionLabel="short"
                                            :filter="true"
                                            placeholder="Select Product"
                                            scrollHeight="100px"
                                            dataKey="_id"
                                            :disabled="true"
                                        >
                                        </Dropdown> -->
                                        <!-- <InputNumber :id="index"
                                            v-model.trim="breakdown.customers[index].products[i].qty"
                                            showButtons
                                            required="true"
                                            @input="changeQty($event, index, i)"
                                        /> -->
                                        <input type="number" :id="index"
                                            v-model="breakdown.customers[index].products[i].qty"
                                            @input="changeQty(col2.short, index, i)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" 
							icon="pi pi-check"
							class="p-button-text"
							@click="saveBreakDown"
							:disabled="!createNew"
						/>
					</template>
                </Dialog>
            </div>
        </div>
    </div>
</template>


<script>
import BreakDownService from '../service/BreakDownService'
import SaveBreakDownService from '../service/SaveBreakDownSarvice'
import ProductService from '../service/ProductService'
import OutletService from '../service/OutletService'
import DetailerService from '../service/DetailerService'
export default {
    data() {
        return {
            detailers: null,
            columnSaveBreakdown: [],
            saveBreakdowns: null,
            breakdown: {},
            expandedRows: [],
            products: null,
            filters:{},
            breakDowns: null,
            dateBreakDown: null,
            submitted: false,
            createNew: false,
            breakDownDialog: false,
            loading: false,
            qtyProductCustomer:[],
        }
    },
    detailerService: null,
    productService: null,
    breakdownService : null,
    outletService: null,
    saveBreakdownService: null,
    created() {
        this.columnSaveBreakdown = [
			{
				field : 'name',
				header : 'Outlet'
			},
			{
				field : 'date',
				header : 'Bulan'
            },
        ]
        this.productService = new ProductService()
        this.breakdownService = new BreakDownService()
        this.outletService = new OutletService()
        this.saveBreakdownService = new SaveBreakDownService()
        this.detailerService = new DetailerService()
        // let today = new Date()
        // let month = today.getMonth()
    },
    // computed: {
    //     change
    // },
    watch: {
        breakdown:{ 
            handler: function(newValue, oldValue) {
                // this.getWeather();
                console.log(newValue)
                console.log(oldValue)
            },
            deep: true,
        }
    },
    mounted() {
        this.loading = true
        this.productService.getProducts()
        .then(data => {
            this.products = data
        })
        this.detailerService.getDetailers()
        .then(data => {
            this.detailers = data
        })
        this.saveBreakdownService.getSaveBreakdown()
        .then(data => {
            this.saveBreakdowns = data
            // console.log(this.saveBreakdowns)
            for (let l in data) {
                for (let key in this.saveBreakdowns[l].products) {
                    this.saveBreakdowns[l][key] = this.saveBreakdowns[l].products[key]
                }
            }
            // console.log(this.saveBreakdowns)
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

            return month + '-' + date.getFullYear();
        },
        hideDialog() {
			this.breakDownDialog = false
			this.submitted = false
		},
        generateData() {
            let tempDate= []
            tempDate.push(new Date(this.dateBreakDown))
            tempDate.push(new Date(new Date(this.dateBreakDown).setMonth(this.dateBreakDown.getMonth()+1)))
            // console.log(new Date(this.dateBreakDown.setMonth(this.dateBreakDown.getMonth()+1)))
            // tempDate.push(new Date(this.dateBreakDown.setMonth(this.dateBreakDown.getMonth()+2)))
            // console.log(tempDate)
            this.outletService.outletBreakdown(tempDate)
            .then(data => {
                this.breakDowns = data
                for (let l in this.breakDowns) {
                    this.breakDowns[l].date = new Date(this.dateBreakDown)
                    this.breakDowns[l].trxs = []
                    this.breakDowns[l].products = {}
                    this.breakDowns[l].outletMaps.forEach(element => {
                        this.breakDowns[l].trxs = this.breakDowns[l].trxs.concat([...new Set(element.trxs.map(({
                            productMap, 
                            ...rp
                        })=>({
                            product: productMap.product._id,
                            productName: productMap.product.name,
                            productCode: productMap.product.code,
                            productShort: productMap.product.short,
                            
                            ...rp
                        })))])
                    });
                    this.products.forEach(elm => {
                        let tempData = [...new Set(this.breakDowns[l].trxs.filter(x => x.product === elm._id))]
                        if (tempData.length !== 0) {
                            let qty = 0
                            tempData.forEach(el => {
                                qty+=el.qty
                            })
                            // this.breakDowns[l][elm.short] = qty
                            this.breakDowns[l].products[elm.short] = qty
                        }
                    })
                    delete this.breakDowns[l].outletMaps
                }
                // console.log(this.breakDowns)
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'Success Generate', life: 3000});
            })
            .catch(err => {
                console.log(err)
                this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000});
            })  
            // // console.log(this.dateBreakDown)
        },
        openNew() {
			this.breakdown = {}
			this.submitted = false
            this.breakDownDialog = true
            this.createNew = true
		},
        changeBreakdown() {
            // console.log(event.value)
            // console.log(this.breakdown)
            this.qtyProductCustomer= []
            let index = 0;
            for (let key in this.breakdown.products) {
                // console.log(this.breakdown.products[key])
                const len = this.breakdown.customers.length
                if(len == 0) return;
                const qty_temp = this.breakdown.products[key]/len
                let qty = 0
                if ((qty_temp > 0) && (qty_temp < 1)) {
                    qty = 1
                } else {
                    // qty = Math.round(this.breakdown.products[key]/len)
                    qty = Math.round(qty_temp)
                }
                
                // console.log(this.findIndexByCode(key, 'short', this.products))
                let total = this.breakdown.products[key]
                for (let i = 0 ; i < len-1 ; i++ ) {
                    this.qtyProductCustomer[i] = []
                    // this.breakdown.customers[i] = {}
                    // console.log(this.breakdown.customers[i])
                    this.breakdown.customers[i].products = []
                    this.breakdown.customers[i].products[index] = this.products[this.findIndexByCode(key, 'short', this.products)]
                    if (total !== 0){
                        if (total > qty ) {
                            this.breakdown.customers[i][key] = qty
                            this.breakdown.customers[i].products[index].qty = qty
                            this.qtyProductCustomer[i][index] = qty
                            total -= qty
                        } else {
                            this.breakdown.customers[i][key] = total
                            this.breakdown.customers[i].products[index].qty = total
                            this.qtyProductCustomer[i][index] = total
                            total -= total
                        }
                    } else {
                        this.breakdown.customers[i].products[index].qty = 0
                        this.breakdown.customers[i][key] = 0
                        this.qtyProductCustomer[i][index] = 0
                    }
                }
                this.qtyProductCustomer[len-1] = []
                // this.breakdown.customers[len-1] = {}
                this.breakdown.customers[len-1].products = []
                this.breakdown.customers[len-1].products[index] = this.products[this.findIndexByCode(key, 'short', this.products)]
                this.breakdown.customers[len-1].products[index].qty = total
                this.breakdown.customers[len-1][key]= total
                this.qtyProductCustomer[len-1][index] = total
                index+=1
            }
            // console.log(this.breakdown)

        },
        saveBreakDown() {
            
            this.createBreakdown();
            // console.log(this.breakdown)
        },
        create() {
            let data = this.breakdown
            data.outlet = this.breakdown._id
            delete data._id

            this.saveBreakdownService.createSaveBreakdown(data)
            .then(msg => {
                this.loading = true
                this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
                this.saveBreakdownService.getSaveBreakdown()
                .then(data => {
                    this.saveBreakdowns = data  
                    for (let l in data) {
                        for (let key in this.saveBreakdowns[l].products) {
                            this.saveBreakdowns[l][key] = this.saveBreakdowns[l].products[key]
                        }
                    }
                    this.loading = false
                })
            })
            .catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})
        },
        createBreakdown() {
            this.submitted = true;
            if(this.breakdown.code && this.breakdown.detailer) {
                this.create()
                this.breakdown = {}
                // this.breakdown = {}
                this.createNew = false;
                this.breakDownDialog = false
            }
            
        },
        findIndexByCode(id, key, data) {
			let index = -1;
			for (let i = 0; i < data.length; i++) {
				if (data[i][key] === id) {
					index = i;
					break;
				}
			}
			return index;
        },
        changeQty(short,i, index){
            // console.log(i)
            // console.log(index)
            // this.breakdown.customers[i].products[index].qty = event.value
            console.log(this.breakdown.customers[i].products[index].qty)
            // console.log(event )
            this.breakdown.customers[i][short] = this.breakdown.customers[i].products[index].qty
            // this.breakdown.customers[i].products[index].qty = event
            // console.log(this.breakdown.customers[i].products[index].qty)
        }
    }

}
</script>

<style>

</style>