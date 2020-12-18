<template>
    <div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<!-- <template slot="left">Mapping</template> -->
                    <template slot="left">
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew"/>
						<!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedRegions || !selectedRegions.length" /> -->
					</template>
					<template slot="right">
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>
				<DataTable ref="mapping" :value="products" :scrollable="true" scrollHeight="500px" dataKey="_id" editMode="cell" class="editable-cells-table" :filters="filters">
					<Column field="nfCode" header="Detailer" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Type Transaksi" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Deskripsi" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Amount" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Tanggal" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Bukti Transaksi" headerStyle="width: 150px"></Column>
				</DataTable>
                <Dialog :visible.sync="expenseDialog" :style="{width: '600px'}" header="Expense" :modal="true" class="p-fluid">
					<!-- ini bisa diisi dengan peta nantinya -->
                    <div class="p-fluid p-grid">
                        <div class="p-field p-col-12 p-md-6">
                            <!-- <span class="p-float-label"> -->
                            <label for="detailer">Detailer</label>
                            <Dropdown inputId="detailer" :options="detailers" :filter="true" optionValue="code" optionLabel="name" placeholder="Select Detailer" scrollHeight="100px">
                            </Dropdown>
                            <!-- </span> -->
                        </div>
                        <div class="p-field p-col-12 p-md-6">
                            <label for="typeTransaksi">Type Transaksi</label>
                            <InputText inputId="typeTransaksi"/>
                        </div>
                        <div class="p-field p-col-12 p-md-6">
                            <label for="currency-id">Amount</label>
                            <InputNumber/>
                        </div>
                        <div class="p-field p-col-12 p-md-6">
                            <label for="monthpicker">Tanggal</label>
                            <Calendar id="monthpicker" view="year" dateFormat="yy" :yearNavigator="true" yearRange="2000:2030" />
                        </div>
                        <div class="p-field p-col-12 p-md-6">
                            <label>Image</label>
                            <FileUpload mode="basic" name="demo[]" url="./upload.php" accept="image/*" :maxFileSize="1000000"/>
                        </div>
						
						<div class="p-field p-col-12 p-md-12">
							<span class="p-float-label">
								<Textarea id="textarea" rows="3" />
								<label for="textarea">Deskripsi</label>
							</span>
						</div>
                    </div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" />
					</template>
				</Dialog>
			</div>
		</div>

	</div>
</template>

<script>
export default {
    data() {
		return {
            expenseDialog: false,
			products: null,
		}
	},
	created() {
		
	},
	mounted() {
		
	},
	methods: {
        exportCSV() {

        },
        openNew() {
			this.expenseDialog = true;
		},
		hideDialog  () {
			this.expenseDialog = false
		},
	}

}
</script>

<style>

</style>