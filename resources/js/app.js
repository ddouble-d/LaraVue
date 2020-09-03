/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");
import moment from "moment";
import { Form, HasError, AlertError } from "vform";
import VueRouter from "vue-router";
import { values } from "lodash";
import VueProgressBar from "vue-progressbar";
import Swal from "sweetalert2";

window.Vue = require("vue");
window.Form = Form;
window.Swal = Swal;
window.Fire = new Vue();
window.Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
});

Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
Vue.component(
    "passport-clients",
    require("./components/passport/Clients.vue").default
);
Vue.component(
    "passport-authorized-clients",
    require("./components/passport/AuthorizedClients.vue").default
);
Vue.component(
    "passport-personal-access-tokens",
    require("./components/passport/PersonalAccessTokens.vue").default
);

Vue.use(VueRouter);
Vue.use(VueProgressBar, {
    color: "#41578d",
    failedColor: "#874b4b",
    thickness: "5px",
    transition: {
        speed: "0.2s",
        opacity: "0.6s",
        termination: 300
    },
    autoRevert: true,
    location: "top",
    inverse: false
});

Vue.filter("upText", function(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
});
Vue.filter("dateFormat", function(text) {
    return moment(text).format("LL");
});

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/dashboard",
            component: require("./components/Dashboard.vue").default
        },
        {
            path: "/profile",
            component: require("./components/Profile.vue").default
        },
        {
            path: "/users",
            component: require("./components/Users.vue").default
        },
        {
            path: "/developer",
            component: require("./components/Developer.vue").default
        }
    ]
});

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

// Vue.component(
//     "example-component",
//     require("./components/ExampleComponent.vue").default
// );

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: "#app",
    router
});
