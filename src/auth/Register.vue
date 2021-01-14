<template>
    <div>
        <div class="card p-fluid">
            <h5>Register</h5>
            <div class="p-field p-grid">
                <label for="name" class="p-col-12 p-mb-2 p-md-3 p-mb-md-0">Name</label>
                <div class="p-col-12 p-md-9">
                    <InputText id="name" type="text" v-model="name"/>
                </div>
            </div>
            <div class="p-field p-grid">
                <label for="email" class="p-col-12 p-mb-2 p-md-3 p-mb-md-0">Email</label>
                <div class="p-col-12 p-md-9">
                    <InputText id="email" type="text" v-model="email"/>
                </div>
            </div>
            <div class="p-field p-grid">
                <label for="phone" class="p-col-12 p-mb-2 p-md-3 p-mb-md-0">Phone</label>
                <div class="p-col-12 p-md-9">
                    <InputText id="phone" type="text" v-model="phone"/>
                </div>
            </div>
            <div class="p-field p-grid">
                <label for="password" class="p-col-12 p-mb-2 p-md-3 p-mb-md-0">Password</label>
                <div class="p-col-12 p-md-9">
                    <Password id="Password" v-model="password" placeholder="Password"/>
                </div>
            </div>
            <div class="p-field p-grid">
                <Button label="Register" @click="register()"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from '../service/AuthService'
export default {
    data() {
        return {
            name: '',
            email: '',
            phone: '',
            password: '',   
        }
    },
    authService: null,
    created() {
        this.authService = new AuthService()
    },
    methods: {
        register() {
            const data = {
                name: this.name,
                email: this.email,
                phone: this.phone,
                password: this.password,

            }
            this.authService.register(data).
            then(msg => {
                console.log(msg)
            })
        }
    }
}
</script>

<style lang="scss">
	
</style>