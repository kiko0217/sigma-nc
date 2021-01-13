<template>
	<div :class="containerClass" @click="onWrapperClick">
		<AppTopBar @menu-toggle="onMenuToggle" v-if="!isAuth()"/>

        <transition name="layout-sidebar" v-if="!isAuth()">
            <div :class="sidebarClass" @click="onSidebarClick" v-show="isSidebarVisible()">
                <div class="layout-logo">
                    <router-link to="/">
                        <img alt="Logo" :src="logo" />
                    </router-link>
                </div>

                <AppProfile />
                <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
            </div>
        </transition>

		<div id="app" class="layout-main">
			<router-view />
		</div>

		<AppConfig :layoutMode="layoutMode" :layoutColorMode="layoutColorMode" @layout-change="onLayoutChange" @layout-color-change="onLayoutColorChange" v-if="!isAuth()"/>

		<AppFooter />
	</div>
</template>

<script>
import AppTopBar from './AppTopbar.vue';
import AppProfile from './AppProfile.vue';
import AppMenu from './AppMenu.vue';
import AppConfig from './AppConfig.vue';
import AppFooter from './AppFooter.vue';

export default {
    data() {
        return {
            layoutMode: 'static',
            layoutColorMode: 'dark',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            menu : [
                {label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'},
                {label: 'Master', icon: 'pi pi-fw pi-clone',
					items: [
                        {
                            label: 'Region',
                            icon: 'pi pi-fw pi-map-marker', 
                            to: { name: "region" }
                        },
                        {
                            label:'Area',
                            icon: 'pi pi-fw pi-refresh',
                            to: { name: 'area' }
                        },
                        {
                            label:'Distributor',
                            icon: 'pi pi-fw pi-shopping-cart',
                            to: { name: 'distributor' }
                        },
                        {
                            label:'Detailer',
                            icon: 'pi pi-fw pi-sort-alpha-down',
                            to: { name: 'detailer' }
                        },
                        {
                            label:'Outlet',
                            icon: 'pi pi-fw pi-eject',
                            to: { name: 'outlet' }
                        },
                        {
                            label:'Outlet Mapping',
                            icon: 'pi pi-fw pi-eject',
                            to: { name: 'outletMapping' }
                        },
                        // {
                        //     label:'Outlet Distributor',
                        //     icon: 'pi pi-fw pi-eject',
                        //     to: { name: 'outletDistributor' }
                        // },
                        {
                            label:'Customer',
                            icon: 'pi pi-fw pi-users',
                            to: { name: 'customer' }
                        },
                        {
                            label:'Sales Cover',
                            icon: 'pi pi-fw pi-users',
                            to: { name: 'selesCover' }
                        },
                        {
                            label:'Product',
                            icon: 'pi pi-fw pi-thumbs-up',
                            to: { name: 'product' }
                        },
                        {
                            label:'Product Mapping',
                            icon: 'pi pi-fw pi-thumbs-up',
                            to: { name: 'productMapping' }
                        },
                        {
                            label:'Pemeliharaan Harga',
                            icon: 'pi pi-fw pi-heart',
                            to: { name: 'pemeliharaanHarga' }
                        },
                        // {
                        //     label:'Skema Discount',
                        //     icon: 'pi pi-fw pi-heart',
                        //     to: { name: 'skemaDiscount' }
                        // },
                    ]
                },
                {label: 'Transaksi', icon: 'pi pi-fw pi-clone',
					items: [
                        {
                            label: 'Target Sales',
                            icon: 'pi pi-fw pi-map-marker', 
                            to: { name: "targetSeles" }
                        },
                        {
                            label: 'Revisi Target Sales',
                            icon: 'pi pi-fw pi-map-marker', 
                            to: { name: "revisiTargetSeles" }
                        },
                        {
                            label: 'Sales Displacement (PR)',
                            icon: 'pi pi-fw pi-map-marker', 
                            to: { name: "salesDisplacement" }
                        },
                        // {
                        //     label: 'Target Call',
                        //     icon: 'pi pi-fw pi-map-marker', 
                        //     to: { name: "targetCall" }
                        // },
                        
                        {
                            label:'Breakdown Sales',
                            icon: 'pi pi-fw pi-refresh',
                            to: { name: 'breakdownSales' }
                        },
                        {
                            label: 'Sales Visit',
                            icon: 'pi pi-fw pi-map-marker', 
                            to: { name: "salesVisit" }
                        },
                        {
                            label: 'Journey Plan',
                            icon: 'pi pi-fw pi-map-marker', 
                            to: { name: "journeyPlan" }
                        },
                        {
                            label: 'Donasi',
                            icon: 'pi pi-fw pi-map-marker', 
                            to: { name: "donasi" }
                        },
                        {
                            label: 'Realisasi Expense',
                            icon: 'pi pi-fw pi-map-marker', 
                            to: { name: "realisasiExpense" }
                        },
                        {
                            label:'Expense/CA',
                            icon: 'pi pi-fw pi-sort-alpha-down',
                            to: { name: 'expense' }
                        },
                        // {
                        //     label:'Selling In',
                        //     icon: 'pi pi-fw pi-eject',
                        //     to: { name: 'sellingIn' }
                        // },
                        {
                            label:'Kerjasama Operasi',
                            icon: 'pi pi-fw pi-shopping-cart',
                            to: { name: 'kerjasamaOperasi' }
                        },
                        // {
                        //     label:'Incentive Calc',
                        //     icon: 'pi pi-fw pi-users',
                        //     to: { name: 'incentiveCalc' }
                        // },
                        {
                            label:'Discount Submission',
                            icon: 'pi pi-fw pi-thumbs-up',
                            to: { name: 'discountSubmission' }
                        },
                    ]
				},
                {label: 'Laporan', icon: 'pi pi-fw pi-clone',
					items: [
                        {
                            label:'Sales Distributor',
                            icon: 'pi pi-fw pi-sort-alpha-down',
                            to: { name: 'salesbyDistributor' }
                        },
                        {
                            label: 'Detail Sales Info',
                            icon: 'pi pi-fw pi-map-marker', 
                            to: { name: "detailSales" }
                        },
                        {
                            label:'Achievement by Product',
                            icon: 'pi pi-fw pi-refresh',
                            to: { name: 'achievementbyProduct' }
                        },
                        {
                            label:'Achievement by Area',
                            icon: 'pi pi-fw pi-shopping-cart',
                            to: { name: 'achievementbyArea' }
                        },
                        // {
                        //     label:'Target',
                        //     icon: 'pi pi-fw pi-eject',
                        //     to: { name: 'laporanTarget' }
                        // },
                        {
                            label:'Evaluasi Customer',
                            icon: 'pi pi-fw pi-users',
                            to: { name: 'evaluasiCustomer' }
                        },
                        {
                            label:'Monitoring Outlet',
                            icon: 'pi pi-fw pi-users',
                            to: { name: 'monitoringOutlet' }
                        },
                        {
                            label:'Monitoring Product',
                            icon: 'pi pi-fw pi-users',
                            to: { name: 'evaluasiCustomer' }
                        },
                        {
                            label:'Balance KSP',
                            icon: 'pi pi-fw pi-users',
                            to: { name: 'balanceKSP' }
                        },
                        {
                            label:'Laporan Incentive',
                            icon: 'pi pi-fw pi-users',
                            to: { name: 'balanceKSP' }
                        },
                        // {
                        //     label:'Laporan Donasi',
                        //     icon: 'pi pi-fw pi-thumbs-up',
                        //     to: { name: 'laporanDonasi' }
                        // },
                        // {
                        //     label:'Laporan Incentive',
                        //     icon: 'pi pi-fw pi-thumbs-up',
                        //     to: { name: 'laporanIncentive' }
                        // },

                        {
                            label:'Key Loyalty Management',
                            icon: 'pi pi-fw pi-thumbs-up',
                            to: { name: 'laporanIncentive' }
                        },
                        {
                            label:'Detail Stock Info',
                            icon: 'pi pi-fw pi-thumbs-up',
                            to: { name: 'detailStockInfo' }
                        },
                        {
                            label:'WPR',
                            icon: 'pi pi-fw pi-thumbs-up',
                            to: { name: 'wpr' }
                        },
                        {
                            label:'Monthly Call Plan',
                            icon: 'pi pi-fw pi-thumbs-up',
                            to: { name: 'monthlyCallPlan' }
                        },
                        {
                            label:'Promo Trial',
                            icon: 'pi pi-fw pi-thumbs-up',
                            to: { name: 'promoTrial' }
                        },
                    ]
				},
                {label: 'Admin', icon: 'pi pi-fw pi-clone',
					items: [
                        {
                            label: 'User',
                            icon: 'pi pi-fw pi-map-marker', 
                            to: { name: "adminUser" }
                        },
                        {
                            label:'Level of Authonriztion User',
                            icon: 'pi pi-fw pi-refresh',
                            to: { name: 'adminAuthorization' }
                        },
                        {
                            label:'Log Data Import',
                            icon: 'pi pi-fw pi-shopping-cart',
                            to: { name: 'adminLogData' }
                        },
                        {
                            label:'Log User',
                            icon: 'pi pi-fw pi-sort-alpha-down',
                            to: { name: 'adminLogUser' }
                        },
                    ]
				},
		
            ]
        }
    },
    watch: {
        $route() {
            this.menuActive = false;
            this.$toast.removeAllGroups();
        }
    },
    methods: {
        onWrapperClick() {
            if (!this.menuClick) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle() {
            this.menuClick = true;

            if (this.isDesktop()) {
                if (this.layoutMode === 'overlay') {
					if(this.mobileMenuActive === true) {
						this.overlayMenuActive = true;
					}

                    this.overlayMenuActive = !this.overlayMenuActive;
					this.mobileMenuActive = false;
                }
                else if (this.layoutMode === 'static') {
                    this.staticMenuInactive = !this.staticMenuInactive;
                }
            }
            else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }
        },
		onLayoutChange(layoutMode) {
			this.layoutMode = layoutMode;
		},
		onLayoutColorChange(layoutColorMode) {
			this.layoutColorMode = layoutColorMode;
		},
        addClass(element, className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        },
        removeClass(element, className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },
        isDesktop() {
            return window.innerWidth > 1024;
        },
        isSidebarVisible() {
            if (this.isDesktop()) {
                if (this.layoutMode === 'static')
                    return !this.staticMenuInactive;
                else if (this.layoutMode === 'overlay')
                    return this.overlayMenuActive;
                else
                    return true;
            }
            else {
                return true;
            }
        },
        isAuth() {
            const path = this.$router.history.current['path']
            if(path === '/auth/register') return true
            if(path === '/auth/login') return true
            return false
        }
    },
    computed: {
        containerClass() {
            return ['layout-wrapper', {
                'layout-overlay': this.layoutMode === 'overlay',
                'layout-static': this.layoutMode === 'static',
                'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
                'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
                'layout-mobile-sidebar-active': this.mobileMenuActive,
				'p-input-filled': this.$appState.inputStyle === 'filled',
				'p-ripple-disabled': this.$primevue.ripple === false
            }];
        },
        sidebarClass() {
            return ['layout-sidebar', {
                'layout-sidebar-dark': this.layoutColorMode === 'dark',
                'layout-sidebar-light': this.layoutColorMode === 'light'
            }];
        },
        logo() {
            return (this.layoutColorMode === 'dark') ? "assets/layout/images/output-onlinepngtools.png" : "assets/layout/images/logo.svg";
        }
    },
    beforeUpdate() {
        if (this.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    },
    components: {
        'AppTopBar': AppTopBar,
        'AppProfile': AppProfile,
        'AppMenu': AppMenu,
        'AppConfig': AppConfig,
        'AppFooter': AppFooter,
    }
}
</script>

<style lang="scss">
@import './App.scss';
</style>
