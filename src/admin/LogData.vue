<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<!-- <h1>Data dari Email</h1> -->
			<div class="card">
				<Toolbar class="p-mb-4">
					<template slot="left">Data from Email</template>
					<template slot="right">
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>
				<DataTable :value="dataTemp" 
					:scrollable="true"
					:expandedRows.sync="expandedRows"
					scrollHeight="500px"
					dataKey="_id"
					:loading="loading"
					:paginator="true"
					:rows="10"
					:filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} data from email"
				>
					<template #empty>
                        No Data from Email found.
                    </template>
                    <template #loading>
                        Loading Data from Email data. Please wait.
                    </template>
					<Column :expander="true" headerStyle="width: 3rem" />
					<Column v-for="(col, index) of culomnTemp" :field="col" :header="col" :key="index" headerStyle="width: 150px"></Column>
					<template #expansion="slotProps">
						<Toolbar class="p-mb-4">
							<template slot="left">{{slotProps.data.subject}}</template>
							<template slot="right">
								<!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" /> -->
								<!-- <Button label="Mapping" icon="pi pi-upload" class="p-button-help" @click="mapping"  /> -->
							</template>
						</Toolbar>
						<DataTable :value="slotProps.data.attachments" 
							:selection.sync="selectedTemp" 
							selectionMode="single" 
							dataKey="name">
							<Column headerStyle="width:120px">
								<template #body="slotProps">
									<Button icon="pi pi-arrow-down" class="p-button-rounded p-button-success p-mr-2" @click="downloadFile(slotProps.data)" />
								</template>
							</Column>
							<Column v-for="(col, index) of culomnAttachment" :field="col" :header="col" :key="index" headerStyle="width: 150px"></Column>
						</DataTable>
					</template>
				</DataTable>
			</div>
		</div>
		<div class="p-col-12">
			<!-- <h1>Data dari Email</h1> -->
			<div class="card">
				<Toolbar class="p-mb-4">
					<template slot="left">Log Error</template>
				</Toolbar>
				<DataTable :value="logErrors" 
					:scrollable="true"
					scrollHeight="500px"
					dataKey="_id"
					:loading="loading2"
					:paginator="true"
					:rows="10"
					:filters="filters2"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Error"
				>
					<template #empty>
                        No Error found.
                    </template>
                    <template #loading>
                        Loading... Please wait.
                    </template>
					<Column v-for="(col, index) in culomnLogError" :field="col.field" :header="col.header" :key="index" headerStyle="width: 150px">
					</Column>
				</DataTable>
			</div>
		</div>

	</div>
</template>

<script>
import ProductMappingService from '../service/ProductMappingService'
import LogErrorService from '../service/LogErrorService'
export default {
	data() {
		return {
			loading: false,
			loading2: false,
			productUnmapping: null,
			logErrors: null,
			culomnLogError: [
				{field: 'updatedAt', header: 'Time'},
				{field: 'file', header: 'Files'},
				{field: 'line', header: 'Line'},
				{field: 'error', header: 'error'},
			],
			selectedTemp : null,
			expandedRows : [{
				subject: null,
			}],
			dataTemp : null,
			culomnTemp: [],
			culomnAttachment: ['name' , 'type'],
			filters: {},
			filters2: {},
		}
	},
	productMappingService: null,
	logErrorService: null,
	// fs: null,
	created() {
		this.logErrorService = new LogErrorService()
		this.productMappingService = new ProductMappingService();
		this.culomnTemp = ['from', 'subject', 'status', 'createdAt']
		// this.fs = new FS();
	},
	mounted() {
		this.loading = true
		this.loading2 = true
		this.productMappingService.getDataFromEmail().then(data=> {
			this.dataTemp = data
			this.loading = false
		})
		this.logErrorService.getLogError().then(dt => {
			this.logErrors = dt
			this.loading2 = false
		})
	},
	methods: {
		downloadFile(data) {
			this.productMappingService.downloadFile(data.name, this.expandedRows[1].subject)
			
		},
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		},
		createId() {
			let id = '';
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for ( var i = 0; i < 5; i++ ) {
				id += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return id;
		},
		exportCSV() {
			this.$refs.mapping.exportCSV();
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