import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './components/Dashboard.vue';

Vue.use(Router);
// const EmptyParentComponent = {
// 	template: '<router-view></router-view>'
// }
// Vue.use(EmptyParentComponent);

// const demoRouter = []
export default new Router({
	// mode: 'hash',
	routes: [
		// ...demoRouter,
		{
			path: '*',
			redirect: { name: 'dashboard' }
		},
		{
			path: '/',
			name: 'dashboard',
			component: Dashboard
		},
		{
			path: '/master',
			redirect: { name: 'region' },
		},
		{
			name: 'region',
			path: '/master/region',
			component: () => import('./master/Region.vue')
		},
		{
			name: 'area',
			path: '/master/area',
			component: () => import('./master/Area.vue')
		},
		{
			name: 'distributor',
			path: '/master/distributor',
			component: () => import('./master/Distributor.vue')
		},
		{
			name: 'pemeliharaanHarga',
			path: '/master/pemeliharaan-harga',
			component: () => import('./master/PemeliharaanHarga.vue')
		},
		{
			name: 'detailer',
			path: '/master/detailer',
			component: () => import('./master/Detailer.vue')
		},
		{
			name: 'outlet',
			path: '/master/outlet',
			component: () => import('./master/Outlet.vue')
		},
		{
			name: 'product',
			path: '/master/product',
			component: () => import('./master/Product.vue')
		},
		{
			path: 'transaksi',
			redirect: { name: 'target' },
		},
		{
			name: 'target',
			path: '/transaksi/target',
			component: () => import('./transaksi/Target.vue')
		},
		{
			name: 'breakdownSeles',
			path: '/transaksi/breakdown-seles',
			component: () => import('./transaksi/BreakdownSeles.vue')
		},
		{
			name: 'kerjasamaOperasi',
			path: '/transaksi/kerjasama-operasi',
			component: () => import('./transaksi/KerjasamaOperasi.vue')
		},
		{
			name: 'expense',
			path: '/transaksi/expense',
			component: () => import('./transaksi/Expense.vue')
		},
		{
			name: 'sellingIn',
			path: '/transaksi/selling-in',
			component: () => import('./transaksi/SellingIn.vue')
		},
		{
			name: 'incentiveCalc',
			path: '/transaksi/incentive-calc',
			component: () => import('./transaksi/IncentiveCalc.vue')
		},
		{
			name: 'discountSubmission',
			path: '/transaksi/discount-submission',
			component: () => import('./transaksi/DiscountSubmission.vue')
		},
		{
			path: 'laporan',
			redirect: { name: 'detailSales' },
		},
		{
			name: 'detailSales',
			path: '/laporan/detail-sales',
			component: () => import('./laporan/DetailSales.vue')
		},
		{
			name: 'achevementbyProduct',
			path: '/laporan/achevement-by-product',
			component: () => import('./laporan/AchevementbyProduct.vue')
		},
		{
			name: 'achevementbyArea',
			path: '/laporan/achevement-by-area',
			component: () => import('./laporan/AchevementbyArea.vue')
		},
		{
			name: 'salesbyDistributor',
			path: '/laporan/sales-by-distributor',
			component: () => import('./laporan/SalesbyDistributor.vue')
		},
		{
			name: 'laporanTarget',
			path: '/laporan/target',
			component: () => import('./laporan/Target.vue')
		},
		{
			name: 'evaluasiCustomer',
			path: '/laporan/evaluasi-customer',
			component: () => import('./laporan/EvaluasiCustomer.vue')
		},
		{
			name: 'laporanDonasi',
			path: '/laporan/laporan-donasi',
			component: () => import('./laporan/LaporanDonasi.vue')
		},
		{
			name: 'laporanIncentiveCalc',
			path: '/laporan/incentive-calc',
			component: () => import('./laporan/IncentiveCalc.vue')
		},
		{
			name: 'keyLoyaltyManagement)',
			path: '/laporan/key-loyalty-management',
			component: () => import('./laporan/KeyLoyaltyManagement.vue')
		},
		{
			name: 'detailStockInfo)',
			path: '/laporan/detail-stock-info',
			component: () => import('./laporan/DetailStockInfo.vue')
		},
	],
	scrollBehavior() {
		return {x: 0, y: 0};
	}
});
