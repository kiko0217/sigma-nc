<template>
    <div class="p-field p-grid">
        <div class="p-col-12 p-md-6">
            <div class="card">
				<Toast/>
                <Toolbar class="p-mb-4">
					<template slot="left">
						<strong>From</strong>
					</template>

					<template slot="right">
						
					</template>
				</Toolbar>
                <div class=" p-fluid p-grid p-formgrid">
                    <div class="p-field p-col-12 p-md-6">
                        <label for="basic">Periode</label>
                        <Calendar id="basic" 
                            :manualInput="false"
                            v-model.trim="salesDisplacement.from.periode"
                        />
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.from.periode">
                            Periode is required.
                        </small>
                    </div>
                </div>
                <div class="p-fluid p-grid">
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="detailer">Detailer</label>
                        <Dropdown inputId="detailer" 
                            v-model="salesDisplacement.from.detailer"
                            :options="detailers"
                            :filter="true"
                            optionValue="_id"
                            optionLabel="name"
                            placeholder="Select Detailer"
                            scrollHeight="100px"
                        >
                        </Dropdown>
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.from.detailer">
                            Detailer is required.
                        </small>
                        <!-- </span> -->
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="outletFrom">Outlet</label>
                        <Dropdown inputId="outletFrom" 
                            v-model.trim="salesDisplacement.from.outlet"
                            :options="outlets"
                            :filter="true"
                            optionValue="_id"
                            optionLabel="name"
                            placeholder="Select Outlet"
                            scrollHeight="100px"
                            dataKey="_id"
                        >
                        </Dropdown>
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.from.outlet">
                            Outlet is required.
                        </small>
                        <!-- </span> -->
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="distributorFrom">Distributor</label>
                        <Dropdown inputId="distributorFrom" 
                            v-model.trim="salesDisplacement.from.distributor"
                            :options="distributors"
                            :filter="true"
                            optionValue="_id" 
                            optionLabel="name"
                            placeholder="Select Distributor"
                            crollHeight="100px"
                            dataKey= "_id"
                        >
                        </Dropdown>
                        <!-- </span> -->
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="salesFrom">Sales</label>
                        <InputText placeholder="Sales" 
                            v-model="salesDisplacement.from.sales"/>
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.from.sales">
                            Sales is required.
                        </small>
                        <!-- </span> -->
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="productFrom">Product</label>
                        <Dropdown inputId="productFrom" 
                            v-model="salesDisplacement.from.product"
                            :options="products"
                            :filter="true"
                            optionValue="_id"
                            optionLabel="short"
                            placeholder="Select Distributor"
                            scrollHeight="100px"
                            dataKey="_id"
                        >
                        </Dropdown>
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.from.product">
                            Product is required.
                        </small>
                        <!-- </span> -->
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="amountFrom">Amount</label>
                        <InputNumber id="amountFrom" 
                            v-model="salesDisplacement.from.amount"
                            mode="currency" 
                            currency="IDR" locale="id-ID" />
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.from.amount">
                            Amount is required.
                        </small>
                        <!-- </span> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="p-col-12 p-md-6">
            <div class="card">
                <Toolbar class="p-mb-4">
					<template slot="left">
						<strong>To</strong> 
					</template>

					<template slot="right">
						
					</template>
				</Toolbar>
                <div class=" p-fluid p-grid p-formgrid">
                    <div class="p-field p-col-12 p-md-6">
                        <label for="dateTo">Date</label>
                        <Calendar id="dateTo"
                            :manualInput="false"
                            v-model="salesDisplacement.to.date"
                        />
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.to.date">
                            Sales is required.
                        </small>
                    </div>
                </div>
                <div class="p-fluid p-grid">
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="detailerTo"
                        :disabled="true">Detailer</label>
                        <Dropdown inputId="detailerTo"
                            v-model="salesDisplacement.to.detailer" 
                            :options="detailers"
                            :filter="true"
                            optionValue="_id"
                            optionLabel="name"
                            placeholder="Select Detailer"
                            scrollHeight="100px"
                            dataKey="_id"
                        >
                        </Dropdown>
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.to.detailer">
                            Sales is required.
                        </small>
                        <!-- </span> -->
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="outletTo">Outlet</label>
                        <Dropdown inputId="outletTo"
                            v-model="salesDisplacement.to.outlet" 
                            :options="outlets" 
                            :filter="true"
                            optionValue="_id"
                            optionLabel="name"
                            placeholder="Select Outlet"
                            scrollHeight="100px"
                            dataKey="_id"
                        >
                        </Dropdown>
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.to.outlet">
                            Sales is required.
                        </small>
                        <!-- </span> -->
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="distributorTo">Distributor</label>
                        <Dropdown inputId="distributorTo"
                            v-model.trim="salesDisplacement.to.distributor"
                            :options="distributors" 
                            :filter="true"
                            optionValue="_id"
                            optionLabel="name" 
                            placeholder="Select Distributor" 
                            scrollHeight="100px"
                            dataKey="_id"
                        >
                        </Dropdown>
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.to.distributor">
                            Sales is required.
                        </small>
                        <!-- </span> -->
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="salesTo">Sales</label>
                        <InputText placeholder="Sales"
                            v-model.trim="salesDisplacement.to.sales"
                        />
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.to.sales">
                            Sales is required.
                        </small>
                        <!-- </span> -->
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <!-- <span class="p-float-label"> -->
                        <label for="amountTo">Amount</label>
                        <InputNumber id="amountTo"
                            v-model.trim="salesDisplacement.to.amount" 
                            mode="currency" 
                            currency="IDR" 
                            locale="id-ID"
                        />
                        <small class="p-invalid" 
                            v-if="submitted && !salesDisplacement.to.amount">
                            Sales is required.
                        </small>
                        <!-- </span> -->
                    </div>
                    <div class="p-field p-col-12 p-md-3">
                        <label for="save">Save</label>
                        <Button icon="pi pi-check" label="Save" @click="save()"/>
                    </div>
                </div>
            </div>
                
        </div>
    </div>
</template>

<script>
import SalesDisplacementService from '../service/SalesDisplacementService'
import DetailerService from '../service/DetailerService'
import OutletService from '../service/OutletService';
import DistributorService from '../service/DistributorService';
import ProductService from '../service/ProductService';

export default {
    data() {
        return {
            submitted: false,
            salesDisplacement: {
                from: {},
                to: {},
            },
            products: null,
            productFrom: null,
            outlets: null,
            outletFrom: null,
            detailers: null,
            detailerFrom: null,
            distributors: null,
            distributorFrom: null,
            distributorTo: null,
            priodeNew: null,
            salesDisplaceDialog: true,
        }
    },
    productService: null,
    distributorService: null,
    detailerService: null,
    outletService: null,
    salesDisplacementService: null,
    created() {
        this.productService = new ProductService();
        this.outletService = new OutletService();
        this.detailerService = new DetailerService();
        this.distributorService = new DistributorService();
        this.salesDisplacementService = new SalesDisplacementService();
    },
    mounted() {
        this.productService.getProducts()
        .then(data => this.products = data);
        this.distributorService.getDistributors()
        .then(data => this.distributors = data);
        this.detailerService.getDetailers()
		.then(data => {
			this.detailers = data
        })
        this.outletService.getOutlets()
		.then(data => {
            this.outlets = data;
            // this.loading = false;
        });
    },
    computed: {
        
    },
    methods: {

        save() {
            this.submitted = true;
            if (!(this.salesDisplacement.from.periode &&
				this.salesDisplacement.from.detailer &&
				this.salesDisplacement.from.outlet &&
				this.salesDisplacement.from.distributor &&
				this.salesDisplacement.from.sales &&
				this.salesDisplacement.from.product &&
				this.salesDisplacement.from.amount &&
				this.salesDisplacement.to.date &&
				this.salesDisplacement.to.detailer &&
				this.salesDisplacement.to.outlet &&
				this.salesDisplacement.to.distributor &&
				this.salesDisplacement.to.sales &&
				this.salesDisplacement.to.amount)) 
			{
                return
            }
            this.salesDisplacementService.createSalesDisplacement({
                salesDisplacement: this.salesDisplacement
            })
            .then(msg => {
                this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000})
                this.salesDisplacement= {
                    from: {},
                    to: {},
                }
                this.submitted = false
            })
            .catch(err => {
                this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
            })
        }
    }
}
</script>

<style>

</style>