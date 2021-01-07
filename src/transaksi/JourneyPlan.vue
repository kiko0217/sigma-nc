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
					<Column field="nfCode" header="Detailer" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Region" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Area" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Custome" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Target Call" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Call/Visit" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Call Date" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Latitude" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Longitude" headerStyle="width: 150px"></Column>
					<Column field="nfCode" header="Image" headerStyle="width: 150px"></Column>
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
			salesVisitDialog: false,
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