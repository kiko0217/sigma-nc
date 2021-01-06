<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" 
							icon="pi pi-plus"
							class="p-button-success p-mr-2"
							:disabled="loading"
							@click="openNew"
						/>
					</template>

					<template slot="right">
						<Button label="Export"
							icon="pi pi-upload"
							class="p-button-help"
							:disabled="loading"
							@click="exportCSV($event)"
						/>
					</template>
				</Toolbar>

				<DataTable ref="dt" 
					:value="targetSales"
					scrollHeight="500px"
					:scrollable="true" 
					dataKey="_id"
					:paginator="true"
					:rows="10"
					:filters="filters"
					:loading="loading"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Target Sales"
                    :expandedRows.sync="expandedRows"
				>
                    <Column :expander="true" headerStyle="width: 3rem" />
					<Column v-for="(col, index) of columnTargetSales"
						:field="col.field"
						:header="col.header"
						:key="index"
						headerStyle="width: 150px"
					>
					</Column>
                    <template #expansion="slotProps">
                        <DataTable :value="slotProps.data.revisiTargetSales" 
                            dataKey="_id"
                        >
                            <Column headerStyle="width: 6em" headerClass="p-text-center" bodyClass="p-text-center">
                                <template #body="slotProps1">
                                    <Button type="button" 
                                        icon="pi pi-search"
                                        class="p-button-success"
                                        style="margin-right: .5em"
                                        @click="openView(slotProps1.data)"
                                    ></Button>
                                </template>
                            </Column>
                            <Column v-for="(col, index) of columnRevisiTargetSales"
                                :field="col.field"
                                :header="col.header"
                                :key="index"
                                headerStyle="width: 150px"
                            >
                            </Column>
                        </DataTable>
                    </template>
				</DataTable>

				<Dialog :visible.sync="revisiTargetSalesNewDialog" 
					:style="{width: '900px'}" 
					header="Target Sales" 
					:modal="true" 
					class="p-fluid"
				>
					<!-- ini bisa diisi dengan peta nantinya -->
                    <div class="p-fluid p-grid">
						<div class="p-field p-col-12 p-md-4">
							<label for="Code">Code</label>
							<InputText id="Code" 
								v-model.trim="revisiTargetSale.code"
								required="true"
								autofocus 
								:class="{'p-invalid': submitted && !revisiTargetSale.code}" 
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.code">Code is required.</small>
						</div>
                        <div class="p-field p-col-12 p-md-4">
                            <!-- <span class="p-float-label"> -->
                            <label for="detailer">Target Sale</label>
                            <Dropdown inputId="detailer" 
								v-model.trim="revisiTargetSale.targetSale"
								:options="targetSales"
								:filter="true"
								optionValue="_id"
								optionLabel="code"
								placeholder="Select Target Sales"
								scrollHeight="100px"
								:disabled="!createNew"
                                @change="changeTargetSale($event)"
							>
                            </Dropdown>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.targetSale">Target Sale is required.</small>
                            <!-- </span> -->
                        </div>
                        <div class="p-field p-col-12 p-md-4">
                            <label for="Target Per Tahun">Target Per Tahun</label>
                            <InputNumber id="Target Per Tahun"
								v-model.trim="revisiTargetSale.targetPerTahun"
								suffix=" Qty"
                                :disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.targetPerTahun">Target Per Tahun is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Januari">Januari</label>
                            <InputNumber id="Januari"
								v-model.trim="revisiTargetSale.january"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.january">Target Januari is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Febuari">Febuari</label>
                            <InputNumber id="Febuari"
								v-model.trim="revisiTargetSale.febuary"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.febuary">Target Febuari is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Maret">Maret</label>
                            <InputNumber id="Maret"
								v-model.trim="revisiTargetSale.maret"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.maret">Target Maret is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="April">April</label>
                            <InputNumber id="April"
								v-model.trim="revisiTargetSale.april"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.april">Target April is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Mei">Mei</label>
                            <InputNumber id="Mei"
								v-model.trim="revisiTargetSale.may"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.may">Target Mei is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Juni">Juni</label>
                            <InputNumber id="Juni"
								v-model.trim="revisiTargetSale.june"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.june">Target Juni is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Juli">Juli</label>
                            <InputNumber id="Juli"
								v-model.trim="revisiTargetSale.july"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.july">Target Juli is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Agustus">Agustus</label>
                            <InputNumber id="Agustus"
								v-model.trim="revisiTargetSale.august"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.august">Target Agustus is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="September">September</label>
                            <InputNumber id="September"
								v-model.trim="revisiTargetSale.september"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.september">Target September is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Oktober">Oktober</label>
                            <InputNumber id="Oktober"
								v-model.trim="revisiTargetSale.october"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.october">Target Oktober is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="November">November</label>
                            <InputNumber id="November"
								v-model.trim="revisiTargetSale.november"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.november">Target November is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-4">
                            <label for="Desember">Desember</label>
                            <InputNumber id="Desember"
								v-model.trim="revisiTargetSale.december"
								suffix=" Qty"
								:disabled="!createNew"
							/>
							<small class="p-invalid" v-if="submitted && !revisiTargetSale.december">Target Desember is required.</small>
                        </div>
						<div class="p-field p-col-12 p-md-12">
							<span class="p-float-label">
								<Textarea id="textarea" 
									v-model="revisiTargetSale.description" 
									rows="3" 
									:disabled="!createNew"
								/>
								<label for="textarea">Keterangan</label>
							</span>
						</div>
                    </div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" 
							icon="pi pi-check"
							class="p-button-text"
							@click="saveRevisiTargetSale"
							:disabled="!createNew"
						/>
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import RevisiTargetSaleService from '../service/RevisiTargetSaleService'
import TargetSaleService from '../service/TargetSaleService'

export default {
	data() {
		return {
			loading: false,
            columnTargetSales: [],
            columnRevisiTargetSales: [],
            filters: {},
			targetSales: null,
			revisiTargetSale: {},
            revisiTargetSalesNewDialog: false,
			submitted: false,
			createNew: false,
            deleteTargetSaleDialog: false,
            expandedRows: null,
		}
	},
	targetSaleService: null,
	revisiTargetSaleService: null,
	created() {
		this.columnTargetSales = [
			{
				field : 'code',
				header : 'Code'
			},
			{
				field : 'tahun',
				header : 'Tahun'
			},
			{
				field : 'detailerName',
				header : 'Detailer'
			},
			{
				field : 'productName',
				header : 'Product'
			},
			{
				field : 'targetPerTahun',
				header : 'Target Per Tahun (Qty)'
			},
			{
				field : 'codeRevisi',
				header : 'Revisi'
			},
		]
		this.columnRevisiTargetSales = [
            {
                field : 'tahun',
				header : 'Tahun'
			},
			{
                field : 'targetPerTahun',
				header : 'Target Per Tahun (Qty)'
			},
            {
                field : 'code',
                header : 'Code Revisi'
            },
		]
		this.targetSaleService = new TargetSaleService();
		this.revisiTargetSaleService = new RevisiTargetSaleService();
	},
	mounted() {
		this.loading = true
		this.targetSaleService.getTargetSalesWithRevisi()
		.then(data => {
			this.targetSales = data
			this.targetSales = [...new Set(this.targetSales.map(({
				product,
				detailer,
				...rest
			}) => ({
				product: product._id,
				productName: product.name,
				detailer: detailer._id,
				detailerName: detailer.name,
				...rest
			})))]
			this.loading = false
		})
	},
	methods: {
		hideDialog() {
            this.revisiTargetSalesNewDialog = false
            this.revisiTargetSale = {}
			this.submitted = false
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
        },
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		},
		openNew() {
            // console.log('test')
			this.revisiTargetSale = {}
			this.submitted = false
			this.revisiTargetSalesNewDialog = true
			this.createNew = true
		},
		openView(revisiTargetSale) {
			this.createNew = false
			this.revisiTargetSale = {...revisiTargetSale};
			this.revisiTargetSalesNewDialog = true;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		saveRevisiTargetSale() {
			this.submitted = true;
			// console.log(this.revisiTargetSale)
			if (this.revisiTargetSale.code && 
				this.revisiTargetSale.targetSale &&
				this.revisiTargetSale.tahun &&
				this.revisiTargetSale.targetPerTahun &&
				this.revisiTargetSale.january &&
				this.revisiTargetSale.febuary &&
				this.revisiTargetSale.maret &&
				this.revisiTargetSale.april &&
				this.revisiTargetSale.may &&
				this.revisiTargetSale.june &&
				this.revisiTargetSale.july &&
				this.revisiTargetSale.august &&
				this.revisiTargetSale.september &&
				this.revisiTargetSale.october &&
				this.revisiTargetSale.november &&
				this.revisiTargetSale.december)
			{
				if(this.createNew) {
					this.createRevisiTargetSale()
					return;
				}

			}
		},
		create() {
            delete this.revisiTargetSale['_id']
            // delete this.revisiTargetSale['_id']
            // console.log(this.revisiTargetSale)
			this.revisiTargetSaleService.createRevisiTargetSale(this.revisiTargetSale)
			.then(msg => {
				this.loading = true
				this.$toast.add({severity:'success', summary: 'Successful', detail: msg, life: 3000});
				this.targetSaleService.getTargetSalesWithRevisi()
				.then(data => {
					this.targetSales = data
					this.targetSales = [...new Set(this.targetSales.map(({
						product,
						detailer,
						...rest
					}) => ({
						product: product._id,
						productName: product.name,
						detailer: detailer._id,
						detailerName: detailer.name,
						...rest
					})))]
					this.loading = false
				})

			})
			.catch(err => {
				this.$toast.add({severity:'error', summary: 'Error Message', detail: err, life: 3000})
			})

		},
		createRevisiTargetSale() {
			this.create()
			this.revisiTargetSalesNewDialog = false
			this.revisiTargetSale = {}
			this.createNew = false
        },
        changeTargetSale(event) {
            // console.log(event.value)
            const targetSale = this.targetSales.find(data => data._id == event.value)
            this.revisiTargetSale = targetSale.revisiTargetSales.find(data => data.code == targetSale.codeRevisi )
            // console.log(this.revisiTargetSale)
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