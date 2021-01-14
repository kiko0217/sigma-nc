<template>
	<div class="layout-profile">
		<div>
			<img src="assets/layout/images/profile.png" alt="" />
		</div>
		<button class="p-link layout-profile-link" @click="onClick">
			<span class="username">{{user.name}}</span>
			<i class="pi pi-fw pi-cog"></i>
		</button>
        <transition name="layout-submenu-wrapper">
            <ul v-show="expanded">
                <li><button class="p-link"><i class="pi pi-fw pi-user"></i><span>Account</span></button></li>
                <li><button class="p-link"><i class="pi pi-fw pi-inbox"></i><span>Notifications</span><span class="menuitem-badge">2</span></button></li>
                <li><button class="p-link" @click="logout()"><i class="pi pi-fw pi-power-off"></i><span>Logout</span></button></li>
            </ul>
        </transition>
		
	</div>
</template>

<script>
import AuthService from './service/AuthService'
import UserService from './service/UserService'
export default {
	
	data() {
		return {
			expanded: false,
			user: {},
		}
	},
	authService: null,
	userService: null,
    created() {
        this.authService = new AuthService()
        this.userService = new UserService()
	},
	mounted() {
		this.userService.getProfile()
		.then(data => {
			console.log('test')
			console.log(data)
			this.user = data
		})
		.catch(err => {
			console.log(err)
			this.logout()
		})
	},
	methods: {
		onClick(event){
			this.expanded = !this.expanded;
			event.preventDefault();
		},
		logout() {
			console.log('test')
			this.authService.logout()
			.then(msg => {
				console.log(msg)
				this.$router.push({name:'auth'})
			})
			.catch( err => {
				console.log(err)
			})
		}
	}
}
</script>

<style scoped>

</style>