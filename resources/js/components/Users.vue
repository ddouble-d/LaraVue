<template>
  <div class="container">
    <div class="row mt-2" v-if="$gate.isAdmin()">
      <div class="col-md-12">
        <h3>Users Table</h3>
        <div class="card mt-3">
          <div class="card-header">
            <button class="btn btn-success" @click="createModal()">Add New</button>
            <div class="card-tools">
              <div class="input-group input-group-sm" style="width: 150px;">
                <input
                  type="text"
                  name="table_search"
                  class="form-control float-right"
                  placeholder="Search"
                />

                <div class="input-group-append">
                  <button type="submit" class="btn btn-default">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users.data" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.type | upText }}</td>
                  <td>{{ user.created_at | dateFormat }}</td>
                  <td>
                    <button class="btn btn-info" @click="editModal(user)">Edit</button>
                    <button class="btn btn-danger" @click="deleteUser(user.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.card-body -->
          <div class="card-footer">
            <pagination :data="users" @pagination-change-page="getResults"></pagination>
          </div>
        </div>
        <!-- /.card -->
      </div>
    </div>
    <div class="row mt-2" v-else>
      <not-found></not-found>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="addNew"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addNewLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-show="modal.is_create" class="modal-title" id="addNewLabel">Add New User</h5>
            <h5 v-show="!modal.is_create" class="modal-title" id="addNewLabel">Update User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form
            @submit.prevent="
                            modal.is_create ? createUser() : updateUser()
                        "
          >
            <div class="modal-body">
              <div class="form-group">
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  class="form-control"
                  placeholder="Name"
                  :class="{
                                        'is-invalid': form.errors.has('name')
                                    }"
                />
                <has-error :form="form" field="name"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.email"
                  type="text"
                  name="email"
                  class="form-control"
                  placeholder="Email"
                  :class="{
                                        'is-invalid': form.errors.has('email')
                                    }"
                />
                <has-error :form="form" field="email"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  class="form-control"
                  placeholder="Password"
                  :class="{
                                        'is-invalid': form.errors.has(
                                            'password'
                                        )
                                    }"
                />
                <has-error :form="form" field="password"></has-error>
              </div>
              <div class="form-group">
                <select
                  v-model="form.type"
                  name="type"
                  id="type"
                  class="form-control"
                  :class="{
                                        'is-invalid': form.errors.has('type')
                                    }"
                >
                  <option value>Select User Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="author">Author</option>
                </select>
                <has-error :form="form" field="email"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.bio"
                  type="text"
                  name="bio"
                  class="form-control"
                  placeholder="Short bio (optional)"
                  :class="{
                                        'is-invalid': form.errors.has('bio')
                                    }"
                />
                <has-error :form="form" field="bio"></has-error>
              </div>
              <!-- <div class="form-group">
                            <input
                                v-model="form.photo"
                                type="text"
                                name="email"
                                class="form-control"
                                placeholder="Email"
                                :class="{
                                    'is-invalid': form.errors.has('email')
                                }"
                            />
                            <has-error :form="form" field="email"></has-error>
              </div>-->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
              <button
                type="submit"
                class="btn btn-primary"
                v-html="modal.button_text"
                :disabled="modal.button_load"
              ></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: {},
      form: new Form({
        id: "",
        name: "",
        email: "",
        password: "",
        type: "",
        bio: "",
        photo: "",
      }),
      modal: {
        is_create: "",
        button_text: "",
        button_load: "",
      },
    };
  },
  methods: {
    loadUsers() {
      if (this.$gate.isAdmin()) {
        axios.get("api/user").then(({ data }) => (this.users = data));
      }
    },
    getResults(page = 1) {
      axios.get("api/user?page=" + page).then((response) => {
        this.users = response.data;
      });
    },
    createModal() {
      this.form.reset();
      this.modal.is_create = true;
      this.modal.button_text = "Save";
      this.modal.button_load = false;
      $("#addNew").modal("show");
    },
    editModal(userdata) {
      this.form.reset();
      this.modal.is_create = false;
      this.modal.button_text = "Update";
      this.modal.button_load = false;
      $("#addNew").modal("show");
      this.form.fill(userdata);
    },
    createUser() {
      this.$Progress.start();
      this.modal.button_load = true;
      this.modal.button_text = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
      this.form
        .post("api/user")
        .then(() => {
          Fire.$emit("AfterAction");
          Toast.fire({
            icon: "success",
            title: "New user created succesfully",
          });
          $("#addNew").modal("hide");
          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
          Swal.fire("Failed!", "There was something wrong", "warning");
        });
    },
    updateUser() {
      this.$Progress.start();
      this.modal.button_load = true;
      this.modal.button_text = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
      this.form
        .put("api/user/" + this.form.id)
        .then(() => {
          Fire.$emit("AfterAction");
          Toast.fire({
            icon: "success",
            title: "User updated succesfully",
          });
          $("#addNew").modal("hide");
          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
          Swal.fire("Failed!", "There was something wrong", "warning");
        });
    },
    deleteUser(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
        .then((result) => {
          if (result.value) {
            this.$Progress.start();
            this.form
              .delete("api/user/" + id)
              .then(() => {
                Fire.$emit("AfterAction");
                Toast.fire({
                  icon: "success",
                  title: "User deleted succesfully",
                });
                this.$Progress.finish();
              })
              .catch(() => {
                this.$Progress.fail();
                Swal.fire("Failed!", "There was something wrong", "warning");
              });
          }
        })
        .catch(() => {
          Swal.fire("Failed!", "There was something wrong", "warning");
        });
    },
  },
  mounted() {
    this.loadUsers();
    this.getResults();
    Fire.$on("AfterAction", () => {
      this.loadUsers();
    });
    Fire.$on("searching", () => {
      let query = this.$parent.search;
      axios
        .get("api/findUser?query=" + query)
        .then((data) => {
          this.users = data.data;
        })
        .catch(() => {});
    });
  },
};
</script>
