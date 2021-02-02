<template>
    <div class="p-grid">
        <div class="p-field p-grid">
            <div class="p-col-12 p-md-6">
                <card>
                    <template #title>
                        From
                    </template>
                    <template #content>
                        <div class=" p-fluid p-grid p-formgrid">
                            <div class="p-field p-col-12 p-md-6">
                                <label for="basic">Periode</label>
                                <Calendar id="basic" 
                                    v-model.trim="salesDisplacement.from.periode"
                                />
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
                                    optionValue="code"
                                    optionLabel="name"
                                    placeholder="Select Detailer"
                                    scrollHeight="100px"
                                >
                                </Dropdown>
                                <!-- </span> -->
                            </div>
                            <div class="p-field p-col-12 p-md-6">
                                <!-- <span class="p-float-label"> -->
                                <label for="outletFrom">Outlet</label>
                                <Dropdown inputId="outletFrom" 
                                    v-model.trim="outletFrom"
                                    :options="outlets"
                                    :filter="true"
                                    optionValue="code"
                                    optionLabel="name"
                                    placeholder="Select Outlet"
                                    scrollHeight="100px"
                                    dataKey="_id"
                                >
                                </Dropdown>
                                <!-- </span> -->
                            </div>
                            <div class="p-field p-col-12 p-md-6">
                                <!-- <span class="p-float-label"> -->
                                <label for="distributorFrom">Distributor</label>
                                <Dropdown inputId="distributorFrom" 
                                    v-model.trim="distributorFrom"
                                    :options="distributors"
                                    :filter="true"
                                    optionValue="code" 
                                    optionLabel="name"
                                    placeholder="Select Distributor"
                                    crollHeight="100px"
                                    dataKey="_id"
                                >
                                </Dropdown>
                                <!-- </span> -->
                            </div>
                            <div class="p-field p-col-12 p-md-6">
                                <!-- <span class="p-float-label"> -->
                                <label for="salesFrom">Sales</label>
                                <InputText placeholder="Sales" />
                                <!-- </span> -->
                            </div>
                            <div class="p-field p-col-12 p-md-6">
                                <!-- <span class="p-float-label"> -->
                                <label for="productFrom">Product</label>
                                <Dropdown inputId="productFrom" 
                                    v-model="productFrom"
                                    :options="products"
                                    :filter="true"
                                    optionValue="code"
                                    optionLabel="name"
                                    placeholder="Select Distributor"
                                    scrollHeight="100px"
                                    dataKey="_id"
                                >
                                </Dropdown>
                                <!-- </span> -->
                            </div>
                            <div class="p-field p-col-12 p-md-6">
                                <!-- <span class="p-float-label"> -->
                                <label for="amountFrom">Amount</label>
                                <InputNumber id="amountFrom" mode="currency" currency="IDR" locale="id-ID" />
                                <!-- </span> -->
                            </div>
                        </div>
                    </template>
                </card>
            </div>
            <div class="p-col-12 p-md-6">
                <card>
                    <template #title>
                        To
                    </template>
                    <template #content>
                        <div class=" p-fluid p-grid p-formgrid">
                            <div class="p-field p-col-12 p-md-6">
                                <label for="basic1">Date</label>
                                <Calendar id="basic1" 
                                    :disabled="true"
                                />
                            </div>
                        </div>
                        <div class="p-fluid p-grid">
                            <div class="p-field p-col-12 p-md-6">
                                <!-- <span class="p-float-label"> -->
                                <label for="detailerTo"
                                :disabled="true">Detailer</label>
                                <Dropdown inputId="detailerTo" 
                                    :options="detailers"
                                    :filter="true"
                                    optionValue="code"
                                    optionLabel="name"
                                    placeholder="Select Detailer"
                                    scrollHeight="100px"
                                    dataKey="_id"
                                >
                                </Dropdown>
                                <!-- </span> -->
                            </div>
                            <div class="p-field p-col-12 p-md-6">
                                <!-- <span class="p-float-label"> -->
                                <label for="outletTo">Outlet</label>
                                <Dropdown inputId="outletTo" 
                                    :options="outlets" 
                                    :filter="true"
                                    optionValue="code"
                                    optionLabel="name"
                                    placeholder="Select Outlet"
                                    scrollHeight="100px"
                                    dataKey="_id"
                                    :optionDisabled="true"
                                >
                                </Dropdown>
                                <!-- </span> -->
                            </div>
                            <div class="p-field p-col-12 p-md-6">
                                <!-- <span class="p-float-label"> -->
                                <label for="distributorTo">Distributor</label>
                                <Dropdown inputId="distributorTo"
                                    v-model.trim="distributorTo"
                                    :options="distributors" 
                                    :filter="true"
                                    optionValue="code"
                                    optionLabel="name" 
                                    placeholder="Select Distributor" 
                                    scrollHeight="100px"
                                    dataKey="_id"
                                    :optionDisabled="true"
                                >
                                </Dropdown>
                                <!-- </span> -->
                            </div>
                            <div class="p-field p-col-12 p-md-6">
                                <!-- <span class="p-float-label"> -->
                                <label for="salesTo">Sales</label>
                                <InputText placeholder="Sales" 
                                    :disabled="true"
                                />
                                <!-- </span> -->
                            </div>
                            <div class="p-field p-col-12 p-md-6">
                                <!-- <span class="p-float-label"> -->
                                <label for="amountTo">Amount</label>
                                <InputNumber id="amountTo" 
                                    mode="currency" 
                                    currency="IDR" 
                                    locale="id-ID"
                                    :disabled="true"
                                />
                                <!-- </span> -->
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <Button icon="pi pi-check" label="Save" />
                        <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" style="margin-left: .5em" />
                    </template>
                </card>
            </div>
        </div>
    </div>
</template>

<script>
import DetailerService from '../service/DetailerService'
import OutletService from '../service/OutletService';
import DistributorService from '../service/DistributorService';
import ProductService from '../service/ProductService';

export default {
    data() {
        return {
            
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
    created() {
        this.productService = new ProductService();
        this.outletService = new OutletService();
        this.detailerService = new DetailerService();
        this.distributorService = new DistributorService();
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
        
    }
}
</script>

<style>

</style>