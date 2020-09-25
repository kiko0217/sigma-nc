import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './components/Dashboard.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'dashboard',
			component: Dashboard
		},
		{
			path: '/report',
			name: 'masterdata',
			component: () => import('./components/MasterData.vue')
		},
		{
			path: '/product',
			name: 'crud',
			component: () => import('./pages/CrudDemo.vue')
		},
		{
			path: '/seles',
			name: 'table',
			component: () => import('./components/TableDemo.vue')
		},
	],
	scrollBehavior() {
		return {x: 0, y: 0};
	}
});
