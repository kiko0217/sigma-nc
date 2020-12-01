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
			name: 'outletMapping',
			path: '/master/outlet-map',
			component: () => import('./master/OutletMapping.vue')
		},
		{
			name: 'outletDistributor',
			path: '/master/outlet-distributor',
			component: () => import('./master/OutletDistributor.vue')
		},
		{
			name: 'customer',
			path: '/master/customer',
			component: () => import('./master/Customer.vue')
		},
		{
			name: 'selesCover',
			path: '/master/seles-cover',
			component: () => import('./master/SelesCover.vue')
		},
		{
			name: 'product',
			path: '/master/product',
			component: () => import('./master/Product.vue')
		},
		{
			name: 'productMapping',
			path: '/master/product-mapping',
			component: () => import('./master/ProductMapping.vue')
		},
		{
			name: 'pemeliharaanHarga',
			path: '/master/pemeliharaan-harga',
			component: () => import('./master/PemeliharaanHarga.vue')
		},
		{
			name: 'skemaDiscount',
			path: '/master/skema-discount',
			component: () => import('./master/SkemaDiscount.vue')
		},
		{
			path: 'transaksi',
			redirect: { name: 'target' },
		},
		{
			name: 'targetSeles',
			path: '/transaksi/target-seles',
			component: () => import('./transaksi/TargetSeles.vue')
		},
		{
			name: 'revisiTargetSeles',
			path: '/transaksi/revisi-target-seles',
			component: () => import('./transaksi/RevisiTargetSeles.vue')
		},
		{
			name: 'targetCall',
			path: '/transaksi/target-call',
			component: () => import('./transaksi/TargetCall.vue')
		},
		{
			name: 'breakdownSales',
			path: '/transaksi/breakdown-sales',
			component: () => import('./transaksi/BreakdownSales.vue')
		},
		{
			name: 'salesVisit',
			path: '/transaksi/sales-visit',
			component: () => import('./transaksi/SalesVisit.vue')
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
			name: 'kerjasamaOperasi',
			path: '/transaksi/kerjasama-operasi',
			component: () => import('./transaksi/KerjasamaOperasi.vue')
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
			name: 'achievementbyProduct',
			path: '/laporan/achievement-by-product',
			component: () => import('./laporan/AchievementbyProduct.vue')
		},
		{
			name: 'achievementbyArea',
			path: '/laporan/achievement-by-area',
			component: () => import('./laporan/AchievementbyArea.vue')
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
			name: 'laporanIncentive',
			path: '/laporan/incentive-calc',
			component: () => import('./laporan/Incentive.vue')
		},
		{
			name: 'keyLoyaltyManagement)',
			path: '/laporan/key-loyalty-management',
			component: () => import('./laporan/KeyLoyaltyManagement.vue')
		},
		{
			name: 'detailStockInfo',
			path: '/laporan/detail-stock-info',
			component: () => import('./laporan/DetailStockInfo.vue')
		},
		{
			name: 'wpr',
			path: '/laporan/wpr',
			component: () => import('./laporan/WPR.vue')
		},
		{
			name: 'monthlyCallPlan',
			path: '/laporan/monthly-call-plan',
			component: () => import('./laporan/MothlyCallPlan.vue')
		},
		{
			name: 'promoTrial',
			path: '/laporan/promo-trial',
			component: () => import('./laporan/PromoTrial.vue')
		},
		{
			path: 'admin',
			redirect: { name: 'adminUser' },
		},
		{
			name: 'adminUser',
			path: '/admin/user',
			component: () => import('./admin/User.vue')
		},
		{
			name: 'adminAuthorization',
			path: '/admin/authorization',
			component: () => import('./admin/Authorization.vue')
		},
		{
			name: 'adminLogData',
			path: '/admin/log-data',
			component: () => import('./admin/LogData.vue')
		},
		{
			name: 'adminLogUser',
			path: '/admin/log-user',
			component: () => import('./admin/LogUser.vue')
		},
	],
	scrollBehavior() {
		return {x: 0, y: 0};
	}
});
