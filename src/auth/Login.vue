<template>
    <div>
        <div class="card p-fluid">
            <h5>Login</h5>
            <div class="p-field p-grid">
                <label for="" class="p-col-12 p-mb-2 p-md-3 p-mb-md-0">Email</label>
                <div class="p-col-12 p-md-9">
                    <InputText :disabled="loading" id="name3" type="text" v-model="username" placeholder="Email/Phone"/>
                    <small class="p-invalid" v-if="submitted && !username">Email is required..</small>
                </div>
            </div>
            <div class="p-field p-grid">
                <label for="password" class="p-col-12 p-mb-2 p-md-3 p-mb-md-0">Password</label>
                <div class="p-col-12 p-md-9">
                    <Password  :disabled="loading" id="Password" v-model="password" placeholder="Password"/>
                    <small class="p-invalid" v-if="submitted && !password">Password is required..</small>
                </div>
                
            </div>
            <div class="p-grid p-jc-center">
                <div class="p-col-12">
                    <Button :disabled="loading" label="Login" @click="login()"></Button>
                    <small class="p-invalid" v-if="error">{{message}}</small>
                </div>
            </div>
            <ProgressBar mode="indeterminate" v-if="loading" style="height: .5em" />
        </div>
    </div>
</template>

<script>
import AuthService from '../service/AuthService'

export default {
    data() {
		return {
            loading: false,
			username: null,
            password: null,
            error: false,
            message: '',
            submitted: false,
		}
    },
    authService: null,
    created() {
        this.authService = new AuthService()
    },
    methods: {
        login() {
            this.submitted = true
            this.error = false
            if(!(this.username && this.password)) {
                return;
            }
            const data = {
                username: this.username,
                password: this.password,

            }
            this.loading = true
            this.authService.login(data).
            then(msg => {
                console.log(msg)
                this.loading = false
                this.$router.push({name:'dashboard'})
            })
            .catch ( err => {
                this.error = true
                this.message = err
                console.log(err)
                this.loading = false
            })
            // this.loading = false
        }
    }

}
</script>

<style>

</style>