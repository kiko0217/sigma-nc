<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template slot="left">
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedRegions || !selectedRegions.length" />
					</template>

					<template slot="right">
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="products" :scrollable="true" scrollHeight="500px" :selection.sync="selectedRegions" dataKey="Code" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Regions">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Manage Product</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column headerStyle="width:120px" >
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editRegion(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteRegion(slotProps.data)" />
						</template>
					</Column>
					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column field="code" header="Code" headerStyle="width: 100px" sortable></Column>
					<Column field="barcode" header="Barcode" headerStyle="width: 150px" sortable></Column>
					<Column field="name" header="Name" headerStyle="width: 200px" sortable></Column>
					<Column field="short" header="Short" headerStyle="width: 200px" ortable></Column>
					<Column field="type" header="Type" headerStyle="width: 100px" sortable></Column>
					<Column field="ppn" header="PPN" headerStyle="width: 100px" sortable></Column>
					<Column field="disc" header="Disc" headerStyle="width: 100px" sortable></Column>
					<Column field="UoM" header="Unit of Measure" headerStyle="width: 200px" sortable></Column>
					<Column field="conversion" header="Conversion" headerStyle="width: 150px" sortable></Column>
					<Column field="weight" header="Weight" headerStyle="width: 100px" sortable></Column>
					<Column field="volume" header="Volume" headerStyle="width: 120px" sortable></Column>
					<Column field="price" header="Price" headerStyle="width: 150px" sortable>
						<template #body="slotProps">
							<span>{{formatCurrency(slotProps.data.price)}}</span>
						</template>
					</Column>
					<Column field="HNA" header="HNA" headerStyle="width: 150px" sortable>
						<template #body="slotProps">
							<span>{{formatCurrency(slotProps.data.HNA)}}</span>
						</template>
					</Column>
					<Column field="status" header="Status" headerStyle="width: 100px" sortable></Column>
					<Column field="createdAt" header="Create Date" headerStyle="width: 150px" sortable>
						<template #body="slotProps">
							<span>{{formatDate(slotProps.data.createdAt)}}</span>
						</template>
					</Column>
					<Column field="updatedAt" header="Update Date" headerStyle="width: 150px" sortable>
						<template #body="slotProps">
							<span>{{formatDate(slotProps.data.updatedAt)}}</span>
						</template>
					</Column>
					<Column field="updateBy" header="Update by" headerStyle="width: 150px" sortable></Column>
				</DataTable>

				<Dialog :visible.sync="regionDialog" :style="{width: '450px'}" header="Region Details" :modal="true" class="p-fluid">
					<!-- ini bisa diisi dengan peta nantinya -->
					<div class="p-field">
						<label for="Code">Code</label>
						<InputText id="Code" v-model.trim="region.Code" required="true" autofocus :class="{'p-invalid': submitted && !region.Code}" />
						<small class="p-invalid" v-if="submitted && !region.Code">Code is required.</small>
					</div>
					<div class="p-field">
						<label for="Name">Name</label>
						<InputText id="Name" v-model.trim="region.Name" required="true" autofocus :class="{'p-invalid': submitted && !region.Name}" />
						<small class="p-invalid" v-if="submitted && !region.Name">Name is required.</small>
					</div>
					<div class="p-field">
						<label for="Type">Type</label>
						<InputText id="Type" v-model.trim="region.Type" required="true" autofocus :class="{'p-invalid': submitted && !region.Type}" />
						<small class="p-invalid" v-if="submitted && !region.Type">Type Name is required.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveRegion" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteRegionDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="region">Are you sure you want to delete <b>{{region.Name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRegionDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteRegion" />
					</template>
				</Dialog>

				<Dialog :visible.sync="deleteRegionsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="region">Are you sure you want to delete the selected regions?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRegionsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedRegions" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import ProductService from '../service/ProductService';

export default {
	data() {
		return {
			products: null,
			regionDialog: false,
			deleteRegionDialog: false,
			deleteRegionsDialog: false,
			region: {},
			selectedRegions: null,
			filters: {},
            submitted: false,
            createNew: false
		}
	},
	productService: null,
	created() {
		this.productService = new ProductService();
	},
	mounted() {
		this.productService.getProducts().then(data => this.products = data);
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
        },
		formatCurrency(value) {
			return value.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'});
		},
		openNew() {
			this.region = {};
			this.submitted = false;
            this.regionDialog = true;
            this.createNew = true;
		},
		hideDialog() {
			this.regionDialog = false;
			this.submitted = false;
		},
		saveRegion() {
            if(this.createNew){
                this.createRegion();
                return;
            }
			this.submitted = true;

			if (this.region.Name.trim() && this.region.Code.trim() && this.region.Type.trim()) {
                this.$set(this.regions, this.findIndexByCode(this.region.Code), this.region);
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Updated', life: 3000});
                this.regionDialog = false;
                this.region = {};
			}
        },
        createRegion() {
            this.submitted = true;
            if (this.region.Name.trim() && this.region.Code.trim() && this.region.Type.trim()) {
                this.regions.push(this.region);
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Created', life: 3000});
                this.regionDialog = false;
                this.region = {};
                this.createNew = false;
            }
        },
		editRegion(region) {
			this.region = {...region};
			this.regionDialog = true;
		},
		confirmDeleteRegion(region) {
			this.region = region;
			this.deleteRegionDialog = true;
		},
		deleteRegion() {
			this.regions = this.regions.filter(val => val.Code !== this.region.Code);
			this.deleteRegionDialog = false;
			this.region = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Region Deleted', life: 3000});
		},
		findIndexByCode(Code) {
			let index = -1;
			for (let i = 0; i < this.regions.length; i++) {
				if (this.regions[i].Code === Code) {
					index = i;
					break;
				}
			}

			return index;
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
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteRegionsDialog = true;
		},
		deleteSelectedRegions() {
			this.regions = this.regions.filter(val => !this.selectedRegions.includes(val));
			this.deleteRegionsDialog = false;
			this.selectedRegions = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Regions Deleted', life: 3000});
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