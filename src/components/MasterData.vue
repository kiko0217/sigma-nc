<template>
	<div class="p-grid">
		<div class="p-col-12">
			<div class="card">
				<h4>Row Expand</h4>

				<Toast />
				<DataTable :value="reports" :expandedRows.sync="expandedRows" class="p-datatable-customers" dataKey="id" @row-expand="onRowExpand" @row-collapse="onRowCollapse">
					<template #header>
						<div class="table-header-container">
							<Button icon="pi pi-plus" label="Expand All" @click="expandAll" class="p-mr-2" />
							<Button icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
						</div>
					</template>
					<Column :expander="true" headerStyle="width: 3rem" />
					<Column field="Bulan" header="Bulan" sortable></Column>
					<Column field="Value_Target" header="Val.Target" sortable>
						<template #body="slotProps">
							{{formatCurrency(slotProps.data.Value_Target)}}
						</template>
					</Column>
					<Column field="QTY_ONOIWA" header="ONOIWA" sortable></Column>
					<Column field="QTY_ONOIWA_PLUS" header="ONOIWA PLUS" sortable></Column>
					<Column field="QTY_ONOIWA_MX" header="ONOIWA MX" sortable></Column>
					<Column field="QTY_ONOGATE" header="ONOGATE" sortable></Column>
                    <Column field="QTY_ONOAKE" header="ONOAKE" sortable></Column>
                    <Column field="QTY_RAFA_KHOMSAH" header="KHOMSAH" sortable></Column>
                    <Column field="Qty_Sales" header="Tot.Sales" sortable></Column>
                    <Column field="Value_Sales" header="Val.Sales" sortable>
						<template #body="slotProps">
							{{formatCurrency(slotProps.data.Value_Sales)}}
						</template>
					</Column>
                    <Column field="Achievement" header="Achievement" sortable></Column>
					<template #expansion="slotProps">
						<div class="orders-subtable">
							<h5>Rincian Bulan {{slotProps.data.Bulan}}</h5>
							<DataTable :value="slotProps.data.Data">
<!--								<Column field="NO" header="No" sortable></Column>
-->
								<Column field="PERIOD" header="Period" sortable></Column>
<!--								<Column field="NAME" header="Name" sortable></Column>
								<Column field="POSITION" header="Pos" sortable></Column>
								<Column field="REGION" header="Reg" sortable></Column>
-->								<Column field="AREA" header="City" sortable></Column>
<!--							<Column field="AREA" header="AREA" sortable></Column>
-->								<Column field="Value_Target" header="ValTarget" sortable>
									<template #body="slotProps" sortable>
										{{formatCurrency(slotProps.data.Value_Target)}}
									</template>
								</Column>
								<Column field="QTY_ONOIWA" header="ONOIWA" sortable></Column>
                                <Column field="QTY_ONOIWA_PLUS" header="ONOIWAPLUS" sortable></Column>
                                <Column field="QTY_ONOIWA_MX" header="ONOIWAMX" sortable></Column>
                                <Column field="QTY_ONOGATE" header="ONOGATE" sortable></Column>
                                <Column field="QTY_ONOAKE" header="ONOAKE" sortable></Column>
                                <Column field="QTY_RAFA_KHOMSAH" header="KHOMSAH" sortable></Column>
                                <Column field="Qty_Sales" header="Tot.Sales" sortable></Column>
                                <Column field="Value_Sales" header="Val.Sales" sortable>
                                    <template #body="slotProps">
                                        {{formatCurrency(slotProps.data.Value_Sales)}}
                                    </template>
                                </Column>
                                <Column field="Achievement" header="Achievement" sortable></Column>
							</DataTable>
						</div>
					</template>
				</DataTable>
			</div>
		</div>
	</div>
</template>

<script>
	import ReportService from "../service/ReportService";
	import CustomerService from "../service/CustomerService";
	import ProductService from '../service/ProductService';

	export default {
		data() {
			return {
				customer1: null,
				customer2: null,
				customer3: null,
				selectedCustomers1: null,
				selectedCustomers2: null,
				filters1: {},
				filters2: {},
				loading1: true,
				loading2: true,
                products: null,
                reports: null,
				expandedRows: []
			}
		},
		customerService: null,
        productService: null,
        reportService: null,
		created() {
			this.customerService = new CustomerService();
            this.productService = new ProductService();
            this.reportService = new ReportService();
		},
		mounted() {
            this.productService.getProductsWithOrdersSmall().then(data => this.products = data);
            this.reportService.getReport().then(data=> this.reports = data);
			this.customerService.getCustomersMedium().then(data => this.customer1 = data);
			this.customerService.getCustomersLarge().then(data => this.customer2 = data);
			this.customerService.getCustomersMedium().then(data => this.customer3 = data);
			this.loading1 = false;
			this.loading2 = false;
		},
		methods: {
			onRowExpand(event) {
				this.$toast.add({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
			},
			onRowCollapse(event) {
				this.$toast.add({severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000});
			},
			expandAll() {
				this.expandedRows = this.reports.filter(p => p.id);
				this.$toast.add({severity: 'success', summary: 'All Rows Expanded', life: 3000});
			},
			collapseAll() {
				this.expandedRows = null;
				this.$toast.add({severity: 'success', summary: 'All Rows Collapsed', life: 3000});
			},
			formatCurrency(value) {
				return value;
			},
			calculateCustomerTotal(name) {
				let total = 0;

				if (this.customer3) {
					for (let customer of this.customer3) {
						if (customer.representative.name === name) {
							total++;
						}
					}
				}

				return total;
			}
		}
	}
</script>

<style scoped lang="scss">
/deep/ .p-progressbar {
	height: .5rem;
	background-color: #D8DADC;

	.p-progressbar-value {
		background-color: #607D8B;
	}
}

.p-datatable .p-column-filter {
	display: none;
}

.table-header {
	display: flex;
	justify-content: space-between;
}

/deep/ .p-datatable.p-datatable-customers {
	.p-datatable-header {
		padding: 1rem;
		text-align: left;
		font-size: 1.5rem;
	}

	.p-paginator {
		padding: 1rem;
	}

	.p-datatable-thead > tr > th {
		text-align: left;
	}

	.p-datatable-tbody > tr > td {
		cursor: auto;
	}

	.p-dropdown-label:not(.p-placeholder) {
		text-transform: uppercase;
	}
}

/* Responsive */
.p-datatable-customers .p-datatable-tbody > tr > td .p-column-title {
	display: none;
}

.customer-badge {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: .3px;

	&.status-qualified {
		background: #C8E6C9;
		color: #256029;
	}

	&.status-unqualified {
		background: #FFCDD2;
		color: #C63737;
	}

	&.status-negotiation {
		background: #FEEDAF;
		color: #8A5340;
	}

	&.status-new {
		background: #B3E5FC;
		color: #23547B;
	}

	&.status-renewal {
		background: #ECCFFF;
		color: #694382;
	}

	&.status-proposal {
		background: #FFD8B2;
		color: #805B36;
	}
}

.p-progressbar-value.ui-widget-header {
	background: #607d8b;
}

@media (max-width: 640px) {
	.p-progressbar {
		margin-top: .5rem;
	}
}

.product-image {
	width: 100px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
}

.orders-subtable {
	padding: 1rem;
}

.product-badge {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 10px;
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

.order-badge {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: .3px;

	&.order-delivered {
		background: #C8E6C9;
		color: #256029;
	}

	&.order-cancelled {
		background: #FFCDD2;
		color: #C63737;
	}

	&.order-pending {
		background: #FEEDAF;
		color: #8A5340;
	}

	&.order-returned {
		background: #ECCFFF;
		color: #694382;
	}
}

@media screen and (max-width: 960px) {
	/deep/ .p-datatable {
		&.p-datatable-customers {
			.p-datatable-thead > tr > th,
			.p-datatable-tfoot > tr > td {
				display: none !important;
			}

			.p-datatable-tbody > tr {
				> td {
					text-align: middle;
					font-size: 10px;
					display: block;
					border: 0 none !important;
					width: 100% !important;
					float: left;
					clear: left;
					border: 0 none;

					.p-column-title {
						padding: .4rem;
						min-width: 30%;
						display: inline-block;
						margin: -.4rem 1rem -.4rem -.4rem;
						font-weight: bold;
					}

					.p-progressbar {
						margin-top: .5rem;
					}
				}
			}
		}
	}
}
</style>
