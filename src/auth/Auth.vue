<template>
    <div class="layout-main">
        <div class="flexgrid-demo">
            <!-- <h5>Vertical Alignment - Per Column</h5> -->
            <div class="p-grid vertical-container">
                <div class="p-col p-col-align-start"/>
                <div class="p-col p-col-align-center">
                    <Card style="width: 30em">
                        <!-- <template #header>
                            <img src="assets/layout/images/log-nucleus.jpg" alt="" width="20" height="auto">
                        </template> -->
                        <template #content>
                            <TabMenu :model="items" />
                            <router-view />
                        </template>
                        <template #footer>
                            <div class="p-grid p-jc-center">
                                <img src="assets/layout/images/log-nucleus.jpg" alt="" width="250" height="auto">
                            </div>
                        </template>
                    </Card>
                </div>
                <div class="p-col p-col-align-end"/>
            </div>
        </div>
        <!-- <router-view /> -->
    </div>
</template>

<script>

export default {
    data() {
        return {
            items: [
                {label: 'Login', icon: 'pi pi-fw pi-sign-in', to: '/auth/login'},
                {label: 'Register', icon: 'pi pi-fw pi-user-edit', to: '/auth/register'},
            ]
            
        }
    },
    methods: {
        
    },
    computed: {
    },
    
}
</script>

<style lang="scss">
@import '../App.scss';

    .flexgrid-demo {
		.box {
			background-color: #ffffff;
			text-align: center;
			padding-top: 1rem;
			padding-bottom: 1rem;
			border-radius: 4px;
			box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
		}

		.box-stretched {
			height: 100%;
		}

		.vertical-container {
            margin: 0;
            // width:100vh;
			// height: 100vw;
			height: 500px;
			// background: #dee2e6;
			border-radius: 4px;
		}

		.nested-grid .p-col-4 {
			padding-bottom: 1rem;
		}

		.dynamic-box-enter-active, .dynamic-box-leave-active {
			transition: all .5s;
		}

		.dynamic-box-enter, .dynamic-box-leave-to {
			opacity: 0;
		}

		.dynamic-box-enter, .dynamic-box-leave-to {
			transform: translateX(30px);
		}

		p {
			margin: 0;
		}
	}
</style>
