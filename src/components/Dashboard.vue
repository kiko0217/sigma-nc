 <template>
<div class="dashboard">
	<div class="p-grid p-fluid">
		<div class="p-col-12 p-lg-4">
			<div class="card summary">
				<span class="title">Sales</span>
				<span class="detail">Total Sales</span>
				<span class="count visitors">{{totalSales}}</span>
			</div>
		</div>
		<div class="p-col-12 p-lg-4">
			<div class="card summary">
				<span class="title">Product</span>
				<span class="detail">Total Purchases</span>
				<span class="count purchases">{{totalPurchases}}</span>
			</div>
		</div>
		<div class="p-col-12 p-lg-4">
			<div class="card summary">
				<span class="title">Revenue</span>
				<span class="detail">This Year</span>
				<span class="count revenue">IDR {{formatCurrency(revenue)}}</span>
			</div>
		</div>
	</div>
	<div class="p-grid p-fluid">
		<div v-for="(col, index) in resultProduct" 
			:key="index"
			class="p-col-12 p-md-6 p-xl-4">
			<div class="highlight-box">
				<div class="initials" :style="randomColor(index)"><span>PR</span></div>
				<div class="highlight-details ">
					<i class="pi pi-question-circle"></i>
					<span>{{col.short}}</span>
					<span class="count">{{col.qty}}</span>
				</div>
			</div>
		</div>
	</div>
	<div class="p-grid p-fluid">
		<div class="p-col-12 p-lg-8">
			<div class="card">
				<Chart type="line" :data="lineData" />
			</div>
		</div>
		<div class="p-col-12 p-lg-4">
			<div class="card">
				<h1 style="font-size:16px">Top Product</h1>
				<DataTable :value="resultProduct" 
					class="p-datatable-customers" 
					:scrollable="true" scrollHeight="300px"
					:rows="10" 
					style="margin-bottom: 20px" 
					:paginator="true">
					<!-- <Column>
						<template #header>
							Logo
						</template>
						<template #body="slotProps">
							<img :src="'assets/layout/images/product/' + slotProps.data.image" :alt="slotProps.data.image" width="50px" />
						</template>
					</Column> -->
					<Column field="short" header="Name" sortable></Column>
					<Column field="qty" header="QTY" sortable></Column>
					<Column field="price" header="Price" sortable>
						<template #body="slotProps">
							{{formatCurrency(slotProps.data.price)}}
						</template>
					</Column>
				</DataTable>
			</div>
		</div> 
	</div>
	<div class="p-grid p-fluid">
		<div class="p-col-12 p-lg-4 contacts">
			<Panel header="Top Sales">
				<ul>
					<li>
						<button class="p-link">
							<img src="assets/layout/images/avatar_1.png" width="35" alt="avatar1"/>
							<span class="name">Maya Dante</span>
							<span class="email">maya@necleus.com</span>
						</button>
					</li>
					<li>
						<button class="p-link">
							<img src="assets/layout/images/avatar_2.png" width="35" alt="avatar2"/>
							<span class="name">Jason Dourne</span>
							<span class="email">jason@nucleus.com</span>
						</button>
					</li>
					<li>
						<button class="p-link">
							<img src="assets/layout/images/avatar_3.png" width="35" alt="avatar3"/>
							<span class="name">Jane Davidson</span>
							<span class="email">jane@nucleus.com</span>
						</button>
					</li>
					<li>
						<button class="p-link">
							<img src="assets/layout/images/avatar_4.png" width="35" alt="avatar4"/>
							<span class="name">Tony Corleone</span>
							<span class="email">tony@nucleus.com</span>
						</button>
					</li>
					<li>
						<button class="p-link">
							<img src="assets/layout/images/avatar_2.png" width="35" alt="avatar4"/>
							<span class="name">Rendi Jaka</span>
							<span class="email">renJaka@nucleus.com</span>
						</button>
					</li>
					<li>
						<button class="p-link">
							<img src="assets/layout/images/avatar_1.png" width="35" alt="avatar4"/>
							<span class="name">Clarosia Cindi</span>
							<span class="email">cCindi@nucleus.com</span>
						</button>
					</li>
					<li>
						<button class="p-link">
							<img src="assets/layout/images/avatar_4.png" width="35" alt="avatar4"/>
							<span class="name">Samuel Iskandar</span>
							<span class="email">iskandar@nucleus.com</span>
						</button>
					</li>
				</ul>
			</Panel>
		</div>
		<div class="p-col-12 p-lg-8">
			<Panel header="Activity" style="height: 100%">
				<div class="activity-header">
					<div class="p-grid">
						<div class="p-col-6">
							<span style="font-weight:bold">Last Activity</span>
							<p>Updated 1 minute ago</p>
						</div>
						<div class="p-col-6" style="text-align: right">
							<Button label="Refresh" icon="pi pi-refresh" />
						</div>
					</div>
				</div>

				<ul class="activity-list">
					<li>
						<div class="p-d-flex p-jc-between p-ai-center p-mb-3">
							<h5 class="activity p-m-0">Income</h5>
							<div class="count">900,000,000</div>
						</div>
						<ProgressBar :value="95" :showValue="false" />
					</li>
					<li>
						<div class="p-d-flex p-jc-between p-ai-center p-mb-3">
							<h5 class="activity p-m-0">Tax</h5>
							<div class="count" style="background-color:#f9c851">2,500,000</div>
						</div>
						<ProgressBar :value="24" :showValue="false" />
					</li>
					<li>
						<div class="p-d-flex p-jc-between p-ai-center p-mb-3">
							<h5 class="activity p-m-0">Invoices</h5>
							<div class="count" style="background-color:#20d077">125,000,000</div>
						</div>
						<ProgressBar :value="55" :showValue="false" />
					</li>
					<li>
						<div class="p-d-flex p-jc-between p-ai-center p-mb-3">
							<h5 class="activity p-m-0">Expenses</h5>
							<div class="count" style="background-color:#f9c851">2,500,000</div>
						</div>
						<ProgressBar :value="15" :showValue="false" />
					</li>
					<li>
						<div class="p-d-flex p-jc-between p-ai-center p-mb-3">
							<h5 class="activity p-m-0">Bonus</h5>
							<div class="count" style="background-color:#007be5">350,000.000</div>
						</div>
						<ProgressBar :value="5" :showValue="false" />
					</li>
					<li>
						<div class="p-d-flex p-jc-between p-ai-center p-mb-3">
							<h5 class="activity p-m-0">Revenue</h5>
							<div class="count" style="background-color:#ef6262">500,000,000</div>
						</div>
						<ProgressBar :value="25" :showValue="false" />
					</li>
				</ul>
			</Panel>
		</div>
	</div>
	<!--  -->


<!--	<div class="p-col-12 p-lg-8">
		<Panel header="Calendar" style="height: 100%">
			<FullCalendar :events="events" :options="options" />
		</Panel>
	</div>
-->
</div>




</template>

<script>
import ProductService from '../service/ProductService'
import DetailerService from '../service/DetailerService'
import EventService from '../service/EventService';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
	data() {
		return {
			value: 0,
			totalSales: 0,
			totalPurchases: 0,
			resultProduct: null,
			revenue: 0,
			tasksCheckbox: [],
			dropdownCities: [
				{name: 'New York', code: 'NY'},
				{name: 'Rome', code: 'RM'},
				{name: 'London', code: 'LDN'},
				{name: 'Istanbul', code: 'IST'},
				{name: 'Paris', code: 'PRS'}
			],
			dropdownCity: null,
			options: {
				plugins:[dayGridPlugin, timeGridPlugin, interactionPlugin],
				defaultDate: '2019-01-01',
				header: {
					left: 'prev,next',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay'
				},
				editable: true
			},
			events: null,
			products: null,
			selectedProducts: null,
			lineData: null,
		}
	},
	productService: null,
	detailerService: null,
	eventService: null,
	created() {
		this.productService = new ProductService()
		this.detailerService = new DetailerService()
		this.eventService = new EventService();
	},
	mounted() {
		this.productService.getProductMinis().then(data => this.products = data);
		this.productService.getProductTotal().then(data => this.totalPurchases = data[0].total);
		this.productService.getProductPlot().then(data => {
				this.lineData = data[0]
				this.lineData.datasets = [...new Set(this.lineData.datasets.map(({...rest})=>({
					backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16),
                    borderColor: '#'+Math.floor(Math.random()*16777215).toString(16),
					...rest
				})))]
			});
		this.productService.getProductResult().then(data => {
			this.resultProduct = data
			this.resultProduct.forEach(elm => {
				this.revenue += (elm.price * elm.qty)
			})
		})
		this.detailerService.getTotalDetailers().then(data => this.totalSales = data[0].total);

		this.eventService.getEvents().then(data => this.events = data);

		let afId = this.$route.query['af_id'];
        if (afId) {
            let today = new Date();
            let expire = new Date();
            expire.setTime(today.getTime() + 3600000*24*7);
            document.cookie = 'primeaffiliateid=' + afId + ';expires=' + expire.toUTCString() + ';path=/; domain:primefaces.org';
        }
	},
	methods: {
		randomColor(index) {
			// const rndom = {
			// 	backgroundColor : '#' + Math.floor(Math.random()*16777215).toString(16),
			// 	color: '#' + Math.floor(Math.random()*16777215).toString(16)
			// }
			// console.log(rndom)
			let rndom = {}
			if ((index % 4) == 0){
				rndom = {
					backgroundColor : '#007be5',
					color: '#00448f'
				}
			} else if((index % 4) == 1) {
				rndom = {
					backgroundColor : '#ef6262',
					color: '#a83d3b'
				}
			} else if((index % 4) == 2) {
				rndom = {
					backgroundColor : '#20d077',
					color: '#038d4a'
				}
			} else {
				rndom = {
					backgroundColor : '#f9c851',
					color: '#b58c2b'
				}
			}
			// console.log(rndom)
			
			return rndom
		},
		formatCurrency(value) {
			return value.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'});
		}
	}
}
</script>

<style lang="scss" scoped>
	@media screen and (max-width: 960px) {
		/deep/ .p-datatable {
			&.p-datatable-customers {
				.p-datatable-thead > tr > th,
				.p-datatable-tfoot > tr > td {
					display: none !important;
				}

				.p-datatable-tbody > tr {
					border-bottom: 1px solid #dee2e6;
					> td {
						text-align: left;
						display: flex;
						align-items: center;
						justify-content: center;
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
