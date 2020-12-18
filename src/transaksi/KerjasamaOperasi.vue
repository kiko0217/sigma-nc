<template>
    <div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<!-- <template slot="left">Mapping</template> -->
					<template slot="right">
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>

				</Toolbar>
				<DataTable ref="mapping" :value="products" :scrollable="true" scrollHeight="500px" dataKey="_id" editMode="cell" class="editable-cells-table" :filters="filters">
					<Column field="nfCode" header="Code Cust" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Name Customer" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Tanggal" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Value" headerStyle="width: 150px"></Column>
				</DataTable>
			</div>
		</div>

	</div>
</template>

<script>
export default {
    data() {
		return {
			products: null,
		}
	},
	created() {
		
	},
	mounted() {
		
	},
	methods: {
        exportCSV() {

        }
		
	}

}
</script>

<style>

</style>